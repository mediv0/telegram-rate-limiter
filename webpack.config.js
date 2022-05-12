const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    mode: "production",
    externals: {
        redis: "redis",
        "@types/redis": "@types/redis",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },
};
