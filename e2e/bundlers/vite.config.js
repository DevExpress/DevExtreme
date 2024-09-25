import rollupConfig from './rollup.config.mjs';

delete rollupConfig.output.file;

module.exports = {
    build: {
        output: './dist/dist_vite/bundle_esm.js',
        rollupOptions: rollupConfig
    }
};
