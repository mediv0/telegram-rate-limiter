const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: "./src/index.ts",
    mode: "production",
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    },
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.ts?$/, loader: "ts-loader" },
        ],
    },
};
