<template>
  <div class="wallet">
    <div class="sig-actions">
      <h3>Signatures</h3>
      <button @click="newSig">+</button>
    </div>
    <ul>
      <li class="sig-item" v-for="(sig, index) in allSigs" :key="sig.address">
        <i @click="removeSig(index)">&times;</i> {{ sig.address }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../store";
import { Signature } from "../modules/wallet";
const EthUtil = require("ethereumjs-util");
const Secp256k1 = require("secp256k1");
const Crypto = require("crypto");

function newSig(): Signature {
  let privKey;
  do {
    privKey = Crypto.randomBytes(32);
  } while (!Secp256k1.privateKeyVerify(privKey));

  const address = EthUtil.privateToAddress(privKey);
  return new Signature(
    EthUtil.bufferToHex(address),
    EthUtil.bufferToHex(privKey)
  );
}
// init
if ((store.state as any).wallet.all.length === 0) {
  for (let i = 0; i < 5; i++) {
    let sig = newSig();
    store.dispatch("wallet/addSig", sig);
  }
}

@Component({
  components: {}
})
export default class Wallet extends Vue {
  get allSigs() {
    return this.$store.state.wallet.all;
  }

  newSig() {
    let sig = newSig();
    this.$store.dispatch("wallet/addSig", sig);
  }

  removeSig(index: number) {
    this.$store.dispatch("wallet/removeSig", index);
  }
}
</script>

<style lang="stylus">
@import "../assets/themes/light.styl"
.wallet
  display flex
  flex-direction column
  height 100%
  .sig-actions
    padding 0 0.5em
    display flex
    align-items baseline
    justify-content space-between
    h3
      margin 0
      font-size 0.9em
    button
      font-size 1.5em
      background transparent
      border 0
      color $color
      padding 0
      line-height 1.5
      cursor pointer
  ul
    margin 0
    padding 0 1em
    list-style none
    flex-grow 1
    overflow scroll
  .sig-item
    position relative
    width 100%
    padding-left 20px
    margin 1em 0
    overflow hidden
    text-overflow ellipsis
    i
      font-style normal
      position absolute
      left 0
      cursor pointer
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
body.dark-theme
  .wallet
    .sig-actions
      button
        color $color
</style>
