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
  test('getCustomVariables function', () => {
    const createSassMap = (key: sass.SassString, value: sass.Value) => {
      return new sass.SassMap(OrderedMap<sass.Value, sass.Value>([
        [ key, value ]
      ]));
    };

    const compiler = new Compiler();
    compiler.userItems = [{
        key: '$var2',
        value: 'rgba(30, 200, 163, 0.3)'
      }
    ]

    const keyNumber = new sass.SassString('$var1');
    const valueNumber: any = new sass.SassNumber(300, 'px');
    expect(compiler.getCustomVar([createSassMap(keyNumber, valueNumber)])).toEqual(valueNumber);
    
    const keyString = new sass.SassString('$var2');
    const valueString = new sass.SassString('Helvetica', { quotes: false });
    expect(compiler.getCustomVar([createSassMap(keyString, valueString)])).toEqual(valueString);

    const keyColor = new sass.SassString('$var2');
    const valueColor = new sass.SassColor({
      red: 50,
      green: 60,
      blue: 70,
      alpha: 0.4,
    });
    expect(compiler.getCustomVar([createSassMap(keyColor, valueColor)])).toEqual(valueColor);

    const keyListSeparator = new sass.SassString('$var4');
    const valueListSeparator = new sass.SassList([
      new sass.SassNumber(10, 'px'),
      new sass.SassNumber(15, 'px'),
      new sass.SassNumber(32, 'px'),
    ], {
      separator: ',',
    });
    expect(compiler.getCustomVar([createSassMap(keyListSeparator, valueListSeparator)])).toEqual(valueListSeparator);

    const keyList = new sass.SassString('$var5');
    const valueList = new sass.SassList([
      new sass.SassNumber(10, 'px'),
      new sass.SassNumber(15, 'px'),
      new sass.SassNumber(32, 'px'),
    ]);
    expect(compiler.getCustomVar([createSassMap(keyList, valueList)])).toEqual(valueList);

    const keyNull = new sass.SassString('$var6');
    const valueNull = sass.sassNull;
    expect(compiler.getCustomVar([createSassMap(keyNull, valueNull)])).toEqual(valueNull);
  });
});
