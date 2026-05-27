import rollupConfig from './rollup.config.mjs';

delete rollupConfig.output.file;

rollupConfig.plugins = rollupConfig.plugins.filter(p => p.name !== 'commonjs');

module.exports = {
    build: {
        outDir: './dist/dist_vite',
        rollupOptions: rollupConfig
    }
};
