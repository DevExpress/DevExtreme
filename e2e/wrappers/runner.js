const path = require('path');
const process = require('process');
const minimist = require('minimist');
const express = require('express');
const createTestCafe = require('testcafe');

const argv = minimist(process.argv.slice(2));
const framework = argv.framework || 'react';

const http = require('http');

function waitForServerReady(port, timeout = 5000) {
    const deadline = Date.now() + timeout;

    return new Promise((resolve, reject) => {
        const check = () => {
            http.get(`http://localhost:${port}`, res => {
                res.destroy();
                resolve();
            }).on('error', () => {
                if (Date.now() > deadline) {
                    reject(new Error(`Timeout waiting for http://localhost:${port}`));
                } else {
                    setTimeout(check, 100);
                }
            });
        };

        check();
    });
}

const frameworkConfig = {
    react: {
        staticPath: path.resolve(__dirname, 'builders/react19/dist/index.html'),
        port: 3030,
    },
    angular: {
        staticPath: path.resolve(__dirname, 'builders/angular/dist/angular/browser/index.html'),
        port: 3031,
    },
    vue: {
        staticPath: path.resolve(__dirname, 'builders/vue3/dist/index.html'),
        port: 3032,
    },
};

if (!frameworkConfig[framework]) {
    console.error(`❌ Unsupported framework: ${framework}`);
    process.exit(1);
}

const { staticPath, port } = frameworkConfig[framework];
process.env.FRAMEWORK = framework;
process.env.E2E_TEST_PORT = port;

const startStaticServer = () =>
    new Promise((resolve, reject) => {
        const app = express();
        app.use(express.static(path.dirname(staticPath)));
        app.get('*', (_, res) => res.sendFile(staticPath));

        const server = app.listen(port, () => {
            console.log(`✅ Server for ${framework} running at http://localhost:${port}`);
            resolve(server);
        });

        server.on('error', reject);
    });

(async () => {
    let testcafe;
    let server;

    try {
        server = await startStaticServer();

        await waitForServerReady(port, 5000);

        testcafe = await createTestCafe();

        const runner = testcafe.createRunner();

        const failedCount = await runner
            .src('./tests/**/*.js')
            .browsers(process.env.BROWSER || 'chrome:headless --no-sandbox --disable-gpu --window-size=1200,800')
            .concurrency(1)
            .run({
                skipJsErrors: true,
                selectorTimeout: 3000,
                assertionTimeout: 1000,
                pageLoadTimeout: 5000,
            });

        console.log(`✅ E2E complete. Failed tests: ${failedCount}`);
        process.exit(failedCount);

    } catch (err) {
        console.error('❌ E2E test run failed:', err);
        process.exit(1);

    } finally {
        if (testcafe) await testcafe.close();
        if (server && server.close) await new Promise((res) => server.close(res));
    }
})();
