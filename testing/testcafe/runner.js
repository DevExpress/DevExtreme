/* eslint-env node */

const createTestCafe = require('testcafe');
const fs = require('fs');
const process = require('process');
const parseArgs = require('minimist');
const dashboardReporter = require('testcafe-reporter-dashboard-devextreme');
require('nconf').argv();

const TESTS_IN_JOB = 115;

let testCafe;
createTestCafe('localhost', 1437, 1438)
    .then(tc => {
        testCafe = tc;

        const args = getArgs();
        const testName = args.test.trim();
        const meta = args.meta.trim();
        const reporter = typeof args.reporter === 'string' ? args.reporter.trim() : args.reporter;
        const indices = args.indices.trim();
        let componentFolder = args.componentFolder.trim();
        const file = args.file.trim();

        setTestingPlatform(args);

        componentFolder = componentFolder ? `${componentFolder}/**` : '**';
        if(fs.existsSync('./testing/testcafe/screenshots')) {
            fs.rmdirSync('./testing/testcafe/screenshots', { recursive: true });
        }

        const browsers = args.browsers.split(' ')
            .map((browser) => `${expandBrowserAlias(browser)}${componentFolder === 'scheduler' ? ' --window-size=1200,800' : ''}`);
        // eslint-disable-next-line no-console
        console.log('Browsers:', browsers);

        const runner = testCafe.createRunner()
            .browsers(browsers)
            .reporter(reporter)

            .src([`./testing/testcafe/tests/${componentFolder}/${file}.ts`]);

        runner.compilerOptions({
            'typescript': {
                customCompilerModulePath: '../../node_modules/typescript',
            }
        });

        if(args.concurrency > 0) {
            runner.concurrency(args.concurrency);
        }
        const filters = [];
        if(indices) {
            const [current, total] = indices.split(/_|of|\\|\//ig).map(x => +x);
            let testIndex = 0;
            filters.push(() => {
                const jobIndex = Math.trunc(testIndex / TESTS_IN_JOB);

                const result = jobIndex === (current - 1) || (current === total && jobIndex > total - 1);
                testIndex += 1;
                return result;
            });
        }
        if(testName) {
            filters.push(name => name === testName);
        }
        if(meta) {
            filters.push((testName, fixtureName, fixturePath, testMeta, fixtureMeta) => {
                return testMeta[meta] || fixtureMeta[meta];
            });
        }
        if(filters.length) {
            runner.filter((...args) => {
                for(let i = 0; i < filters.length; i++) {
                    if(!filters[i](...args)) {
                        return false;
                    }
                }
                return true;
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

function setTestingPlatform(args) {
    process.env.platform = args.platform;
}

function expandBrowserAlias(browser, componentFolder) {
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
            reporter: ['minimal', dashboardReporter],
            componentFolder: '',
            file: '*',
            cache: true,
            quarantineMode: false,
            indices: '',
            platform: ''
        }
    });
}
