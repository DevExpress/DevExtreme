/**
 * Replaces `gulp update-config` task.
 * Creates demo config files with bundle mode enabled.
 */
const { join } = require('path');
const createConfig = require('../utils/internal/create-config');

const demosDir = join(__dirname, '..', 'Demos');

createConfig.useBundles = true;
createConfig.run(demosDir);

console.log('update-config: done');
