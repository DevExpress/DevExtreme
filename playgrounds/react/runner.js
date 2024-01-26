const process = require('process');
const createTestCafe = require('testcafe');

let testCafe;
createTestCafe('localhost')
    .then(tsc => {
        testCafe = tsc;

        const runner = tsc.createRunner();
        return runner
            .src('test.js')
            .browsers('chrome')
            .run();
    }).then(failedCount => {
        testCafe.close();
        process.exit(failedCount);
    });
