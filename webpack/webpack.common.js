const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const root = path.resolve(__dirname, '..');

module.exports = {
    entry: './src/app.ts',
    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
            },
            exclude: /node_modules/,
        }, ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'BABYLON Evolved',
            template: './src/html/index.html'
        }),
    ],
    externals: {
        'babylonjs': 'BABYLON',
    },

    output: {
        path: path.resolve(root, 'dist'),
        filename: 'public/js/main.js',
        chunkFilename: '[id].[contenthash].js',
        publicPath: './',
    },
};