<template>
  <Operating>
    <Actions>
      <button @click="run"><span class="icon-play3"></span>Run</button>
      <button
        class="editor-tab"
        :class="currentEditorTab === 'html' ? 'selected' : ''"
        @click="switchTab('html')"
      >
        HTML
      </button>
      <button
        class="editor-tab"
        :class="currentEditorTab === 'css' ? 'selected' : ''"
        @click="switchTab('css')"
      >
        CSS
      </button>
      <button
        class="editor-tab"
        :class="currentEditorTab === 'js' ? 'selected' : ''"
        @click="switchTab('js')"
      >
        JS
      </button>
    </Actions>
    <div class="container">
      <section>
        <Editor>
          <div id="dapp-editor"></div>
        </Editor>
        <Output>
          <Tabs size="small">
            <TabPane label="CONSOLE"></TabPane>
            <TabPane label="LOG"></TabPane>
          </Tabs>
        </Output>
      </section>
      <section ref="renderPanel" v-show="showRender">
        <ResizeBar resize-direction="horizontal-left"></ResizeBar>
      </section>
    </div>
  </Operating>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Operating from "@/views/Operating.vue";
import Actions from "@/layout/Actions.vue";
import Editor from "@/layout/Editor.vue";
import Output from "@/layout/Output.vue";
import Tabs from "@/components/Tabs.vue";
import TabPane from "@/components/TabPane.vue";
import * as monaco from "monaco-editor";
import ResizeBar from "@/components/ResizeBar.vue";

@Component({
  components: {
    Operating,
    Actions,
    Editor,
    Output,
    Tabs,
    TabPane,
    ResizeBar
  }
})
export default class Dapp extends Vue {
  showRender = false;
  renderFrame: HTMLIFrameElement | undefined;

  editorData: any = {
    js: {
      model: monaco.editor.createModel(
        `var bt = document.querySelector("#s");
bt.addEventListener("click", function() {
  var n = window.prompt("Input the number:");
  alert(n);
});`,
        "javascript"
      ),
      state: null
    },
    css: {
      model: monaco.editor.createModel(
        `button {
  background-color: #000;
  color: #fff;
  border: 0;
  font-size: 1em;
}`,
        "css"
      ),
      state: null
    },
    html: {
      model: monaco.editor.createModel(
        `<button id="s">Set Data</button>
<button id="g">Get Data</button>`,
        "html"
      ),
      state: null
    }
  };

  currentEditorTab = "html";

  private monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;
  private windowResizeListener = () => {
    this.$store.dispatch("events/triggerEditorResize");
  };

  mounted() {
    this.monacoEditor = monaco.editor.create(
      document.getElementById("dapp-editor") as HTMLElement,
      {
        model: this.editorData.html.model,
        theme: this.$store.state.prefs.darkTheme ? "vs-dark" : "",
        minimap: {
          enabled: false
        }
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

  run() {
    (window as any).htmlSrc = this.editorData.html.model.getValue();
    (window as any).cssSrc = this.editorData.css.model.getValue();
    (window as any).jsSrc = this.editorData.js.model.getValue();

    const showing = this.showRender;
    this.showRender = true;
    if (showing) {
      if (this.renderFrame && this.renderFrame.contentWindow) {
        this.renderFrame.contentWindow.location.reload();
      }
    } else {
      this.renderFrame = document.createElement("iframe");
      this.renderFrame.src = "dapp-frame.html";
      this.renderFrame.height = "100%";
      this.renderFrame.frameBorder = "0";
      this.renderFrame.style.backgroundColor = "#fff";
      (this.$refs.renderPanel as HTMLElement).appendChild(this.renderFrame);

      this.$store.dispatch("events/triggerEditorResize");
    }
  }

  switchTab(desiredModelId: string) {
    if (this.monacoEditor != undefined) {
      this.editorData[
        this.currentEditorTab
      ].state = this.monacoEditor.saveViewState();

      this.monacoEditor.setModel(this.editorData[desiredModelId].model);
      this.monacoEditor.restoreViewState(this.editorData[desiredModelId].state);
      this.monacoEditor.focus();

      this.currentEditorTab = desiredModelId;
    }
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"

.editor-tab.selected
  background-color rgba($color, 0.2)

#dapp-editor
  position absolute
  top 0
  bottom 0
  left 0
  right 0
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"

body.dark-theme
  .editor-tab.selected
    background-color rgba($color, 0.2)
</style>

<style lang="stylus" scoped>
@import "../assets/themes/light.styl"

.container
  display flex
  flex-direction row
  flex-grow 1
  section
    position relative
    display flex
    flex-grow 1
    flex-direction column
    & + section
      border-left 1px solid $borderColor
      flex-grow 0
      width 300px
</style>

<style lang="stylus" scoped>
@import "../assets/themes/dark.styl"

body.dark-theme
  .container
    section
      & + section
        border-color $borderColor
</style>
