<template>
  <div class="wallet">
    <div class="sig-actions">
      <h3>Accounts</h3>
      <div>
        <button @click="importSig" title="Import From Private Key">
          Import
        </button>
        <button @click="newSig" title="New Account">New</button>
      </div>
    </div>
    <ul>
      <li class="sig-item" v-for="(sig, index) in allSigs" :key="sig.address">
        <i
          v-if="defaultSig && defaultSig.address !== sig.address"
          @click="removeSig(index)"
          title="Remove"
          >&times;</i
        >
        {{ sig.address }}
        <input :ref="`sig${sig.address}`" type="hidden" :value="sig.address" />
        <div class="sig-item-op">
          <span v-if="defaultSig && defaultSig.address === sig.address"
            >Default</span
          >
          <a v-else @click="setDefault(sig)">Set Default</a>
          <a @click="copy(sig.address, $event)">Copy</a>
        </div>
        <div
          class="sig-item-balance"
          :title="`Balance ${sigBalances[sig.address]} Wei`"
        >
          {{ sigBalances[sig.address] }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../store";
import { Signature } from "../modules/wallet";
import LityWeb3 from "@/services/web3";
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

function importSig(): Signature | null {
  let privKey = window.prompt("Enter your Private Key:");
  if (privKey !== null) {
    if (!privKey.startsWith("0x")) {
      privKey = "0x" + privKey;
    }
    if (/^0x[0-9a-zA-Z]{64}$/.test(privKey)) {
      const address = EthUtil.privateToAddress(privKey);
      return new Signature(
        EthUtil.bufferToHex(address),
        EthUtil.bufferToHex(privKey)
      );
    } else {
      alert("Invalid Private Key");
    }
  }
  return null;
}

// init
if ((store.state as any).wallet.all.length === 0) {
  for (let i = 0; i < 5; i++) {
    let sig = newSig();
    store.dispatch("wallet/addSig", sig);
    if (i === 0) {
      store.dispatch("wallet/setDefault", sig);
    }
  }
}

@Component({
  components: {}
})
export default class Wallet extends Vue {
  sigBalances: { [key: string]: string } = {};

  created() {
    let updating = false;
    function updateBalance(this: Wallet) {
      if (updating) {
        return;
      }
      updating = true;
      const web3 = this.newLityWeb3();
      const sb: { [key: string]: string } = {};
      let gc = 0;
      this.allSigs.forEach((sig: Signature) => {
        web3.ss.getBalance(sig.address, (err: any, blc: any) => {
          if (!err) {
            sb[sig.address] = blc.toString();
          } else {
            sb[sig.address] = "";
          }
          if (++gc === this.allSigs.length) {
            this.sigBalances = sb;
            updating = false;
          }
        });
      });
    }

    setInterval(updateBalance.bind(this), 10 * 1000);
  }

  newLityWeb3() {
    const provider = this.$store.state.prefs.web3Provider;
    const pUrl =
      provider.using !== ""
        ? provider.options[provider.using].url
        : provider.custom.url;
    return LityWeb3(pUrl, "Lity");
  }

  get allSigs() {
    return this.$store.state.wallet.all;
  }

  get defaultSig() {
    return this.$store.state.wallet.default;
  }

  newSig() {
    let sig = newSig();
    this.$store.dispatch("wallet/addSig", sig);
  }

  importSig() {
    let sig = importSig();
    if (sig) {
      this.$store.dispatch("wallet/addSig", sig);
      this.setDefault(sig);
    }
  }

  removeSig(index: number) {
    this.$store.dispatch("wallet/removeSig", index);
  }

  setDefault(sig: Signature) {
    this.$store.dispatch("wallet/setDefault", sig);
  }

  copy(addr: string, e: any) {
    const input = (this.$refs[`sig${addr}`] as any)[0];
    input.setAttribute("type", "text");
    input.select();
    document.execCommand("copy");
    input.setAttribute("type", "hidden");
    e.target.innerText = "Copied";
    setTimeout(() => {
      e.target.innerText = "Copy";
    }, 500);
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
    padding 0.5em 0.5em
    display flex
    align-items baseline
    justify-content space-between
    h3
      margin 0
      font-size 0.9em
    button
      font-size .75em
      background transparent
      border 0
      box-shadow none
      color $color
      padding 0
      margin 0 0.5em
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
    padding 0 0 20px 20px
    margin 1em 0
    overflow hidden
    text-overflow ellipsis
    font-size 0.9em
    i
      font-style normal
      position absolute
      left 0
      cursor pointer
    .sig-item-op
      position absolute
      margin-top 3px
      font-size 0.8em
      a
        display none
        color rgba($color, 0.5)
        cursor pointer
      * + a
        margin-left 1em
    .sig-item-balance
      position absolute
      margin-top 3px
      font-size 0.8em
      right 0
      color rgba($color, 0.5)
      max-width 150px
      overflow hidden
      text-overflow ellipsis
    &:hover
      .sig-item-op
        a
          display inline
</style>

<style lang="stylus">
@import "../assets/themes/dark.styl"
body.dark-theme
  .wallet
    .sig-actions
      button
        color $color
    .sig-item
      .sig-item-op
        a
          color rgba($color, 0.5)
      .sig-item-balance
        color rgba($color, 0.5)
</style>
