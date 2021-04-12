/* eslint-disable max-classes-per-file */
import ConfigurationComponent from '../nested-option';
import { OptionsManager } from '../options-manager';
import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import {
  eventHandlers,
  fireOptionChange,
  TestComponent,
  Widget,
  WidgetClass,
} from './test-component';
jest.useFakeTimers();

interface IControlledComponentProps {
  defaultControlledOption?: string;
  controlledOption?: string;
  onControlledOptionChanged?: () => void;
  onIndependentEvent?: () => void;
  everyOption?: number | boolean | null;
  anotherOption?: string;
  complexOption?: Record<string, unknown>;
}

class ControlledComponent extends TestComponent<IControlledComponentProps> {
  protected _defaults = {
    defaultControlledOption: 'controlledOption',
  };
}

class NestedComponent extends ConfigurationComponent<{
  a?: number;
  b?: string;
  c?: string;
  defaultC?: string;
  value?: number;
  onValueChange?: (value: number) => void;
}> {
  public static DefaultsProps = {
    defaultC: 'c',
  };
}

(NestedComponent as any).OptionName = 'nestedOption';

class CollectionNestedComponent extends ConfigurationComponent<{
  a?: number;
  onAChange?: (value: number) => void;
}> {}
(CollectionNestedComponent as any).OptionName = 'items';
(CollectionNestedComponent as any).IsCollectionItem = true;
(CollectionNestedComponent as any).ExpectedChildren = {
  subItems: {
    optionName: 'subItems',
    isCollectionItem: true,
  },
};

class CollectionSubNestedComponent extends ConfigurationComponent<{
  a?: number;
  onAChange?: (value: number) => void;
}> {}
(CollectionSubNestedComponent as any).OptionName = 'subItems';
(CollectionSubNestedComponent as any).IsCollectionItem = true;

class TestComponentWithExpectation<P = any> extends TestComponent<P> {
  protected _expectedChildren = {
    items: {
      optionName: 'items',
      isCollectionItem: true,
    },
  };
}

describe('option update', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  })

   it('calls option method on props update', () => {
     const { rerender } = render(
       <TestComponent />,
     );
     expect(Widget.option.mock.calls.length).toBe(0);

     const sampleProps = { text: '1' };

     rerender(<TestComponent sampleProps={sampleProps}/>,)

     expect(Widget.option.mock.calls.length).toBe(1);
     expect(Object.keys(Widget.option.mock.calls[0][1])[0]).toEqual('text');

     expect(Widget.option.mock.calls[0][1]?.text).toEqual('1');
   });

  it('updates nested collection item', () => {
    const TestContainer = (props: any) => {
      const { value } = props;
      return (
        <TestComponentWithExpectation>
          <CollectionNestedComponent a={value} />
        </TestComponentWithExpectation>
      );
    };

    const { rerender } = render(<TestContainer value={123} />)
    rerender(<TestContainer value={234} />)

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['items[0].a', 234]);
  });

  it('updates sub-nested collection item', () => {
    const TestContainer = (props: any) => {
      const { value } = props;
      return (
        <TestComponentWithExpectation>
          <CollectionNestedComponent>
            <CollectionSubNestedComponent a={value} />
          </CollectionNestedComponent>
        </TestComponentWithExpectation>
      );
    };
    const { rerender } = render(<TestContainer value={123} />)
    rerender(<TestContainer value={234} />)

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['items[0].subItems[0].a', 234]);
  });
});

describe('option control', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  })

  it('binds callback for optionChanged', () => {
    render(
      <ControlledComponent everyOption={123} />,
    );

    expect(eventHandlers).toHaveProperty('optionChanged');
  });

  describe('handler option', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
      cleanup();
    })

    it('is not fired when option changed on props updating', () => {
      const handler = jest.fn();
      const { rerender } = render(
        <ControlledComponent
          controlledOption="controlled"
          onControlledOptionChanged={handler}
        />,
      );
      Widget.option.mockImplementation(
        (name: string) => {
          if (name === 'controlledOption') {
            WidgetClass.mock.calls[0][1].onControlledOptionChanged();
          }
        },
      );
      rerender(<ControlledComponent controlledOption= "changed" />)

      expect(handler.mock.calls.length).toBe(0);

      Widget.option('controlledOption', 'controlled');

      expect(handler.mock.calls.length).toBe(1);
    });

    it('is not fired when option changed on props updating (handler updated)', () => {
      const handler = jest.fn();

      const { rerender } = render(
          <ControlledComponent
            controlledOption="controlled"
            onControlledOptionChanged={jest.fn()}
          />
        );

      Widget.option.mockImplementation(
        (name: string) => {
          if (name === 'controlledOption') {
            Widget.option.mock.calls[0][1]();
          }
        },
      );

      rerender(<ControlledComponent
        onControlledOptionChanged={handler}
      />)

      rerender(<ControlledComponent
        controlledOption="changed"
      />)

      expect(handler.mock.calls.length).toBe(0);

      Widget.option('controlledOption', 'controlled');

      expect(handler.mock.calls.length).toBe(1);
    });

    it('is not updated on other prop updating', () => {
      const controlledOptionChanged = jest.fn();
      const { rerender } = render(
        <ControlledComponent
          anotherOption="abc"
          onControlledOptionChanged={controlledOptionChanged}
        />,
      );

      rerender(
        <ControlledComponent
          anotherOption="def"
          onControlledOptionChanged={controlledOptionChanged}
        />,
      );

      expect(Widget.option.mock.calls.length).toBe(1);
      expect(Widget.option.mock.calls[0]).toEqual(['anotherOption', 'def']);
    });
  });

  [123, false, 0, undefined, null].forEach((value) => {
    it('rolls back controlled simple option', () => {
      render(
        <ControlledComponent everyOption={value} />,
      );

      fireOptionChange('everyOption', 234);
      jest.runAllTimers();

      expect(Widget.option.mock.calls.length).toBe(1);
      expect(Widget.option.mock.calls[0]).toEqual(['everyOption', value]);
    });
  });

  it('rolls back controlled complex option', () => {
    render(
      <ControlledComponent complexOption={{ a: 123, b: 234 }} />,
    );

    fireOptionChange('complexOption', {});
    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['complexOption', { a: 123, b: 234 }]);
  });

  it('rolls back complex option controlled field', () => {

    render(
      <ControlledComponent complexOption={{ a: 123 }} />,
    );

    fireOptionChange('complexOption.a', 234);
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['complexOption.a', 123]);
  });

  it('rolls back one simple option and updates other', () => {
    const { rerender } = render(
      <ControlledComponent everyOption={123} anotherOption="const" />,
    );

    fireOptionChange('anotherOption', 'changed');
    rerender(
      <ControlledComponent everyOption={234}/>,
    );

    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(2);
    expect(Widget.option.mock.calls[0]).toEqual(['everyOption', 234]);
    expect(Widget.option.mock.calls[1]).toEqual(['anotherOption', 'const']);
  });

  it('applies simple option change', () => {
    const { rerender } = render(
      <ControlledComponent everyOption={123} />,
    );

    fireOptionChange('everyOption', 234);
    rerender(
      <ControlledComponent everyOption={234} />,
    )

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['everyOption', 234]);
  });

  it('applies complex option change', () => {
    const { rerender } = render(
      <ControlledComponent complexOption={{ a: 123 }} />,
    );

    fireOptionChange('complexOption.b', 234);
    rerender(
      <ControlledComponent complexOption={{ a: 123, b: 234 }} />,
    )

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['complexOption', { a: 123, b: 234 }]);
  });

  it('does not roll back not controlled simple option', () => {
    render(
      <ControlledComponent />,
    );

    fireOptionChange('everyOption', 123);
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(0);
  });

  it('does not roll back controlled complex option not controlled field', () => {
    render(
      <ControlledComponent complexOption={{ a: 123 }} />,
    );

    fireOptionChange('complexOption.b', 234);
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(0);
  });

  it('does not roll back not controlled complex option', () => {
    render(
      <ControlledComponent />,
    );

    fireOptionChange('complexOption.b', 234);
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(0);
  });
});

describe('option defaults control', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  })

  it('pass default values to widget', () => {
    render(
      <ControlledComponent defaultControlledOption="default" />,
    );

    expect(WidgetClass.mock.calls[0][1].controlledOption).toBe('default');
    expect(WidgetClass.mock.calls[0][1]).not.toHaveProperty('defaultControlledOption');
  });

  it('ignores option with default prefix', () => {
    render(
      <ControlledComponent defaultControlledOption="default" />,
    );

    fireOptionChange('controlledOption', 'changed');
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(0);
  });

  it('ignores 3rd-party changes in default props', () => {
    const { rerender } = render(
      <ControlledComponent defaultControlledOption="default" />,
    );
    rerender(
      <ControlledComponent defaultControlledOption="changed" />,
    )

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(0);
  });
});

describe('cfg-component option control', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  })

  it('rolls cfg-component option value back', () => {
    render(
      <ControlledComponent>
        <NestedComponent a={123} />
      </ControlledComponent>,
    );

    fireOptionChange('nestedOption.a', 234);
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['nestedOption.a', 123]);
  });

  it('rolls nested collection value back', () => {
    render(
      <TestComponentWithExpectation>
        <CollectionNestedComponent a={1} />
        <CollectionNestedComponent a={2} />
      </TestComponentWithExpectation>,
    );

    fireOptionChange('items', []);
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['items', [{ a: 1 }, { a: 2 }]]);
  });

  it('rolls nested collection item value back', () => {
    render(
      <TestComponentWithExpectation>
        <CollectionNestedComponent a={1} />
        <CollectionNestedComponent a={2} />
      </TestComponentWithExpectation>,
    );

    fireOptionChange('items[0]', { a: 3 });
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['items[0].a', 1]);
  });

  it('rolls cfg-component option value if parent object changes another field', () => {
    render(
      <ControlledComponent>
        <NestedComponent a={123} />
      </ControlledComponent>,
    );

    fireOptionChange('nestedOption', { b: 'abc' });
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['nestedOption.a', 123]);
  });

  it('rolls cfg-component option value and preserves parent object', () => {
    render(
      <ControlledComponent>
        <NestedComponent a={123} />
      </ControlledComponent>,
    );

    fireOptionChange('nestedOption', { a: 456, b: 'abc' });
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['nestedOption.a', 123]);
  });

  it('rolls cfg-component option value back if value has no changes', () => {
    const TestContainer = (props: any) => {
      const { value } = props;
      return (
        <ControlledComponent>
          <NestedComponent a={value} b="const" />
        </ControlledComponent>
      );
    };

    const { rerender } = render(<TestContainer value={123} />);

    fireOptionChange('nestedOption.b', 'changed');
    rerender(<TestContainer value={234} />)

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(2);
    expect(Widget.option.mock.calls[0]).toEqual(['nestedOption.a', 234]);
    expect(Widget.option.mock.calls[1]).toEqual(['nestedOption.b', 'const']);
  });

  it('apply cfg-component option change if value really change', () => {
    const TestContainer = (props: any) => {
      const { value } = props;
      return (
        <ControlledComponent>
          <NestedComponent a={value} b="const" />
        </ControlledComponent>
      );
    };

    const { rerender } = render(<TestContainer value={123} />);
    fireOptionChange('nestedOption.a', 234);

    rerender(<TestContainer value={234} />)

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['nestedOption.a', 234]);
  });

  it('does not control not specified cfg-component option', () => {
    render(
      <ControlledComponent>
        <NestedComponent a={123} />
      </ControlledComponent>,
    );

    fireOptionChange('nestedOption.b', 'abc');
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(0);
  });
});

describe('cfg-component option defaults control', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  })

  it('pass nested default values to widget', () => {
    render(
      <ControlledComponent>
        <NestedComponent defaultC="default" />
      </ControlledComponent>,
    );

    expect(WidgetClass.mock.calls[0][1].nestedOption.c).toBe('default');
    expect(WidgetClass.mock.calls[0][1].nestedOption).not.toHaveProperty('defaultC');
  });

  it('does not pass default values to widget if controlledOption set', () => {
    render(
      <ControlledComponent defaultControlledOption="default" controlledOption="controlled" />,
    );

    expect(Widget.option.mock.calls.length).toBe(0);
    expect(WidgetClass.mock.calls[0][1].controlledOption).toBe('controlled');
    expect(WidgetClass.mock.calls[0][1]).not.toHaveProperty('defaultControlledOption');
  });

  it('ignores cfg-component option with default prefix', () => {
    render(
      <ControlledComponent>
        <NestedComponent defaultC="default" />
      </ControlledComponent>,
    );

    fireOptionChange('nestedOption.c', 'changed');
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(0);
  });

  it('ignores 3rd-party changes in nested default props', () => {
    const TestContainer = (props: any) => {
      const { optionDefValue } = props;
      return (
        <ControlledComponent>
          <NestedComponent defaultC={optionDefValue} />
        </ControlledComponent>
      );
    };

    const { rerender } = render(<TestContainer optionDefValue="default" />)
    rerender(<TestContainer optionDefValue="changed" />)

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(0);
  });

  it('ignores 3rd-party changes in nested default props if parent object changes', () => {
    render(
      <ControlledComponent>
        <NestedComponent defaultC="default" />
      </ControlledComponent>,
    );

    fireOptionChange('nestedOption', { a: 456, b: 'abc' });
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(0);
  });

  it('does not pass nested default values to widget if controlledOption set', () => {
    render(
      <ControlledComponent>
        <NestedComponent defaultC="default" c="controlled" />
      </ControlledComponent>,
    );

    expect(Widget.option.mock.calls.length).toBe(0);
    expect(WidgetClass.mock.calls[0][1].nestedOption.c).toBe('controlled');
    expect(WidgetClass.mock.calls[0][1].nestedOption).not.toHaveProperty('defaultC');
  });
});

describe('mutation detection', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  })

  const expectNoPropsUpdate = () => {
    expect(Widget.option.mock.calls.length).toBe(0);
    expect(Widget.beginUpdate.mock.calls.length).toBe(0);
    expect(Widget.endUpdate.mock.calls.length).toBe(0);
  };

  const expectPropsUpdated = (expectedPath: string, value: any) => {
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.beginUpdate.mock.calls.length).toBe(1);
    expect(Widget.endUpdate.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0][0]).toEqual(expectedPath);
    expect(Widget.option.mock.calls[0][1]).toEqual(value);
  };

  it('prevents update if no option changed', () => {
    const { rerender } = render(
      <TestComponent prop="abc" />,
    );

    rerender(
      <TestComponent prop="abc" />,
    );

    expectNoPropsUpdate();
  });

  it('prevents update if array-option mutated', () => {
    const arr = [1, 2, 3];
    const { rerender } = render(
      <TestComponent prop={arr} />,
    );

    arr[0] = 123;
    rerender(
      <TestComponent prop={arr} />,
    )

    expectNoPropsUpdate();
  });

  it('prevents update if object-option mutated', () => {
    const obj = {
      field: 123,
    };
    const { rerender } = render(
      <TestComponent prop={obj} />,
    );

    obj.field = 456;
    rerender(
      <TestComponent prop={obj} />,
    )

    expectNoPropsUpdate();
  });

  it('triggers update if object-option replaced', () => {
    const { rerender } = render(
      <TestComponent prop={[1, 2, 3]} />,
    );

    rerender(
      <TestComponent prop={[1, 2, 3, 4]} />,
    )

    expectPropsUpdated('prop', [1, 2, 3, 4]);
  });

  it('triggers update if option added', () => {
    const { rerender } = render(
      <TestComponent prop="123" />,
    );

    rerender(
      <TestComponent prop="123" anotherProp={456} />,
    )

    expectPropsUpdated('anotherProp', 456);
  });
});

describe('onXXXChange', () => {
  describe('subscribable options', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
      cleanup();
    })

    beforeAll(() => {
      jest.spyOn(
        OptionsManager.prototype as OptionsManager & { isOptionSubscribable: () => boolean; },
        'isOptionSubscribable',
      )
        .mockImplementation(() => true);
    });

    it('is not called on create', () => {
      const onPropChange = jest.fn();
      render(
        <TestComponent
          text="0"
          onTextChange={onPropChange}
        />,
      );

      expect(onPropChange).toHaveBeenCalledTimes(0);
    });

    it('is called on update', () => {
      const onPropChange = jest.fn();
      render(
        <TestComponent
          text="0"
          onTextChange={onPropChange}
        />,
      );

      fireOptionChange('text', '1');
      expect(onPropChange).toHaveBeenCalledTimes(1);
    });

    it('is called on component changes controlled option', () => {
      const onPropChange = jest.fn();
      const { rerender } = render(
        <TestComponent
          text="0"
          onTextChange={onPropChange}
        />,
      );
      expect(onPropChange).not.toBeCalled();

      const sampleProps = { text: '1' };
      rerender(
        <TestComponent
          {...sampleProps}
          onTextChange={onPropChange}
        />,
      )
      expect(onPropChange).not.toBeCalled();

      fireOptionChange('text', '2');
      expect(onPropChange).toHaveBeenCalledTimes(1);
      expect(onPropChange).toBeCalledWith('2');

      fireOptionChange('text', '3');
      expect(onPropChange).toHaveBeenCalledTimes(2);
      expect(onPropChange).toBeCalledWith('3');
    });

     it('is not called if received value is being modified', () => {
      const ref = React.createRef() as React.RefObject<TestComponent>;
      const onPropChange = jest.fn();
      const defaultProps = {
        text:"0",
        onTextChange:onPropChange,
        ref
      }

       const { rerender } = render(
         <TestComponent
           {...defaultProps}
         />
       );

       onPropChange.mockImplementation((value) => {
         rerender(
           <TestComponent
             {...defaultProps}
             text={`X${value}`}
             />,
         )
       });


       fireOptionChange('text', '2');

       expect(onPropChange).toHaveBeenCalledTimes(1);

       expect(ref.current?.props.text).toBe("X2");
       fireOptionChange('text', 'X22');
       expect(onPropChange).toHaveBeenCalledTimes(2);
       expect(ref.current?.props.text).toBe("XX22");

     });

    it('is not called if new value is equal', () => {
      const onPropChange = jest.fn();
      render(
        <TestComponent
          text="0"
          onTextChange={onPropChange}
        />,
      );

      fireOptionChange('text', '0');
      expect(onPropChange).toHaveBeenCalledTimes(0);
    });

    it('is called on component changes complex option', () => {
      const onPropChange = jest.fn();
      render(
        <TestComponent
          complexOption={{ text: '0', onTextChange: onPropChange }}
        />,
      );
      expect(onPropChange).not.toBeCalled();

      fireOptionChange('complexOption.text', '1');
      expect(onPropChange).toHaveBeenCalledTimes(1);
      expect(onPropChange).toBeCalledWith('1');
    });

    it('is called on component changes array option', () => {
      const onFirstPropChange = jest.fn();
      const onSecondPropChange = jest.fn();
      render(
        <TestComponent
          arrayOption={[
            { text: '0', onTextChange: onFirstPropChange },
            { text: '0', onTextChange: onSecondPropChange },
          ]}
        />,
      );
      expect(onFirstPropChange).not.toBeCalled();
      expect(onSecondPropChange).not.toBeCalled();

      fireOptionChange('arrayOption[0].text', '1');
      expect(onFirstPropChange).toHaveBeenCalledTimes(1);
      expect(onSecondPropChange).not.toBeCalled();
      expect(onFirstPropChange).toHaveBeenCalledWith('1');

      fireOptionChange('arrayOption[1].text', '2');
      expect(onFirstPropChange).toHaveBeenCalledTimes(1);
      expect(onSecondPropChange).toHaveBeenCalledTimes(1);
      expect(onSecondPropChange).toHaveBeenCalledWith('2');
    });

    it('is called on nested option changed', () => {
      const onNestedPropChange = jest.fn();
      const onSubNestedPropChange = jest.fn();
      const onCollectionPropChange = jest.fn();
      const onSubCollectionPropChange = jest.fn();
      render(
        <TestComponent>
          <NestedComponent
            value={0}
            onValueChange={onNestedPropChange}
          />
          <CollectionNestedComponent
            a={0}
          />
          <CollectionNestedComponent
            a={0}
            onAChange={onCollectionPropChange}
          >
            <CollectionSubNestedComponent
              a={0}
              onAChange={onSubCollectionPropChange}
            />
            <NestedComponent
              value={0}
              onValueChange={onSubNestedPropChange}
            />
          </CollectionNestedComponent>
        </TestComponent>,
      );

      fireOptionChange('items[1].a', 1);
      expect(onCollectionPropChange).toHaveBeenCalledTimes(1);
      expect(onCollectionPropChange).toBeCalledWith(1);

      fireOptionChange('items[1].subItems[0].a', 2);
      expect(onSubCollectionPropChange).toHaveBeenCalledTimes(1);
      expect(onSubCollectionPropChange).toBeCalledWith(2);

      fireOptionChange('nestedOption.value', '3');
      expect(onNestedPropChange).toHaveBeenCalledTimes(1);
      expect(onNestedPropChange).toBeCalledWith('3');

      fireOptionChange('items[1].nestedOption.value', '4');
      expect(onSubNestedPropChange).toHaveBeenCalledTimes(1);
      expect(onSubNestedPropChange).toBeCalledWith('4');
    });

    it('throws an error if handler is not a function', () => {
      render(
        <TestComponent
          text="0"
          onTextChange="someFunction"
        />,
      );

      expect(() => fireOptionChange('text', '1')).toThrow();
    });
  });

  describe('non-subscribable options', () => {
    beforeAll(() => {
      jest.spyOn(
        OptionsManager.prototype as OptionsManager & { isOptionSubscribable: () => boolean; },
        'isOptionSubscribable',
      )
        .mockImplementation(() => false);
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
      cleanup();
    })

    it('is not called on create', () => {
      const onPropChange = jest.fn();
      render(
        <TestComponent
          text="0"
          onTextChange={onPropChange}
        />,
      );

      expect(onPropChange).toHaveBeenCalledTimes(0);
    });

    it('is not called on update', () => {
      const onPropChange = jest.fn();
      render(
        <TestComponent
          text="0"
          onTextChange={onPropChange}
        />,
      );

      fireOptionChange('text', '1');
      expect(onPropChange).toHaveBeenCalledTimes(0);
    });
  });

  describe('independent events', () => {
    beforeAll(() => {
      jest.spyOn(
        OptionsManager.prototype as OptionsManager & { isIndependentEvent: () => boolean; },
        'isIndependentEvent',
      )
        .mockImplementation(() => true);
    });
    
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
      cleanup();
    })

    it('is not called on create', () => {
      const onPropChange = jest.fn();
      render(
        <TestComponent
          text="0"
          onTextChange={onPropChange}
        />,
      );

      expect(onPropChange).toHaveBeenCalledTimes(0);
    });

    it('it is fired on outher change', () => {
      const ref = React.createRef() as React.RefObject<HTMLDivElement>;
      const onPropChange = jest.fn();
      const { rerender } = render(
        <TestComponent
          text="0"
          onTextChange={onPropChange}
        >
          <div ref={ref} />
        </TestComponent>,
      );
      expect(onPropChange).not.toBeCalled();
      Widget.option.mockImplementation(
        (name: string) => {
          if (name === 'text') {
            WidgetClass.mock.calls[0][1].onTextChange();
          }
        },
      );
      const sampleProps = { text: '1' };
      rerender(
        <TestComponent
          {...sampleProps}
        />,
      )
      expect(onPropChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('dependent events', () => {
    beforeAll(() => {
      jest.spyOn(
        OptionsManager.prototype as OptionsManager & { isIndependentEvent: () => boolean; },
        'isIndependentEvent',
      )
        .mockImplementation(() => false);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
      cleanup();
    })

    it('it is fired on outher change', () => {
      const onPropChange = jest.fn();
      const { rerender } = render(
        <TestComponent
          text="0"
          onTextChange={onPropChange}
        />,
      );
      expect(onPropChange).not.toBeCalled();
      Widget.option.mockImplementation(
        (name: string) => {
          if (name === 'text') {
            WidgetClass.mock.calls[0][1].onTextChange();
          }
        },
      );
      const sampleProps = { text: '1' };
      rerender(
        <TestComponent
          text="0"
          onTextChange={onPropChange}
          sampleProps={sampleProps}
        />,      )
      expect(onPropChange).toHaveBeenCalledTimes(0);
    });
  });
});
