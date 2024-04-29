const process = require('process');
const createTestCafe = require('testcafe');

let testCafe;
createTestCafe('127.0.0.1')
    .then(tsc => {
        testCafe = tsc;

        const runner = tsc.createRunner();
        return runner
            .src('test.js')
            .browsers('chrome --headless=new --disable-gpu --window-size=1200,800')
            .run();
    }).then(failedCount => {
        testCafe.close();
        process.exit(failedCount);
    });
