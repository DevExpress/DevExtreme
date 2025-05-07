/* eslint-disable max-classes-per-file */
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { memo } from 'react';
import { Component, IHtmlOptions, NestedComponentMeta } from '../component';
import ConfigurationComponent from '../nested-option';
import { TestComponent, TestPortalComponent, Widget, WidgetClass } from './test-component';

jest.useFakeTimers();

const NestedComponent = function NestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ a: number } & React.PropsWithChildren>
      elementDescriptor={{
        OptionName: 'option',
        ExpectedChildren: {
          test: { optionName: "test", isCollectionItem: false },
        },
      }}
      {...props}
    />
  );
} as React.ComponentType<any> & NestedComponentMeta;

NestedComponent.componentType = 'option';

const NestedComponentWithPredfeinedProps = function NestedComponentWithPredfeinedProps(props: any) {
  return (
    <ConfigurationComponent<{ a: number } & React.PropsWithChildren>
      elementDescriptor={{
        OptionName: 'option',
        PredefinedProps: {
          predefinedProp: 'predefined-value',
        },
        ExpectedChildren: {
          test: { optionName: "test", isCollectionItem: false },
        },
      }}
      {...props}
    />
  );
} as React.ComponentType<any> & NestedComponentMeta;

NestedComponentWithPredfeinedProps.componentType = 'option';

const CollectionNestedWithPredfeinedProps1 = function CollectionNestedWithPredfeinedProps1(props: any) {
  return (
    <ConfigurationComponent<{ a: number }>
      elementDescriptor={{
        IsCollectionItem: true,
        OptionName: 'option',
        PredefinedProps: {
          predefinedProp: 'predefined-value-1',
        },
        ExpectedChildren: {
          test: { optionName: "test", isCollectionItem: false },
        },
      }}
      {...props}
    />
  );
} as React.ComponentType<any> & NestedComponentMeta;

CollectionNestedWithPredfeinedProps1.componentType = 'option';

const CollectionNestedWithPredfeinedProps2 = function CollectionNestedWithPredfeinedProps2(props: any) {
  return (
    <ConfigurationComponent<{ a: number }>
      elementDescriptor={{
        IsCollectionItem: true,
        OptionName: 'option',
        PredefinedProps: {
          predefinedProp: 'predefined-value-2',
        },
        ExpectedChildren: {
          test: { optionName: "test", isCollectionItem: false },
        },
      }}
      {...props}
    />
  );
} as React.ComponentType<any> & NestedComponentMeta;

CollectionNestedWithPredfeinedProps2.componentType = 'option';

const SubNestedComponent = function SubNestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ d: string }>
      elementDescriptor={{
        OptionName: 'subOption',
        ExpectedChildren: {
          test: { optionName: "test", isCollectionItem: false },
        },
      }}
      {...props}
    />
  );
} as React.ComponentType<any> & NestedComponentMeta;

SubNestedComponent.componentType = 'option';

const AnotherSubNestedComponent = function AnotherSubNestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ e: string }>
      elementDescriptor={{
        OptionName: 'anotherSubOption',
        ExpectedChildren: {
          test: { optionName: "test", isCollectionItem: false },
        },
      }}
      {...props}
    />
  );
} as React.ComponentType<any> & NestedComponentMeta;

AnotherSubNestedComponent.componentType = 'option';

const AnotherNestedComponent = function AnotherNestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ b: string }>
      elementDescriptor={{
        OptionName: 'anotherOption',
        ExpectedChildren: {
          test: { optionName: "test", isCollectionItem: false },
        },
      }}
      {...props}
    />
  );
} as React.ComponentType<any> & NestedComponentMeta;

AnotherNestedComponent.componentType = 'option';

const CollectionNestedComponent = function CollectionNestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ c?: number; d?: string }>
      elementDescriptor={{
        OptionName: 'itemOptions',
        IsCollectionItem: true,
        ExpectedChildren: {
          test: { optionName: "test", isCollectionItem: false },
        },
      }}
      {...props}
    />
  );
} as React.ComponentType<any> & NestedComponentMeta;

CollectionNestedComponent.componentType = 'option';

const CollectionSubNestedComponent = function CollectionSubNestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ c?: number; d?: string }>
      elementDescriptor={{
        OptionName: 'subItemsOptions',
        IsCollectionItem: true,
        ExpectedChildren: {
          test: { optionName: "test", isCollectionItem: false },
        },
      }}
      {...props}
    />
  );
} as React.ComponentType<any> & NestedComponentMeta;

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

    const MySetting = () => <NestedComponent a={345} />;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 345,
      },
    });
  });

  it('is pulled from portal component', () => {
    render(
      <TestPortalComponent>
        <NestedComponent a={123} />
      </TestPortalComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
    });

    expect(Widget.option.mock.calls[0][1]).toEqual({ a: 123 });

    const MySetting = () => <NestedComponent a={345} />;

    render(
      <TestPortalComponent>
        <MySetting />
      </TestPortalComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
    });

    expect(Widget.option.mock.calls[0][1]).toEqual({ a: 345 });
  });

  it('is pulled from nested component', () => {
    render(
      <TestComponent
        templateProps={[{
          tmplOption: 'template',
          render: 'render',
          component: 'component',
        }]}>
        <TestComponent>
          <NestedComponent a={123} />
        </TestComponent>
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 123,
      },
    });

    const MySetting = () => <NestedComponent a={345} />;

    render(
      <TestComponent
        templateProps={[{
          tmplOption: 'template',
          render: 'render',
          component: 'component',
        }]}>
        <TestComponent>
          <MySetting />
        </TestComponent>
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[2][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 345,
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

    const MySetting = () => <>
      <NestedComponent a={789} />
      {false && <NestedComponent a={987} />}
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 789,
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

    const MySetting = () => <>
      <NestedComponent a={456} />
      <AnotherNestedComponent b="def" />
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 456,
      },
      anotherOption: {
        b: 'def',
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

    const MySetting = () => <>
      <NestedComponent a={789} />
      <NestedComponent a={987} />
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 987,
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

    const MySetting = () => <>
      <CollectionNestedComponent c={456} d="def" />
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      itemOptions: [
        { c: 456, d: 'def' },
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

    const MySetting = () => <>
      <CollectionNestedComponent c={456} d="def" />
      <CollectionNestedComponent c={789} />
      <CollectionNestedComponent d="ghi" />
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      itemOptions: [
        { c: 456, d: 'def' },
        { c: 789 },
        { d: 'ghi' },
      ],
    });

    const MySetting1 = () => <>
      <CollectionNestedComponent c={789} d="ghi" />
    </>;
    const MySetting2 = () => <>
      <CollectionNestedComponent c={987} />
    </>;
    const MySetting3 = () => <>
      <CollectionNestedComponent d="jkl" />
    </>;

    render(
      <TestComponent>
        <MySetting1 />
        <MySetting2 />
        <MySetting3 />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[2][1]).toEqual({
      templatesRenderAsynchronously: true,
      itemOptions: [
        { c: 789, d: 'ghi' },
        { c: 987 },
        { d: 'jkl' },
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

    const MySetting = () => <>
      <NestedComponent a={456} />
      <CollectionNestedComponent c={789} d="def" />
    </>;

    render(
      <TestComponentWithExpectation>
        <MySetting />
      </TestComponentWithExpectation>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      expectedItemOptions: [
        { a: 456 },
      ],
      expectedOption: { c: 789, d: 'def' },
    });
  });

  it('is pulled with predefined props', () => {
    render(
      <TestComponent>
        <NestedComponentWithPredfeinedProps a={123} />
      </TestComponent>,
    );

    let actualProps = WidgetClass.mock.calls[0][1];
    expect(actualProps.option).toHaveProperty('predefinedProp');
    expect(actualProps.option.predefinedProp).toBe('predefined-value');

    const MySetting = () => <>
      <NestedComponentWithPredfeinedProps a={456} />
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    actualProps = WidgetClass.mock.calls[1][1];
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

    let actualProps = WidgetClass.mock.calls[0][1];

    expect(actualProps.option).toEqual([
      { predefinedProp: 'predefined-value-1', a: 123 },
      { predefinedProp: 'predefined-value-2', a: 456 },
    ]);

    const MySetting = () => <>
      <CollectionNestedWithPredfeinedProps1 a={789} />
      <CollectionNestedWithPredfeinedProps2 a={987} />
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    actualProps = WidgetClass.mock.calls[1][1];

    expect(actualProps.option).toEqual([
      { predefinedProp: 'predefined-value-1', a: 789 },
      { predefinedProp: 'predefined-value-2', a: 987 },
    ]);
  });

  it('is pulled as a collection item after update', () => {
    let { rerender } = render(
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

    const MySetting = ({ c1, c2, d1, d2 }) => <>
        <CollectionNestedComponent key={1} c={c1} d={d1} />
        <CollectionNestedComponent key={2} c={c2} />
        <CollectionNestedComponent key={3} d={d2} />
    </>;

    ({ rerender } = render(
      <TestComponent>
        <MySetting c1={456} c2={789} d1='def' d2='ghi' />
      </TestComponent>,
    ));

    rerender(
      <TestComponent>
        <MySetting c1={456} c2={1000} d1='def' d2='ghi' />
      </TestComponent>,
    );

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['itemOptions[1].c', 1000]);
  });

  it('is pulled after update', () => {
    let TestContainer = (props: any) => {
      const { value } = props;
      return (
        <TestComponent>
          <NestedComponent a={value} />
        </TestComponent>
      );
    };
    let { rerender } = render(<TestContainer value={123} />);
    rerender(<TestContainer value={456} />);

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.a', 456]);

    const MySetting = ({ value }) => <>
      <NestedComponent a={value} />
    </>;

    TestContainer = (props: any) => {
      const { value } = props;
      return (
        <TestComponent>
          <MySetting value={value} />
        </TestComponent>
      );
    };

    ({ rerender } = render(<TestContainer value={456} />));
    rerender(<TestContainer value={789} />);
  
    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.a', 789]);
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
      const { children, wrapOptions } = props;
      const nesteds = children.map((child: any) => {
        if (wrapOptions) {
          const MySetting = (props) => <CollectionNestedComponent {...props} />;

          return <MySetting {...child} />
        } else {
          return <CollectionNestedComponent {...child}/>;
        }
      });

      return (<TestComponent>{nesteds}</TestComponent>);
    };

    let startChildren = [
      { c: 123, d: 'abc', key: 1 },
      { c: 456, d: 'def', key: 2 },
    ];

    let endChildren = [
      { c: 123, d: 'abc', key: 1 },
      { c: 456, d: 'def', key: 2 },
      { c: 789, d: 'ghi', key: 3 },
    ];
    let { rerender } = render(<TestContainer wrapOptions={false}>{startChildren}</TestContainer>);
    rerender(<TestContainer wrapOptions={false}>{endChildren}</TestContainer>);

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['itemOptions', [
      { c: 123, d: 'abc' },
      { c: 456, d: 'def' },
      { c: 789, d: 'ghi' },
    ]]);

    startChildren = [
      { c: 456, d: 'def', key: 1 },
      { c: 789, d: 'ghi', key: 2 },
    ];

    endChildren = [
      { c: 456, d: 'def', key: 1 },
      { c: 789, d: 'ghi', key: 2 },
      { c: 987, d: 'jkl', key: 3 },
    ];

    ({ rerender } = render(<TestContainer wrapOptions={true}>{startChildren}</TestContainer>));
    rerender(<TestContainer wrapOptions={true}>{endChildren}</TestContainer>);

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['itemOptions', [
      { c: 456, d: 'def' },
      { c: 789, d: 'ghi' },
      { c: 987, d: 'jkl' },
    ]]);
  });

  it('updates widget option when collection item removed', () => {
    const TestContainer = (props: any) => {
      const { children, wrapOptions } = props;
      const nesteds = children.map((child: any) => {
        if (wrapOptions) {
          const MySetting = (props) => <CollectionNestedComponent {...props} />;

          return <MySetting {...child} />
        } else {
          return <CollectionNestedComponent {...child}/>;
        }
      });

      return (<TestComponent>{nesteds}</TestComponent>);
    };

    let startChildren = [
      { c: 123, d: 'abc', key: 1 },
      { c: 456, d: 'def', key: 2 },
    ];

    let endChildren = [
      { c: 123, d: 'abc', key: 1 },
    ];

    let { rerender } = render(<TestContainer wrapOptions={false}>{startChildren}</TestContainer>);

    rerender(<TestContainer wrapOptions={false}>{endChildren}</TestContainer>);

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['itemOptions', [
      { c: 123, d: 'abc' },
    ]]);

    startChildren = [
      { c: 456, d: 'def', key: 1 },
      { c: 789, d: 'ghi', key: 2 },
    ];

    endChildren = [
      { c: 456, d: 'def', key: 1 },
    ];

    ({ rerender } = render(<TestContainer wrapOptions={true}>{startChildren}</TestContainer>));

    rerender(<TestContainer wrapOptions={true}>{endChildren}</TestContainer>);

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['itemOptions', [
      { c: 456, d: 'def' },
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

    const MySubSetting = () => <>
      <SubNestedComponent d="def" />
    </>;
    const MySetting = () => <>
      <NestedComponent a={456}>
        <MySubSetting />
      </NestedComponent>
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 456,
        subOption: {
          d: 'def',
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

    const MySubSetting = () => <>
      <SubNestedComponent d="def" />
      <AnotherSubNestedComponent e="ghi" />
    </>;
    const MySetting = () => <>
      <NestedComponent a={456}>
        <MySubSetting />
      </NestedComponent>
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 456,
        subOption: {
          d: 'def',
        },
        anotherSubOption: {
          e: 'ghi',
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

    const MySubSetting = () => <>
      <SubNestedComponent d="def" />
      <SubNestedComponent d="ghi" />
    </>;
    const MySetting = () => <>
      <NestedComponent a={456}>
        <MySubSetting />
      </NestedComponent>
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 456,
        subOption: {
          d: 'ghi',
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

    const MySubSetting = () => <>
      <CollectionSubNestedComponent c={456} d="def" />
    </>;
    const MySetting = () => <>
      <NestedComponent a={456}>
        <MySubSetting />
      </NestedComponent>
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 456,
        subItemsOptions: [
          { c: 456, d: 'def' },
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

    const MySubSetting = () => <>
      <CollectionSubNestedComponent c={456} d="def" />
      <CollectionSubNestedComponent c={789} />
      <CollectionSubNestedComponent d="ghi" />
    </>;
    const MySetting = () => <>
      <NestedComponent a={456}>
        <MySubSetting />
      </NestedComponent>
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 456,
        subItemsOptions: [
          { c: 456, d: 'def' },
          { c: 789 },
          { d: 'ghi' },
        ],
      },
    });
  });

  it('is pulled as a collection item after update inside another option', () => {
    let { rerender } = render(
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

    const MySubSetting = ({ c1, c2, d1, d2 }) => <>
      <CollectionSubNestedComponent key={1} c={c1} d={d1} />
      <CollectionSubNestedComponent key={2} c={c2} />
      <CollectionSubNestedComponent key={3} d={d2} />
    </>;
    const MySetting = ({ a, c1, c2, d1, d2 }) => <>
      <NestedComponent a={a}>
        <MySubSetting c1={c1} c2={c2} d1={d1} d2={d2} />
      </NestedComponent>
    </>;

    ({ rerender } = render(
      <TestComponent>
        <MySetting a={456} c1={456} c2={789} d1="def" d2="ghi" />
      </TestComponent>,
    ));
    rerender(
      <TestComponent>
        <MySetting a={456} c1={456} c2={888} d1="def" d2="ghi" />
      </TestComponent>,
    );
    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.subItemsOptions[1].c', 888]);
  });

  it('is pulled after update', () => {
    let TestContainer = (props: any) => {
      const { value } = props;
      return (
        <TestComponent>
          <NestedComponent a={123}>
            <SubNestedComponent d={value} />
          </NestedComponent>
        </TestComponent>
      );
    };

    let { rerender } = render(<TestContainer value="abc" />);
    rerender(<TestContainer value="def" />);

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.subOption.d', 'def']);

    const MySubSetting = ({ value }) => <>
      <SubNestedComponent d={value} />
    </>;
    const MySetting = ({ a, value }) => <>
      <NestedComponent a={a}>
        <MySubSetting value={value} />
      </NestedComponent>
    </>;

    TestContainer = (props: any) => {
      const { value } = props;
      return (
        <TestComponent>
         <MySetting a={456} value={value}/>
        </TestComponent>
      );
    };

    ({ rerender } = render(<TestContainer value="def" />));
    rerender(<TestContainer value="ghi" />);

    jest.runAllTimers();
    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option.subOption.d', 'ghi']);
  });

  it('is pulled according to expectations', () => {
    const NestedComponentWithExpectations = function NestedComponentWithExpectations(props: any) {
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
    } as React.ComponentType<any> & NestedComponentMeta;

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

    const MySubSetting = () => <>
      <SubNestedComponent d="def" />
      <CollectionSubNestedComponent c={789} d="ghi" />
    </>;
    const MySetting = () => <>
      <NestedComponentWithExpectations a={456}>
        <MySubSetting />
      </NestedComponentWithExpectations>
    </>;

    render(
      <TestComponent>
        <MySetting />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1]).toEqual({
      templatesRenderAsynchronously: true,
      option: {
        a: 456,
        expectedSubItemOptions: [
          { d: 'def' },
        ],
        expectedSubOption: { c: 789, d: 'ghi' },
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

const ComponentWithConditionalCustomOption = (props: { enableOption: boolean }) => {
  const { enableOption } = props;

  const MySetting = ({ enable }) => <>
    {enable && <NestedComponent a={2} />}
  </>;

  return (
    <TestComponent>
      <MySetting enable={enableOption} />
    </TestComponent>
  );
};

describe('conditional rendering', () => {
  afterEach(() => {
    WidgetClass.mockClear();
    cleanup();
  });
  it('adds option', () => {
    let { rerender } = render(
      <ComponentWithConditionalOption enableOption={false} />,
    );

    rerender(
      <ComponentWithConditionalOption enableOption />,
    );
    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option', { a: 1 }]);

    ({ rerender } = render(
      <ComponentWithConditionalCustomOption enableOption={false} />,
    ));

    rerender(
      <ComponentWithConditionalCustomOption enableOption />,
    );
    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(1);
    expect(Widget.option.mock.calls[0]).toEqual(['option', { a: 2 }]);
  });

  it('removes option', () => {
    let { rerender } = render(
      <ComponentWithConditionalOption enableOption />,
    );

    rerender(
      <ComponentWithConditionalOption enableOption={false} />,
    );
    jest.runAllTimers();

    expect(Widget.resetOption.mock.calls.length).toBe(1);
    expect(Widget.resetOption.mock.calls[0]).toEqual(['option']);

    ({ rerender } = render(
      <ComponentWithConditionalCustomOption enableOption />,
    ));

    rerender(
      <ComponentWithConditionalCustomOption enableOption={false} />,
    );
    jest.runAllTimers();

    expect(Widget.resetOption.mock.calls.length).toBe(1);
    expect(Widget.resetOption.mock.calls[0]).toEqual(['option']);
  });
});
