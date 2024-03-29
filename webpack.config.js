const path = require("path");

module.exports = {
    entry: {
        index: ["babel-polyfill", "./src/index.js"]
    },
    output: {
        path: path.resolve(__dirname, "public/scripts"), //absolute path is required
        filename: "[name]-bundle.js"
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }]

    },
    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        publicPath: "/scripts/"
    },
    devtool: "source-map"
}