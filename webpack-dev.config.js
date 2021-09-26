let path = require('path')
let devConfig = require('./webpack.config.js');
const webpack = require('webpack');

devConfig.devtool = 'eval-source-map';
devConfig.output.publicPath = 'http://'+(require("ip").address() || 'localhost')+':8080/';

devConfig.mode = "development";
devConfig.optimization = {
  nodeEnv: 'development'
}

devConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin()
);

devConfig.devServer = {
  index: "index.html",
  contentBase: path.join(__dirname, 'public'),
  host: '0.0.0.0',
  port: 8080,
  hot: true,
  disableHostCheck: true,
  historyApiFallback: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept'
  },
  compress: true,
  inline: true,
  noInfo: false,
  quiet: false,
  open: false,
  stats: {
    all: undefined,
    cached: false,
    cachedAssets: false,
    colors: true
  },
};
devConfig.watchOptions = {
  ignored: /node_modules/,
};

module.exports = devConfig;
