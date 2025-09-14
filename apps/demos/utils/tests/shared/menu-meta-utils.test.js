const menuMetaUtils = require('../../shared/menu-meta-utils');

const menuMetaJson = [
  {
    Name: 'Category1',
    Groups: [
      {
        Name: 'Category1.1',
        Groups: [
          {
            Name: 'Group1.1.1',
            Demos: [
              {
                Title: 'Demo 1.1.1.1',
                Name: 'Demo1.1.1.1',
                Widget: 'Widget',
              }, {
                Title: 'Demo 1.1.1.2',
                Name: 'Demo1.1.1.2',
                Widget: 'Widget',
              }
            ]
          }, {
            Name: 'Category.1.1.2',
            Groups: [
              {
                Name: 'Group1.1.2.1',
                Demos: [
                  {
                    Title: 'Demo 1.1.2.1.1',
                    Name: 'Demo1.1.2.1.1',
                    Widget: 'Widget',
                  }
                ]
              }
            ]
          }
        ]
      }, {
        Name: 'Group1.2',
        Demos: [
          {
            Title: 'Demo 1.2.1',
            Name: 'Demo1.2.1',
            Widget: 'Widget',
            Modules: 'openai',
          }
        ]
      }
    ]
  }
]

describe('check functions', () => {
  test('isCategory (first level)', () => {
    expect(menuMetaUtils.isCategory(menuMetaJson, ['Category1'])).toBe(true);
  });
  test('isCategory (nested)', () => {
    expect(menuMetaUtils.isCategory(menuMetaJson, ['Category1', 'Category1.1', 'Category.1.1.2'])).toBe(true);
  });
  test('isCategory (group)', () => {
    expect(menuMetaUtils.isCategory(menuMetaJson, ['Category1', 'Group1.2'])).toBe(false);
  });
  test('isCategory (demo)', () => {
    expect(menuMetaUtils.isCategory(menuMetaJson, ['Category1', 'Group1.2', 'Demo1.2.1'])).toBe(false);
  });

  test('isGroup (group)', () => {
    expect(menuMetaUtils.isGroup(menuMetaJson, ['Category1', 'Group1.2'])).toBe(true);
  });
  test('isGroup (category)', () => {
    expect(menuMetaUtils.isGroup(menuMetaJson, ['Category1', 'Category1.1'])).toBe(false);
  });
  test('isGroup (demo)', () => {
    expect(menuMetaUtils.isGroup(menuMetaJson, ['Category1', 'Group1.2', 'Demo1.2.1'])).toBe(false);
  });

  test('isDemo (demo)', () => {
    expect(menuMetaUtils.isDemo(menuMetaJson, ['Category1', 'Group1.2', 'Demo1.2.1'])).toBe(true);
  });
  test('isDemo (category)', () => {
    expect(menuMetaUtils.isDemo(menuMetaJson, ['Category1', 'Category1.1'])).toBe(false);
  });
  test('isDemo (group)', () => {
    expect(menuMetaUtils.isDemo(menuMetaJson, ['Category1', 'Group1.2'])).toBe(false);
  });
});

describe('get functions', () => {
  test('getCategories', () => {
    expect(menuMetaUtils.getCategories(menuMetaJson)).toStrictEqual([{
      title: 'CATEGORY1',
      value: 'Category1',
    }]);
  });
  test('getCategories (with new)', () => {
    expect(menuMetaUtils.getCategories(menuMetaJson, '[New Category]')).toStrictEqual([{
      title: '[New Category]',
      value: 'new',
    }, {
      title: 'CATEGORY1',
      value: 'Category1',
    }])
  });

  test('getGroups', () => {
    expect(menuMetaUtils.getGroups(menuMetaJson, ['Category1'])).toStrictEqual([{
      title: 'Category1.1',
    }, {
      title: 'Group1.2',
    }]);
  });
  test('getGroups (with new)', () => {
    expect(menuMetaUtils.getGroups(menuMetaJson, ['Category1'], '[New Group]')).toStrictEqual([{
      title: '[New Group]',
      value: 'new',
    }, {
      title: 'Category1.1',
    }, {
      title: 'Group1.2',
    }])
  });

  test('getDemos', () => {
    expect(menuMetaUtils.getDemos(menuMetaJson, ['Category1', 'Group1.2'])).toStrictEqual([{
      title: 'Demo 1.2.1',
      value: 'Demo1.2.1',
    }]);
  });
  test('getDemos (with new)', () => {
    expect(menuMetaUtils.getDemos(menuMetaJson, ['Category1', 'Category1.1', 'Group1.1.1'], '[New Demo]')).toStrictEqual([{
      title: '[New Demo]',
      value: 'new',
    }, {
      title: 'Demo 1.1.1.1',
      value: 'Demo1.1.1.1',
    }, {
      title: 'Demo 1.1.1.2',
      value: 'Demo1.1.1.2',
    }]);
  });

  test('getByPath ([])', () => {
    expect(menuMetaUtils.getByPath(menuMetaJson, [])).toStrictEqual(menuMetaJson);
  });

  test('getByPath (category)', () => {
    expect(menuMetaUtils.getByPath(menuMetaJson, ['Category1'])).toStrictEqual(menuMetaJson[0].Groups);
  });
  test('getByPath (nested category)', () => {
    expect(menuMetaUtils.getByPath(menuMetaJson, ['Category1', 'Category1.1'])).toStrictEqual(menuMetaJson[0].Groups[0].Groups);
  });
  test('getByPath (nested group)', () => {
    expect(menuMetaUtils.getByPath(menuMetaJson, ['Category1', 'Category1.1', 'Group1.1.1'])).toStrictEqual(menuMetaJson[0].Groups[0].Groups[0].Demos);
  });
  test('getByPath (nested demo)', () => {
    expect(menuMetaUtils.getByPath(menuMetaJson, ['Category1', 'Category1.1', 'Group1.1.1', 'Demo1.1.1.2'])).toStrictEqual(menuMetaJson[0].Groups[0].Groups[0].Demos[1]);
  });
  test('getByPath (error)', () => {
    const path = ['Category1', 'Category1.1', 'Group1.1.1', 'Demo1.1.1.3'];
    const errorMessage = `incorrect path for menuMetaData: ${JSON.stringify(path)}`
    expect(() => menuMetaUtils.getByPath(menuMetaJson, path))
      .toThrow(errorMessage);
  });
  test('getByPath (error nesting demo)', () => {
    const path = ['Category1', 'Category1.1', 'Group1.1.1', 'Demo1.1.1.1', 'smth'];
    const errorMessage = `incorrect path for menuMetaData: ${JSON.stringify(path)}`
    expect(() => menuMetaUtils.getByPath(menuMetaJson, path))
      .toThrow(errorMessage);
  });
});

describe('add functions', () => {
  test('addCategory', () => {
    const name = 'New Category';
    const meta = [];
    const newCategory = {
      Name: name,
      Equivalents: '',
      Groups: [],
    }
    menuMetaUtils.addCategory(meta, name)
    expect(meta).toStrictEqual([newCategory]);
  });
  test('addGroup', () => {
    const name = 'Group3';
    const groups = [{
      Name: 'Group1',
      Demos: [],
    }, {
      Name: 'Group2',
      Demos: [],
    }];
    const meta = [{
      Name: 'Category',
      Groups: [...groups],
    }];

    menuMetaUtils.addGroup(meta, ['Category'], name);

    expect(meta).toStrictEqual([{
      Name: 'Category',
      Groups: [...groups, { Name: name, Equivalents: '', Demos: [] }],
    }]);
  });
  test('addDemo', () => {
    const widgetName = 'Widget';
    const equivalents = 'Demonstration, test';
    const demos = [{
      Title: 'Title 1',
      Name: 'Title1',
    }];

    const meta = [{
      Name: 'Category',
      Groups: [{
        Name: 'Group',
        Demos: [...demos],
      }],
    }];

    menuMetaUtils.addDemo(
      meta,
      ['Category', 'Group'],
      'Test Demo',
      widgetName,
      equivalents
    );

    expect(meta).toStrictEqual([{
      Name: 'Category',
      Groups: [{
        Name: 'Group',
        Demos: [
          ...demos,
          {
            Title: 'Test Demo',
            Name: 'TestDemo',
            Equivalents: equivalents,
            DocUrl: '',
            Widget: widgetName,
            MvcDescription: '',
            NetCoreDescription: '',
            MvcAdditionalFiles: [],
            DemoType: 'Web',
            Badge: 'New',
          },
        ],
      }],
    }]);
  });
});

describe('modules functions', () => {
  test('updateDemoProperties', () => {
    const meta = [{
      Name: 'Category1',
      Groups: [{
        Name: 'Group1',
        Demos: [{
          Title: 'Demo 1',
          Name: 'Demo1',
          Modules: 'module1,module2',
        }],
      }, {
        Name: 'Group2',
        Demos: [{
          Title: 'Demo 2',
          Name: 'Demo2',
        }],
      }]
    }];
    
    menuMetaUtils.updateDemoProperties(
      meta,
      ['Category1', 'Group2', 'Demo2'],
      { path: ['Category1', 'Group1', 'Demo1'] },
    );

    expect(meta).toStrictEqual([{
      Name: 'Category1',
      Groups: [{
        Name: 'Group1',
        Demos: [{
          Title: 'Demo 1',
          Name: 'Demo1',
          Modules: 'module1,module2',
        }],
      }, {
        Name: 'Group2',
        Demos: [{
          Title: 'Demo 2',
          Name: 'Demo2',
          Modules: 'module1,module2',
        }],
      }]
    }]);
  });
  test('updateDemoProperties (no modules)', () => {
    const meta = [{
      Name: 'Category1',
      Groups: [{
        Name: 'Group1',
        Demos: [{
          Title: 'Demo 1',
          Name: 'Demo1',
        }],
      }, {
        Name: 'Group2',
        Demos: [{
          Title: 'Demo 2',
          Name: 'Demo2',
        }],
      }]
    }];
    const testMeta = [ ...meta ];
    
    menuMetaUtils.updateDemoProperties(
      testMeta,
      ['Category1', 'Group2', 'Demo2'],
      { path: ['Category1', 'Group1', 'Demo1'] },
    );

    expect(testMeta).toStrictEqual(meta);
  });



  test('addDemoModules', () => {
    const meta = [{
      Name: 'Category1',
      Groups: [{
        Name: 'Group1',
        Demos: [{
          Title: 'Demo 1',
          Name: 'Demo1',
          Modules: 'module1,module2',
        }],
      }, {
        Name: 'Group2',
        Demos: [{
          Title: 'Demo 2',
          Name: 'Demo2',
        }],
      }]
    }];
    
    menuMetaUtils.addDemoModules(
      meta,
      ['Category1', 'Group2', 'Demo2'],
      ['module3', 'module4'],
    );

    expect(meta).toStrictEqual([{
      Name: 'Category1',
      Groups: [{
        Name: 'Group1',
        Demos: [{
          Title: 'Demo 1',
          Name: 'Demo1',
          Modules: 'module1,module2',
        }],
      }, {
        Name: 'Group2',
        Demos: [{
          Title: 'Demo 2',
          Name: 'Demo2',
          Modules: 'module3,module4',
        }],
      }]
    }])
  });
  test('addDemoModules, ([])', () => {
    const meta = [{
      Name: 'Category1',
      Groups: [{
        Name: 'Group1',
        Demos: [{
          Title: 'Demo 1',
          Name: 'Demo1',
          Modules: 'module1,module2',
        }],
      }, {
        Name: 'Group2',
        Demos: [{
          Title: 'Demo 2',
          Name: 'Demo2',
        }],
      }]
    }];
    const testMeta = [ ...meta ];
    
    menuMetaUtils.addDemoModules(
      testMeta,
      ['Category1', 'Group2', 'Demo2'],
      [],
    );

    expect(testMeta).toStrictEqual(meta);
  });
});
