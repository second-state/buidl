const solc = require("./compiler-wrapper.js");
import compilerInput from "./compiler-input";
import store from "../store";

export default class Compiler {
  compiler: any | undefined;

  constructor(url: string) {
    this.loadModule(url);
  }

  private loadModule(url: string) {
    delete (window as any).Module;

    const newScript = document.createElement("script");
    newScript.type = "text/javascript";
    newScript.src = url;
    document.getElementsByTagName("head")[0].appendChild(newScript);
    const check = window.setInterval(() => {
      if (!(window as any).Module) {
        return;
      }
      window.clearInterval(check);
      this.compilerLoaded();
    }, 200);
  }

  private compilerLoaded() {
    this.compiler = solc((window as any).Module);
    store.dispatch("events/compilerReady");
  }

  public compile(source: string) {
    let missingInputs: string[] = [];
    function missingInputsCallback(path: string) {
      missingInputs.push(path);
      return { error: "Deferred import" };
    }

    let result;
    try {
      const input = compilerInput(
        {
          "new.lity": {
            content: source
          }
        },
        { optimize: false }
      );
      if (this.compiler) {
        result = this.compiler.compile(input, missingInputsCallback);
      }
      result = JSON.parse(result);
    } catch (exception) {
      result = {
        error: {
          formattedMessage: `Uncaught JavaScript exception:\n${exception}`,
          severity: "error",
          mode: "panic"
        }
      };
    }
    console.log(result, missingInputs);
  }
}
