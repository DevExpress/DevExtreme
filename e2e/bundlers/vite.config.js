import rollupConfig from './rollup.config.mjs';

delete rollupConfig.output.file;
// Vite 6 applies its own @rollup/plugin-commonjs internally; remove the user-provided
// instance to avoid the "default is not exported" conflict with CJS modules (e.g. jszip).
rollupConfig.plugins = rollupConfig.plugins.filter(p => p.name !== 'commonjs');

module.exports = {
    build: {
        outDir: './dist/dist_vite',
        rollupOptions: rollupConfig
    }
};
