<template>
  <Operating>
    <Actions>
      <button><span class="icon-wrench"></span>Compile</button>
      <button><span class="icon-cogs"></span>Deploy</button>
    </Actions>
    <Editor>
      <div id="lity-editor"></div>
    </Editor>
  </Operating>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Operating from "@/views/Operating.vue";
import Actions from "@/components/Actions.vue";
import Editor from "@/components/Editor.vue";
import * as monaco from "monaco-editor";

@Component({
  components: {
    Operating,
    Actions,
    Editor
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
        if (this.monacoEditor != undefined) {
          this.monacoEditor.layout();
        }
      }
    );

    window.addEventListener("resize", this.windowResizeListener);
  }

  destroyed() {
    window.removeEventListener("resize", this.windowResizeListener);
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
