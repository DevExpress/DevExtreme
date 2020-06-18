import path from 'path';
import fs from 'fs';
import { metadata } from '../data/metadata';
import noModificationsMeta from '../data/compilation-results/no-changes-meta';

import Compiler, { ImportType } from '../../src/modules/compiler';

jest.mock('../../src/data/metadata/dx-theme-builder-metadata', () => ({
  __esModule: true,
  metadata,
}));

const dataPath: string = path.join(path.resolve(), 'tests', 'data');
const indexFileName = path.join(dataPath, 'scss', 'widgets', 'generic', '_index.scss');
const defaultIndexFileContent = fs.readFileSync(indexFileName, 'utf8');

describe('compile', () => {
  const file = path.join(dataPath, 'scss', 'bundles', 'dx.light.scss');
  const includePaths = [path.join(dataPath, 'scss', 'widgets', 'generic')];

  test('Compile with empty modifications (check that items can be undefined)', () => {
    const compiler = new Compiler();
    compiler.indexFileContent = defaultIndexFileContent;
    return compiler.compile(null, {
      file,
      includePaths,
    }).then((data) => {
      // compiled css
      expect(data.result.css.toString()).toBe(`.dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", Helvetica, Verdana, sans-serif;
  color: #337ab7;
  background-image: url(icons/icons.woff2);
}
.dx-accordion .from-base {
  background-color: transparent;
  color: #337ab7;
}`);
      // collected variables
      expect(data.changedVariables).toEqual(noModificationsMeta);
    });
  });

  test('Compile with one base and one accordion items modified', () => {
    const compiler = new Compiler();
    compiler.indexFileContent = defaultIndexFileContent;
    return compiler.compile([
      { key: '$base-accent', value: 'red' },
      { key: '$accordion-item-title-opened-bg', value: 'green' },
    ], {
      file,
      includePaths,
    }).then((data) => {
      // compiled css
      expect(data.result.css.toString()).toBe(`.dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", Helvetica, Verdana, sans-serif;
  color: red;
  background-image: url(icons/icons.woff2);
}
.dx-accordion .from-base {
  background-color: green;
  color: red;
}`);
      // collected variables
      expect(data.changedVariables).toEqual([
        {
          Key: '$base-font-family',
          Value: '"Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif',
          Path: 'tb/widgets/generic/colors',
        },
        {
          Key: '$base-accent',
          Value: 'rgba(255,0,0,1)', // red
          Path: 'tb/widgets/generic/colors',
        },
        {
          Key: '$accordion-title-color',
          Value: 'rgba(255,0,0,1)', // red
          Path: 'tb/widgets/generic/accordion/colors',
        },
        {
          Key: '$accordion-item-title-opened-bg',
          Value: 'rgba(0,128,0,1)', // green
          Path: 'tb/widgets/generic/accordion/colors',
        },
      ]);
    });
  });

  test('Compile with error', () => {
    const compiler = new Compiler();
    compiler.indexFileContent = defaultIndexFileContent;
    return compiler.compile([], { file: 'dx.error.scss' }).then(
      () => expect(false).toBe(true),
      (error) => {
        expect(error.status).toBe(3);
        expect(error.formatted).toBe('Error: dx.error.scss: no such file or directory');
      },
    );
  });

  test('Compile with custom sass compiler options (try to compile with custom data)', () => {
    const compiler = new Compiler();
    compiler.indexFileContent = defaultIndexFileContent;
    const bundleContent = fs.readFileSync(file, 'utf8');
    const extraOptions = {
      data: `${bundleContent}.extra-class { color: red; }`,
      includePaths,
      outputStyle: 'compressed' as const,
    };
    return compiler.compile([], extraOptions).then((data) => {
      // compiled css
      expect(data.result.css.toString()).toBe(
        '.dx-accordion{background-color:'
        + '"Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif;'
        + 'color:#337ab7;background-image:url(icons/icons.woff2)}.dx-accordion '
        + '.from-base{background-color:transparent;color:#337ab7}.extra-class{color:red}',
      );
    });
  });
});

describe('compile with widgets', () => {
  test('getImportType', () => {
    expect(Compiler.getImportType('tb/url')).toBe(ImportType.Color);
    expect(Compiler.getImportType('../widgets/generic/tb_index')).toBe(ImportType.Index);
    expect(Compiler.getImportType('colors')).toBe(ImportType.Unknown);
  });

  test('setter return indexFileContent for index file', () => {
    const compiler = new Compiler();
    const contentOfIndexFile = 'some content';
    const indexFileUrl = '../widgets/generic/tb_index';
    compiler.indexFileContent = contentOfIndexFile;

    expect(compiler.setter(indexFileUrl)).toEqual({ contents: contentOfIndexFile });
  });
});
