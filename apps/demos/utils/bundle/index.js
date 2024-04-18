/* eslint-disable import/no-extraneous-dependencies, no-console */
const path = require('path');
const fs = require('fs-extra');

const rollup = require('rollup');
const nodeResolve =   require('@rollup/plugin-node-resolve');
const commonjs =   require('@rollup/plugin-commonjs');
const replace =   require('@rollup/plugin-replace');
const babel =   require('@rollup/plugin-babel');

const Builder = require('systemjs-builder');

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

const getDefaultBuilderConfig = (framework, additionPaths) => ({
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
  meta: {
    '*': {
      build: false,
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
    'devextreme/*': '../../node_modules/devextreme/cjs/*',
    'devexpress-gantt': '../../node_modules/devexpress-gantt/dist/dx-gantt.min.js',
    'devexpress-diagram': '../../node_modules/devexpress-diagram/dist/dx-diagram.min.js',
    [`devextreme-${framework}/*`]: `../../node_modules/devextreme-${framework}/${['react', 'vue'].includes(framework) ? 'cjs/*' : '*'}`,
    ...additionPaths,
  },
});

const generateDxAngularBundles = async () => {
  const baseDir = '../../node_modules/devextreme-angular/';
  const srcDir = path.join(baseDir, 'fesm2022');
  const componentNames = fs.readdirSync(srcDir)
      .filter((fileName) => fileName.indexOf('mjs.map') !== -1)
      .filter((fileName) => fileName.indexOf('devextreme-angular-ui') === 0)
      .map((fileName) => fileName.replace('devextreme-angular-ui-', '').replace('.mjs.map', ''));

  const files = [
    `devextreme-angular.mjs`,
    `devextreme-angular-core.mjs`,
     ...componentNames.map((componentName) => `devextreme-angular-ui-${componentName}.mjs`),

  ];

  for (let i = 0; i < files.length; i++) {
    await buildUmd(srcDir, files[i]);
  }


}

const prepareConfigs = async (framework) => {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const currentPackage = require(`devextreme-${framework}/package.json`);

  let additionPackage = [];
  let packages = [];
  let additionPaths = {};

  let main = `devextreme-${framework}/index.js`;
  let minify = true;

  if (framework === 'angular') {
    additionPackage = [{
      name: 'rxjs/*',
      metaValue: {
        build: true,
      },
      pathValue: '../../node_modules/rxjs/*',
    }];

    packages = [
      'rxjs/dist/cjs/index.js',
      'rxjs/dist/cjs/operators/index.js',
    ];

    // eslint-disable-next-line spellcheck/spell-checker
    if (currentPackage.module?.startsWith('fesm2022')) {
      main = `devextreme-${framework}`;
      minify = false;

      await generateDxAngularBundles();

      const bundlesRoot = '../../node_modules/devextreme-angular/bundles';
      const componentNames = fs.readdirSync(bundlesRoot)
        .filter((fileName) => fileName.indexOf('umd.js') !== -1)
        .filter((fileName) => fileName.indexOf('devextreme-angular-ui') === 0)
        .map((fileName) => fileName.replace('devextreme-angular-ui-', '').replace('.umd.js', ''));

      additionPaths = {
        'devextreme-angular': `${bundlesRoot}/devextreme-angular.umd.js`,
        'devextreme-angular/core': `${bundlesRoot}/devextreme-angular-core.umd.js`,
        ...componentNames.reduce((items, item) => {
          // eslint-disable-next-line no-param-reassign
          items[`devextreme-angular/ui/${item}`] = `${bundlesRoot}/devextreme-angular-ui-${item}.umd.js`;
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

  const builderConfig = getDefaultBuilderConfig(framework, additionPaths);

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
    },
  };
};

async function buildUmd(dir, file) {
  const bundle = await rollup.rollup({
    input: path.join(dir,file),
    plugins:[
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify( 'production' )
      }),
      nodeResolve({
        preferBuiltins: false,
        browser: true
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
      }),
    ],
    external: id => {
      return /^@angular\//.test(id)
          || /^devextreme\//.test(id)
          || /^devextreme-angular\//.test(id)
    },
  });
  const libName = file
      .replace(/\.\w+$/, '')
      .replace(/^devextreme-angular-ui-/,'devextreme-angular/ui/')
      .replace(/^devextreme-angular-/,'devextreme-angular/');

  await bundle.write({
    file: path.join(path.dirname(dir), 'bundles', file.replace(/\.mjs$/, '.umd.js')),
    format: 'umd',
    amd: {
      id: libName
    },
    globals: {
      '@angular/core': 'ng.core',
      '@angular/common': 'ng.common',
      '@angular/forms': 'ng.forms',
      '@angular/platform-browser': 'ng.platformBrowser',
    },
    name: libName
  });
  await bundle.close();
}


const build = async (framework) => {
  const builder = new Builder();
  prepareModulesToNamedImport();

  const {
    builderConfig, packages, bundlePath, bundleOpts,
  } = await prepareConfigs(framework);

  builder.config(builderConfig);

  try {
    await builder.bundle(packages, bundlePath, bundleOpts);
  } catch (err) {
    console.error(`Build ${framework} error `, err);
  }
};

const copyBundlesFolder = () => {
  const dxPath = path.join(process.cwd(), '..', '..', 'node_modules', 'devextreme');
  const dxBundlesPath = path.join(dxPath, 'bundles');
  const dxCjsBundlesPath = path.join(dxPath, 'cjs', 'bundles');

  fs.copySync(dxBundlesPath, dxCjsBundlesPath, { overwrite: true });
};

module.exports = {
  copyBundlesFolder,
  build,
};
