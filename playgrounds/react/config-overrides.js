module.exports = function override(config, env) {
  // config.module.rules.push([
  //   {
  //     test: /\.(?:mjs|js|ts|tsx)$/,
  //     resolve: {
  //       // Since we use ES modules, the import path must be fully specified. But this is not something Typescript
  //       // support, so the workaround is to not require extension in import path.
  //       // See https://github.com/webpack/webpack/issues/11467
  //       // See https://github.com/microsoft/TypeScript/issues/16577
  //       fullySpecified: false,
  //     },
  //   },
  // ]);
  return config;
};

// a = [{
//   'enforce': 'pre',
//   'exclude': {},
//   'test': {},
//   'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\react-scripts\\node_modules\\source-map-loader\\dist\\cjs.js',
// }, {
//   'oneOf': [{
//     'test': [{}],
//     'type': 'asset',
//     'mimetype': 'image/avif',
//     'parser': { 'dataUrlCondition': { 'maxSize': 10000 } },
//   }, {
//     'test': [{}, {}, {}, {}],
//     'type': 'asset',
//     'parser': { 'dataUrlCondition': { 'maxSize': 10000 } },
//   }, {
//     'test': {},
//     'use': [{
//       'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\@svgr\\webpack\\lib\\index.js',
//       'options': {
//         'prettier': false,
//         'svgo': false,
//         'svgoConfig': { 'plugins': [{ 'removeViewBox': false }] },
//         'titleProp': true,
//         'ref': true,
//       },
//     }, {
//       'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\file-loader\\dist\\cjs.js',
//       'options': { 'name': 'static/media/[name].[hash].[ext]' },
//     }],
//     'issuer': { 'and': [{}] },
//   }, {
//     'test': {},
//     'include': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\playgrounds\\react\\src',
//     'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\babel-loader\\lib\\index.js',
//     'options': {
//       'customize': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\babel-preset-react-app\\webpack-overrides.js',
//       'presets': [['C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\babel-preset-react-app\\index.js', { 'runtime': 'automatic' }]],
//       'babelrc': false,
//       'configFile': false,
//       'cacheIdentifier': 'development:babel-plugin-named-asset-import@0.3.8:babel-preset-react-app@10.0.1:react-dev-utils@12.0.1:react-scripts@5.0.1',
//       'plugins': ['C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\react-refresh\\babel.js'],
//       'cacheDirectory': true,
//       'cacheCompression': false,
//       'compact': false,
//     },
//   }, {
//     'test': {},
//     'exclude': {},
//     'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\babel-loader\\lib\\index.js',
//     'options': {
//       'babelrc': false,
//       'configFile': false,
//       'compact': false,
//       'presets': [['C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\babel-preset-react-app\\dependencies.js', { 'helpers': true }]],
//       'cacheDirectory': true,
//       'cacheCompression': false,
//       'cacheIdentifier': 'development:babel-plugin-named-asset-import@0.3.8:babel-preset-react-app@10.0.1:react-dev-utils@12.0.1:react-scripts@5.0.1',
//       'sourceMaps': true,
//       'inputSourceMap': true,
//     },
//   }, {
//     'test': {},
//     'exclude': {},
//     'use': ['C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\style-loader\\dist\\cjs.js', {
//       'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\css-loader\\dist\\cjs.js',
//       'options': {
//         'importLoaders': 1,
//         'sourceMap': true,
//         'modules': { 'mode': 'icss' },
//       },
//     }, {
//       'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\react-scripts\\node_modules\\postcss-loader\\dist\\cjs.js',
//       'options': {
//         'postcssOptions': {
//           'ident': 'postcss',
//           'config': false,
//           'plugins': ['postcss-flexbugs-fixes', ['postcss-preset-env', {
//             'autoprefixer': { 'flexbox': 'no-2009' },
//             'stage': 3,
//           }], 'postcss-normalize'],
//         },
//         'sourceMap': true,
//       },
//     }],
//     'sideEffects': true,
//   }, {
//     'test': {},
//     'use': ['C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\style-loader\\dist\\cjs.js', {
//       'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\css-loader\\dist\\cjs.js',
//       'options': {
//         'importLoaders': 1,
//         'sourceMap': true,
//         'modules': { 'mode': 'local' },
//       },
//     }, {
//       'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\react-scripts\\node_modules\\postcss-loader\\dist\\cjs.js',
//       'options': {
//         'postcssOptions': {
//           'ident': 'postcss',
//           'config': false,
//           'plugins': ['postcss-flexbugs-fixes', ['postcss-preset-env', {
//             'autoprefixer': { 'flexbox': 'no-2009' },
//             'stage': 3,
//           }], 'postcss-normalize'],
//         },
//         'sourceMap': true,
//       },
//     }],
//   }, {
//     'test': {},
//     'exclude': {},
//     'use': ['C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\style-loader\\dist\\cjs.js', {
//       'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\css-loader\\dist\\cjs.js',
//       'options': {
//         'importLoaders': 3,
//         'sourceMap': true,
//         'modules': { 'mode': 'icss' },
//       },
//     }, {
//       'loader': 'C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\react-scripts\\node_modules\\postcss-loader\\dist\\cjs.js',
//       'options': {
//         'postcssOptions': {
//           'ident': 'postcss',
//           'config': false,
//           'plugins': ['postcss-flexbugs-fixes', ['postcss-preset-env', {
//             'autoprefixer': { 'flexbox': 'no-2009' },
//             'stage': 3,
//           }], 'postcss-normalize'],
//         },
//         'sourceMap': true,
//       },
//     }, { 'loader': "C:\\Users\\aleksandr.bulychev\\WebstormProjects\\DevExtreme\\node_modules\\react-scripts
//
