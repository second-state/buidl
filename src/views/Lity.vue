<template>
  <Operating>
    <Actions>
      <button @click="compile" :disabled="!$store.state.events.compilerReady">
        <span class="icon-wrench"></span>
        Compile
      </button>
      <button><span class="icon-cogs"></span>Deploy</button>
    </Actions>
    <Editor>
      <div id="lity-editor"></div>
    </Editor>
    <Output>
      <Tabs size="small">
        <TabPane label="PROBLEMS">
          <Problems></Problems>
        </TabPane>
        <TabPane label="LOG"></TabPane>
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
    Problems
  }
})
export default class Lity extends Vue {
  private monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;
  private windowResizeListener = () => {
    this.$store.dispatch("events/triggerEditorResize");
  };

  mounted() {
    this.monacoEditor = monaco.editor.create(
      document.getElementById("lity-editor") as HTMLElement,
      {
        value: `pragma solidity >=0.4.0 <0.6.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
`,
        language: "solidity",
        theme: this.$store.state.prefs.darkTheme ? "vs-dark" : ""
      }
    );

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
      compiler.compile(this.monacoEditor.getValue());
    }
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
