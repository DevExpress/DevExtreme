/* eslint-disable no-undef */
/* eslint-env node */

const createTestCafe = require('testcafe');
const fs = require('fs');
const process = require('process');
const parseArgs = require('minimist');
const dashboardReporter = require('testcafe-reporter-dashboard-devextreme');
const testPageUtils = require('./helpers/clearPage');
require('nconf').argv();

const changeTheme = async(themeName) => createTestCafe.ClientFunction(() => new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    window.DevExpress.ui.themes.ready(resolve);
    // eslint-disable-next-line no-undef
    window.DevExpress.ui.themes.current(themeName);
}),
{ dependencies: { themeName } })();

const matrix = [
    { componentFolder: 'treeList', name: 'treeList', concurrency: 1 },
    { componentFolder: 'dataGrid', name: 'dataGrid (1/2)', indices: '1/2' },
    { componentFolder: 'dataGrid', name: 'dataGrid (2/2)', indices: '2/2' },
    { componentFolder: 'pivotGrid', name: 'pivotGrid', concurrency: 1 },
    { componentFolder: 'pivotGrid', name: 'pivotGrid - material', theme: 'material.blue.light', concurrency: 1 },
    { componentFolder: 'scheduler', name: 'scheduler (1/5)', indices: '1/5' },
    { componentFolder: 'scheduler', name: 'scheduler (2/5)', indices: '2/5' },
    { componentFolder: 'scheduler', name: 'scheduler (3/5)', indices: '3/5' },
    { componentFolder: 'scheduler', name: 'scheduler (4/5)', indices: '4/5' },
    { componentFolder: 'scheduler', name: 'scheduler (5/5)', indices: '5/5' },
    { componentFolder: 'form', name: 'form' },
    { componentFolder: 'editors', name: 'editors' },
    { componentFolder: 'navigation', name: 'navigation' },
    { componentFolder: 'htmlEditor', name: 'htmlEditor', concurrency: 1 },
    { componentFolder: 'form', name: 'form - material', theme: 'material.blue.light' },
    { componentFolder: 'editors', name: 'editors - material', theme: 'material.blue.light' },
    { componentFolder: 'navigation', name: 'navigation - material', theme: 'material.blue.light' },
    { componentFolder: 'htmlEditor', name: 'htmlEditor - material', theme: 'material.blue.light', concurrency: 1 },
    { componentFolder: 'renovation', name: 'renovation (jquery)', platform: 'jquery' },
    { componentFolder: 'renovation', name: 'renovation (react)', platform: 'react' },
];

(async() => {
    const testCafe = await createTestCafe({
        hostname: 'localhost',
        port1: 1437,
        port2: 1438,
        // eslint-disable-next-line spellcheck/spell-checker
        experimentalProxyless: false,
    });
    let totalFailedCount = 0;

    // eslint-disable-next-line no-restricted-syntax
    for(const { componentFolder, name, concurrency, indices, theme, platform } of matrix) {
        console.log(`Started test: ${name}`);
        const args = getArgs();
        const testName = args.test.trim();
        const reporter = typeof args.reporter === 'string' ? args.reporter.trim() : args.reporter;
        // const indices = args.indices.trim();
        // let componentFolder = args.componentFolder.trim();
        const file = args.file.trim();

        setTestingPlatform({ platform });
        setTestingTheme({ theme });

        const componentPath = componentFolder ? `${componentFolder}/**` : '**';
        if(fs.existsSync('./testing/testcafe/screenshots')) {
            fs.rmSync('./testing/testcafe/screenshots', { recursive: true });
        }

        const browsers = args.browsers.split(' ').map(expandBrowserAlias);
        // eslint-disable-next-line no-console
        console.log('Browsers:', browsers);

        const runner = testCafe.createRunner()
            .browsers(browsers)
            .reporter(reporter)
            .src([`./testing/testcafe/tests/${componentPath}/${file}.ts`]);

        runner.compilerOptions({
            'typescript': {
                customCompilerModulePath: '../../node_modules/typescript',
            }
        });

        runner.concurrency(concurrency || 3);

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

        const runOptions = {
            quarantineMode: { successThreshold: 1, attemptLimit: 3 },
            disableScreenshots: true
        };

        if(componentFolder.trim() !== 'renovation') {
            runOptions.hooks = {
                test: {
                    after: async() => {
                        await testPageUtils.clearTestPage();
                    }
                },
            };

            if(theme) {
                runOptions.hooks.test.before = async() => {
                    await changeTheme(theme);
                };
            }
        }
        const failedCount = await runner.run(runOptions);

        totalFailedCount += failedCount;
    }

    await testCafe.close();
    process.exit(totalFailedCount);
})();

function setTestingPlatform(args) {
    process.env.platform = args.platform;
}

function setTestingTheme(args) {
    process.env.theme = args.theme || 'generic.light';
}

function expandBrowserAlias(browser) {
    switch(browser) {
        case 'chrome:devextreme-shr2':
            return 'chrome:headless --disable-gpu --window-size=1200,800';
    }

    return 'chromium:headless --no-sandbox --disable-gpu --window-size=1200,800';
}

function getArgs() {
    return parseArgs(process.argv.slice(1), {
        default: {
            concurrency: 0,
            browsers: 'chrome',
            test: '',
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
