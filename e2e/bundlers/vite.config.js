import rollupConfig from './rollup.config.mjs';
const jszipEntry = require.resolve('jszip/lib/index.js');

delete rollupConfig.output.file;

module.exports = {
    resolve: {
        alias: {
            jszip: jszipEntry,
        },
    },
    build: {
        outDir: './dist/dist_vite',
        rollupOptions: rollupConfig
    }
};
