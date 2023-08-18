import * as sass from 'sass-embedded';
// eslint-disable-next-line import/no-extraneous-dependencies
import { OrderedMap } from 'immutable';

import Compiler from '../../src/modules/compiler';

jest.mock('../../src/data/metadata/dx-theme-builder-metadata', () => ({
  __esModule: true,
  metadata: {
    generic: [
      {
        Key: '$var0', Name: '10. Font size', Type: 'text',
      },
      {
        Key: '$var1', Name: '10. Font family', Type: 'text',
      },
      {
        Key: '$var2', Name: '10. Accent color', Type: 'color',
      },
      {
        Key: '$var3', Name: '10. Select color', Type: 'color',
      },
    ],
    material: [],
  },
}));

describe('Sass features', () => {
  test('collector function', () => {
    const compiler = new Compiler();
    const map = new sass.SassMap(OrderedMap<sass.Value, sass.Value>([
      // number variable
      [
        new sass.SassString('$var1'),
        new sass.SassNumber(300, 'px'),
      ],
      // string variable
      [
        new sass.SassString('$var2'),
        new sass.SassString('Helvetica', { quotes: false }),
      ],
      // color variable
      [
        new sass.SassString('$var3'),
        new sass.SassColor({
          red: 50,
          green: 60,
          blue: 70,
          alpha: 0.4,
        }),
      ],
      // list variable with ','
      [
        new sass.SassString('$var4'),
        new sass.SassList([
          new sass.SassNumber(10, 'px'),
          new sass.SassNumber(15, 'px'),
          new sass.SassNumber(32, 'px'),
        ], {
          separator: ',',
        }),
      ],
      // list variable
      [
        new sass.SassString('$var5'),
        new sass.SassList([
          new sass.SassNumber(10, 'px'),
          new sass.SassNumber(15, 'px'),
          new sass.SassNumber(32, 'px'),
        ], {
          separator: ' ',
        }),
      ],
      // null variable
      [
        new sass.SassString('$var6'),
        sass.sassNull,
      ],
      // next variable after null
      [
        new sass.SassString('$var7'),
        new sass.SassNumber(200, 'px'),
      ],
    ]));

    compiler.collector([map]);

    expect(compiler.changedVariables).toEqual({
      $var1: '300px',
      $var2: 'Helvetica',
      $var3: '#323c4666',
      $var4: '10px, 15px, 32px',
      $var5: '10px 15px 32px',
      $var7: '200px',
    });
  });
});
