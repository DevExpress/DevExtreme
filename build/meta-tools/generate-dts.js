#!/usr/bin/env node

const currentFolder = process.cwd();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const globalRoot = execSync('npm root -g').toString().trim();
const packageName = 'devextreme-metadata-generator';
const packagePath = path.join(globalRoot, packageName);
const jsPath = currentFolder + "/js";
const outputPath = currentFolder + "/ts/dx.all.d.ts";

function isPackageAvailable() {
    var metaToolsPackageJson = path.join(packagePath, 'package.json');
    return fs.existsSync(metaToolsPackageJson);
}

function runMetaTools() {
    if(!isPackageAvailable()) return;
    var packageMainScriptPath = path.join(packagePath, 'index.js');
    require(packageMainScriptPath).generateTs(jsPath, outputPath);
}

runMetaTools();
