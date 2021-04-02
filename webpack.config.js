const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

//const devMode = process.env.NODE_ENV !== 'production';
const devMode ="development";
var wwwroot = "../../public/";


module.exports = {
    mode: devMode,
    entry: './src/app.ts',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js','.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
                exclude: /node_modules/,
            },
            //https://webpack.js.org/guides/asset-management/#loading-css
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                  // Translates CSS into CommonJS
                  {
                    loader: "css-loader",
                    options: {
                      sourceMap: !!devMode,
                    },
                  },
                  // Compiles Sass to CSS
                  {
                    loader: "sass-loader",
                    options: {
                      sourceMap: !!devMode,
                      sassOptions: {
                        outputStyle: "compressed",
                        fiber: false
                      },
                    },
                  },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'BABYLON Evolved',
            template: './src/html/index.html'
          }),
        new MiniCssExtractPlugin({
            filename: devMode ? 'public/css/style.css' : 'public/css/style.[contenthash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
        }),
        
        new CopyPlugin({
          patterns: [
            { 
              from:path.resolve(__dirname, "assets"),
              to: path.resolve(__dirname, "dist/public/"),
              toType: 'dir'
            },
          ],
        }),
    ],
    externals: {
        'babylonjs': 'BABYLON',
    },
  //https://webpack.js.org/configuration/dev-server/
    devServer: {
      //static assets
        contentBase: path.join(__dirname, 'assets'),
        contentBasePublicPath:'/public',
      //dynamic assets
        //index:  path.join(__dirname, 'dist/index.html'),
        filename:'/public/js/main.js',
        publicPath: '/',
        historyApiFallback: {
          index: 'index.html'
        },
      //http
        compress: !!!devMode, 
        port: 9000,
        headers: { 'Access-Control-Allow-Origin': '*' },//SECURITY => NOT IN PRODUCTION
        disableHostCheck: !!devMode,//SECURITY => NOT IN PRODUCTION
      //reloading & browser
        open: true,
        watchContentBase: true,
        liveReload: true,
        injectHot:true,
        hot: true,
    },
    //LOCKED !
    output: {
      //main output folder
        path: path.resolve(__dirname, 'dist'),
        clean: true,//!!!devMode, //=> in production

        filename: 'public/js/main.js',
        chunkFilename: '[id].[contenthash].js',
        publicPath: './',
        //path.join(__dirname,'dist/public','js'),
        //path: path.join(__dirname,wwwroot,'js')
    },
};
