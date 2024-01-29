const process = require('process');
const createTestCafe = require('testcafe');

let testCafe;
createTestCafe('localhost')
    .then(tsc => {
        testCafe = tsc;

        const runner = tsc.createRunner();
        return runner
            .src('test.js')
            .browsers('chrome:headless --disable-gpu --window-size=1200,800')
            .run();
    }).then(failedCount => {
        testCafe.close();
        process.exit(failedCount);
    });
