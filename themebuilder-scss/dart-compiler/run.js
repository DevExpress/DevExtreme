'use strict';

const { spawn } = require('child_process');
const { join } = require('path');

const runCommand = (command, args) => {
    console.log(`Run: ${command}\n`);

    const process = spawn(command, args, {
        cwd: __dirname,
        shell: true
    });

    return new Promise((resolve, reject) => {
        const log = (data) => console.log(data.toString());
        process.stderr.on('data', log);
        process.stdout.on('data', log);

        process.on('close', (code) => {
            if(code) reject();
            else resolve();
        });
    });
};

const isDartInstalled = async() => {
    try {
        await runCommand('dart2native', ['-h']);
        await runCommand('pub', ['get', '-h']);
        return true;
    } catch(e) {
        return false;
    }
};

const run = async() => {
    if(!await isDartInstalled()) return;
    try {
        await runCommand('pub', ['get']);
        await runCommand('dart2native', ['main.dart', '-o', 'compiler.exe']);
        runCommand(join(__dirname, 'compiler.exe'), []);
        console.log('Dart compile server has been run');
    } catch(e) {
        console.log('Dart compile server has not been run.', e);
    }
};

module.exports.run = run;
