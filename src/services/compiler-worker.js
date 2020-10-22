import * as solc from "./compiler-wrapper.js";
let compileJSON = null;
const missingInputs = [];

onmessage = function(e) {
  const data = e.data;
  switch (data.cmd) {
    case "loadVersion":
      {
        delete self.Module;
        // NOTE: workaround some browsers?
        self.Module = undefined;
        //importScripts() method of synchronously imports one or more scripts into the worker's scope
        self.importScripts(data.data);
        const compiler = solc(self.Module);
        compileJSON = function(input) {
          try {
            const missingInputsCallback = function(path) {
              missingInputs.push(path);
              return { "error": "Deferred import" };
            };
            return compiler.compile(input, missingInputsCallback);
          } catch (exception) {
            return JSON.stringify({ error: "Uncaught JavaScript exception:\n" + exception });
          }
        }
        self.postMessage({
          cmd: "versionLoaded",
          data: compiler.version()
        });
        break;
      }
      
    case "compile":
      missingInputs.length = 0;
      if (data.input && compileJSON) {
        self.postMessage({
          cmd: "compiled",
          job: data.job,
          data: compileJSON(data.input),
          missingInputs: missingInputs
        });
      }
      break;
  }
}
