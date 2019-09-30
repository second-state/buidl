export default `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>{{title}}</title>
    {{cssLibs}}
    <style type="text/css">
    {{css}}
    </style>
  </head>
  <body>
    {{html}}

    <script type="text/javascript">
    window.BuidlProviders = {
      web3: {
        url: "{{web3ProviderUrl}}",
        chainId: "{{web3ProviderChainId}}",
        gasPrice: "{{web3ProviderGasPrice}}",
        gasLimit: "{{web3ProviderGasLimit}}",
      },
      es: {
        url: "{{esProviderUrl}}"
      }
    }
    </script>
    <script type="text/javascript" src="https://buidl.secondstate.io/embed/main.js"></script>
    {{jsLibs}}
    <script type="text/javascript">
    {{js}}
    </script>
  </body>
</html>` as string;
