/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const root = path.resolve(__dirname, '..');


module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        MiniCssExtractPlugin.loader,
        // Translates CSS into CommonJS
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
          },
        },
        // Compiles Sass to CSS
        {
          loader: "sass-loader",
          options: {
            sourceMap: true,
            sassOptions: {
              //outputStyle: "compressed",
              fiber: false
            },
          },
        },
      ],
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'public/css/style.css',
      chunkFilename: '[id].css',
    }),
  ],
  //https://webpack.js.org/configuration/dev-server/
  devServer: {
    //static assets
    contentBase: path.join(root, 'assets'),
    contentBasePublicPath: '/public',
    //dynamic assets
    filename: '/public/js/main.js',
    publicPath: '/',
    historyApiFallback: {
      index: 'index.html'
    },
    //http
    compress: false,
    port: 9000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    disableHostCheck: true,
    //reloading & browser
    open: true,
    watchContentBase: true,
    liveReload: true,
    injectHot: true,
    hot: true,
  },
});