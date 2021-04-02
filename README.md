https://sebastianrothbucher.github.io/web/html/css/javascript/webpack/cdn/2018/09/22/webpack-javascript-css-cdn.html
https://github.com/mastilver/dynamic-cdn-webpack-plugin
https://webpack.js.org/configuration/externals/

    "build": "webpack --config build/webpack.config.build.js",
    "dev": "webpack-dev-server --config build/webpack.config.dev.js",

    https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html
    https://github.com/jantimon/html-webpack-plugin

    should add linter

    should minify

babel rc
{
    "presets": [
      ["@babel/env", {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }]
    ]
  }



  prod config
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // Must be set to true if using source-maps in production
        extractComments: true,
        terserOptions: {
          output: {
            comments: /@license/i,
          },
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
    ],
  },

  //https://www.alsacreations.com/tuto/lire/1754-debuter-avec-webpack.html add dashboard ?