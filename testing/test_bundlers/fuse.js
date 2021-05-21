/* eslint-disable spellcheck/spell-checker */

import { fusebox } from 'fuse-box';

const fuse = fusebox({
    entry: './src/import_modules_esm.js',
    target: 'browser',
    cache: false,
    bundles: {
        distRoot: '../../artifacts/test_bundlers/dist_fuse',
        app: 'modules_esm.js',
    },
});

fuse.runDev();
