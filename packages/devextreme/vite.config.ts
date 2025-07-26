import { defineConfig } from 'vite';
import inferno from 'vite-plugin-inferno'
import path from 'path';
import fs from 'fs'
import url from 'url'
import commonjs from 'vite-plugin-commonjs';
import { 
  type TestFile,
  type TestDirectory 
} from './testing/test-environment/template-utils'
import { 
  moduleResolverPlugin, 
  testServerPlugin,
  esmHelpersPlugin,
  editorPlugin
} from './testing/test-environment/plugins'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function scanTestsInDirectory(dirPath: string, basePath: string = ''): TestDirectory {
  const fullDirPath = path.join(__dirname, 'testing/tests', dirPath);
  const relativePath = basePath ? path.join(basePath, dirPath) : dirPath;
  
  const result: TestDirectory = {
    name: path.basename(dirPath) || 'tests',
    path: relativePath,
    tests: [],
    subdirectories: []
  };

  if (!fs.existsSync(fullDirPath)) {
    return result;
  }

  const items = fs.readdirSync(fullDirPath, { withFileTypes: true });
  
  for (const item of items) {
    if (item.isDirectory() && !item.name.startsWith('.')) {
      const subDir = scanTestsInDirectory(
        path.join(dirPath, item.name), 
        basePath
      );
      if (subDir.tests.length > 0 || subDir.subdirectories.length > 0) {
        result.subdirectories.push(subDir);
      }
    } else if (item.isFile() && item.name.endsWith('.js') && !item.name.startsWith('__')) {
      const testPath = path.join('testing/tests', relativePath, item.name);
      result.tests.push({
        name: path.basename(item.name, '.js'),
        path: testPath,
        relativePath: path.join(relativePath, item.name),
        fullPath: path.join(fullDirPath, item.name),
        category: result.name
      });
    }
  }
  
  return result;
}

function getAllTests(): TestFile[] {
  const rootDir = scanTestsInDirectory('');
  const allTests: TestFile[] = [];
  
  function collectTests(dir: TestDirectory) {
    allTests.push(...dir.tests);
    dir.subdirectories.forEach(collectTests);
  }
  
  collectTests(rootDir);
  return allTests;
}

export default defineConfig({
  plugins: [
    inferno(), 
    commonjs({
       requireReturnsDefault: 'auto'
    }),
    moduleResolverPlugin(__dirname), 
    esmHelpersPlugin(__dirname),
    editorPlugin(__dirname),
    testServerPlugin(__dirname, scanTestsInDirectory, getAllTests)
  ],
  server: {
    port: 3000,
    host: true,
    fs: {
      allow: ['..', '.', './testing']
    },
    // Enable editor integration for opening files
    middlewareMode: false,
    hmr: {
      port: 3001
    }
  },
  resolve: {
    alias: {
      'aspnet': path.resolve(__dirname, 'js/aspnet.js'),
      'exporter': path.resolve(__dirname, './js/exporter'),
      'excel_exporter': path.resolve(__dirname, './js/excel_exporter'),
      'color': path.resolve(__dirname, '/js/color.js'),
      'core': path.resolve(__dirname, './js/core'),
      'common': path.resolve(__dirname, './js/common'),
      'data': path.resolve(__dirname, './js/data'),
      'ui': path.resolve(__dirname, './js/ui'),
      'localization': path.resolve(__dirname, './js/localization'),
      'viz': path.resolve(__dirname, './js/viz'),
      '@js': path.resolve(__dirname, './js'),
      '@ts': path.resolve(__dirname, './js/__internal'),
      '__internal': path.resolve(__dirname, './js/__internal'),
      'integration': path.resolve(__dirname, './js/integration'),
      'testing': path.resolve(__dirname, './testing'),
      'bundles': path.resolve(__dirname, './js/bundles'),
      'globalize$': path.resolve(__dirname, './node_modules/globalize/dist/globalize.js'),
      'globalize/currency': path.resolve(__dirname, './node_modules/globalize/dist/globalize/currency.js'),
      'globalize/date': path.resolve(__dirname, './node_modules/globalize/dist/globalize/date.js'),
      'globalize/message': path.resolve(__dirname, './node_modules/globalize/dist/globalize/message.js'),
      'globalize/number': path.resolve(__dirname, './node_modules/globalize/dist/globalize/number.js'),

      'generic_light.css!': path.resolve(__dirname, './artifacts/css/dx.light.css'),
      'generic_light.css': path.resolve(__dirname, './artifacts/css/dx.light.css'),
      'material_blue_light.css!': path.resolve(__dirname, './artifacts/css/dx.material.blue.light.css'),
      'material_blue_light.css': path.resolve(__dirname, './artifacts/css/dx.material.blue.light.css'),
      'material_blue_dark.css!': path.resolve(__dirname, './artifacts/css/dx.material.blue.dark.css'),
      'material_blue_dark.css': path.resolve(__dirname, './artifacts/css/dx.material.blue.dark.css'),
      'material_lime_light.css!': path.resolve(__dirname, './artifacts/css/dx.material.lime.light.css'),
      'material_lime_light.css': path.resolve(__dirname, './artifacts/css/dx.material.lime.light.css'),
      'material_lime_dark.css!': path.resolve(__dirname, './artifacts/css/dx.material.lime.dark.css'),
      'material_lime_dark.css': path.resolve(__dirname, './artifacts/css/dx.material.lime.dark.css'),
      'material_orange_light.css!': path.resolve(__dirname, './artifacts/css/dx.material.orange.light.css'),
      'material_orange_light.css': path.resolve(__dirname, './artifacts/css/dx.material.orange.light.css'),
      'material_orange_dark.css!': path.resolve(__dirname, './artifacts/css/dx.material.orange.dark.css'),
      'material_orange_dark.css': path.resolve(__dirname, './artifacts/css/dx.material.orange.dark.css'),
      'material_purple_light.css!': path.resolve(__dirname, './artifacts/css/dx.material.purple.light.css'),
      'material_purple_light.css': path.resolve(__dirname, './artifacts/css/dx.material.purple.light.css'),
      'material_purple_dark.css!': path.resolve(__dirname, './artifacts/css/dx.material.purple.dark.css'),
      'material_purple_dark.css': path.resolve(__dirname, './artifacts/css/dx.material.purple.dark.css'),
      'material_teal_light.css!': path.resolve(__dirname, './artifacts/css/dx.material.teal.light.css'),
      'material_teal_light.css': path.resolve(__dirname, './artifacts/css/dx.material.teal.light.css'),
      'material_teal_dark.css!': path.resolve(__dirname, './artifacts/css/dx.material.teal.dark.css'),
      'material_teal_dark.css': path.resolve(__dirname, './artifacts/css/dx.material.teal.dark.css'),
    }
  },

  esbuild: {
    jsxFactory: 'Inferno.createVNode',
    jsxFragment: 'Inferno.Fragment',
    loader: 'tsx',
  },
});