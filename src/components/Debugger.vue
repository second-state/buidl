<template>
  <div class="debugger">
    <div>
      <input
        type="text"
        class="txHash"
        v-model="txHash"
        placeholder="Transaction hash, should start with 0x"
      />
      <button @click="startDebug">Start Debugging</button>
      <div v-show="isStart">
        <div class="dropDownList">
          <div
            v-for="(item, index) in trace"
            class="dropDownItem"
            :class="[index == stepIndex ? 'active' : '', '']"
            :key="index"
          >
            {{ item.pc }} {{ item.op }}
          </div>
        </div>
        <div class="infoBox">
          <p>vm trace step: {{ stepIndex }}</p>
          <p>execution step: {{ stepIndex }}</p>
          <p>gas: {{ gas }}</p>
          <p>remaining gas: {{ remainingGas }}</p>
        </div>
        <button @click="stepBack">&#8592;</button>
        <button @click="stepForward">&#8594;</button>
        <div
          v-for="(item, key, index) in detailList"
          class="detailBox"
          :key="key"
        >
          <div class="detailBoxItem" @click="toggle(index)">
            <span>&#9654;</span>{{ key }}
            <p v-show="activateList[index]">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import EthDebugger from "@/services/debugger";
var util = require("../../node_modules/remix-lib/src/util");

@Component({
  components: {}
})
export default class Debugger extends Vue {
  private txHash: string = "";
  private isStart: boolean = false;
  private trace: any[] = [];
  private stepIndex: number = 0;
  private debugManager: any;
  private traceManager: any;
  private activateList: boolean[] = [];

  get contract() {
    return this.$store.state.contracts.contracts2;
  }

  get remainingGas() {
    if (!this.isStart) return 0;
    return this.trace[this.stepIndex].gas;
  }

  get gas() {
    if (!this.isStart) return 0;
    return this.trace[this.stepIndex].gasCost;
  }

  get detailList(): any {
    return {
      "Solidity State": { value: this.solidityState },
      "Solidity Locals": { value: this.solidityLocals },
      Stack: { value: this.stack },
      Memory: { value: this.memory },
      "Call Stack": { value: this.callStack },
      "Call Data": { value: this.callData },
      "Return Value": { value: this.returnValue }
    };
  }

  get stack() {
    if (!this.isStart) return 0;
    return this.trace[this.stepIndex].stack.slice(0).reverse();
  }

  get memory() {
    if (!this.isStart) return 0;
    return this.trace[this.stepIndex].memory;
  }

  get callStack() {
    if (!this.isStart) return 0;
    return util
      .findCall(this.stepIndex, this.traceManager.traceCache.callsTree.call)
      .callStack.join("\n");
  }

  get callData() {
    if (!this.isStart) return 0;
    return util.findLowerBoundValue(
      this.stepIndex,
      this.traceManager.traceCache.callDataChanges
    );
  }

  get returnValue() {
    if (!this.isStart) return 0;
    let value = this.traceManager.traceCache.returnValues[this.stepIndex];
    if (!value) {
      return "current step is not a return step";
    } else {
      return value;
    }
  }

  get solidityState() {
    if (!this.isStart) return 0;
    const state = EthDebugger.getSolidityState(this.stepIndex);
    let result = "";
    for (let item in state) {
      result +=
        item + ": " + state[item].value + " (" + state[item].type + ")\n";
    }
    return result;
  }

  get solidityLocals() {
    if (!this.isStart) return 0;
    const locals = EthDebugger.getSolidityLocals(this.stepIndex);
    let result = "";
    for (let item in locals) {
      result +=
        item + ": " + locals[item].value + " (" + locals[item].type + ")\n";
    }
    if (result === "") result = "no locals";
    return result;
  }

  startDebug() {
    EthDebugger.createDebugManager(
      this.txHash,
      this.contract,
      (debugManager: any) => {
        this.debugManager = debugManager;
        //console.log(debugManager)
        this.traceManager = this.debugManager.traceManager;
        this.trace = this.traceManager.trace;
        this.isStart = true;
        this.stepIndex = 0;
        this.setCodeHighLight();
      }
    );
  }

  stepBack() {
    if (this.stepIndex > 0) {
      this.stepIndex -= 1;
      this.dropDownListScroll();
      this.setCodeHighLight();
    }
  }

  stepForward() {
    if (this.stepIndex < this.trace.length - 1) {
      this.stepIndex += 1;
      this.dropDownListScroll();
      this.setCodeHighLight();
    }
  }

  toggle(index: number) {
    this.$set(this.activateList, index, !this.activateList[index]);
  }

  dropDownListScroll() {
    const list = document.getElementsByClassName(
      "dropDownList"
    )[0] as HTMLElement;
    const item = document.getElementsByClassName("dropDownItem")[
      this.stepIndex
    ] as HTMLElement;
    const offsetTop = item.offsetTop - list.offsetTop;
    list.scrollTop = offsetTop;
  }

  setCodeHighLight() {
    const res = EthDebugger.getSourceLocation(this.stepIndex);
    const lineElements = document.querySelectorAll(".view-line span span");
    lineElements.forEach((element: Element) => {
      element.classList.remove("selectionHighlight"); //monaco-editor-hover
    });
    for (let line = res.from; line <= res.to; line++) {
      lineElements[line - 1].classList.add("selectionHighlight"); //selectionHighlight
    }
  }
}
</script>
<style lang="stylus">
@import "../assets/themes/light.styl"

.debugger
  height 100%
  padding 1em
  overflow scroll
  select
    margin-bottom 1em
  button
    font-size 0.9em
  .txHash
    margin 0.5em 0
    padding 0.2em
    font-size 0.9em
  .dropDownList
    height 15vh
    margin 3vh 0
    padding 0 3vh
    overflow-y scroll
    background-color $backgroundColor
    font-size 0.9em
    .active
      color red
  .infoBox
    margin 3vh 0
    padding 1vh 3vh
    background-color $backgroundColor
    p
      margin 0
  .detailBox
    .detailBoxItem
      cursor pointer
      margin 3vh 0
      background-color $backgroundColor
      border-radius 10px
      padding 1vh
      p
        margin 0
      span
        margin 0 10px
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
body.dark-theme
  .debugger
    .dropDownList
      background-color $backgroundColor
    .infoBox
      background-color $backgroundColor
    .detailBox
      .detailBoxItem
        background-color $backgroundColor
</style>
