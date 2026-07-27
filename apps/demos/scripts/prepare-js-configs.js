const { join } = require('path');
const { init } = require('../utils/shared/config-helper');
const createConfig = require('../utils/internal/create-config');
const { copyJsSharedResources } = require('../utils/copy-shared-resources/copy');

const demosDir = join(__dirname, '..', 'Demos');

init();
copyJsSharedResources(() => {});
createConfig.useBundles = false;
createConfig.run(demosDir);

console.log('prepare-js-configs: done');
