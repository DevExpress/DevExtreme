'use strict';

const {
    INTERNAL_PACKAGE,
    TEST_INTERNAL_PACKAGE,
} = require('./internal-build');

function readFlag(variableName) {
    return String(process.env[variableName]).toLowerCase() === 'true';
}

module.exports = {
    TEST_CI: readFlag('DEVEXTREME_TEST_CI'),
    BUILD_ESM_PACKAGE: readFlag('BUILD_ESM_PACKAGE') && !readFlag('DEVEXTREME_TEST_CI'),
    BUILD_INPROGRESS_RENOVATION: readFlag('BUILD_INPROGRESS_RENOVATION'),
    BUILD_TESTCAFE: readFlag('BUILD_TESTCAFE'),
    BUILD_INTERNAL_PACKAGE: readFlag(INTERNAL_PACKAGE),
    BUILD_TEST_INTERNAL_PACKAGE: readFlag(TEST_INTERNAL_PACKAGE)
};
