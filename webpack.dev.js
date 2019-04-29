const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.base');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9091
  } 
});
