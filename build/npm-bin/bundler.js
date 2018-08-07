#!/usr/bin/env node

var path = require("path"),
    webpack = require("webpack"),
    webpackVersion = require("webpack/package.json").version;

var outputDir = process.cwd(),
    sourcesDir = path.join(__dirname, ".."),
    bundle = process.argv.length > 2 ? process.argv[2] : "dx.custom";

bundle = bundle.replace(/.config.js$/, "");

var baseConfig = require("./webpack.config.js");
var createConfig = function(outputFile, mode) {
    var config = Object.create(baseConfig);

    if(webpackVersion.split(".")[0] >= 4) {
        config.mode = mode;
    } else if(mode === "production") {
        config.plugins = (config.plugins || []).concat([
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false }
            })
        ]);
    }
    config.context = process.cwd();
    config.entry = "./" + bundle + ".config.js";
    config.output = {
        path: outputDir,
        filename: outputFile
    };

    config.resolve = {
        alias: {
            'devextreme': sourcesDir
        }
    };

    return config;
};

console.log("bundling using '" + bundle + ".config.js'...");
webpack([
    createConfig(bundle + ".debug.js", "development"),
    createConfig(bundle + ".js", "production")
], function(err, stats) {
    if(err) {
        throw err;
    }

    var jsonStats = stats.toJson();
    if(jsonStats.errors.length) {
        console.log("'" + bundle + "' bundles creation failed!\n\n" + jsonStats.errors.join("\n\n"));
    } else {
        console.log("'" + bundle + "' bundles created!");
    }
});
