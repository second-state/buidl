<template>
  <div class="lity">
    <Actions>
      <button><span class="icon-wrench"></span>Compile</button>
      <button><span class="icon-cogs"></span>Deploy</button>
    </Actions>
    <Operating>
      <div id="lity-editor"></div>
    </Operating>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Actions from "@/components/Actions.vue";
import Operating from "@/components/Operating.vue";
import * as monaco from "monaco-editor";

@Component({
  components: {
    Operating,
    Actions
  }
})
export default class Lity extends Vue {
  private monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;

  mounted() {
    this.monacoEditor = monaco.editor.create(
      document.getElementById("lity-editor") as HTMLElement,
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

    window.addEventListener("resize", () => {
      this.$store.dispatch("events/triggerEditorResize");
    });
  }
}
</script>

<style lang="stylus">
.lity, #lity-editor
  height 100%
</style>
