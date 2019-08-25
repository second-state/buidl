import JSVM from "@/services/jsvm.ts";
import store from "@/store";
const Debugger = require("remix-debug").EthDebugger;

class myDebugger {
  debugManager: any;
  traceLength: number = 0;
  solidityLocals: any[] = [];
  solidityStates: any[] = [];
  sourceLocation: any[] = [];
  createDebugManager(txHash: string, contract: any, cb: Function) {
    //console.log(JSVM.vm);
    //console.log(JSVM.web3Providers);
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
        this.debugManager.callTree.event.register(
          "callTreeBuildFailed",
          (err: any) => {
            console.log(err);
          }
        );
        this.debugManager.callTree.event.register("callTreeReady", () => {
          this.traceLength = this.debugManager.traceManager.trace.length;
          this.setSolidityLocals();
          this.setSolidityState();
          this.setSourceLocation();
          cb(this.debugManager);
        });
        this.debugManager.debug(tx);
      }
    });
  }

  setSolidityLocals() {
    for (let step = 0; step < this.traceLength; step++) {
      this.debugManager.traceManager.getCurrentCalledAddressAt(
        step,
        (error: any, address: any) => {
          if (error) console.log(error);
          this.debugManager.sourceLocationFromVMTraceIndex(
            address,
            step,
            (error: any, location: any) => {
              if (error) console.log(error);
              this.debugManager.decodeLocalsAt(
                step,
                location,
                (error: any, decodedlocals: any) => {
                  if (error) console.log(error);
                  //console.log(decodedlocals)
                  this.solidityLocals.push(decodedlocals);
                }
              );
            }
          );
        }
      );
    }
  }
  setSolidityState() {
    for (let step = 0; step < this.traceLength; step++) {
      this.debugManager.extractStateAt(step, (error: any, state: any) => {
        if (error) console.log(error);
        this.debugManager.decodeStateAt(
          step,
          state,
          (error: any, decodedState: any) => {
            this.solidityStates.push(decodedState);
          }
        );
      });
    }
  }
  setSourceLocation() {
    for (let step = 0; step < this.traceLength; step++) {
      this.debugManager.traceManager.getCurrentCalledAddressAt(
        step,
        (error: any, address: any) => {
          if (error) console.log(error);
          this.debugManager.sourceLocationFromVMTraceIndex(
            address,
            step,
            (error: any, rawLocation: any) => {
              if (error) console.log(error);
              this.sourceLocation.push(rawLocation);
            }
          );
        }
      );
    }
  }

  getSolidityState(stepIndex: number) {
    return this.solidityStates[stepIndex];
  }

  getSolidityLocals(stepIndex: number) {
    return this.solidityLocals[stepIndex];
  }

  getSourceLocation(stepIndex: number) {
    const code = store.state.editor.text.lity;
    const loc = this.sourceLocation[stepIndex];
    const res = {
      from: this.getlineNumberofChar(code, loc.start),
      to: this.getlineNumberofChar(code, loc.start + loc.length)
    };
    return res;
  }

  getlineNumberofChar(data: string, index: number) {
    var perLine = data.split("\n");
    var total_length = 0;
    let i: number;
    for (i = 0; i < perLine.length; i++) {
      total_length += perLine[i].length;
      if (total_length >= index) return i + 1;
    }
    return i;
  }
}
export default new myDebugger();
