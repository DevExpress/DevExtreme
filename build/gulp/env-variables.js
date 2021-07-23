'use strict';

const TEST_CI = Boolean(process.env['DEVEXTREME_TEST_CI']);
const BUILD_ESM_PACKAGE = Boolean(process.env['BUILD_ESM_PACKAGE']);
const SKIP_THEMEBUILDER = Boolean(process.env['SKIP_THEMEBUILDER']);

module.exports = {
    TEST_CI: TEST_CI,
    DOCKER_CI: Boolean(process.env['DEVEXTREME_DOCKER_CI']),
    BUILD_ESM_PACKAGE: BUILD_ESM_PACKAGE && !TEST_CI,
    SKIP_THEMEBUILDER: SKIP_THEMEBUILDER
};
