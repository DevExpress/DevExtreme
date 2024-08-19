/* eslint-disable max-classes-per-file */
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { memo } from 'react';
import { Component, IHtmlOptions, NestedComponentMeta } from '../component';
import ConfigurationComponent from '../nested-option';
import { TestComponent, Widget, WidgetClass } from './test-component';

jest.useFakeTimers();

const NestedComponent = memo(function NestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ a: number } & React.PropsWithChildren>
      elementDescriptor={{
        OptionName: 'option',
      }}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

NestedComponent.componentType = 'option';

const NestedComponentWithPredfeinedProps = memo(function NestedComponentWithPredfeinedProps(props: any) {
  return (
    <ConfigurationComponent<{ a: number } & React.PropsWithChildren>
      elementDescriptor={{
        OptionName: 'option',
        PredefinedProps: {
          predefinedProp: 'predefined-value',
        },
      }}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

NestedComponentWithPredfeinedProps.componentType = 'option';

const CollectionNestedWithPredfeinedProps1 = memo(function CollectionNestedWithPredfeinedProps1(props: any) {
  return (
    <ConfigurationComponent<{ a: number }>
      elementDescriptor={{
        IsCollectionItem: true,
        OptionName: 'option',
        PredefinedProps: {
          predefinedProp: 'predefined-value-1',
        },
      }}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

CollectionNestedWithPredfeinedProps1.componentType = 'option';

const CollectionNestedWithPredfeinedProps2 = memo(function CollectionNestedWithPredfeinedProps2(props: any) {
  return (
    <ConfigurationComponent<{ a: number }>
      elementDescriptor={{
        IsCollectionItem: true,
        OptionName: 'option',
        PredefinedProps: {
          predefinedProp: 'predefined-value-2',
        },
      }}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

CollectionNestedWithPredfeinedProps2.componentType = 'option';

const SubNestedComponent = memo(function SubNestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ d: string }>
      elementDescriptor={{
        OptionName: 'subOption',
      }}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

SubNestedComponent.componentType = 'option';

const AnotherSubNestedComponent = memo(function AnotherSubNestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ e: string }>
      elementDescriptor={{
        OptionName: 'anotherSubOption',
      }}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

AnotherSubNestedComponent.componentType = 'option';

const AnotherNestedComponent = memo(function AnotherNestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ b: string }>
      elementDescriptor={{
        OptionName: 'anotherOption',
      }}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

AnotherNestedComponent.componentType = 'option';

const CollectionNestedComponent = memo(function CollectionNestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ c?: number; d?: string }>
      elementDescriptor={{
        OptionName: 'itemOptions',
        IsCollectionItem: true,
      }}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

CollectionNestedComponent.componentType = 'option';

const CollectionSubNestedComponent = memo(function CollectionSubNestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ c?: number; d?: string }>
      elementDescriptor={{
        OptionName: 'subItemsOptions',
        IsCollectionItem: true,
      }}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

CollectionSubNestedComponent.componentType = 'option';

describe('nested option', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });
  it('is pulled', () => {
    render(
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
    render(
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
    render(
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
    render(
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
    render(
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
    render(
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
    const TestComponentWithExpectation = memo(function TestComponentWithExpectation(props: any) {
      return (
        <Component<any & IHtmlOptions>
          expectedChildren={{
            option: {
              optionName: 'expectedItemOptions',
              isCollectionItem: true,
            },
            itemOptions: {
              optionName: 'expectedOption',
              isCollectionItem: false,
            },
          }}
          WidgetClass={WidgetClass}
          {...props}
        />
      );
    });

    render(
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
    render(
      <TestComponent>
        <NestedComponentWithPredfeinedProps a={123} />
      </TestComponent>,
    );

    const actualProps = WidgetClass.mock.calls[0][1];
    expect(actualProps.option).toHaveProperty('predefinedProp');
    expect(actualProps.option.predefinedProp).toBe('predefined-value');
  });

  it('is pulled with predefined props (several)', () => {
    render(
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
    const { rerender } = render(
      <TestComponent>
        <CollectionNestedComponent key={1} c={123} d="abc" />
        <CollectionNestedComponent key={2} c={456} />
        <CollectionNestedComponent key={3} d="def" />
      </TestComponent>,
    );
    rerender(
      <TestComponent>
        <CollectionNestedComponent key={1} c={123} d="abc" />
        <CollectionNestedComponent key={2} c={999} />
        <CollectionNestedComponent key={3} d="def" />
      </TestComponent>,
    );
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
    const { rerender } = render(<TestContainer value={123} />);
    rerender(<TestContainer value={456} />);

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.a', 456]);
  });

  it('is pulled after update without rubbish', () => {
    const { rerender } = render(
      <TestComponent>
        <NestedComponent a={123} />
      </TestComponent>,
    );

    rerender(<TestComponent>
      <NestedComponent a={456} />
    </TestComponent>);
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

    const startChildren = [
      { c: 123, d: 'abc', key: 1 },
      { c: 456, d: 'def', key: 2 },
    ];

    const endChildren = [
      { c: 123, d: 'abc', key: 1 },
      { c: 456, d: 'def', key: 2 },
      { c: 789, d: 'ghi', key: 3 },
    ];
    const { rerender } = render(<TestContainer>{startChildren}</TestContainer>);
    rerender(<TestContainer>{endChildren}</TestContainer>);

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

    const startChildren = [
      { c: 123, d: 'abc', key: 1 },
      { c: 456, d: 'def', key: 2 },
    ];

    const endChildren = [
      { c: 123, d: 'abc', key: 1 },
    ];

    const { rerender } = render(<TestContainer>{startChildren}</TestContainer>);

    rerender(<TestContainer>{endChildren}</TestContainer>);

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['itemOptions', [
      { c: 123, d: 'abc' },
    ]]);
  });
});

describe('nested sub-option', () => {
  afterEach(() => {
    WidgetClass.mockClear();
    cleanup();
  });
  it('is pulled', () => {
    render(
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
    render(
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
    render(
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
    render(
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
    render(
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
    const { rerender } = render(
      <TestComponent>
        <NestedComponent a={123}>
          <CollectionSubNestedComponent key={1} c={123} d="abc" />
          <CollectionSubNestedComponent key={2} c={456} />
          <CollectionSubNestedComponent key={3} d="def" />
        </NestedComponent>
      </TestComponent>,
    );
    rerender(
      <TestComponent>
        <NestedComponent a={123}>
          <CollectionSubNestedComponent key={1} c={123} d="abc" />
          <CollectionSubNestedComponent key={2} c={999} />
          <CollectionSubNestedComponent key={3} d="def" />
        </NestedComponent>
      </TestComponent>,
    );
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

    const { rerender } = render(<TestContainer value="abc" />);
    rerender(<TestContainer value="def" />);

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.subOption.d', 'def']);
  });

  it('is pulled according to expectations', () => {
    const NestedComponentWithExpectations = memo(function NestedComponentWithExpectations(props: any) {
      return (
        <ConfigurationComponent<{ a: number } & React.PropsWithChildren>
          elementDescriptor={{
            OptionName: 'option',
            ExpectedChildren: {
              subOption: {
                optionName: 'expectedSubItemOptions',
                isCollectionItem: true,
              },
              subItemsOptions: {
                optionName: 'expectedSubOption',
                isCollectionItem: false,
              },
            },
          }}
          {...props}
        />
      );
    }) as React.MemoExoticComponent<any> & NestedComponentMeta;

    NestedComponentWithExpectations.componentType = 'option';

    render(
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
  afterEach(() => {
    WidgetClass.mockClear();
    cleanup();
  });
  it('adds option', () => {
    const { rerender } = render(
      <ComponentWithConditionalOption enableOption={false} />,
    );

    rerender(
      <ComponentWithConditionalOption enableOption />,
    );

    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option', { a: 1 }]);
  });

  it('removes option', () => {
    const { rerender } = render(
      <ComponentWithConditionalOption enableOption />,
    );

    rerender(
      <ComponentWithConditionalOption enableOption={false} />,
    );

    expect(Widget.resetOption.mock.calls.length).toBe(1);
    expect(Widget.resetOption.mock.calls[0]).toEqual(['option']);
  });
});
