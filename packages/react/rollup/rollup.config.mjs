import {getRollupConfig} from './rollup.utils.mjs';

const OUTPUT_DIR = './lib';
const COMPONENTS = [
    'slideToggle',
    'pager',
];

export default getRollupConfig(COMPONENTS, OUTPUT_DIR);
