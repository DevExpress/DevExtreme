/* eslint-disable max-classes-per-file */
import { Component } from '../component';
import ConfigurationComponent from '../nested-option';
import { mount, React } from './setup';
import { TestComponent, Widget, WidgetClass } from './test-component';

class NestedComponent extends ConfigurationComponent<{ a: number }> {
  public static OptionName = 'option';
}

class NestedComponentWithPredfeinedProps extends ConfigurationComponent<{ a: number }> {
  public static OptionName = 'option';

  public static PredefinedProps = {
    predefinedProp: 'predefined-value',
  };
}

class CollectionNestedWithPredfeinedProps1 extends ConfigurationComponent<{ a: number }> {
  public static IsCollectionItem = true;

  public static OptionName = 'option';

  public static PredefinedProps = {
    predefinedProp: 'predefined-value-1',
  };
}

class CollectionNestedWithPredfeinedProps2 extends ConfigurationComponent<{ a: number }> {
  public static IsCollectionItem = true;

  public static OptionName = 'option';

  public static PredefinedProps = {
    predefinedProp: 'predefined-value-2',
  };
}

class SubNestedComponent extends ConfigurationComponent<{ d: string }> {
  public static OptionName = 'subOption';
}

class AnotherSubNestedComponent extends ConfigurationComponent<{ e: string }> {
  public static OptionName = 'anotherSubOption';
}

class AnotherNestedComponent extends ConfigurationComponent<{ b: string }> {
  public static OptionName = 'anotherOption';
}

class CollectionNestedComponent extends ConfigurationComponent<{ c?: number, d?: string }> {
  public static IsCollectionItem = true;

  public static OptionName = 'itemOptions';
}

class CollectionSubNestedComponent extends ConfigurationComponent<{ c?: number, d?: string }> {
  public static IsCollectionItem = true;

  public static OptionName = 'subItemsOptions';
}

describe('nested option', () => {
  it('is pulled', () => {
    mount(
      <TestComponent>
        <NestedComponent a={123} />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 123,
      },
    });
  });

  it('is not pulled during conditional rendering', () => {
    mount(
      <TestComponent>
        <NestedComponent a={123} />
        {false && <NestedComponent a={456} />}
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 123,
      },
    });
  });

  it('is pulled (several options)', () => {
    mount(
      <TestComponent>
        <NestedComponent a={123} />
        <AnotherNestedComponent b="abc" />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 123,
      },
      anotherOption: {
        b: 'abc',
      },
    });
  });

  it('is pulled overriden if not a collection item', () => {
    mount(
      <TestComponent>
        <NestedComponent a={123} />
        <NestedComponent a={456} />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 456,
      },
    });
  });

  it('is pulled as a collection item', () => {
    mount(
      <TestComponent>
        <CollectionNestedComponent c={123} d="abc" />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      itemOptions: [
        { c: 123, d: 'abc' },
      ],
    });
  });

  it('is pulled as a collection item (several items)', () => {
    mount(
      <TestComponent>
        <CollectionNestedComponent c={123} d="abc" />
        <CollectionNestedComponent c={456} />
        <CollectionNestedComponent d="def" />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      itemOptions: [
        { c: 123, d: 'abc' },
        { c: 456 },
        { d: 'def' },
      ],
    });
  });

  it('is pulled according to expectations', () => {
    class TestComponentWithExpectation<P = any> extends Component<P> {
      protected _expectedChildren = {
        option: {
          optionName: 'expectedItemOptions',
          isCollectionItem: true,
        },
        itemOptions: {
          optionName: 'expectedOption',
          isCollectionItem: false,
        },
      };

      protected _WidgetClass = WidgetClass;
    }

    mount(
      <TestComponentWithExpectation>
        <NestedComponent a={123} />
        <CollectionNestedComponent c={456} d="abc" />
      </TestComponentWithExpectation>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      expectedItemOptions: [
        { a: 123 },
      ],
      expectedOption: { c: 456, d: 'abc' },
    });
  });

  it('is pulled with predefined props', () => {
    mount(
      <TestComponent>
        <NestedComponentWithPredfeinedProps a={123} />
      </TestComponent>,
    );

    const actualProps = WidgetClass.mock.calls[0][1];
    expect(actualProps.option).toHaveProperty('predefinedProp');
    expect(actualProps.option.predefinedProp).toBe('predefined-value');
  });

  it('is pulled with predefined props (several)', () => {
    mount(
      <TestComponent>
        <CollectionNestedWithPredfeinedProps1 a={123} />
        <CollectionNestedWithPredfeinedProps2 a={456} />
      </TestComponent>,
    );

    const actualProps = WidgetClass.mock.calls[0][1];
    expect(actualProps.option).toEqual([
      { predefinedProp: 'predefined-value-1', a: 123 },
      { predefinedProp: 'predefined-value-2', a: 456 },
    ]);
  });

  it('is pulled as a collection item after update', () => {
    const component = mount(
      <TestComponent>
        <CollectionNestedComponent key={1} c={123} d="abc" />
        <CollectionNestedComponent key={2} c={456} />
        <CollectionNestedComponent key={3} d="def" />
      </TestComponent>,
    );
    component.setProps({
      children: [
        <CollectionNestedComponent key={1} c={123} d="abc" />,
        <CollectionNestedComponent key={2} c={999} />,
        <CollectionNestedComponent key={3} d="def" />,
      ],
    });
    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['itemOptions[1].c', 999]);
  });

  it('is pulled after update', () => {
    const TestContainer = (props: any) => {
      const { value } = props;
      return (
        <TestComponent>
          <NestedComponent a={value} />
        </TestComponent>
      );
    };
    mount(<TestContainer value={123} />)
      .setProps({ value: 456 });

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.a', 456]);
  });

  it('is pulled after update without rubbish', () => {
    const component = mount(
      <TestComponent>
        <NestedComponent a={123} />
      </TestComponent>,
    );

    component.setProps({ children: <NestedComponent a={456} /> });
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.a', 456]);
  });

  it('updates widget option when collection item added', () => {
    const TestContainer = (props: any) => {
      const { children } = props;
      const nesteds = children.map((child: any) => (
        <CollectionNestedComponent c={child.c} d={child.d} key={child.key} />
      ));

      return (<TestComponent>{nesteds}</TestComponent>);
    };

    const children = [
      { c: 123, d: 'abc', key: 1 },
      { c: 456, d: 'def', key: 2 },
    ];
    mount(<TestContainer>{children}</TestContainer>)
      .setProps({
        children: [
          { c: 123, d: 'abc', key: 1 },
          { c: 456, d: 'def', key: 2 },
          { c: 789, d: 'ghi', key: 3 },
        ],
      });

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['itemOptions', [
      { c: 123, d: 'abc' },
      { c: 456, d: 'def' },
      { c: 789, d: 'ghi' },
    ]]);
  });

  it('updates widget option when collection item removed', () => {
    const TestContainer = (props: any) => {
      const { children } = props;
      const nesteds = children.map((child: any) => (
        <CollectionNestedComponent c={child.c} d={child.d} key={child.key} />
      ));

      return (<TestComponent>{nesteds}</TestComponent>);
    };

    const children = [
      { c: 123, d: 'abc', key: 1 },
      { c: 456, d: 'def', key: 2 },
    ];
    mount(<TestContainer>{children}</TestContainer>)
      .setProps({
        children: [
          { c: 123, d: 'abc', key: 1 },
        ],
      });

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['itemOptions', [
      { c: 123, d: 'abc' },
    ]]);
  });
});

describe('nested sub-option', () => {
  it('is pulled', () => {
    mount(
      <TestComponent>
        <NestedComponent a={123}>
          <SubNestedComponent d="abc" />
        </NestedComponent>
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 123,
        subOption: {
          d: 'abc',
        },
      },
    });
  });

  it('is pulled (several options)', () => {
    mount(
      <TestComponent>
        <NestedComponent a={123}>
          <SubNestedComponent d="abc" />
          <AnotherSubNestedComponent e="def" />
        </NestedComponent>
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 123,
        subOption: {
          d: 'abc',
        },
        anotherSubOption: {
          e: 'def',
        },
      },
    });
  });

  it('is pulled overriden if not a collection item', () => {
    mount(
      <TestComponent>
        <NestedComponent a={123}>
          <SubNestedComponent d="abc" />
          <SubNestedComponent d="def" />
        </NestedComponent>
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 123,
        subOption: {
          d: 'def',
        },
      },
    });
  });

  it('is pulled as a collection item', () => {
    mount(
      <TestComponent>
        <NestedComponent a={123}>
          <CollectionSubNestedComponent c={123} d="abc" />
        </NestedComponent>
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 123,
        subItemsOptions: [
          { c: 123, d: 'abc' },
        ],
      },
    });
  });

  it('is pulled as a collection item (several items)', () => {
    mount(
      <TestComponent>
        <NestedComponent a={123}>
          <CollectionSubNestedComponent c={123} d="abc" />
          <CollectionSubNestedComponent c={456} />
          <CollectionSubNestedComponent d="def" />
        </NestedComponent>
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 123,
        subItemsOptions: [
          { c: 123, d: 'abc' },
          { c: 456 },
          { d: 'def' },
        ],
      },
    });
  });

  it('is pulled as a collection item after update inside another option', () => {
    const component = mount(
      <TestComponent>
        <NestedComponent a={123}>
          <CollectionSubNestedComponent key={1} c={123} d="abc" />
          <CollectionSubNestedComponent key={2} c={456} />
          <CollectionSubNestedComponent key={3} d="def" />
        </NestedComponent>
      </TestComponent>,
    );
    component.setProps({
      children: (
        <NestedComponent a={123}>
          <CollectionSubNestedComponent key={1} c={123} d="abc" />
          <CollectionSubNestedComponent key={2} c={999} />
          <CollectionSubNestedComponent key={3} d="def" />
        </NestedComponent>
      ),
    });
    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.subItemsOptions[1].c', 999]);
  });

  it('is pulled after update', () => {
    const TestContainer = (props: any) => {
      const { value } = props;
      return (
        <TestComponent>
          <NestedComponent a={123}>
            <SubNestedComponent d={value} />
          </NestedComponent>
        </TestComponent>
      );
    };

    mount(<TestContainer value="abc" />)
      .setProps({
        value: 'def',
      });

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.subOption.d', 'def']);
  });

  it('is pulled according to expectations', () => {
    class NestedComponentWithExpectations extends ConfigurationComponent<{ a: number }> {
      public static OptionName = 'option';

      public static ExpectedChildren = {
        subOption: {
          optionName: 'expectedSubItemOptions',
          isCollectionItem: true,
        },
        subItemsOptions: {
          optionName: 'expectedSubOption',
          isCollectionItem: false,
        },
      };
    }

    mount(
      <TestComponent>
        <NestedComponentWithExpectations a={123}>
          <SubNestedComponent d="abc" />
          <CollectionSubNestedComponent c={456} d="def" />
        </NestedComponentWithExpectations>
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 123,
        expectedSubItemOptions: [
          { d: 'abc' },
        ],
        expectedSubOption: { c: 456, d: 'def' },
      },
    });
  });
});

const ComponentWithConditionalOption = (props: { enableOption: boolean }) => {
  const { enableOption } = props;
  return (
    <TestComponent>
      {enableOption && <NestedComponent a={1} />}
    </TestComponent>
  );
};

describe('conditional rendering', () => {
  it('adds option', () => {
    const component = mount(
      <ComponentWithConditionalOption enableOption={false} />,
    );

    component.setProps({ enableOption: true });

    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option', { a: 1 }]);
  });

  it('removes option', () => {
    const component = mount(
      <ComponentWithConditionalOption enableOption />,
    );

    component.setProps({ enableOption: false });

    expect(Widget.resetOption.mock.calls.length).toBe(1);
    expect(Widget.resetOption.mock.calls[0]).toEqual(['option']);
  });
});
