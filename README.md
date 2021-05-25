# BabylonJS-AdvancedBoilerPlate
Aka : "I'm tired to start over a configuration for my babylon.JS game project, so why not building a full project configuration and share it ?"

V 0.0.4
Work in progress

## Features & Highlight

The project and configuration files target Visual Studio Code 1.54 and above TODO : add node version

### Packages.json
The npm has 4 entry point (executable via `npm run commandName` )
- `test` : [not supported yet](https://www.youtube.com/watch?v=Qaks25zJlcw)
- `dev` : will launch the webpack dev server with his custom configuration
- `build` : will build the project using the according webpack configuration
- `lint` : will execute eslint on the project in order to keep the code clean

### Webpack
The folder webpack contains 3 webpack configurations files according to the run command. 
#### Common
This one will setup common parameters, such as transpile typescript, copying and filling the *index.html* template using [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin). . And finally, set the output folder to `dist`.
#### Development
The dev configuration set webpack in `development` mode and change the SASS config (unminified, full source map). It mainly setup the webpack dev server. The server use the static content from */assets* and the dynamic content generated on the fly (css and js) and serve them from */public*.
To speed up the reloading of the page, the hot module remplacement feature is on.
#### Production
The prod configuration set webpack in `production` mode. ~~The js transpiled from ts will pass trough babel (despite TS targeting ES5, still some part aren't supported).~~ The SASS config will minify and output css and the CopyPlugin will copy the files from */assets* into */dist*. Also, the JS and CSS final output will be placed in */dist*. 

The `webpack-bundle-analyzer` plugin deliver stats about the production build. The analyzer viewer in browser is set to false by default. Switch to on and go to http://localhost:8888 to vizualise the content. More info in the [documentation]( https://www.npmjs.com/package/webpack-bundle-analyzer).

### Debbuging 
With chrome and visual studio Code debbuging tools. The tasks are sets in the .vscode environnement
https://blog.alexanderwolf.tech/debugging-a-web-app-in-vs-code/
Todo :
- debug, it seems the debugger is not correctly linked to the build

### Linter
https://www.digitalocean.com/community/tutorials/linting-and-formatting-with-eslint-in-vs-code

## Babylon JS

https://doc.babylonjs.com/divingDeeper/developWithBjs/vsCode
### Inspector
The inspector is activated by default

## Blender level 
I'm a Blender user since 2008. It was obviously my choice to develop games with babylon js. 
I use the [blender to babylon python addon](https://doc.babylonjs.com/extensions/Exporters/Blender). To load 3D resources, 2 entry point exists :

### Entire scene
Load an entire scene, with concrete and empty object (ie: anchor point for instances). The blender scene you export and all his content will be your babylon js scene. Then you link elements from within the scene. For instance hidden colliders.

### AssetContainer
The file or a collection of file can be loaded in an asset container, in order to instantiate element on fly during the game.

## Config


## optimization 
Lazy loading
TODO : terser 
https://webpack.js.org/guides/lazy-loading/

## build & pack
- opera : ?
- firefox : ?
- chrome : ?
- IE11 : ?
- edge : ?

## Ideas and todo
https://www.alsacreations.com/tuto/lire/1754-debuter-avec-webpack.html add dashboard ?

https://github.com/mastilver/dynamic-cdn-webpack-plugin
https://sebastianrothbucher.github.io/web/html/css/javascript/webpack/cdn/2018/09/22/webpack-javascript-css-cdn.html

custom loading screen
https://doc.babylonjs.com/divingDeeper/scene/customLoadingScreen



integrat idea from JustKeepSwimming
- integrate resource loader (asser manager)
- integrate soundtrack

integrate idea from babylonjs-webpack-es6-master
- search for clean-webpack plugin

set config in environnement variable
https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html

correctyl call elements for efficient tree shaking (15mb dev, 5mb build o_o)

externalize inspector (too heavy !)
https://cdn.babylonjs.com/inspector/babylon.inspector.min.js

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";

