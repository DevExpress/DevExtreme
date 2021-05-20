import { IProp, IComplexProp } from './integration-data-model';
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
} from './generator';

describe('collectIndependentEvents', () => {
  it('discard dependent events', () => {
    const options: IProp[] = [
      {
        name: 'option1',
        isSubscribable: true,
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
    expect(independentEvents.length).toBe(2);
    expect(independentEvents[0]).toEqual(options[1]);
    expect(independentEvents[1]).toEqual(options[6]);
  });
});

describe('collectSubscribableRecursively', () => {
  it('subscribable options', () => {
    const options: IProp[] = [{
      name: 'option1',
      isSubscribable: true,
      types: [],
      props: [],
      firedEvents: [],
    }, {
      name: 'option2',
      isSubscribable: false,
      types: [],
      props: [],
      firedEvents: [],
    }, {
      name: 'option3',
      isSubscribable: true,
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
      types: [],
      props: [],
      firedEvents: [],
    };
    const options: IProp[] = [{
      name: 'option1',
      isSubscribable: false,
      types: [],
      props: [subOption],
      firedEvents: [],
    }, {
      name: 'option2',
      isSubscribable: true,
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
      types: [],
      props: [],
      firedEvents: [],
    })).toBe(false);
  });

  it('should return false for non-array type', () => {
    expect(isNestedOptionArray({
      name: 'option',
      isSubscribable: true,
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
        type: 'any',
      }],
      isSubscribable: undefined,
    });
  });

  it('with props', () => {
    const option = {
      name: 'option',
      isSubscribable: false,
      types: [],
      props: [{
        name: 'subOption',
        isSubscribable: false,
        types: [],
        props: [],
        firedEvents: [],
      }],
      firedEvents: [],
    };

    expect(mapOption(option)).toEqual({
      name: 'option',
      isSubscribable: undefined,
      nested: option.props.map(mapOption),
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
    },
  };

  it('should return null if option without types', () => {
    const option = {
      name: 'option1',
      isSubscribable: false,
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
      types: [],
      props: [],
      firedEvents: [],
    }, {
      name: 'option2',
      isSubscribable: false,
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
      types: [],
      props: [],
      firedEvents: [],
    }, {
      name: 'option2',
      isSubscribable: false,
      types: [],
      props: [],
      firedEvents: [],
    }, {
      name: 'option3',
      isSubscribable: true,
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
    }];

    const widgetWithOptions = {
      ...rawWidget,
      options,
      complexOptions,
    };

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
});
