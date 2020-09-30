/* eslint no-process-exit: 0 */
'use strict';

const { spawn } = require('child_process');

const runCommand = (command, args, detached = false) => {
    console.log(`Run: ${command}\n`);

    const process = spawn(command, args, {
        cwd: __dirname,
        shell: true,
        detached
    });

    return new Promise((resolve, reject) => {
        let errorData = '';
        process.stderr.on('data', (data) => {
            errorData += data;
            // reject(data.toString());
        });

        process.on('close', (code) => {
            if(code) reject(errorData);
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
        runCommand('./compiler.exe', [], true);
        console.log('Dart compile server has been run');
        process.exit(0);
    } catch(e) {
        console.log('Dart compile server has not been run.', e);
        process.exit(1);
    }
};

run();
