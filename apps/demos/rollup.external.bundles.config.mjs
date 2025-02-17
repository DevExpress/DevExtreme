import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

const NG_BASE_DIR = './node_modules/';
const OUTPUT_DIR = './bundles/externals/';
const format = 'es';
const plugins = [
  resolve(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    presets: [
      ['@babel/preset-env', { targets: {
          chrome: '58',
          ie: '11'
        } }]
    ],
  })
];

export default [
  {
    input: NG_BASE_DIR + `openai/index.js`,
    output: {
      file: OUTPUT_DIR + `openai.bundle.js`,
      format: 'umd',
      name: 'openai',
      globals: { },
    },
    external: [],
    plugins,
  },
  {
    input: NG_BASE_DIR + `unified/index.js`,
    output: {
      file: OUTPUT_DIR + `unified/unified.bundle.js`,
      format,
      name: 'unified',
      globals: { },
    },
    external: [],
    plugins,
  },
  {
    input: NG_BASE_DIR + `remark-parse/index.js`,
    output: {
      file: OUTPUT_DIR + `unified/remark-parse.bundle.js`,
      format,
      name: 'remarkParse',
      globals: { },
    },
    external: [],
    plugins,
  },
  {
    input: NG_BASE_DIR + `remark-rehype/index.js`,
    output: {
      file: OUTPUT_DIR + `unified/remark-rehype.bundle.js`,
      format,
      name: 'remarkRehype',
      globals: { },
    },
    external: [],
    plugins,
  },
  {
    input: NG_BASE_DIR + `remark-stringify/index.js`,
    output: {
      file: OUTPUT_DIR + `unified/remark-stringify.bundle.js`,
      format,
      name: 'remarkStringify',
      globals: { },
    },
    external: [],
    plugins,
  },
  {
    input: NG_BASE_DIR + `rehype-stringify/index.js`,
    output: {
      file: OUTPUT_DIR + `unified/rehype-stringify.bundle.js`,
      format,
      name: 'rehypeStringify',
      globals: { },
    },
    external: [],
    plugins,
  },
  {
    input: NG_BASE_DIR + `rehype-parse/index.js`,
    output: {
      file: OUTPUT_DIR + `unified/rehype-parse.bundle.js`,
      format,
      name: 'rehypeParse',
      globals: { },
    },
    external: [],
    plugins,
  },
  {
    input: NG_BASE_DIR + `rehype-remark/index.js`,
    output: {
      file: OUTPUT_DIR + `unified/rehype-remark.bundle.js`,
      format,
      name: 'rehypeRemark',
      globals: { },
    },
    external: [],
    plugins,
  },
  {
      input: NG_BASE_DIR + `rehype-minify-whitespace/index.js`,
      output: {
          file: OUTPUT_DIR + `unified/rehype-minify-whitespace.bundle.js`,
          format,
          name: 'rehypeRemark',
          globals: { },
      },
      external: [],
      plugins,
  },
  {
    input: NG_BASE_DIR + `canvg/dist/index.js`,
    output: {
      file: OUTPUT_DIR + `canvg.bundle.js`,
      format,
      name: 'canvg',
      globals: { },
    },
    external: [],
    plugins,
  }
];
