const createTestCafe = require('testcafe');
const process = require('process');
const parseArgs = require('minimist');
require('nconf').argv();

let testCafe;
createTestCafe('localhost', 1437, 1438)
    .then(tc => {
        testCafe = tc;

        const args = getArgs();
        const testName = args.test.trim();
        let componentFolder = args.componentFolder.trim();

        componentFolder = componentFolder ? `${componentFolder}/**` : '**';
        const browsers = args.browsers.split(' ');
        const quarantineMode = args.quarantineMode;

        const runner = testCafe.createRunner()
            .browsers(browsers)
            .src([`./testing/functional/tests/${componentFolder}/*.ts`]);

        if(testName) {
            runner.filter(name => name === testName);
        }

        return runner.run({
            quarantineMode: quarantineMode
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
            browsers: 'chrome',
            test: '',
            componentFolder: '',
            quarantineMode: false
        }
    });
}
