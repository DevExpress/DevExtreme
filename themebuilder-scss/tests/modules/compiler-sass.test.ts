import sass from 'sass';

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
    const map = new sass.types.Map(7);

    // number variable
    map.setKey(0, new sass.types.String('$var1'));
    map.setValue(0, new sass.types.Number(300, 'px'));
    // string variable
    map.setKey(1, new sass.types.String('$var2'));
    map.setValue(1, new sass.types.String('Helvetica'));
    // color variable
    map.setKey(2, new sass.types.String('$var3'));
    map.setValue(2, new sass.types.Color(50, 60, 70, 0.4));
    // list variable
    map.setKey(3, new sass.types.String('$var4'));
    const list1 = new sass.types.List(3);
    list1.setValue(0, new sass.types.Number(10, 'px'));
    list1.setValue(1, new sass.types.Number(15, 'px'));
    list1.setValue(2, new sass.types.Number(32, 'px'));
    list1.setSeparator(true);
    map.setValue(3, list1);
    // list variable with ','
    map.setKey(4, new sass.types.String('$var5'));
    const list2 = new sass.types.List(3);
    list2.setValue(0, new sass.types.Number(10, 'px'));
    list2.setValue(1, new sass.types.Number(15, 'px'));
    list2.setValue(2, new sass.types.Number(32, 'px'));
    list2.setSeparator(false);
    map.setValue(4, list2);
    // null variable
    map.setKey(5, new sass.types.String('$var6'));
    map.setValue(5, sass.types.Null.NULL);
    // next variable after null
    map.setKey(6, new sass.types.String('$var7'));
    map.setValue(6, new sass.types.Number(200, 'px'));

    compiler.collector(map);

    expect(compiler.changedVariables).toEqual({
      $var1: '300px',
      $var2: 'Helvetica',
      $var3: 'rgba(50, 60, 70, 0.4)',
      $var4: '10px, 15px, 32px',
      $var5: '10px 15px 32px',
      $var7: '200px',
    });
  });

  test('getMatchingUserItemsAsString - return right string for the url', () => {
    const compiler = new Compiler();

    compiler.userItems = [{
      key: '$var2',
      value: 'rgba(0,0,0,0)',
    }, {
      key: '$var0',
      value: '10px',
    }];
    const expected = '$var2: rgba(0,0,0,0);$var0: 10px;';

    const content = compiler.getMatchingUserItemsAsString('generic');

    expect(content).toEqual(expected);
  });

  test('setter function (custom importer)', () => {
    const compiler = new Compiler();
    compiler.userItems = [{
      key: '$var2',
      value: 'rgba(0,0,0,0)',
    }, {
      key: '$var0',
      value: '10px',
    }];

    const url = 'tb_generic';
    const expectedContent = '$var2: rgba(0,0,0,0);$var0: 10px;';

    const setterResult = compiler.setter(url);
    expect(setterResult).toEqual({ contents: expectedContent });
    expect(compiler.importerCache[url]).toBe(expectedContent);
  });

  test('setter call getMatchingUserItemsAsString once for every url', () => {
    const url = 'tb_generic';
    const compiler = new Compiler();
    compiler.getMatchingUserItemsAsString = jest.fn().mockImplementation(() => 'content');
    compiler.setter(url);
    compiler.setter(url);
    compiler.setter(url);

    expect(compiler.getMatchingUserItemsAsString).toHaveBeenCalledTimes(1);
    expect(compiler.importerCache[url]).toBe('content');
  });
});
