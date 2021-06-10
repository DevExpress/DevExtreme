import rollupConfig from './rollup.config'; /* eslint-disable-line spellcheck/spell-checker */

delete rollupConfig.output.file; /* eslint-disable-line spellcheck/spell-checker */

module.exports = {
    build: {
        output: './dist/dist_vite/bundle_esm.js',
        rollupOptions: rollupConfig /* eslint-disable-line spellcheck/spell-checker */
    }
};
