#!/usr/bin/env node

const { spawn } = require('child_process');
const command = 'generate-dts';

var generator = spawn(command, { shell: true });
generator.stdout.on('data', (data) => {
    console.log(data.toString());
});
generator.stderr.on('data', (data) => {
    if(data.indexOf('is not recognized as an internal or external command') >= 0) {
        return;
    }
    throw "Commit canceled";
});
