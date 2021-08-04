const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = function() {
    const config = {
        entry: "./src/index.tsx",
        output: {
            filename: "FlowComponentModel.min.js",
            path: path.resolve(__dirname, 'lib')
        },
        devtool: 'inline-source-map',
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        devServer: {
            contentBase: './build'
        },
        mode: 'production',
        module: {
            rules: [
                { 
                    test: /\.tsx?$/, 
                    loader: "awesome-typescript-loader" 
                },
                { 
                    test: /\.js$/, 
                    enforce: "pre", 
                    loader: "source-map-loader" 
                },
                { 
                    test:/\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader"
                      ]
                }
            ]
        },
        externals: {
            "react": "React",
            "react-dom": "ReactDOM"
        },
        plugins: [
            new WriteFilePlugin(),
            new MiniCssExtractPlugin({ filename: "FlowComponentModel.css"})
        ],
    }

    if (!fs.existsSync('./lib'))
        fs.mkdirSync('./lib');

    return config;
};