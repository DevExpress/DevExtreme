import { IProp, IComplexProp } from 'devextreme-internal-tools/integration-data-model';
import {
  collectIndependentEvents,
  collectSubscribableRecursively,
  getComplexOptionType,
  mapSubscribableOption,
  isNestedOptionArray,
  convertToBaseType,
  mapOption,
  extractNestedComponents,
  createPropTyping,
  extractPropTypings,
  mapWidget,
  createCustomTypeResolver,
  ImportOverridesMetadata,
} from './generator';

describe('collectIndependentEvents', () => {
  it('discard dependent events', () => {
    const options: IProp[] = [
      {
        name: 'option1',
        isSubscribable: true,
        isDeprecated: false,
        types: [
          {
            type: 'Function',
            acceptableValues: [],
            isCustomType: true,
          },
        ],
        props: [],
        firedEvents: ['func1'],
      },
      {
        name: 'onOption',
        isSubscribable: false,
        isDeprecated: false,
        types: [
          {
            type: 'Function',
            acceptableValues: [],
            isCustomType: true,
          },
        ],
        props: [],
        firedEvents: [],
      },
      {
        name: 'option3',
        isSubscribable: true,
        isDeprecated: false,
        types: [
          {
            type: 'Function',
            acceptableValues: [],
            isCustomType: true,
          },
          {
            type: 'Number',
            acceptableValues: [],
            isCustomType: true,
          },
        ],
        props: [],
        firedEvents: [],
      },
      {
        name: 'onOption4',
        isSubscribable: true,
        isDeprecated: false,
        types: [
          {
            type: 'Function',
            acceptableValues: [],
            isCustomType: true,
          },
          {
            type: 'Number',
            acceptableValues: [],
            isCustomType: true,
          },
        ],
        props: [],
        firedEvents: ['func1'],
      },
      {
        name: 'option5',
        isSubscribable: true,
        isDeprecated: false,
        types: [
          {
            type: 'Function',
            acceptableValues: [],
            isCustomType: true,
          },
          {
            type: 'Number',
            acceptableValues: [],
            isCustomType: true,
          },
        ],
        props: [],
        firedEvents: [],
      },
      {
        name: 'onSomeOptionChanged',
        isSubscribable: true,
        isDeprecated: false,
        types: [
          {
            type: 'Function',
            acceptableValues: [],
            isCustomType: true,
          },
        ],
        props: [],
        firedEvents: [],
      },
      {
        name: 'onSomeOptionChange',
        isSubscribable: true,
        isDeprecated: false,
        types: [
          {
            type: 'Function',
            acceptableValues: [],
            isCustomType: true,
          },
        ],
        props: [],
        firedEvents: [],
      },
      {
        name: 'onSomeOptionChanged',
        isSubscribable: true,
        isDeprecated: false,
        types: [
          {
            type: 'Function',
            acceptableValues: [],
            isCustomType: true,
          },
          {
            type: 'Number',
            acceptableValues: [],
            isCustomType: true,
          },
        ],
        props: [],
        firedEvents: [],
      },
      {
        name: 'valueChange',
        isSubscribable: true,
        isDeprecated: false,
        types: [
          {
            type: 'Function',
            acceptableValues: [],
            isCustomType: true,
          },
        ],
        props: [],
        firedEvents: [],
      },
      {
        name: 'onSomeValueChanged',
        isSubscribable: true,
        isDeprecated: false,
        types: [
          {
            type: 'Function',
            acceptableValues: [],
            isCustomType: true,
          },
          {
            type: 'Number',
            acceptableValues: [],
            isCustomType: true,
          },
        ],
        props: [],
        firedEvents: [],
      },
    ];
    const independentEvents = collectIndependentEvents(options);
    expect(independentEvents.length).toBe(3);
    expect(independentEvents[0]).toEqual(options[1]);
    expect(independentEvents[1]).toEqual(options[6]);
  });
});

describe('collectSubscribableRecursively', () => {
  it('subscribable options', () => {
    const options: IProp[] = [{
      name: 'option1',
      isSubscribable: true,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    }, {
      name: 'option2',
      isSubscribable: false,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    }, {
      name: 'option3',
      isSubscribable: true,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    }];

    const subscribableOptions = collectSubscribableRecursively(options);
    expect(subscribableOptions.length).toBe(2);
    expect(subscribableOptions[0]).toEqual(options[0]);
    expect(subscribableOptions[1]).toEqual(options[2]);
  });

  it('subscribable nested options', () => {
    const subOption = {
      name: 'subOption',
      isSubscribable: true,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    };
    const options: IProp[] = [{
      name: 'option1',
      isSubscribable: false,
      isDeprecated: false,
      types: [],
      props: [subOption],
      firedEvents: [],
    }, {
      name: 'option2',
      isSubscribable: true,
      isDeprecated: false,
      types: [],
      props: [subOption],
      firedEvents: [],
    }];

    const subscribableOptions = collectSubscribableRecursively(options);
    expect(subscribableOptions.length).toBe(3);
    expect(subscribableOptions[0]).toEqual({
      ...subOption,
      name: 'option1.subOption',
    });
    expect(subscribableOptions[1]).toEqual(options[1]);
    expect(subscribableOptions[2]).toEqual({
      ...subOption,
      name: 'option2.subOption',
    });
  });
});

describe('mapSubscribableOption', () => {
  it('should work with subscribable option', () => {
    expect(mapSubscribableOption({
      name: 'option',
      isSubscribable: true,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    })).toEqual({
      name: 'option',
      isSubscribable: true,
      type: 'any',
    });
  });

  it('should work with non-subscribable option', () => {
    expect(mapSubscribableOption({
      name: 'option',
      isSubscribable: false,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    })).toEqual({
      name: 'option',
      isSubscribable: undefined,
      type: 'any',
    });
  });
});

describe('isNestedOptionArray', () => {
  it('should work', () => {
    expect(isNestedOptionArray({
      name: 'option',
      isSubscribable: true,
      isDeprecated: false,
      types: [{
        type: 'Array',
        acceptableValues: [],
        isCustomType: false,
      }],
      props: [],
      firedEvents: [],
    })).toBe(true);
  });

  it('should return false if "types" is empty array', () => {
    expect(isNestedOptionArray({
      name: 'option',
      isSubscribable: true,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    })).toBe(false);
  });

  it('should return false for non-array type', () => {
    expect(isNestedOptionArray({
      name: 'option',
      isSubscribable: true,
      isDeprecated: false,
      types: [{
        type: 'String',
        acceptableValues: [],
        isCustomType: false,
      }],
      props: [],
      firedEvents: [],
    })).toBe(false);
  });
});

describe('mapOption', () => {
  it('without props', () => {
    const option = {
      name: 'option',
      isSubscribable: false,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    };

    expect(mapOption(option)).toEqual({
      name: 'option',
      type: 'any',
      isSubscribable: undefined,
    });
  });

  it('complex option with types', () => {
    const option = {
      name: 'option',
      isSubscribable: false,
      isDeprecated: false,
      types: [{
        type: 'String',
        acceptableValues: [],
        isCustomType: false,
      }, {
        type: 'Number',
        acceptableValues: [],
        isCustomType: false,
      }, {
        type: 'MyType',
        acceptableValues: [],
        isCustomType: false,
      }],
      props: [{
        name: 'prop1',
        firedEvents: [],
        isSubscribable: false,
        isDeprecated: false,
        props: [],
        types: [{
          type: 'Number',
          acceptableValues: [],
          isCustomType: false,
        }],
      }],
      firedEvents: [],
    };

    expect(mapOption(option)).toEqual({
      isArray: false,
      name: 'option',
      type: 'string | number',
      nested: [{
        isSubscribable: undefined,
        name: 'prop1',
        type: 'number',
      }],
      isSubscribable: undefined,
    });
  });

  it('with props', () => {
    const option = {
      name: 'option',
      isSubscribable: false,
      isDeprecated: false,
      types: [],
      props: [{
        name: 'subOption',
        isSubscribable: false,
        isDeprecated: false,
        types: [],
        props: [],
        firedEvents: [],
      }],
      firedEvents: [],
    };

    expect(mapOption(option)).toEqual({
      name: 'option',
      isSubscribable: undefined,
      nested: option.props.map((p) => mapOption(p)),
      isArray: isNestedOptionArray(option),
    });
  });
});

describe('extractNestedComponents', () => {
  it('should work', () => {
    const options = [{
      isCollectionItem: false,
      name: 'firstOption',
      nesteds: [],
      optionName: 'firstOptionName',
      owners: ['widget', 'secondOption'],
      predefinedProps: {},
      props: [],
      templates: [],
    }, {
      isCollectionItem: false,
      name: 'secondOption',
      nesteds: [],
      optionName: 'secondOptionName',
      owners: [],
      predefinedProps: {},
      props: [],
      templates: [],
    }];
    const nestedComponent = extractNestedComponents(options, 'widget', 'DxWidget');

    expect(nestedComponent[0].className).toBe('FirstOption');
    expect(nestedComponent[0].expectedChildren).toBe(options[0].nesteds);
    expect(nestedComponent[0].owners).toEqual([
      'DxWidget',
      'SecondOption',
    ]);

    expect(nestedComponent[1].className).toBe('SecondOption');
    expect(nestedComponent[1].expectedChildren).toBe(options[1].nesteds);
    expect(nestedComponent[1].owners).toEqual([]);
  });
});

describe('createPropTyping', () => {
  const customTypes = {
    CustomType: {
      name: 'SomeType',
      props: [],
      templates: [],
      types: [{
        type: 'String',
        acceptableValues: [],
        isCustomType: false,
      }],
      module: '',
    },
  };

  it('should return null if option without types', () => {
    const option = {
      name: 'option1',
      isSubscribable: false,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    };

    expect(createPropTyping(option, customTypes)).toEqual(null);
  });

  it('should ignore customTypes if used only regular types', () => {
    const option = {
      name: 'option2',
      isSubscribable: false,
      isDeprecated: false,
      types: [{
        type: 'Array',
        acceptableValues: [],
        isCustomType: false,
      }],
      props: [],
      firedEvents: [],
    };
    const expected = {
      propName: 'option2',
      types: ['array'],
    };

    expect(createPropTyping(option, customTypes)).toEqual(expected);
    expect(createPropTyping(option, {})).toEqual(expected);
  });

  it('should work with custom types', () => {
    const option = {
      name: 'option3',
      isSubscribable: false,
      isDeprecated: false,
      types: [{
        type: 'CustomType',
        acceptableValues: [],
        isCustomType: true,
      }],
      props: [],
      firedEvents: [],
    };

    expect(createPropTyping(option, customTypes)).toEqual({
      propName: 'option3',
      types: ['object', 'string'],
    });
  });
});

describe('extractPropTypings', () => {
  it('should work', () => {
    const options = [{
      name: 'option1',
      isSubscribable: false,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    }, {
      name: 'option2',
      isSubscribable: false,
      isDeprecated: false,
      types: [{
        type: 'Array',
        acceptableValues: [],
        isCustomType: false,
      }],
      props: [],
      firedEvents: [],
    }, {
      name: 'option3',
      isSubscribable: false,
      isDeprecated: false,
      types: [{
        type: 'CustomType',
        acceptableValues: [],
        isCustomType: true,
      }],
      props: [],
      firedEvents: [],
    }];
    const customTypes = {
      CustomType: {
        name: 'SomeType',
        props: [],
        templates: [],
        types: [{
          type: 'String',
          acceptableValues: [],
          isCustomType: false,
        }],
        module: '',
      },
    };

    const expected = [{
      propName: 'option2',
      types: [
        'array',
      ],
    }, {
      propName: 'option3',
      types: [
        'object',
        'string',
      ],
    }];

    expect(extractPropTypings(options, customTypes)).toEqual(expected);
  });
});

describe('mapWidget', () => {
  const rawWidget = {
    complexOptions: [],
    exportPath: 'widget/index',
    hasTranscludedContent: false,
    isEditor: false,
    isExtension: false,
    name: 'testWidget',
    nesteds: [],
    options: [],
    templates: [],
    optionsTypeParams: [],
    reexports: [],
  };

  it('should rename widget', () => {
    const { fileName, component } = mapWidget(
      rawWidget,
      '',
      '',
      '',
      [],
      '',
    );

    expect(component.name).toBe('testWidget');
    expect(fileName).toBe('test-widget.ts');
  });

  it('should build export path', () => {
    const { component } = mapWidget(
      rawWidget,
      '',
      '',
      '',
      [],
      'some-package',
    );

    expect(component.dxExportPath).toBe('some-package/widget/index');
  });

  describe('options', () => {
    const options: IProp[] = [{
      name: 'option1',
      isSubscribable: true,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    }, {
      name: 'option2',
      isSubscribable: false,
      isDeprecated: false,
      types: [],
      props: [],
      firedEvents: [],
    }, {
      name: 'option3',
      isSubscribable: true,
      isDeprecated: false,
      types: [{
        type: 'CustomType',
        acceptableValues: [],
        isCustomType: true,
      }],
      props: [],
      firedEvents: [],
    }];

    const complexOptions: IComplexProp[] = [{
      isCollectionItem: false,
      name: 'complexOption1',
      nesteds: [],
      optionName: 'widgetComplexOption1',
      owners: [],
      predefinedProps: {},
      props: [],
      templates: [],
    }, {
      isCollectionItem: true,
      name: 'complexOption2',
      nesteds: [],
      optionName: 'widgetComplexOption2',
      owners: [],
      predefinedProps: {},
      props: [],
      templates: [],
    }];

    const customTypes = [{
      name: 'CustomType',
      props: [],
      templates: [],
      types: [],
      module: '',
    }];

    const widgetWithOptions = {
      ...rawWidget,
      options,
      complexOptions,
    };

    const widgetWithCustomTypes = {
      ...rawWidget,
      options: [{
        name: 'option1',
        isSubscribable: true,
        isDeprecated: false,
        types: [{
          type: 'CustomTypeWithModule',
          acceptableValues: [],
          isCustomType: true,
        }],
        props: [],
        firedEvents: [],
      },
      {
        name: 'option2',
        isSubscribable: true,
        isDeprecated: false,
        types: [{
          type: 'CustomTypeWithoutModule',
          acceptableValues: [],
          isCustomType: true,
        }],
        props: [],
        firedEvents: [],
      },
      {
        name: 'option3',
        isSubscribable: true,
        isDeprecated: false,
        types: [{
          type: 'CustomTypeWithTypeResolution',
          acceptableValues: [],
          isCustomType: true,
        }],
        props: [],
        firedEvents: [],
      },
      {
        name: 'option4',
        isSubscribable: true,
        isDeprecated: false,
        types: [{
          type: 'CustomTypeWithNameConflict',
          acceptableValues: [],
          isCustomType: true,
        }],
        props: [],
        firedEvents: [],
      },
      {
        name: 'option5',
        isSubscribable: true,
        isDeprecated: false,
        types: [{
          type: 'CustomTypeWithDefaultImport',
          acceptableValues: [],
          isCustomType: true,
        }],
        props: [],
        firedEvents: [],
      },
      {
        name: 'option6',
        isSubscribable: true,
        isDeprecated: false,
        types: [{
          type: 'CustomGenericType',
          acceptableValues: [],
          isCustomType: true,
        }],
        props: [],
        firedEvents: [],
      },
      {
        name: 'optionThatConflictsWithComponent',
        isSubscribable: true,
        isDeprecated: false,
        types: [{
          type: 'ComplexOption1',
          acceptableValues: [],
          isCustomType: true,
        }],
        props: [],
        firedEvents: [],
      }],
    };

    const customTypesWithModules = [{
      name: 'CustomTypeWithModule',
      props: [],
      templates: [],
      types: [],
      module: 'custom/type/module',
    },
    {
      name: 'CustomTypeWithoutModule',
      props: [],
      templates: [],
      types: [],
      module: '',
    },
    {
      name: 'CustomTypeWithTypeResolution',
      props: [],
      templates: [],
      types: [],
      module: '',
    },
    {
      name: 'CustomTypeWithNameConflict',
      props: [],
      templates: [],
      types: [],
      module: '',
    },
    {
      name: 'CustomTypeWithDefaultImport',
      props: [],
      templates: [],
      types: [],
      module: '',
    },
    {
      name: 'CustomGenericType',
      props: [],
      templates: [],
      types: [],
      module: '',
    },
    {
      name: 'ComplexOption1',
      props: [],
      templates: [],
      types: [],
      module: 'complex/option/module',
    }];

    it('should process subscribable options', () => {
      const { component } = mapWidget(
        widgetWithOptions,
        '',
        '',
        '',
        customTypes,
        '',
      );

      expect(component.subscribableOptions).toEqual([{
        name: 'option1',
        isSubscribable: true,
        type: 'any',
      }, {
        name: 'option3',
        isSubscribable: true,
        type: 'any',
      }]);
    });

    it('should process subscribable options with empty import overrides metadata', () => {
      const { component } = mapWidget(
        widgetWithOptions,
        '',
        '',
        '',
        customTypes,
        '',
        {
          generateCustomTypes: true,
          importOverridesMetadata: {},
        },
      );

      expect(component.subscribableOptions).toEqual([{
        name: 'option1',
        isSubscribable: true,
        type: 'any',
      }, {
        name: 'option3',
        isSubscribable: true,
        type: 'CustomType',
      }]);
    });

    it('should process complex options', () => {
      const { component } = mapWidget(
        widgetWithOptions,
        '',
        '',
        '',
        customTypes,
        '',
      );

      expect(component.nestedComponents?.length).toBe(2);
      expect(component.nestedComponents?.[0].className).toBe('ComplexOption1');
      expect(component.nestedComponents?.[0].optionName).toBe('widgetComplexOption1');
      expect(component.nestedComponents?.[1].className).toBe('ComplexOption2');
      expect(component.nestedComponents?.[1].optionName).toBe('widgetComplexOption2');
    });
    it('should resolve name conflicts in complex options', () => {
      const { component, customTypeImports } = mapWidget(
        { ...widgetWithCustomTypes, complexOptions },
        '',
        '',
        '',
        customTypesWithModules,
        '',
        {
          generateCustomTypes: true,
        },
      );
      expect(component.nestedComponents?.length).toBe(2);
      expect(component.nestedComponents?.[0].className).toBe('ComplexOption1');
      expect(customTypeImports!['devextreme/complex/option/module']).toEqual(['ComplexOption1 as ComplexOption1Aliased']);
    });

    it('should resolve name conflicts in complex options with overrides if present', () => {
      const importOverridesMetadata: ImportOverridesMetadata = {
        nameConflictsResolutionNamespaces: {
          ComplexOption1: 'NamespaceForNestedComponentNamesConflict',
        },
      };

      const { component, customTypeImports, wildcardTypeImports } = mapWidget(
        { ...widgetWithCustomTypes, complexOptions },
        '',
        '',
        '',
        customTypesWithModules,
        '',
        {
          generateCustomTypes: true,
          importOverridesMetadata,
        },
      );
      expect(component.nestedComponents?.length).toBe(2);
      expect(component.nestedComponents?.[0].className).toBe('ComplexOption1');
      expect(customTypeImports!['devextreme/complex/option/module']).toBeUndefined();
      expect(wildcardTypeImports).toEqual({ 'devextreme/complex/option/module': 'NamespaceForNestedComponentNamesConflict' });
    });

    it('should process custom types', () => {
      const { component } = mapWidget(
        widgetWithOptions,
        '',
        '',
        '',
        customTypes,
        '',
      );

      expect(component.propTypings).toEqual([{
        propName: 'option3',
        types: ['object'],
      }]);
    });
    it('should process custom types with type resolver with overrides', () => {
      const importOverridesMetadata: ImportOverridesMetadata = {
        importOverrides: {
          CustomTypeWithoutModule: 'overridden/module',
          CustomTypeWithNameConflict: 'another/overridden/module',
        },
        genericTypes: {
          CustomGenericType: {},
        },
        defaultImports: {
          CustomTypeWithDefaultImport: 'module/with/default/import',
        },
        nameConflictsResolutionNamespaces: {
          CustomTypeWithNameConflict: 'NoConflictNamespace',
        },
        typeResolutions: {
          CustomTypeWithTypeResolution: 'CustomTypeWithModule',
        },
      };

      const {
        component, defaultTypeImports, wildcardTypeImports, customTypeImports,
      } = mapWidget(
        widgetWithCustomTypes,
        '',
        '',
        '',
        customTypesWithModules,
        '',
        {
          generateCustomTypes: true,
          importOverridesMetadata,
        },
      );

      const resultOptions = component.subscribableOptions!.reduce(
        (result, option) => {
          result[option.name] = option; return result;
        }, {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any;

      expect(resultOptions.option1.type).toEqual('CustomTypeWithModule');
      expect(resultOptions.option2.type).toEqual('CustomTypeWithoutModule');
      expect(resultOptions.option3.type).toEqual('CustomTypeWithModule');
      expect(resultOptions.option4.type).toEqual('NoConflictNamespace.CustomTypeWithNameConflict');
      expect(resultOptions.option5.type).toEqual('CustomTypeWithDefaultImport');
      expect(resultOptions.option6.type).toEqual('CustomGenericType<any>');
      expect(customTypeImports!['devextreme/custom/type/module']).toEqual(['CustomTypeWithModule']);
      expect(customTypeImports!['overridden/module']).toEqual(['CustomTypeWithoutModule']);
      expect(defaultTypeImports).toEqual({ CustomTypeWithDefaultImport: 'module/with/default/import' });
      expect(wildcardTypeImports).toEqual({ 'another/overridden/module': 'NoConflictNamespace' });
    });
  });
  describe('convertToBaseType', () => {
    const types = ['Object', 'MyType', 'Number', 'String', 'Boolean', 'Any'];
    const expected = ['object', undefined, 'number', 'string', 'boolean', 'any'];

    it('should return base types', () => {
      expect(types.map((t) => convertToBaseType(t))).toEqual(expected);
    });
  });

  describe('getComplexOptionType', () => {
    const types = [{
      type: 'String',
      acceptableValues: [],
      isCustomType: false,
    }, {
      type: 'Number',
      acceptableValues: [],
      isCustomType: false,
    }, {
      type: 'Object',
      acceptableValues: [],
      isCustomType: false,
    }, {
      type: 'MyType',
      acceptableValues: [],
      isCustomType: true,
    },
    ];

    const expected = 'string | number | object';

    it('should return base types', () => {
      expect(getComplexOptionType(types)).toEqual(expected);
    });
  });

  describe('getComplexOptionType with custom type resolver', () => {
    const types = [{
      type: 'String',
      acceptableValues: [],
      isCustomType: false,
    }, {
      type: 'Number',
      acceptableValues: [],
      isCustomType: false,
    }, {
      type: 'Object',
      acceptableValues: [],
      isCustomType: false,
    }, {
      type: 'MyType',
      acceptableValues: [],
      isCustomType: true,
    },
    ];

    const typeResolver = createCustomTypeResolver({}, new Set());
    const expected = 'string | number | object | MyType';

    it('should return base types', () => {
      expect(getComplexOptionType(types, typeResolver)).toEqual(expected);
    });
  });
});
