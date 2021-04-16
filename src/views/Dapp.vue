<template>
  <Operating>
    <Actions>
      <button
        @click="run"
        onClick="gtag('event', 'dapp', {'event_category': 'toolbar', 'event_label': 'run'});"
      >
        <span class="icon-play3"></span>
        <label>Run</label>
      </button>
      <button
        @click="copy"
        onClick="gtag('event', 'dapp', {'event_category': 'toolbar', 'event_label': 'copy_dapp'});"
      >
        <span class="icon-copy"></span>
        <label>Copy</label>
      </button>
      <button
        @click="prePublish"
        :disabled="pubStatus !== 'normal'"
        onClick="gtag('event', 'dapp', {'event_category': 'toolbar', 'event_label': 'publish'});"
      >
        <span class="icon-share"></span>
        <label v-if="pubStatus === 'normal'"
          >Publish
          <sub v-if="pubResult !== null">
            <a :href="pubResult" target="_blank" v-on:click.stop="">Launched</a>
          </sub>
          <sub v-else-if="pubError !== null" class="error">Failed</sub>
        </label>
        <label v-else
          >Publishing...<sub>{{ pubProgress }}%</sub>
        </label>
      </button>
      <button
        @click="reset"
        class="danger"
        onClick="gtag('event', 'dapp', {'event_category': 'toolbar', 'event_label': 'reset_dapp'});"
      >
        <label>Reset All</label>
      </button>
      <div class="editor-tabs">
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
      </div>
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
    <PubDialog
      ref="pubDialog"
      v-show="showDialog"
      v-on:hide="showDialog = false"
      v-on:publish="publish"
      :provider="dialogProvider"
    />
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
import LityWeb3 from "@/services/web3";
const ES = require("@/modules/es-ss.js");
import HtmlTemplate from "@/embed/template.ts";
import Publisher from "@/services/publisher";
import PubDialog from "@/components/PubDialog.vue";

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
    ResizeBar,
    PubDialog
  }
})
export default class Dapp extends Vue {
  showRender = false;
  renderFrame: HTMLIFrameElement | undefined;

  editorData: any;

  currentEditorTab = "html";

  pubStatus = "normal";
  pubProgress = 0;
  pubResult = null;
  pubError = null;

  showDialog = false;
  dialogProvider = "";

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
    return LityWeb3(pUrl, "Dapp");
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
var abi = [];
var bytecode = '';
var cAddr = '';
/* Don't modify */

var instance = null;
window.addEventListener('web3Ready', function() {
  var contract = web3.ss.contract(abi);
  instance = contract.at(cAddr);
});

// esss.shaAbi(JSON.stringify(abi)).then((shaResult) => {
//   var sha = JSON.parse(shaResult).abiSha3;
//   esss.searchUsingAbi(sha).then((searchResult) => {
//     console.log(searchResult);
//   });
// });

document.querySelector("#s").addEventListener("click", function() {
  var n = window.prompt("Enter the number:");
  n && instance.set(n);
});
document.querySelector("#g").addEventListener("click", function() {
  instance.get(function(e,d) {
    console.log(d.toString());
    alert(d.toString());
  });
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
        return this.$store.state.events.resetEditors;
      },
      () => {
        if (this.monacoEditor != undefined) {
          this.editorData.html.model.setValue(
            this.$store.state.editor.text.html
          );
          this.editorData.css.model.setValue(this.$store.state.editor.text.css);
          this.editorData.js.model.setValue(this.$store.state.editor.text.js);
        }
      }
    );

    this.$store.watch(
      () => {
        return this.$store.state.events.reuseDeployedContract;
      },
      () => {
        const c = this.$store.state.events.usingDeployedContract;
        let value = this.editorData.js.model.getValue();
        value = value.replace(
          /\/\* Don't modify \*\/[\s\S.]*\/\* Don't modify \*\//g,
          `/* Don't modify */
var abi = ${JSON.stringify(c.abi)};
var bytecode = '${c.bytecode}';
var cAddr = '${c.address}';
/* Don't modify */`
        );
        this.editorData.js.model.setValue(value);
      }
    );

    this.$store.watch(
      () => {
        return this.$store.state.events.usingDeployedContractAddress;
      },
      c => {
        const initCodeRegex = /\/\* Don't modify \*\/[\s\S]*var abi = (\[.*\]);[\s\S]*var bytecode = ('.*');[\s\S]*var cAddr = '.*';[\s\S]*\/\* Don't modify \*\//g;
        let value = this.editorData.js.model.getValue();
        if (initCodeRegex.test(value)) {
          value = value.replace(
            initCodeRegex,
            `/* Don't modify */
var abi = $1;
var bytecode = $2;
var cAddr = '${c}';
/* Don't modify */`
          );
          this.editorData.js.model.setValue(value);
        }
      }
    );

    this.$store.watch(
      () => {
        return this.$store.state.events.compiledContract;
      },
      c => {
        const initCodeRegex = /\/\* Don't modify \*\/[\s\S]*var abi = \[.*\];[\s\S]*var bytecode = '.*';[\s\S]*var cAddr = '.*';[\s\S]*\/\* Don't modify \*\//g;
        let value = this.editorData.js.model.getValue();
        if (initCodeRegex.test(value)) {
          value = value.replace(
            /\/\* Don't modify \*\/[\s\S.]*\/\* Don't modify \*\//g,
            `/* Don't modify */
var abi = ${JSON.stringify(c.abi)};
var bytecode = '${c.bytecode}';
var cAddr = '${c.address}';
/* Don't modify */`
          );
          this.editorData.js.model.setValue(value);
        }
      }
    );

    window.addEventListener("resize", this.windowResizeListener);
  }

  destroyed() {
    window.removeEventListener("resize", this.windowResizeListener);
  }

  run() {
    const web3 = this.newLityWeb3();
    web3.ss.getAccounts = (cb: Function) => {
      cb(null, [this.$store.state.wallet.default.address]);
    };
    (window as any).web32 = web3;
    (window as any).esss = this.newEs();

    (window as any).htmlSrc = this.editorData.html.model.getValue();
    (window as any).cssSrc = this.editorData.css.model.getValue();
    (window as any).jsSrc = this.editorData.js.model.getValue();

    (window as any).jsLibs = this.$store.state.resources.js;
    (window as any).cssLibs = this.$store.state.resources.css;

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

  copy() {
    if (this.monacoEditor) {
      const ta = document.createElement("textarea");
      ta.value = this.editorData[this.currentEditorTab].model.getValue();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  }

  generateFile(title: string, provider: any): string {
    let html = HtmlTemplate;
    html = html.replace("{{title}}", title);
    html = html.replace("{{html}}", this.editorData.html.model.getValue());
    html = html.replace("{{js}}", this.editorData.js.model.getValue());
    html = html.replace("{{css}}", this.editorData.css.model.getValue());

    const jsLibs = this.$store.state.resources.js;
    let jsLS = "";
    for (let i = 0; i < jsLibs.length; i++) {
      jsLS += `<script src="${jsLibs[i]}"></scri` + `pt>`;
    }
    html = html.replace("{{jsLibs}}", jsLS);

    const cssLibs = this.$store.state.resources.css;
    let cssLS = "";
    for (let i = 0; i < cssLibs.length; i++) {
      cssLS += `<link rel="stylesheet" href="${cssLibs[i]}" />`;
    }
    html = html.replace("{{cssLibs}}", cssLS);

    const web3Provider = this.$store.state.prefs.web3Provider;
    const web3Url =
      provider !== null
        ? provider.url
        : web3Provider.using !== ""
        ? web3Provider.options[web3Provider.using].url
        : web3Provider.custom.url;
    html = html.replace("{{web3ProviderUrl}}", web3Url);
    const web3ChainId =
      provider !== null
        ? provider.chainId
        : web3Provider.using !== ""
        ? web3Provider.options[web3Provider.using].chainId
        : web3Provider.custom.chainId;
    html = html.replace("{{web3ProviderChainId}}", web3ChainId);

    const gasPrice =
      provider !== null
        ? provider.gasPrice
        : web3Provider.using !== "" || !web3Provider.custom.customGas
        ? web3Provider.default.gasPrice
        : web3Provider.custom.gasPrice;
    html = html.replace("{{web3ProviderGasPrice}}", gasPrice);
    const gasLimit =
      provider !== null
        ? provider.gasLimit
        : web3Provider.using !== "" || !web3Provider.custom.customGas
        ? web3Provider.default.gasLimit
        : web3Provider.custom.gasLimit;
    html = html.replace("{{web3ProviderGasLimit}}", gasLimit);

    const esProvider = this.$store.state.prefs.esProvider;
    const esUrl =
      esProvider.using !== ""
        ? esProvider.options[esProvider.using].url
        : esProvider.custom.url;
    html = html.replace("{{esProviderUrl}}", esUrl);

    return html;
  }

  prePublish() {
    if (this.$store.state.prefs.web3Provider.usingMetaMask) {
      const web3 = (window as any).web3;
      this.dialogProvider = web3.eth ? "MetaMask" : "Venus";
      web3.version.getNetwork((err: any, network: any) => {
        (this.$refs.pubDialog as any).chainId = network;
        this.showDialog = true;
      });
    } else {
      this.dialogProvider = "";
      this.showDialog = true;
    }
  }

  publish() {
    this.showDialog = false;
    const dialog = this.$refs.pubDialog as any;
    const title = dialog.title;
    if (title.length > 50) {
      alert("Title is too long");
      return;
    }
    let provider = null;

    if (
      this.$store.state.prefs.web3Provider.usingMetaMask &&
      dialog.url.trim() !== ""
    ) {
      provider = {
        url: dialog.url,
        chainId: dialog.chainId,
        gasPrice: dialog.gasPrice,
        gasLimit: dialog.gasLimit
      };
    }
    const pageContent = this.generateFile(title.replace("<", "&lt;"), provider);
    this.pubProgress = 10;
    this.pubStatus = "publishing";

    Publisher(title, pageContent, (error: any, result: any) => {
      if (error !== null) {
        this.pubStatus = "normal";
        this.pubError = error;
        return;
      }
      this.pubProgress = result.progress;
      if (result.progress === 100) {
        this.pubStatus = "normal";
        this.pubResult = result.url;
      }
    });
  }

  reset() {
    this.$store.dispatch("editor/setHtml", "");
    this.$store.dispatch("editor/setJs", "");
    this.$store.dispatch("editor/setCss", "");
    window.location.reload();
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
@import "../assets/var.styl"

.editor-tabs
  position absolute
  left 50%
  margin-left ((-3 * $sideBarWidth) / 2)
  top 0
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
