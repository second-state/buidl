<template>
  <Operating>
    <Actions>
      <button><span class="icon-play3"></span>Run</button>
    </Actions>
    <Editor>
      <div id="dapp-editor"></div>
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
export default class Dapp extends Vue {
  private monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;
  private windowResizeListener = () => {
    this.$store.dispatch("events/triggerEditorResize");
  };

  mounted() {
    this.monacoEditor = monaco.editor.create(
      document.getElementById("dapp-editor") as HTMLElement,
      {
        value: ["function x() {", "\tconsole.log('Hello world!');", "}"].join(
          "\n"
        ),
        language: "javascript"
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
#dapp-editor
  position absolute
  top 0
  bottom 0
  left 0
  right 0
</style>
