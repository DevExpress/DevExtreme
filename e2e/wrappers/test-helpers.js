import { fixture, test } from 'testcafe';
const process = require('process');

export function navigateToComponent(t, baseUrl, examplePath) {
    return t.navigateTo(`${baseUrl}/examples/${examplePath}`);
}

export function testInFramework(examplePath, testFn) {
    const frameworkName = process.env.FRAMEWORK || 'react';
    const port = process.env.E2E_TEST_PORT || 3030;
    const baseUrl = `http://localhost:${port}`;

    fixture(`${frameworkName.toUpperCase()} Framework`)
        .page(baseUrl);

    test(`Testing ${examplePath}`, async t => {
        await navigateToComponent(t, baseUrl, examplePath);

        await testFn(t);
    });
}
