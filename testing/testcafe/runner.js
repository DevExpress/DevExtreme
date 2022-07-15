/* eslint-env node */

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
        const meta = args.meta.trim();
        const reporter = args.reporter.trim();
        let componentFolder = args.componentFolder.trim();
        const file = args.file.trim();

        componentFolder = componentFolder ? `${componentFolder}/**` : '**';
        if(fs.existsSync('./testing/testcafe/screenshots')) {
            fs.rmdirSync('./testing/testcafe/screenshots', { recursive: true });
        }

        const browsers = args.browsers.split(' ').map(expandBrowserAlias);
        // eslint-disable-next-line no-console
        console.log('Browsers:', browsers);

        const runner = testCafe.createRunner()
            .browsers(browsers)
            .reporter(reporter)

            .src([`./testing/testcafe/tests/${componentFolder}/${file}.ts`]);

        if(args.concurrency > 0) {
            runner.concurrency(args.concurrency);
        }
        if(testName) {
            runner.filter(name => name === testName);
        }
        if(meta) {
            runner.filter((testName, fixtureName, fixturePath, testMeta, fixtureMeta) => {
                return testMeta[meta] || fixtureMeta[meta];
            });
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


function expandBrowserAlias(browser) {
    switch(browser) {
        case 'chrome:devextreme-shr2':
            return 'chrome:headless --disable-gpu';
    }
    return browser;
}

function getArgs() {
    return parseArgs(process.argv.slice(1), {
        default: {
            concurrency: 0,
            browsers: 'chrome',
            test: '',
            meta: '',
            reporter: process.env.CI === 'true' ? 'list' : 'minimal',
            componentFolder: '',
            file: '*',
            cache: true,
            quarantineMode: false
        }
    });
}
