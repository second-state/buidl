const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin()
    ]
  },
  chainWebpack: config => config.resolve.symlinks(false)
}