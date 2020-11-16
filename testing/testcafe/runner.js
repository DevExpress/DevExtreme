const createTestCafe = require('testcafe');
const fs = require('fs');
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
        const file = args.file.trim();


        componentFolder = componentFolder ? `${componentFolder}/**` : '**';
        // eslint-disable-next-line spellcheck/spell-checker
        fs.rmdirSync('./testing/testcafe/screenshots', { recursive: true });
        const runner = testCafe.createRunner()
            .browsers(args.browsers.split(' '))
            .src([`./testing/testcafe/tests/${componentFolder}/${file}.ts`]);

        if(testName) {
            runner.filter(name => name === testName);
        }

        return runner.run({
            quarantineMode: args.quarantineMode
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
            file: '*',
            quarantineMode: false
        }
    });
}
