const fs = require('fs');
let dir = process.env.INIT_CWD;
console.log("Checking Project Setup " + dir);

/// tsconfig.json file
console.log("Validating tsconfig.json");
if(!fs.existsSync(dir +"/tsconfig.json")){
    console.log("Creating tsconfig.json");
    
    let tsconf = {
        compilerOptions: {
        outDir: "./build",
        sourceMap: true,
        noImplicitAny: true,
        module: "commonjs",
        target: "es5",
        jsx: "react",
        lib: [
            "es2015",
            "dom"
        ],
        skipLibCheck: false,
        esModuleInterop: true
        },
        include: [
        "./src/**/*"
        ]
    }
    fs.writeFileSync(dir +"/tsconfig.json",JSON.stringify(tsconf,null,2));
}


/// package.json file;
let package;
console.log("Validating package.json");
if(!fs.existsSync(dir +"/package.json")){
    console.log("Creating package.json");
    package = {
        name: "cust",
        version: "1.0.0",
        description: "Custom Component",
        main: "index.js",
        scripts: {
          start: "webpack-dev-server",
          build: "webpack -p --config webpack.production.config.js",
          debug: "ngrok http --host-header=rewrite 8080",
        },
        author: "Dell Boomi",
        license: "MIT",
        dependencies: {
            buffer: "^6.0.3",
            'flow-component-model': "^1.7.8",
            react: "^16.3.2",
            stream: "0.0.2",
            timers: "^0.1.1"
        },
        devDependencies: {
          "@types/react": "^16.7.3",
          "css-loader": "^3.3.2",
          "mini-css-extract-plugin": "^0.5.0",
          "source-map-loader": "^1.1.0",
          "ts-loader": "^8.0.4",
          "typescript": "^4.0.0",
          "webpack": "^5.28.0",
          "webpack-cli": "^3.3.5",
          "webpack-dev-server": "^3.11.2",
          "write-file-webpack-plugin": "4.4.1"
        },
        flow: {
          filenames: {
            js: "custom.js",
            css: "custom.css"
          }
        },
        peerDependencies: {},
        bundledDependencies: [],
        optionalDependencies: {}
    }
}
else {
    try {
        let buffer = fs.readFileSync(dir +"/package.json");
        if(!buffer) {
            console.log("no bufer");
        }
        else {
            console.log("buffer=" + buffer.toString());
        }
        package = JSON.parse(buffer);
        if(!package.dependencies) {
            package.dependencies = {};
        }
        jsonMinimumVersion(package.dependencies,"buffer","^6.0.3");
        //jsonMinimumVersion(package.dependencies,"flow-component-model","^1.7.8");
        jsonMinimumVersion(package.dependencies,"react", "^16.3.2");
        jsonMinimumVersion(package.dependencies,"stream", "0.0.2");
        jsonMinimumVersion(package.dependencies,"timers", "^0.1.1");

        if(!package.devDependencies) {
            package.devDependencies = {};
        }
        jsonMinimumVersion(package.devDependencies,"@types/react", "^16.7.3");
        jsonMinimumVersion(package.devDependencies,"css-loader", "^3.3.2");
        jsonMinimumVersion(package.devDependencies,"mini-css-extract-plugin", "^0.5.0");
        jsonMinimumVersion(package.devDependencies,"source-map-loader", "^1.1.0");
        jsonMinimumVersion(package.devDependencies,"ts-loader", "^8.0.4");
        jsonMinimumVersion(package.devDependencies,"typescript", "^4.0.0");
        jsonMinimumVersion(package.devDependencies,"webpack", "^5.28.0");
        jsonMinimumVersion(package.devDependencies,"webpack-cli", "^3.3.5");
        jsonMinimumVersion(package.devDependencies,"webpack-dev-server", "^3.11.2");
        jsonMinimumVersion(package.devDependencies,"write-file-webpack-plugin", "4.4.1");

        
        if(!package.flow) {
            package.flow = {filenames: {js: "comp.js", css: "comp.css"}};
        }

    }
    catch(e) {
        console.log("pkg error");
        package = {error: e}
    }
}
fs.writeFileSync(dir +"/package.json",JSON.stringify(package,null,2));


let webpack="";
webpack += "const path = require('path')\nconst fs = require('fs')\nconst MiniCssExtractPlugin = require('mini-css-extract-plugin')\nconst flow = require('./package.json').flow\n"
webpack += "module.exports = function() {\n    const config = {\n        entry: './src/index.tsx',\n        output: {\n            filename: flow.filenames.js,\n";
webpack += "            path: path.resolve(__dirname, 'build'),\n            sourceMapFilename: '[flow.filenames.js].map',\n        },\n        devtool: 'inline-source-map',\n";
webpack += "        resolve: {\n            extensions: ['.ts', '.tsx', '.js', '.json'],\n        },\n        devServer: {\n            contentBase: './build',\n";
webpack += "            writeToDisk: true\n        },\n        mode: 'development',\n        module: {\n            rules: [\n                { \n";
webpack += "                    test: /\.tsx?$/, \n                    loader: 'ts-loader'\n                },\n                { \n                    test: /\.js$/, \n";
webpack += "                    enforce: 'pre', \n                    loader: 'source-map-loader'\n                },\n                { \n";
webpack += "                    test:/\.css$/,\n                    use: [\n                        MiniCssExtractPlugin.loader,\n                        'css-loader'\n";
webpack += "                      ]\n                }\n            ]\n        },\n        externals: {\n            'react': 'React',\n            'react-dom': 'ReactDOM'\n";
webpack += "        },\n        plugins: [\n            //new WriteFilePlugin(),\n            new MiniCssExtractPlugin({ filename: flow.filenames.css })\n        ],\n";
webpack += "    }\n    if (!fs.existsSync('./build'))\n        fs.mkdirSync('./build');\n    return config;\n};"
if(!fs.existsSync(dir +"/webpack.config.js")){
    fs.writeFileSync(dir +"/webpack.config.js",webpack);
}

let webpackProd="";
webpackProd += "const path = require('path')\nconst fs = require('fs')\nconst MiniCssExtractPlugin = require('mini-css-extract-plugin')\nconst flow = require('./package.json').flow\n"
webpackProd += "module.exports = function() {\n    const config = {\n        entry: './src/index.tsx',\n        output: {\n            filename: flow.filenames.js,\n";
webpackProd += "            path: path.resolve(__dirname, 'build'),\n            sourceMapFilename: '[flow.filenames.js].map',\n        },\n        devtool: 'inline-source-map',\n";
webpackProd += "        resolve: {\n            extensions: ['.ts', '.tsx', '.js', '.json'],\n        },\n        devServer: {\n            contentBase: './build',\n";
webpackProd += "            writeToDisk: true\n        },\n        mode: 'production',\n        module: {\n            rules: [\n                { \n";
webpackProd += "                    test: /\.tsx?$/, \n                    loader: 'ts-loader'\n                },\n                { \n                    test: /\.js$/, \n";
webpackProd += "                    enforce: 'pre', \n                    loader: 'source-map-loader'\n                },\n                { \n";
webpackProd += "                    test:/\.css$/,\n                    use: [\n                        MiniCssExtractPlugin.loader,\n                        'css-loader'\n";
webpackProd += "                      ]\n                }\n            ]\n        },\n        externals: {\n            'react': 'React',\n            'react-dom': 'ReactDOM'\n";
webpackProd += "        },\n        plugins: [\n            //new WriteFilePlugin(),\n            new MiniCssExtractPlugin({ filename: flow.filenames.css })\n        ],\n";
webpackProd += "    }\n    if (!fs.existsSync('./build'))\n        fs.mkdirSync('./build');\n    return config;\n};"
if(!fs.existsSync(dir +"/webpack.production.config.js")){
    fs.writeFileSync(dir +"/webpack.production.config.js",webpackProd);
}

if(!fs.existsSync(dir +"/src")) {
    fs.mkdirSync(dir +"/src");
}

if(!fs.existsSync(dir +"/src/index.tsx")) {
    fs.writeFileSync(dir +"/src/index.tsx","export * from './comp';");


    let comp = "";
    comp += "import React, { CSSProperties } from 'react';\nimport { eLoadingState, FlowComponent,  FlowObjectData,  FlowOutcome, FlowMessageBox, FlowContextMenu } from 'flow-component-model';";
    comp += "import './comp.css';\n\ndeclare const manywho: any;\n\nexport default class cust extends FlowComponent {\n\n";
    comp += "version: string='1.0.0';\ncontext: any;\n\n   messageBox: FlowMessageBox;\n   contextMenu: FlowContextMenu;\n   lastContent: any = (<div></div>);\n";
    comp += "\n\nconstructor(props: any) {\n   super(props);\n   this.flowMoved = this.flowMoved.bind(this);\n}\n\n\nasync flowMoved(xhr: any, request: any) {\n";
    comp += "   let me: any = this;\n    if(xhr.invokeType==='FORWARD') {\n      if(this.loadingState !== eLoadingState.ready){\n          window.setImmediate(function() {me.flowMoved(xhr, request)});\n";
    comp += "      }\n      else {\n         this.forceUpdate();\n      }\n    }\n}\n";
    comp += "\nasync componentDidMount() {\n   await super.componentDidMount();\n   (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);\n   this.forceUpdate();\n}\n";
    comp += "\nasync componentWillUnmount() {\n    await super.componentWillUnmount();\n    (manywho as any).eventManager.removeDoneListener(this.componentId);\n}\n";
    comp += "\nrender() {\n   if(this.loadingState !== eLoadingState.ready) {\n      return this.lastContent;\n   }\n   //handle classes attribute and hidden and size\n";
    comp += "   let classes: string = 'cust ' + this.getAttribute('classes','');\n   let style: CSSProperties = {};\n   style.width='-webkit-fill-available';\n   style.height='-webkit-fill-available';\n";
    comp += "\n   if(this.model.visible === false) {\n      style.display = 'none';\n   }\n   if(this.model.width) {\n      style.width=this.model.width + 'px'\n   }\n";
    comp += "   if(this.model.height) {\n      style.height=this.model.height + 'px'\n   }\n   this.lastContent = (\n      <div\n         className={classes}\n";
    comp += "         style={style}\n      >\n      <FlowContextMenu\n         parent={this}\n";
    comp += "         ref={(element: FlowContextMenu) => {this.contextMenu = element}}\n      />\n      <FlowMessageBox\n         parent={this}\n";
    comp += "         ref={(element: FlowMessageBox) => {this.messageBox = element}}\n      />\n      <div\n         className='cust-body'\n      >\n         {}\n";
    comp += "      </div>\n   </div>\n   );\n   return this.lastContent;\n}\n}\n\nmanywho.component.register('cust', cust);\n";
    if(!fs.existsSync(dir +"/src/comp.tsx")) {
        fs.writeFileSync(dir +"/src/comp.tsx",comp);
    }

    let css = ".cust {\n\n}\n\n.cust-body{\n\n}\n";
    if(!fs.existsSync(dir +"/src/comp.css")) {
        fs.writeFileSync(dir +"/src/comp.css",css);
    }

}

//forces version in json file to min or above
function jsonMinimumVersion(object,key,min) {
    if(!object[key]){
        object[key]=min;
    }
    else {
        let cur = object[key];
        let curbits = cur.split(".");
        let minbits = min.split(".");
        override=false;
        for(pos=0 ; pos < minbits.length ; pos ++){
            let curbit = parseInt(curbits[pos].replace("<","").replace(">","").replace("=","").replace(":","").replace("^",""));
            let minbit = parseInt(minbits[pos].replace("<","").replace(">","").replace("=","").replace(":","").replace("^",""));
            if(minbit>curbit || override===true){
                curbits[pos]=minbits[pos];
                override=true
            }
        }
        object[key]="";
        curbits.forEach((bit) => {
            if(object[key].length > 0) {
                object[key]+="."
            }
            object[key]+=bit;
        });
    }
}