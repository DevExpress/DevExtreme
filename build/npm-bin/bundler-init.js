#!/usr/bin/env node

var fs = require("fs");
var path = require("path");

var bundle = process.argv.length > 2 ? process.argv[2] : 'dx.custom';
var configPath = path.join(process.cwd(), bundle + ".config.js");

fs.createReadStream(path.join(__dirname, '../bundles', 'dx.custom.config.js')).pipe(fs.createWriteStream(configPath));

console.log(configPath + " successfully created");
