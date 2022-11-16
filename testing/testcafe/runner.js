import createTestCafe from 'testcafe';
import fs from 'fs';
import { argv, env, exit } from 'process';
import parseArgs from 'minimist';
import dashboardReporter from '@vasily.strelyaev/testcafe-reporter-dashboard-devextreme';
import changeTheme from './helpers/changeTheme';

// eslint-disable-next-line spellcheck/spell-checker
import nconf from 'nconf';
// eslint-disable-next-line spellcheck/spell-checker
nconf.argv();

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
        setTestingTheme(args);

        componentFolder = componentFolder ? `${componentFolder}/**` : '**';
        if(fs.existsSync('./testing/testcafe/screenshots')) {
            fs.rmdirSync('./testing/testcafe/screenshots', { recursive: true });
        }

        const browsers = args.browsers.split(' ').map(expandBrowserAlias);
        // eslint-disable-next-line no-undef, no-console
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
                const result = (testIndex % total) === (current - 1);
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

        runner.hooks = {
            fixture: {
                before: function() {
                    changeTheme('material.blue.light');
                },
            }
        };

        return runner.run({
            quarantineMode: args.quarantineMode
        });
    })
    .then(failedCount => {
        testCafe.close();
        exit(failedCount);
    });

function setTestingPlatform(args) {
    env.platform = args.platform;
}

function setTestingTheme(args) {
    env.theme = args.theme;
}


function expandBrowserAlias(browser) {
    switch(browser) {
        case 'chrome:devextreme-shr2':
            return 'chrome:headless --disable-gpu';
    }
    return browser;
}

function getArgs() {
    return parseArgs(argv.slice(1), {
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
            platform: '',
            theme: '',
        }
    });
}
