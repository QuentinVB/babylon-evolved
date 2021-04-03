# Babylon-Evolved
Aka : "I'm tired to start over a configuration for my babylon.JS game project, so why not building a full project configuration and share it ?"

V 0.0.3
Work in progress

## Features & Highlight

The project and configuration files target Visual Studio Code 1.54 and above TODO : add node version

### Packages.json
The npm entry point has 4 command (executable via `npm run commandName` )
- `test` : not supported yet
- `dev` : will launch the webpack dev server with his custom configuration
- `build` : will build the project using the according webpack configuration
- `lint` : will execute eslint on the project in order to keep the code clean

### Webpack
The folder webpack contains 3 webpack configurations files according to the run command. 
#### Common
This one will setup common parameters, such as transpile typescript, copying and filling the *index.html* template using [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin). It adds the BABYLON.JS as an [external lib](https://webpack.js.org/configuration/externals/). And finally, set the output folder to `dist`.
#### Development
The dev configuration set webpack in `development` mode and change the SASS config (unminified, full source map). It mainly setup the webpack dev server. The server use the static content from */assets* and the dynamic content generated on the fly (css and js) and serve them from */public*.
To speed up the reloading of the page, the hot module remplacement feature is on.
#### Production
The prod configuration set webpack in `production` mode. The js transpiled from ts will pass trough babel (despite TS targeting ES5, still some part aren't supported). The SASS config will minify and output css and the CopyPlugin will copy the files from */assets* into */dist*. Also, the JS and CSS final output will be placed in */dist*. The `webpack-bundle-analyzer` plugin deliver stats about the production build. The analyzer viewer in browser is set to false by default. Switch to on and go to localhost:8888 to vizualise the content. More info in the [documentation]( https://www.npmjs.com/package/webpack-bundle-analyzer).


### Debbuging 
with chrome and visual studio Code
https://blog.alexanderwolf.tech/debugging-a-web-app-in-vs-code/

### Linter
 https://www.digitalocean.com/community/tutorials/linting-and-formatting-with-eslint-in-vs-code

## Babylon JS
TODO : retrieve module, loading, and so from quaternion game (may be required to ease the physic...)
https://doc.babylonjs.com/divingDeeper/developWithBjs/vsCode

# Blender level 
use the blender to babylon python module

## Config
Further improvement
https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html

## optimization 
via terser ?
https://webpack.js.org/guides/lazy-loading/

## build & pack
- opera : ?
- firefox : ?
- chrome : ?
- IE11 : ?
- edge : ?

## Ideas
https://www.alsacreations.com/tuto/lire/1754-debuter-avec-webpack.html add dashboard ?

https://github.com/mastilver/dynamic-cdn-webpack-plugin
https://sebastianrothbucher.github.io/web/html/css/javascript/webpack/cdn/2018/09/22/webpack-javascript-css-cdn.html