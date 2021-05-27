/* eslint-disable spellcheck/spell-checker */

import rollupConfig from './rollup.config';

const output = rollupConfig.output.file;
delete rollupConfig.output.file;

module.exports = {
    // root: './src',
    build: {
        // output: './dist/dist_rollup/bundle_esm.js',
        output: output,
        rollupOptions: rollupConfig
    }
};
