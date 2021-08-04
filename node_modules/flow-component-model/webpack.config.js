const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = function() {
    const config = {
        entry: "./src/index.tsx",
        output: {
            filename: "FlowComponentModel.js",
            path: path.resolve(__dirname, 'build')
        },
        devtool: 'inline-source-map',
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        devServer: {
            contentBase: './build'
        },
        mode: 'development',
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

    if (!fs.existsSync('./build'))
        fs.mkdirSync('./build');

    return config;
};