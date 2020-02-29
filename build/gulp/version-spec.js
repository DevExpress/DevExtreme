// Tests for the version.js module
// Note: label and revision can't be set at the same time

const versionFunc = require('./version');

const cases = [
    // revision
    { version: '1.1.0', label: '', flavor: '', revision: '10000', expected: '1.1.1-alpha-10000-0000' },
    { version: '1.1.0', label: '', flavor: 'build', revision: '10000', expected: '1.1.1-build-10000-0000' },
    { version: '1.1.1', label: '', flavor: '', revision: '10000', expected: '1.1.2-alpha-10000-0000' },
    { version: '1.1.2', label: '', flavor: '', revision: '10000', expected: '1.1.3-build-10000-0000' },
    { version: '1.1.2', label: '', flavor: 'pre', revision: '10000', expected: '1.1.3-pre-10000-0000' },

    // label
    { version: '1.1.0', label: '1_1_0', flavor: '', revision: '', expected: '1.1.0-beta' },
    { version: '1.1.0', label: '1_1_0', flavor: 'beta2', revision: '', expected: '1.1.0-beta2' },
    { version: '1.1.1', label: '1_1_1', flavor: '', revision: '', expected: '1.1.1-beta' },
    { version: '1.1.2', label: '1_1_2', flavor: '', revision: '', expected: '1.1.2-beta' },
    { version: '1.1.3', label: '1_1_3', flavor: '', revision: '', expected: '1.1.3' }
];

cases.forEach(testCase => {
    let actual = versionFunc(testCase.version, testCase.label, testCase.flavor, testCase.revision).package;
    actual = actual.replace(/-\d{4}$/, '-0000');

    if(actual !== testCase.expected) {
        throw new Error(`Version mismatch for ${JSON.stringify(testCase)}: get ${actual}`);
    }
});
