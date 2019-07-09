const createTestCafe = require('testcafe');
const process = require('process');
const parseArgs = require('minimist');
require('nconf').argv();

var testCafe;
createTestCafe('localhost', 1437, 1438)
    .then(tc => {
        testCafe = tc;

        var args = getArgs(),
            testName = args.test.trim(),
            runner = testCafe.createRunner()
                .browsers(args.browsers.split(" "))
                .src(["./testing/functional/tests/**/*.ts"]);

        if(testName) {
            runner.filter(name => name === testName);
        }

        return runner.run({
            quarantineMode: false
        });
    })
    .then(failedCount => {
        testCafe.close();
        if(failedCount !== 0) {
            process.exit(failedCount);
        }
    });

function getArgs() {
    return parseArgs(process.argv.slice(1), {
        default: {
            browsers: "chrome",
            test: ""
        }
    });
}
