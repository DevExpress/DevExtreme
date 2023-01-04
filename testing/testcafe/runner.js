/* eslint-disable no-undef */
/* eslint-env node */

const createTestCafe = require('testcafe');
const fs = require('fs');
const process = require('process');
const parseArgs = require('minimist');
const dashboardReporter = require('testcafe-reporter-dashboard-devextreme');
require('nconf').argv();

const changeTheme = async(themeName) => createTestCafe.ClientFunction(() => new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    window.DevExpress.ui.themes.ready(resolve);
    // eslint-disable-next-line no-undef
    window.DevExpress.ui.themes.current(themeName);
}),
{ dependencies: { themeName } })();

let testCafe;
createTestCafe({
    hostname: 'localhost',
    port1: 1437,
    port2: 1438,
    // eslint-disable-next-line spellcheck/spell-checker
    // experimentalProxyless: true,
})
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
            fs.rmSync('./testing/testcafe/screenshots', { recursive: true });
        }

        const browsers = args.browsers.split(' ')
            .map((browser) => `${expandBrowserAlias(browser)}${args.componentFolder.trim() === 'scheduler'
            || args.componentFolder.trim() === 'navigation'
            || args.componentFolder.trim() === 'editors'
            || args.componentFolder.trim() === 'form'
            || args.componentFolder.trim() === 'htmlEditor' ? ' --window-size=1200,800' : ''}`);
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

        const runOptions = {
            quarantineMode: args.quarantineMode,
        };

        if(args.componentFolder.trim() === 'scheduler'
            || args.componentFolder.trim() === 'navigation'
            || args.componentFolder.trim() === 'editors'
            || args.componentFolder.trim() === 'form'
            || args.componentFolder.trim() === 'htmlEditor') {
            runOptions.hooks = {
                test: {
                    after: async() => {
                        await clearTestPage();
                    }
                },
            };

            if(args.theme) {
                runOptions.hooks.test.before = async() => {
                    await changeTheme(args.theme);
                };
            }
        }

        return runner.run(runOptions);
    })
    .then(failedCount => {
        testCafe.close();
        process.exit(failedCount);
    });

function setTestingPlatform(args) {
    process.env.platform = args.platform;
}

function setTestingTheme(args) {
    process.env.theme = args.theme || 'generic.light';
}

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

function clearTestPage() {
    return createTestCafe.ClientFunction(() => {
        const body = document.querySelector('body');

        $('#container').remove();
        $('#otherContainer').remove();

        const containerElement = document.createElement('div');
        containerElement.setAttribute('id', 'container');

        const otherContainerElement = document.createElement('div');
        otherContainerElement.setAttribute('id', 'otherContainer');

        body.prepend(otherContainerElement);
        body.prepend(containerElement);

        $('#stylesheetRules').remove();
    })();
}

