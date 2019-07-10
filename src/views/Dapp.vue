<template>
  <Operating>
    <Actions>
      <button @click="run">
        <span class="icon-play3"></span>
        <label>Run</label>
      </button>
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
          <Tabs
            size="small"
            :animated="false"
            v-model="$store.state.events.dappOutputTab"
          >
            <TabPane label="CONSOLE" name="console">
              <Cnsl></Cnsl>
            </TabPane>
            <TabPane label="LOG" name="logs">
              <Logs type="Dapp"></Logs>
            </TabPane>
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
import Logs from "@/components/Logs.vue";
import Cnsl from "@/components/Cnsl.vue";
import Tabs from "@/components/Tabs.vue";
import TabPane from "@/components/TabPane.vue";
import * as monaco from "monaco-editor";
import ResizeBar from "@/components/ResizeBar.vue";
import Web3 from "web3-ss";
import LityWeb3 from "@/services/web3";
const ES = require("@/modules/es-ss.js");

@Component({
  components: {
    Operating,
    Actions,
    Editor,
    Output,
    Logs,
    Cnsl,
    Tabs,
    TabPane,
    ResizeBar
  }
})
export default class Dapp extends Vue {
  showRender = false;
  renderFrame: HTMLIFrameElement | undefined;

  editorData: any;

  currentEditorTab = "html";

  private monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;
  private windowResizeListener = () => {
    this.$store.dispatch("events/triggerEditorResize");
  };

  newLityWeb3() {
    const provider = this.$store.state.prefs.web3Provider;
    const pUrl =
      provider.using !== ""
        ? provider.options[provider.using].url
        : provider.custom.url;
    return new LityWeb3(new Web3.providers.HttpProvider(pUrl), "Dapp");
  }

  newEs() {
    const provider = this.$store.state.prefs.esProvider;
    const pUrl =
      provider.using !== ""
        ? provider.options[provider.using].url
        : provider.custom.url;
    return new ES(pUrl);
  }

  cnsl(s: string, type?: string) {
    if (type === "error") {
      this.$store.dispatch(
        "outputs/pushCnsl",
        `<span class="error">${s}</span>`
      );
    } else {
      this.$store.dispatch(`events/setDappOutputTab`, "console");
      this.$store.dispatch("outputs/pushCnsl", s);
    }
  }

  mounted() {
    (window as any).cnsl = this.cnsl;

    const jsText =
      this.$store.state.editor.text.js ||
      `/* Don't modify */
var contract = web3.ss.contract();
var instance = contract.at('');
/* Don't modify */

document.querySelector("#s").addEventListener("click", function() {
  var n = window.prompt("Input the number:");
  n && instance.set(n);
});
document.querySelector("#g").addEventListener("click", function() {
  console.log(instance.get().toString());
});`;

    const cssText =
      this.$store.state.editor.text.css ||
      `button {
  background-color: #000;
  color: #fff;
  border: 0;
  font-size: 1em;
}`;

    const htmlText =
      this.$store.state.editor.text.html ||
      `<button id="s">Set Data</button>
<button id="g">Get Data</button>`;

    this.editorData = {
      js: {
        model: monaco.editor.createModel(jsText, "javascript"),
        state: null
      },
      css: {
        model: monaco.editor.createModel(cssText, "css"),
        state: null
      },
      html: {
        model: monaco.editor.createModel(htmlText, "html"),
        state: null
      }
    };

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

    this.monacoEditor.onDidBlurEditorText(() => {
      const cap =
        this.currentEditorTab.charAt(0).toUpperCase() +
        this.currentEditorTab.substring(1);
      this.$store.dispatch(
        `editor/set${cap}`,
        (this.monacoEditor as monaco.editor.IStandaloneCodeEditor).getValue()
      );
    });

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

    this.$store.watch(
      () => {
        return this.$store.state.events.usingDeployedContract;
      },
      c => {
        let value = this.editorData.js.model.getValue();
        value = value.replace(
          /\/\* Don't modify \*\/[\s\S.]*\/\* Don't modify \*\//g,
          `/* Don't modify */
var contract = web3.ss.contract(${JSON.stringify(c.abi)});
var instance = contract.at('${c.address}');
/* Don't modify */`
        );
        this.editorData.js.model.setValue(value);
      }
    );

    /*
      auto inject the very first deployed contract info into js
      only when the code has not been modified
    */
    this.$store.watch(
      () => {
        return this.$store.state.events.firstDeployedContract;
      },
      c => {
        const initCodeRegex = /\/\* Don't modify \*\/[\s\S]*var contract = web3\.ss\.contract\(\);[\s\S]*var instance = contract.at\(''\);[\s\S]*\/\* Don't modify \*\//g;
        const value = this.editorData.js.model.getValue();
        if (initCodeRegex.test(value)) {
          this.$store.dispatch("events/setUsingDeployedContract", c);
        }
      }
    );

    window.addEventListener("resize", this.windowResizeListener);
  }

  destroyed() {
    window.removeEventListener("resize", this.windowResizeListener);
  }

  run() {
    (window as any).web3 = this.newLityWeb3();
    (window as any).esss = this.newEs();

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
