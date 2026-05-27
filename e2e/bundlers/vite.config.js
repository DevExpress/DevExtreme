import rollupConfig from './rollup.config.mjs';

delete rollupConfig.output.file;
rollupConfig.plugins = rollupConfig.plugins.filter(p => p.name !== 'commonjs');

module.exports = {
    build: {
        output: './dist/dist_vite/bundle_esm.js',
        rollupOptions: rollupConfig
    }
};
