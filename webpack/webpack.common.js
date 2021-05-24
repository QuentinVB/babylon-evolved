/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const root = path.resolve(__dirname, '..');

module.exports = {
    context: root,
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
        },],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'BABYLON Evolved',
            template: './src/html/index.html'
        }),
        new ESLintPlugin()
    ],

    output: {
        path: path.resolve(root, 'dist'),
        filename: 'public/js/main.js',
        chunkFilename: '[id].[contenthash].js',
        publicPath: './',
        devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
    },
};