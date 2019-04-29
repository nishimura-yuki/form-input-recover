const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const basePath = process.cwd();

module.exports = {
  entry: {
    'form-input-recover-view': `${basePath}/src/javascripts/FormInputRecoverView.ts`,
    'form-input-recover': `${basePath}/src/javascripts/FormInputRecover.ts`,
  },

  output: {
    path: `${basePath}/dist`,
    filename: '[name].js',
    library: 'FormInputRecover',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      // TSLint loader
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'ts-loader' },
          { loader: 'tslint-loader' }
        ]
      },
      // TypeScript loader(ts-loaderで変換しつつES6についてはbabel-loaderでダウンパイルする)
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // ejs
      {
        test: /\.ejs$/,
        exclude: /node_modules/,
        use: [
          { loader: 'html-loader' },
          { loader: 'ejs-html-loader' },
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: `${basePath}/src/examples/sample-modal.ejs`,
      filename: "sample-modal.html",
      chunks: ['form-input-recover-view'],
    }),
    new HtmlWebpackPlugin({
      template: `${basePath}/src/examples/sample-auto.ejs`,
      filename: "sample-auto.html",
      chunks: ['form-input-recover-view'],
    }),
    new HtmlWebpackPlugin({
      template: `${basePath}/src/examples/sample-api.ejs`,
      filename: "sample-api.html",
      chunks: ['form-input-recover'],
    }),
  ]
};
