'use strict';

const TEST_CI = Boolean(process.env['DEVEXTREME_TEST_CI']);
const USE_RENOVATION = Boolean(process.env['USE_RENOVATION']);

module.exports = {
    TEST_CI: TEST_CI,
    DOCKER_CI: Boolean(process.env['DEVEXTREME_DOCKER_CI']),
    USE_RENOVATION: USE_RENOVATION,
    RUN_RENOVATION_TASK: USE_RENOVATION,
};
