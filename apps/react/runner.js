const process = require('process');
const createTestCafe = require('testcafe');
const path = require('path');

let testCafe;

createTestCafe('127.0.0.1')
    .then(tsc => {
        testCafe = tsc;
        const runner = tsc.createRunner();

        return runner
            .src(path.join(__dirname, './__test__/*.ts'))
            .browsers('chrome --disable-gpu --window-size=1200,800')
            .run();
    })
    .then(failedCount => {
        testCafe.close();
        process.exit(failedCount);
    })
    .catch(err => {
        console.error('Playground TestCafe encountered an error:', err);
        if (testCafe) testCafe.close();
        process.exit(1);
    });
