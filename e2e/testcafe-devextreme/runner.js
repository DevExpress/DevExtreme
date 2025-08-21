
/* eslint-env node */

const createTestCafe = require('testcafe');
const fs = require('fs');
const process = require('process');
const parseArgs = require('minimist');
const { globSync } = require('glob');
const { DEFAULT_BROWSER_SIZE } = require('./helpers/const');
const testPageUtils = require('./helpers/clearPage');
require('nconf').argv();

const LAUNCH_RETRY_ATTEMPTS = 5;
const LAUNCH_RETRY_TIMEOUT = 20000;
const TESTCAFE_CONFIG = {
    hostname: 'localhost',
    port1: 1437,
    port2: 1438,
    // eslint-disable-next-line spellcheck/spell-checker
    experimentalProxyless: true,
};

const changeTheme = async(t, themeName) => createTestCafe.ClientFunction(() => new Promise((resolve) => {

    window.DevExpress.ui.themes.ready(resolve);

    window.DevExpress.ui.themes.current(themeName);
}),
{ dependencies: { themeName } }).with({ boundTestRun: t })();

const addShadowRootTree = async(t) => {
    await createTestCafe.ClientFunction(() => {
        const root = document.querySelector('#parentContainer');
        const childNodes = root.childNodes;

        if(!root.shadowRoot) {
            root.attachShadow({ mode: 'open' });
        }

        const shadowContainer = document.createElement('div');
        shadowContainer.append.apply(shadowContainer, Array.from(childNodes));

        root.shadowRoot.appendChild(shadowContainer);
    }).with({ boundTestRun: t })();
};

const wait = async(timeout) => new Promise(resolve => setTimeout(resolve, timeout));

const retry = async(action, attempt) => {
    return await action()
        .catch(async(error) => {
            if(attempt <= 1) {
                throw error;
            }

            /* eslint-disable no-console */
            console.log('\n > error occurred during testcafe launch!\n');
            console.error(error);
            console.info(`\n > waiting ${LAUNCH_RETRY_TIMEOUT / 1000} seconds...\n`);
            await wait(LAUNCH_RETRY_TIMEOUT);
            console.info('\n > retry launching testcafe\n');
            /* eslint-enable no-console */
            return await retry(action, attempt - 1);
        });
};

let testCafe;
createTestCafe(TESTCAFE_CONFIG)
    .then(async(tc) => {
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
        console.info('Browsers:', browsers);

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

        const split = (array, chunkCount) => {
            const fixturesInChunkCount = Math.ceil(array.length / chunkCount);
            const [...arr] = array;
            const res = [];

            while(arr.length) {
                res.push(arr.splice(0, fixturesInChunkCount));
            }

            return res;
        };

        const filters = [];

        if(indices) {
            const [current, total] = indices.split(/_|of|\\|\//ig).map(x => +x);
            const fixtures = globSync([`./tests/${componentFolder}/*.ts`]);
            const fixtureChunks = split(fixtures, total);
            const targetFixtureChunk = fixtureChunks[current - 1] ?? [];

            /* eslint-disable no-console */
            console.info(' === test run config ===');
            console.info(` > indices: current = ${current} | total = ${total}`);
            console.info(' > glob: ', [`./tests/${componentFolder}/*.ts`]);
            console.info(' > all fixtures: ', fixtureChunks);
            console.info(' > fixtures: ', targetFixtureChunk, '\n');
            /* eslint-enable no-console */

            filters.push((testName, fixtureName, fixturePath) => {
                // TODO: improve performance
                return targetFixtureChunk.some((path) => fixturePath.includes(path));
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
            quarantineMode: { successThreshold: 1, attemptLimit: 10 },
        };

        runOptions.hooks = {
            test: {
                before: async(t) => {
                    const [width, height] = DEFAULT_BROWSER_SIZE;
                    await t.resizeWindow(width, height);

                    if(args.shadowDom) {
                        await addShadowRootTree(t);
                    }

                    if(args.theme) {
                        await changeTheme(t, args.theme);
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

        return await retry(() => runner.run(runOptions), LAUNCH_RETRY_ATTEMPTS);
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
            return 'chrome:headless --no-sandbox --disable-gpu --window-size=1200,800 --disable-partial-raster --disable-skia-runtime-opts --run-all-compositor-stages-before-draw --disable-new-content-rendering-timeout --disable-threaded-animation --disable-threaded-scrolling --disable-checker-imaging --disable-image-animation-resync --use-gl="swiftshader" --disable-features=PaintHolding --font-render-hinting=none --disable-font-subpixel-positioning';
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
