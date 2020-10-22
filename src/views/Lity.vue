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
      <span>
        <select v-model="solv" @change="changeSolv">
          <option value="s042">Solidity 0.4.20</option>
          <option value="s0426">Solidity 0.4.26</option>
          <option value="s0517">Solidity 0.5.17</option>
          <option value="s0612">Solidity 0.6.12</option>
          <option value="s074">Solidity 0.7.4</option>
        </select>
      </span>
      <button
        @click="copy"
        onClick="gtag('event', 'contract', {'event_category': 'toolbar', 'event_label': 'copy_contract'});"
      >
        <span class="icon-copy"></span>
        <label>Copy</label>
      </button>
      <button
        @click="reset"
        class="danger"
        onClick="gtag('event', 'contract', {'event_category': 'toolbar', 'event_label': 'reset_contract'});"
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

let compiler: any = null;
let solvo: string = "";
const s = window.location.search;
if (s && s.indexOf("?") == 0) {
  const qs = s.substring(1).split("&");
  for (let i = 0; i < qs.length; i++) {
    const qss = qs[i].split("=");
    if (qss[0] === "s042") {
      compiler = new Compiler("/soljson-v0.4.20+commit.3155dd80.js");
      solvo = qss[0];
      break;
    } else if (qss[0] === "s0426") {
      compiler = new Compiler("/soljson-v0.4.26+commit.4563c3fc.js");
      solvo = qss[0];
      break;
    } else if (qss[0] === "s0517") {
      compiler = new Compiler("/soljson-v0.5.17+commit.d19bba13.js");
      solvo = qss[0];
      break;
    } else if (qss[0] === "s0612") {
      compiler = new Compiler("/soljson-v0.6.12+commit.27d51765.js");
      solvo = qss[0];
      break;
    } else if (qss[0] === "s074") {
      compiler = new Compiler("/soljson-v0.7.4+commit.3f05b770.js");
      solvo = qss[0];
      break;
    }
  }
}
if (compiler === null) {
  compiler = new Compiler("/soljson-v0.4.26+commit.4563c3fc.js");
  solvo = "s0426";
}

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
  private solv: string = solvo;

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

    this.$store.watch(
      () => {
        return this.$store.state.events.resetEditors;
      },
      () => {
        if (this.monacoEditor != undefined) {
          const model = this.monacoEditor.getModel();
          model && model.setValue(this.$store.state.editor.text.lity);
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
      compiler.compile(this.monacoEditor.getValue(), (result: any) => {
        if (result.errors) {
          for (let i = 0; i < result.errors.length; i++) {
            this.$store.dispatch(
              "outputs/pushProblems",
              (result.errors[i] as any).formattedMessage
            );
          }
        }
        if (
          result.contracts &&
          (result.contracts["sol"] || result.contracts[""])
        ) {
          const c = result.contracts["sol"] || result.contracts[""];
          // Set constant & payable for compatible
          // https://github.com/ethereum/solidity/issues/8065
          for (let n in c) {
            c[n].abi &&
              c[n].abi.forEach((abi: any) => {
                if (
                  abi.stateMutability === "pure" ||
                  abi.stateMutability === "view"
                ) {
                  abi.constant = true;
                } else {
                  if (abi.stateMutability === "payable") {
                    abi.payable = true;
                  }
                  abi.constant = false;
                }
              });
          }
          this.$store.dispatch("contracts/setContracts", c);
          this.$store.dispatch("events/setLityPanel", "Contracts");
          this.$store.dispatch("events/triggerEditorResize");
        }
      });
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

  changeSolv() {
    let search = window.location.search;
    if (search === "") {
      search = `?${this.solv}`;
    } else {
      const regEx = new RegExp(`([\\?&])${solvo}`);
      if (regEx.test(search)) {
        search = search.replace(regEx, `$1${this.solv}`);
      } else {
        search = search.replace("?", `?${this.solv}&`);
      }
    }
    window.removeEventListener("beforeunload", (window as any).leavingConfirm);
    window.location.href =
      window.location.origin + "/" + search + window.location.hash;
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
.actions
  select
    line-height 1em
    width 150px
</style>
