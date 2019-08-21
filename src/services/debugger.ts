import JSVM from "@/services/jsvm.ts";
const Debugger = require("remix-debug").EthDebugger;

class myDebugger {
  debugManager: any;
  createDebugManager(txHash: string, contract: any) {
    console.log(JSVM.vm);
    console.log(JSVM.web3Providers);
    const web3VM = JSVM.web3Providers.modes.VM;
    web3VM.eth.getTransaction(txHash, (error: any, tx: any) => {
      if (error) {
        console.log(error);
        return;
      } else {
        this.debugManager = new Debugger({
          compilationResult: () => {
            return contract;
          }
        });

        this.debugManager.addProvider("web3vmprovider", web3VM);
        this.debugManager.switchProvider("web3vmprovider");

        this.debugManager.callTree.event.register("callTreeReady", () => {});
        this.debugManager.callTree.event.register(
          "callTreeBuildFailed",
          (err: any) => {
            console.log(err);
          }
        );

        this.debugManager.event.register("newTraceLoaded", () => {});
        this.debugManager.debug(tx);
      }
    });
  }

  getVmTraceManager() {
    return this.debugManager.traceManager;
  }
}
export default new myDebugger();
