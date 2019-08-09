<template>
  <Operating>
    <Actions>
      <button
        @click="compile"
        :disabled="!$store.state.events.compilerReady"
        onClick="gtag('event', 'contract', {'event_category': 'toolbar', 'event_label': 'compile'});"
      >
        <span class="icon-wrench"></span>
        <label>Compile</label>
      </button>
      <button
        @click="copy"
        onClick="gtag('event', 'contract', {'event_category': 'toolbar', 'event_label': 'copy'});"
      >
        <span class="icon-copy"></span>
        <label>Copy</label>
      </button>
      <button
        @click="reset"
        class="danger"
        onClick="gtag('event', 'contract', {'event_category': 'toolbar', 'event_label': 'reset'});"
      >
        <label>Reset</label>
      </button>
    </Actions>
    <Editor>
      <div id="lity-editor"></div>
    </Editor>
    <Output>
      <Tabs
        size="small"
        :animated="false"
        v-model="$store.state.events.lityOutputTab"
      >
        <TabPane label="PROBLEMS" name="problems">
          <Problems></Problems>
        </TabPane>
        <TabPane label="LOG" name="logs">
          <Logs type="Lity"></Logs>
        </TabPane>
      </Tabs>
    </Output>
  </Operating>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Operating from "@/views/Operating.vue";
import Actions from "@/layout/Actions.vue";
import Editor from "@/layout/Editor.vue";
import Output from "@/layout/Output.vue";
import Problems from "@/components/Problems.vue";
import Logs from "@/components/Logs.vue";
import Tabs from "@/components/Tabs.vue";
import TabPane from "@/components/TabPane.vue";
import * as monaco from "monaco-editor";
import Compiler from "@/services/compiler";

const compiler = new Compiler("./soljson.js");

@Component({
  components: {
    Operating,
    Actions,
    Editor,
    Output,
    Tabs,
    TabPane,
    Problems,
    Logs
  }
})
export default class Lity extends Vue {
  private monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;
  private windowResizeListener = () => {
    this.$store.dispatch("events/triggerEditorResize");
  };

  mounted() {
    const text =
      this.$store.state.editor.text.lity ||
      `pragma solidity >=0.4.0 <0.6.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
`;
    this.monacoEditor = monaco.editor.create(
      document.getElementById("lity-editor") as HTMLElement,
      {
        value: text,
        language: "sol",
        theme: this.$store.state.prefs.darkTheme ? "vs-dark" : ""
      }
    );

    this.monacoEditor.onDidBlurEditorText(() => {
      this.$store.dispatch(
        "editor/setLity",
        (this.monacoEditor as monaco.editor.IStandaloneCodeEditor).getValue()
      );
    });

    this.$store.watch(
      () => {
        return this.$store.state.events.resizeEditor;
      },
      () => {
        if (this.monacoEditor) {
          this.monacoEditor.layout();
        }
      }
    );

    window.addEventListener("resize", this.windowResizeListener);
  }

  destroyed() {
    window.removeEventListener("resize", this.windowResizeListener);
  }

  compile() {
    if (this.monacoEditor) {
      const result = compiler.compile(this.monacoEditor.getValue());
      if (result.errors) {
        for (let i = 0; i < result.errors.length; i++) {
          this.$store.dispatch(
            "outputs/pushProblems",
            (result.errors[i] as any).formattedMessage
          );
        }
      }
      if (result.contracts && result.contracts["new.lity"]) {
        this.$store.dispatch(
          "contracts/setContracts",
          result.contracts["new.lity"]
        );
        this.$store.dispatch("events/setLityPanel", "Contracts");
        this.$store.dispatch("events/triggerEditorResize");
      }
    }
  }

  copy() {
    if (this.monacoEditor) {
      const ta = document.createElement("textarea");
      ta.value = this.monacoEditor.getValue();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  }

  reset() {
    this.$store.dispatch("editor/setLity", "");
    window.location.reload();
  }
}
</script>

<style lang="stylus">
#lity-editor
  position absolute
  top 0
  bottom 0
  left 0
  right 0
</style>
