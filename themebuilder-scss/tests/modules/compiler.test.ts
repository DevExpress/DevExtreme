
import path from 'path';
import fs from 'fs';
import { metadata } from '../data/metadata';
import noModificationsResult from '../data/compilation-results/no-changes-css';
import noModificationsMeta from '../data/compilation-results/no-changes-meta';

import Compiler from '../../src/modules/compiler';

jest.mock('../../src/data/metadata/dx-theme-builder-metadata', () => ({
  __esModule: true,
  metadata,
}));

const dataPath: string = path.join(path.resolve(), 'tests', 'data');

describe('compile', () => {
  const bundle = path.join(dataPath, 'scss', 'bundles', 'dx.light.scss');

  test('Compile with empty modifications (check that items can be undefined)', () => {
    const compiler = new Compiler();
    return compiler.compile(bundle, null, null).then((data) => {
      // compiled css
      expect(noModificationsResult).toBe(data.result.css.toString());
      // collected variables
      expect(noModificationsMeta).toEqual(data.changedVariables);
    });
  });

  test('Compile with one base and one accordion items modified', () => {
    const compiler = new Compiler();
    return compiler.compile(bundle, [
      { key: '$base-accent', value: 'red' },
      { key: '$accordion-item-title-opened-bg', value: 'green' },
    ], null).then((data) => {
      // compiled css
      expect(data.result.css.toString()).toBe(`.dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", Helvetica, Verdana, sans-serif;
  color: red;
  font: url("icons/icons.woff2");
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
    return compiler.compile('dx.error.scss', [], null).then(
      () => expect(false).toBe(true),
      (error) => {
        expect(error.status).toBe(3);
        expect(error.formatted).toBe('Error: dx.error.scss: no such file or directory');
      },
    );
  });

  test('Compile with custom sass compiler options (try to compile with custom data)', () => {
    const compiler = new Compiler();
    const bundleContent = fs.readFileSync(bundle, 'utf8');
    const extraOptions = {
      data: `${bundleContent}.extra-class { color: red; }`,
      outputStyle: 'compressed' as const,
    };
    return compiler.compile(bundle, [], extraOptions).then((data) => {
      // compiled css
      expect(data.result.css.toString()).toBe(
        '.dx-accordion{background-color:'
        + '"Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif;'
        + 'color:#337ab7;font:url("icons/icons.woff2")}.dx-accordion '
        + '.from-base{background-color:transparent;color:#337ab7}.extra-class{color:red}',
      );
    });
  });
});
