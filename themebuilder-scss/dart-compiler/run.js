'use strict';

const { spawn } = require('child_process');
const { join } = require('path');

const log = (message) => {
    // eslint-disable-next-line no-console
    if(process.env.THEMEBUILDER_DEBUG) console.log(message.toString());
};

const runCommand = (command, args) => {
    log(`Run: ${command}\n`);

    const process = spawn(command, args, {
        cwd: __dirname,
        shell: true
    });

    return new Promise((resolve, reject) => {
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

const runServer = () => runCommand(join(__dirname, 'compiler.exe'), []);

const compilerServer = async() => {
    try {
        await runCommand('pub', ['get']);
        await runCommand('dart2native', ['main.dart', '-o', 'compiler.exe']);
        return true;
    } catch(e) {
        return false;
    }
};

const run = async(restart = false) => {
    try {
        if(restart) {
            log('Try to restart dart server');
            runServer();
            return;
        }

        if(!await isDartInstalled()) {
            log('Dart is not installed');
            return;
        }

        if(await compilerServer()) {
            runServer();
            log('Dart compile server has been run');
        } else {
            log('Dart compile server has not been run.');
        }
    } catch(e) {
        log('Unexpected error:', e);
    }
};

module.exports.run = run;
