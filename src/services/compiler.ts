import compilerInput from "./compiler-input";
import store from "../store";

const compilerWorker = new Worker("./compiler-worker.js", { type: "module" });

export default class Compiler {
  compiler: any | undefined;
  compileCb: Function | undefined;

  constructor(url: string) {
    this.loadModule(url);
  }

  private loadModule(url: string) {
    compilerWorker.onmessage = e => {
      const data = e.data;
      switch (data.cmd) {
        case "versionLoaded":
          this.compilerLoaded();
          break;
        case "compiled":
          this.compileCb && this.compileCb(JSON.parse(data.data));
          break;
      }
    };
    compilerWorker.postMessage({
      cmd: "loadVersion",
      data: url
    });
  }

  private compilerLoaded() {
    store.dispatch("events/compilerReady");
  }

  public compile(source: string, cb: Function) {
    const input = compilerInput(
      {
        sol: {
          content: source
        }
      },
      { optimize: false }
    );
    this.compileCb = cb;
    compilerWorker.postMessage({
      cmd: "compile",
      input: input
    });
  }
}
