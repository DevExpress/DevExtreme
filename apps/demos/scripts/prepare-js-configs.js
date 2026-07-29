const { init } = require('../utils/shared/config-helper');
const { copyJsSharedResources } = require('../utils/copy-shared-resources/copy');

init();
copyJsSharedResources(() => {});

console.log('prepare-js-configs: done');
