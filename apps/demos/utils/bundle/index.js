/* eslint-disable import/no-extraneous-dependencies, no-console */
const path = require('path');
const fs = require('fs-extra');
const Builder = require('systemjs-builder');
const babel = require('@babel/core');
const url = require('url');

const GRID_COMMON_STAR_IMPORT = 'exports.Grids = __importStar(require("./grids"));';

// https://stackoverflow.com/questions/42412965/how-to-load-named-exports-with-systemjs/47108328
const prepareModulesToNamedImport = () => {
  const modules = [
    'time_zone_utils.js',
    'localization.js',
    'viz/export.js',
    'viz/core/export.js',
    'viz/vector_map/projection.js',
    'viz/palette.js',
    'excel_exporter.js',
    'pdf_exporter.js',
    'time_zone_utils.js',
    'devextreme/ui/dialog.js',
    'common/charts.js',
  ];

  const paths = [
    '../npm-scripts/npm-devextreme/cjs',
    'node_modules/devextreme/cjs',
  ];

  const esModuleExport = 'exports.__esModule = true;';

  paths.forEach((p) => {
    modules.forEach((name) => {
      const filePath = `${p}/${name}`;

      if (fs.existsSync(filePath)) {
        const fileText = fs.readFileSync(filePath, 'utf8');
        if (fileText.search(esModuleExport) === -1) {
          fs.appendFileSync(filePath, `\n ${esModuleExport}`);
        }
      }
    });
  });
};

const getDefaultBuilderConfig = (framework, additionPaths, map) => ({
  defaultExtension: false,
  defaultJSExtensions: 'js',
  packages: {
    'devextreme/events/utils': {
      main: 'index',
    },
    'devextreme/events': {
      main: 'index',
    },
  },
  map,
  meta: {
    '*': {
      build: false,
      transpile: true,
    },
    'devextreme/*': {
      build: true,
    },
    'devexpress-gantt': {
      build: true,
    },
    'devexpress-diagram': {
      build: true,
    },
    [`devextreme-${framework}/*`]: {
      build: true,
      main: 'index.js',
    },
  },
  paths: {
    'devextreme/*': 'node_modules/devextreme/cjs/*',
    'devexpress-gantt': 'node_modules/devexpress-gantt/dist/dx-gantt.min.js',
    'devexpress-diagram': 'node_modules/devexpress-diagram/dist/dx-diagram.min.js',
    [`devextreme-${framework}/*`]: `node_modules/devextreme-${framework}/${['react', 'vue'].includes(framework) ? 'cjs/*' : '*'}`,
    ...additionPaths,
  },
});

const prepareDevextremexAngularFiles = () => {
  const dxNgBaseDir = path.resolve('node_modules/devextreme-angular/bundles');

  try {
    fs.rmSync(dxNgBaseDir, { recursive: true });
  } catch (e){}

  try {
    fs.mkdirSync('node_modules/devextreme-angular/bundles');
    console.log(`Directory ${dxNgBaseDir} CLEANED successfully`);
  } catch (e) {}

  fs.copySync('./bundles/devextreme-angular', 'node_modules/devextreme-angular/bundles');
  console.log('Copy devextreme-angular files to node_modules/devextreme-angular/bundles completed!');
}

const prepareConfigs = (framework)=> {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const currentPackage = require(`devextreme-${framework}/package.json`);

  let additionPackage = [];
  let packages = [];
  let additionPaths = {};
  let modulesMap = {};

  let main = `devextreme-${framework}/index.js`;
  let minify = true;

  if (framework === 'angular') {
    additionPackage = [{
      name: 'rxjs/*',
      metaValue: {
        build: true,
      },
      pathValue: 'node_modules/rxjs/*',
    }];

    packages = [
      'rxjs/dist/cjs/index.js',
      'rxjs/dist/cjs/operators/index.js',
    ];

    // eslint-disable-next-line spellcheck/spell-checker
    if (currentPackage.module?.startsWith('fesm2022')) {
      main = `devextreme-${framework}`;
      minify = false;

      prepareDevextremexAngularFiles();

      const bundlesRoot = 'node_modules/devextreme-angular/bundles';

      const componentNames = fs.readdirSync(bundlesRoot)
          .filter((fileName) => fileName.indexOf('umd.js') !== -1)
          .filter((fileName) => fileName.indexOf('devextreme-angular-ui') === 0)
          .map((fileName) => fileName.replace('devextreme-angular-ui-', '').replace('.umd.js', ''));

      additionPaths = {
        'devextreme-angular': `${bundlesRoot}/devextreme-angular.umd.js`,
        'devextreme-angular/core': `${bundlesRoot}/devextreme-angular-core.umd.js`,
        ...componentNames.reduce((items, item) => {
          // eslint-disable-next-line no-param-reassign
          items[`devextreme-angular/ui/${item.replace('-nested', '/nested')}`] = `${bundlesRoot}/devextreme-angular-ui-${item}.umd.js`;
          return items;
        }, {}),
      };

      modulesMap = {
        ...componentNames.reduce((items, item) => {
          // eslint-disable-next-line no-param-reassign
          items[`devextreme-angular/ui/${item.replace('-nested', '/nested')}`] = `${bundlesRoot}/devextreme-angular-ui-${item}.umd.js`;
          return items;
        }, {}),
      };
    }
  }

  if (framework === 'react') {
    additionPackage = [{
      name: 'react/*',
      metaValue: {
        build: true,
        esModule: true,
      },
      pathValue: 'node_modules/react/*',
    }, {
      name: 'react-dom/*',
      metaValue: {
        build: true,
      },
      pathValue: 'node_modules/react-dom/*',
    }];

    additionPaths = {
      'devextreme/localization/messages/*': 'node_modules/devextreme/localization/messages/*',
    };

    packages = [
      'react/umd/react.development.js',
      'react-dom/umd/react-dom.development.js',
    ];
  }

  const builderConfig = getDefaultBuilderConfig(framework, additionPaths, modulesMap);

  additionPackage.forEach((p) => {
    builderConfig.meta[p.name] = p.metaValue;
    builderConfig.paths[p.name] = p.pathValue;
  });

  packages.push(
      'devextreme/bundles/dx.custom.config.js',
      main,
  );

  return {
    builderConfig,
    packages: packages.join(' + '),
    bundlePath: `bundles/devextreme.${framework}.systemjs.js`,
    bundleOpts: {
      minify,
      uglify: { mangle: true },
      async fetch(load, fetch) {
        if(load?.metadata?.transpile) {
          // access to path-specific meta if required: load?.metadata?.babelOptions
          const babelOptions = {
            plugins: [
              '@babel/plugin-transform-nullish-coalescing-operator',
              '@babel/plugin-transform-object-rest-spread',
              '@babel/plugin-transform-optional-catch-binding',
              '@babel/plugin-transform-optional-chaining',
            ]
          };

          // This auto-generated runtime import is useless because grid.js exports only types,
          // but System.js transpiles this import into code that crashes when triggered in a Demo.
          const removeImportTranspiledToCrashingCode = (result) => {
            if(result.code.includes(GRID_COMMON_STAR_IMPORT)) {
              result.code = result.code.replace(GRID_COMMON_STAR_IMPORT, '');
            }
          }

          const result = new Promise((resolve) => {
            // systemjs-builder uses babel 6, so we use babel 7 here for transpiling ES2020
            babel.transformFile(url.fileURLToPath(load.name), babelOptions, (err, result) => {
                if(err) {
                  fetch(load).then(r => resolve(r));
                  console.log('Unexpected transipling error (babel 7): ' + err);
                } else {
                  removeImportTranspiledToCrashingCode(result);
                  resolve(result.code);
                }
            });
          })
          return result;
        } else {
          return fetch(load);
        }
      },
    },
  };
};

const build = async (framework) => {
  const builder = new Builder();
  prepareModulesToNamedImport();

  const {
    builderConfig, packages, bundlePath, bundleOpts,
  } = prepareConfigs(framework);


  builder.config(builderConfig);

  try {
    await builder.bundle(packages, bundlePath, bundleOpts);
  } catch (err) {
    console.error(`Build ${framework} error `, err);
    process.exit(err);
  }
};

const copyBundlesFolder = () => {
  const dxPath = path.join(process.cwd(), 'node_modules', 'devextreme');
  const dxBundlesPath = path.join(dxPath, 'bundles');
  const dxCjsBundlesPath = path.join(dxPath, 'cjs', 'bundles');

  fs.copySync(dxBundlesPath, dxCjsBundlesPath, { overwrite: true });
};

module.exports = {
  copyBundlesFolder,
  build,
};
