const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const WorkerPlugin = require('worker-plugin')

module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html'
    },
    frame: {
      entry: 'src/embed/frame.ts',
      template: 'public/embed/frame.html',
      filename: 'embed/frame.html'
    }
  },
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin(),
      new WorkerPlugin()
    ]
  },
  pwa: {
    workboxOptions: {
      importScripts: 'sw-supplement.js'
    }
  },
  chainWebpack: config => config.resolve.symlinks(false)
}