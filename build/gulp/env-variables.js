'use strict';

const TEST_CI = Boolean(process.env['DEVEXTREME_TEST_CI']);
const USE_RENOVATION = Boolean(process.env['USE_RENOVATION']);
const BUILD_ESM_PACKAGE = Boolean(process.env['BUILD_ESM_PACKAGE']);

module.exports = {
    TEST_CI: TEST_CI,
    DOCKER_CI: Boolean(process.env['DEVEXTREME_DOCKER_CI']),
    USE_RENOVATION,
    BUILD_ESM_PACKAGE
};
