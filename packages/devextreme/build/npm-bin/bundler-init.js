#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const bundle = process.argv.length > 2 ? process.argv[2] : 'dx.custom';
const configPath = path.join(process.cwd(), bundle + '.config.js');

fs.createReadStream(path.join(__dirname, '../bundles', 'dx.custom.config.js')).pipe(fs.createWriteStream(configPath));

console.log(configPath + ' successfully created');
