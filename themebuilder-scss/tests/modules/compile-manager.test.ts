import path from 'path';
import * as sass from 'sass';
import { metadata } from '../data/metadata';
import noModificationsResult from '../data/compilation-results/no-changes-css';
import noModificationsMeta from '../data/compilation-results/no-changes-meta';

import CompileManager from '../../src/modules/compile-manager';

const dataPath = path.join(path.resolve(), 'tests', 'data');

jest.mock('../../src/modules/bundle-resolver', () => ({
  __esModule: true,
  default: (theme: string): sass.SyncOptions => ({
    file: path.join(
      dataPath,
      'scss',
      'bundles',
      theme === 'material'
        ? 'dx.material.blue.light.scss'
        : 'dx.light.scss',
    ),
    includePaths: [path.join(dataPath, 'scss', 'widgets', 'generic')],
  }),
}));

jest.mock('../../src/data/metadata/dx-theme-builder-metadata', () => ({
  __esModule: true,
  metadata,
}));

jest.mock('../../src/modules/post-compiler', () => ({
  ...jest.requireActual('../../src/modules/post-compiler') as Record<string, unknown>,
  addInfoHeader: (css: string): string => css,
}));

describe('Compile manager - integration test on test sass', () => {
  test('compile test bundle without swatch', async () => {
    const manager = new CompileManager();
    return manager.compile({}).then((result) => {
      expect(result.css).toBe(noModificationsResult);
      expect(result.compiledMetadata).toEqual(noModificationsMeta);
    });
  });

  test('compile test bundle with swatch', async () => {
    const manager = new CompileManager();
    return manager.compile({
      makeSwatch: true,
      outColorScheme: 'test-theme',
    }).then((result) => {
      expect(result.css).toBe(`.dx-swatch-test-theme .dx-accordion {
  background-color: "Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif;
  color: #337ab7;
  background-image: url(icons/icons.woff2);
}
.dx-swatch-test-theme .dx-accordion .from-base {
  background-color: transparent;
  color: #337ab7;
}`);
      expect(result.compiledMetadata).toEqual(noModificationsMeta);
    });
  });

  test('compile test bundle with assetsBasePath', async () => {
    const manager = new CompileManager();
    return manager.compile({
      assetsBasePath: 'base-path',
    }).then((result) => {
      expect(result.css).toBe(`.dx-accordion {
  background-color: "Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif;
  color: #337ab7;
  background-image: url(base-path/icons/icons.woff2);
}
.dx-accordion .from-base {
  background-color: transparent;
  color: #337ab7;
}`);
      expect(result.compiledMetadata).toEqual(noModificationsMeta);
    });
  });

  test('compile test bundle with widgets option', async () => {
    const manager = new CompileManager();
    return manager.compile({
      widgets: ['datebox'],
    }).then((result) => {
      expect(result.css).toBe('');
      expect(result.compiledMetadata).toEqual({
        '$base-font-family': '"Helvetica Neue", "Segoe UI", helvetica, verdana, sans-serif',
        '$base-accent': '#337ab7',
      });
    });
  });

  test('compile test bundle using bootstrap (3) file as input', async () => {
    const manager = new CompileManager();
    return manager.compile({
      isBootstrap: true,
      bootstrapVersion: 3,
      data: '@brand-primary: red;',
    }).then((result) => {
      expect(result.css).toBe(`.dx-accordion {
  background-color: "Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif;
  color: red;
  background-image: url(icons/icons.woff2);
}
.dx-accordion .from-base {
  background-color: transparent;
  color: red;
}`);

      expect(result.compiledMetadata).toEqual({
        '$base-font-family': '"Helvetica Neue", "Segoe UI", helvetica, verdana, sans-serif',
        '$base-accent': 'red',
        '$accordion-title-color': 'red',
        '$accordion-item-title-opened-bg': 'transparent',
      });
    });
  });

  test('compile test bundle using bootstrap (4) file as input', async () => {
    const manager = new CompileManager();
    return manager.compile({
      isBootstrap: true,
      bootstrapVersion: 4,
      data: '$primary: red;$font-family-sans-serif: sans-serif;',
    }).then((result) => {
      expect(result.css).toBe(`.dx-accordion {
  background-color: sans-serif;
  color: red;
  background-image: url(icons/icons.woff2);
}
.dx-accordion .from-base {
  background-color: transparent;
  color: red;
}`);

      expect(result.compiledMetadata).toEqual({
        '$base-font-family': 'sans-serif',
        '$base-accent': 'red',
        '$accordion-title-color': 'red',
        '$accordion-item-title-opened-bg': 'transparent',
      });
    });
  });

  test('compile test bundle with noClean option', async () => {
    const manager = new CompileManager();
    return manager.compile({
      noClean: true,
    }).then((result) => {
      expect(result.css).toBe(`.dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", helvetica, verdana, sans-serif;
  color: #337ab7;
  background-image: url(icons/icons.woff2);
}
.dx-accordion .from-base {
  background-color: transparent;
  color: #337ab7;
}`);
      expect(result.compiledMetadata).toEqual(noModificationsMeta);
    });
  });

  test('compile test bundle with error', async () => {
    const manager = new CompileManager();
    return expect(manager.compile({
      makeSwatch: true,
      outColorScheme: 'error for sass compiler :)',
    })).rejects.toBeInstanceOf(Error);
  });

  test('compile test bundle with removeExternalResources option', async () => {
    const manager = new CompileManager();
    return manager.compile({
      themeName: 'material',
      removeExternalResources: true,
    }).then((result) => {
      expect(result.css).toBe('');
      expect(result.compiledMetadata).toEqual({});
    });
  });
});
