export interface CompilerInputOptions {
  optimize: boolean;
  libraries?: object;
}

export default function(sources: object, opts: CompilerInputOptions) {
  return JSON.stringify({
    language: "Solidity",
    sources: sources,
    settings: {
      optimizer: {
        enabled: opts.optimize === true,
        runs: 200
      },
      libraries: opts.libraries,
      outputSelection: {
        "*": {
          "": ["legacyAST"],
          "*": [
            "abi",
            "metadata",
            "devdoc",
            "userdoc",
            "evm.legacyAssembly",
            "evm.bytecode",
            "evm.deployedBytecode",
            "evm.methodIdentifiers"
          ]
        }
      }
    }
  });
}
