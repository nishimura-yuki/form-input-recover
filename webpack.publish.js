const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const config = require('./webpack.base');

module.exports = merge(config, {
  mode: 'production',
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: { drop_console: true }
      },
    })
  ]
});