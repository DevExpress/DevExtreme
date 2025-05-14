import { fixture, test } from 'testcafe';
const process = require('process');

export function navigateToComponent(t, baseUrl, examplePath) {
    return t.navigateTo(`${baseUrl}/examples/${examplePath}`);
}

export function testInFramework(fixtureName, examplePath, ...testData) {
    const frameworkName = process.env.FRAMEWORK || 'react';
    const port = process.env.E2E_TEST_PORT || 3030;
    const baseUrl = `http://localhost:${port}`;

    fixture(fixtureName).page(baseUrl);

    for(let [testName, testFn] of testData) {
        test(testName, async t => {
            await navigateToComponent(t, baseUrl, examplePath);
    
            await testFn(t);
        });
    }
}
