/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const root = path.resolve(__dirname, '..');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
              sassOptions: {
                outputStyle: "compressed",
                fiber: false
              },
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'public/css/style.[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(root, "assets"),
        to: path.resolve(root, "dist/public/"),
        toType: 'dir'
      }, ],
    }),
  ],
  //https://webpack.js.org/configuration/optimization/#root
  optimization: {
    minimize: true,
  },
  output: {
    clean: true
  },
  performance: {
    hints: 'warning',
  },
});