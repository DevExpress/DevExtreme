import rollupConfig from './rollup.config.mjs';

delete rollupConfig.output.file;

module.exports = {
    build: {
        outDir: './dist/dist_vite',
        rollupOptions: rollupConfig
    }
};
