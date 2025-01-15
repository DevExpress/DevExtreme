/* eslint-disable no-undef */
/* eslint-env node */

const createTestCafe = require('testcafe');
const fs = require('fs');
const process = require('process');
const parseArgs = require('minimist');
const testPageUtils = require('./helpers/clearPage');
require('nconf').argv();

const changeTheme = async(themeName) => createTestCafe.ClientFunction(() => new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    window.DevExpress.ui.themes.ready(resolve);
    // eslint-disable-next-line no-undef
    window.DevExpress.ui.themes.current(themeName);
}),
{ dependencies: { themeName } })();

const addShadowRootTree = async function() {
    await createTestCafe.ClientFunction(() => {
        const root = document.querySelector('#parentContainer');
        const childNodes = root.childNodes;

        if(!root.shadowRoot) {
            root.attachShadow({ mode: 'open' });
        }

        const shadowContainer = document.createElement('div');
        shadowContainer.append.apply(shadowContainer, Array.from(childNodes));

        root.shadowRoot.appendChild(shadowContainer);
    })();
};

let testCafe;
createTestCafe({
    hostname: 'localhost',
    port1: 1437,
    port2: 1438,
    // eslint-disable-next-line spellcheck/spell-checker
    experimentalProxyless: true,
})
    .then(tc => {
        testCafe = tc;

        const args = getArgs();
        const testName = args.test.trim();
        const reporter = typeof args.reporter === 'string' ? args.reporter.trim() : args.reporter;
        const indices = args.indices.trim();
        let componentFolder = args.componentFolder.trim();
        const file = args.file.trim();

        setTestingPlatform(args);
        setTestingTheme(args);
        setShadowDom(args);

        componentFolder = componentFolder ? `${componentFolder}/**` : '**';
        if(fs.existsSync('./screenshots')) {
            fs.rmSync('./screenshots', { recursive: true });
        }

        const browsers = args.browsers
            .split(' ')
            .map((browser) => expandBrowserAlias(browser, args.componentFolder.trim()));
        // eslint-disable-next-line no-console
        console.log('Browsers:', browsers);

        const runner = testCafe.createRunner()
            .browsers(browsers)
            .reporter(reporter)
            .src([`./tests/${componentFolder}/${file}.ts`]);

        runner.compilerOptions({
            'typescript': {
                customCompilerModulePath: '../../node_modules/typescript',
            }
        });

        runner.concurrency(args.concurrency || 3);

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
        if(args.skipUnstable) {
            filters.push((testName, fixtureName, fixturePath, testMeta) => {
                return !testMeta.unstable;
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
            quarantineMode: { successThreshold: 1, attemptLimit: 5 },
        };

        runOptions.hooks = {
            test: {
                before: async() => {
                    if(args.shadowDom) {
                        await addShadowRootTree();
                    }

                    if(args.theme) {
                        await changeTheme(args.theme);
                    }
                },
                after: async() => {
                    await testPageUtils.clearTestPage();
                }
            },
        };

        if(args.browsers === 'chrome:docker') {
            runOptions.disableScreenshots = true;
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

function setShadowDom(args) {
    process.env.shadowDom = args.shadowDom;
}

function expandBrowserAlias(browser, componentFolder) {
    switch(browser) {
        case 'chrome:devextreme-shr2':
            return 'chrome:headless --disable-gpu --window-size=1200,800';
        case 'chrome:docker':
            return 'chromium:headless --no-sandbox --disable-gpu --window-size=1200,800';
    }

    return browser;
}

function getArgs() {
    return parseArgs(process.argv.slice(1), {
        default: {
            concurrency: 0,
            browsers: 'chrome',
            test: '',
            reporter: [process.env.CI === 'true' ? 'list' : 'minimal'],
            componentFolder: '',
            file: '*',
            cache: true,
            quarantineMode: false,
            indices: '',
            platform: '',
            theme: '',
            shadowDom: false,
            skipUnstable: true,
        }
    });
}
