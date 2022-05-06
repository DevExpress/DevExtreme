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
        const reporter = args.reporter.trim();
        let componentFolder = args.componentFolder.trim();
        const file = args.file.trim();

        componentFolder = componentFolder ? `${componentFolder}/**` : '**';
        if(fs.existsSync('./testing/testcafe/screenshots')) {
            fs.rmdirSync('./testing/testcafe/screenshots', { recursive: true });
        }
        const runner = testCafe.createRunner()
            .browsers(args.browsers.split(' '))
            .reporter(reporter)

            .src([`./testing/testcafe/tests/${componentFolder}/${file}.ts`]);

        if(args.concurrency > 0) {
            runner.concurrency(args.concurrency);
        }
        if(testName) {
            runner.filter(name => name === testName);
        }
        if(args.cache) {
            runner.cache = args.cache;
        }
        return runner.run({
            quarantineMode: args.quarantineMode
        });
    })
    .then(failedCount => {
        testCafe.close();
        process.exit(failedCount);
    });

function getArgs() {
    return parseArgs(process.argv.slice(1), {
        default: {
            concurrency: 0,
            browsers: 'chrome',
            test: '',
            reporter: 'minimal',
            componentFolder: '',
            file: '*',
            cache: true,
            quarantineMode: false
        }
    });
}
