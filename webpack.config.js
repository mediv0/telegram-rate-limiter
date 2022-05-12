const path = require("path");

module.exports = {
    entry: {
        main: "./src/index.ts",
    },
    mode: "production",
    externals: {
        redis: "redis",
        "@types/redis": "@types/redis",
    },
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
            { test: /\.tsx?$/, loader: "ts-loader" },
        ],
    },
};
