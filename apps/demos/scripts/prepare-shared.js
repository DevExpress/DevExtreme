const { copyJsSharedResources, copyMvcSharedResources } = require('../utils/copy-shared-resources/copy');

copyJsSharedResources(() => {
  copyMvcSharedResources(() => {
    console.log('prepare-shared: done');
  });
});
