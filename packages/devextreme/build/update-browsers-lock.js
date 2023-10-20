'use strict';

const fs = require('fs');
const path = require('path');
const getTargets = require('@babel/helper-compilation-targets').default;

const targets = getTargets();

const result = Object.keys(targets).reduce((acc, key) => {
    acc[key] = targets[key].replace(/(\.0)*$/, '');
    return acc;
}, {});

const lockFilePath = path.resolve('.browserslist-lock.json');
console.log(`browserslist lock saved to ${lockFilePath}:`);
console.log(result);
fs.writeFileSync(lockFilePath, JSON.stringify(result, null, 2));
