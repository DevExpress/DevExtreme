const createTestCafe = require('testcafe');
const process = require('process');
require('nconf').argv();

var testCafe;
createTestCafe('localhost', 1437, 1438)
    .then(tc => {
        testCafe = tc;
        var testName = process.argv[2],
            runner = testCafe.createRunner()
                .browsers(["chrome"])
                .src([
                    "./testing/functional/tests/dataGrid/keyboardNavigation.ts"
                ]);

        if(testName && testName.trim()) {
            runner.filter(name => name === testName);
        }

        return runner.run({
            quarantineMode: false
        });
    })
    .then(failedCount => {
        testCafe.close();
    });
