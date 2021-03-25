/* eslint-disable max-classes-per-file */
import * as events from 'devextreme/events';
import { Component } from '../component';

import ConfigurationComponent from '../nested-option';
import { Template } from '../template';
import { mount, React, shallow } from './setup';
import { TestComponent, Widget, WidgetClass } from './test-component';

const templateProps = [{
  tmplOption: 'item',
  render: 'itemRender',
  component: 'itemComponent',
  keyFn: 'itemKeyFn',
}];

class ComponentWithTemplates extends TestComponent {
  protected _templateProps = templateProps;
}

class ComponentWithAsyncTemplates<P> extends Component<P> {
  protected _WidgetClass = WidgetClass;

  protected _templateProps = templateProps;
}

function renderTemplate(
  name: string,
  model?: any,
  container?: any,
  index?: number,
  onRendered?: () => void,
): Element {
  model = model || {};
  container = container || document.createElement('div');
  const { render } = WidgetClass.mock.calls[0][1].integrationOptions.templates[name];

  return render({
    container, model, ...(index && { index }), onRendered,
  });
}

function renderItemTemplate(
  model?: any,
  container?: any,
  index?: number,
  onRendered?: () => void,
): Element {
  return renderTemplate('item', model, container, index, onRendered);
}

function testTemplateOption(testedOption: string) {
  let prepareTemplate = (render) => render;

  if (testedOption === 'itemComponent') {
    prepareTemplate = (render) => {
      class ItemComponent extends React.PureComponent<{data: any, index?: number}> {
        public render() {
          const { data, index } = this.props;
          return render(data, index);
        }
      }
      return ItemComponent;
    };
  }

  it('pass integrationOptions to widget', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = () => <div>Template</div>;
    shallow(React.createElement(ComponentWithTemplates, elementOptions));

    const options = WidgetClass.mock.calls[0][1];

    expect(options.item).toBe('item');

    const { integrationOptions } = options;

    expect(integrationOptions).toBeDefined();
    expect(integrationOptions.templates).toBeDefined();
    expect(integrationOptions.templates.item).toBeDefined();
    expect(typeof integrationOptions.templates.item.render).toBe('function');
  });

  it('renders', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = prepareTemplate((data: any) => (
      <div className="template">
        Template
        {' '}
        {data.text}
      </div>
    ));

    const component = mount(React.createElement(ComponentWithTemplates, elementOptions));

    renderItemTemplate({ text: 'with data' });
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Template with data</div>');
  });

  it('renders with text node inside component', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = () => <div>Template</div>;
    const component = mount(
      React.createElement(
        ComponentWithTemplates,
        elementOptions,
        'Text',
      ),
    );
    const templateHolder = document.createElement('div');
    component.getDOMNode().appendChild(templateHolder);

    renderItemTemplate({ text: 'with data' }, templateHolder);
    component.update();

    expect(component.html())
      .toBe('<div>Text<div><div style=\"display: none;\"></div><div>Template</div></div></div>');
  });

  it('renders new template after component change', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = () => <div className="template">First Template</div>;
    const component = mount(React.createElement(ComponentWithTemplates, elementOptions));

    const changedElementOptions: Record<string, any> = {};
    changedElementOptions[testedOption] = () => <div className="template">Second Template</div>;
    component.setProps(changedElementOptions);

    renderItemTemplate();
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Second Template</div>');
  });

  it('passes component option changes to widget', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = () => <div className="template">First Template</div>;
    const component = mount(React.createElement(ComponentWithTemplates, elementOptions));

    const changedElementOptions: Record<string, any> = {};
    changedElementOptions[testedOption] = () => <div className="template">Second Template</div>;
    component.setProps(changedElementOptions);
    jest.runAllTimers();
    const optionCalls = Widget.option.mock.calls;
    expect(optionCalls.length).toBe(1);

    expect(optionCalls[0][0]).toBe('integrationOptions');
    expect(typeof optionCalls[0][1].templates.item.render).toBe('function');
  });

  it('renders inside unwrapped container', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = () => <div className="template">Template</div>;
    const component = mount(React.createElement(ComponentWithTemplates, elementOptions));

    renderItemTemplate({}, { get: () => document.createElement('div') });
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Template</div>');
  });

  it('renders template removeEvent listener', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = prepareTemplate((data: any) => (
      <>
        Template
        {' '}
        {data.text}
      </>
    ));
    const component = mount(React.createElement(ComponentWithTemplates, elementOptions));

    const container = document.createElement('div');
    renderItemTemplate({ text: 'with data' }, container);
    component.update();
    expect(container.innerHTML).
      toBe('<div style=\"display: none;\"></div>Template with data<span style=\"display: none;\"></span>');
  });

  it('does not render template removeEvent listener', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = prepareTemplate((data: any) => (
      <tbody>
        <tr>
          <td>
            Template
            {' '}
            {data.text}
          </td>
        </tr>
      </tbody>
    ));
    const component = mount(React.createElement(ComponentWithTemplates, elementOptions));

    const container = document.createElement('table');
    renderItemTemplate({ text: 'with data' }, container);

    component.update();
    expect(container.innerHTML)
      .toBe('<div style=\"display: none;\"></div><tbody><tr><td>Template with data</td></tr></tbody>');
  });

  it('calls onRendered callback', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = prepareTemplate((data: any) => (
      <div className="template">
        Template
        {data.text}
      </div>
    ));
    const component = mount(React.createElement(ComponentWithTemplates, elementOptions));
    const onRendered: () => void = jest.fn();

    renderItemTemplate({ text: 'with data' }, undefined, undefined, onRendered);
    component.update();
    jest.runAllTimers();
    expect(onRendered).toBeCalled();
  });

  it('mounts empty template without errors', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = () => null;
    const component = mount(React.createElement(ComponentWithTemplates, elementOptions));

    renderItemTemplate({ text: 1 });
    expect(() => component.update.bind(component)).not.toThrow();
  });

  it('has templates with unique ids', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = prepareTemplate((data: any) => (
      <div className="template">
        Template
        {data.text}
      </div>
    ));
    const component = shallow(React.createElement(ComponentWithTemplates, elementOptions));
    const componentInstace = component.instance() as any;

    renderItemTemplate({ text: 1 });
    renderItemTemplate({ text: 2 });

    const templatesKeys = Object.getOwnPropertyNames(componentInstace._templatesStore._templates);
    expect(templatesKeys.length).toBe(2);
    expect(templatesKeys[0]).not.toBe(templatesKeys[1]);
  });

  it('has templates with ids genetated with keyExpr', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = prepareTemplate((data: any) => (
      <div className="template">
        Template
        {data.text}
      </div>
    ));
    elementOptions.itemKeyFn = (data) => data.text;
    const component = shallow(React.createElement(ComponentWithTemplates, elementOptions));
    const componentInstance = component.instance() as any;

    renderItemTemplate({ text: 1 });
    renderItemTemplate({ text: 2 });

    const templatesKeys = Object.getOwnPropertyNames(componentInstance._templatesStore._templates);
    expect(templatesKeys.length).toBe(2);
    expect(templatesKeys[0]).toBe('1');
    expect(templatesKeys[1]).toBe('2');
  });

  it('removes text template', () => {
    const elementOptions: Record<string, any> = {};
    elementOptions[testedOption] = prepareTemplate((data: any) => (
      <>
        Template
        {data.text}
      </>
    ));
    const component = mount(React.createElement(ComponentWithTemplates, elementOptions));
    const componentInstance = component.instance() as any;

    const container = document.createElement('div');
    renderItemTemplate({}, container);
    expect(componentInstance._templatesStore.renderWrappers().length).toBe(1);
    component.update();
    const removeListener = container.getElementsByTagName('SPAN')[0];

    const { parentElement } = removeListener;
    if (!parentElement) { throw new Error(); }

    parentElement.innerHTML = '';
    events.triggerHandler(removeListener, 'dxremove');
    component.update();
    expect(componentInstance._templatesStore.renderWrappers().length).toBe(0);
  });

  it('removes template', () => {
    const elementOptions: Record<string, any> = {
      [testedOption]: prepareTemplate((data: any) => (
        <div className="template">
          Template
          {data.text}
        </div>
      )),
    };

    const component = mount(React.createElement(ComponentWithTemplates, elementOptions));
    const componentInstance = component.instance() as any;

    renderItemTemplate();
    expect(componentInstance._templatesStore.renderWrappers().length).toBe(1);
    component.update();
    const templateContent = component.find('.template').getDOMNode();

    const { parentElement } = templateContent;
    if (!parentElement) { throw new Error(); }

    parentElement.removeChild(templateContent);
    events.triggerHandler(templateContent, 'dxremove');
    component.update();
    expect(componentInstance._templatesStore.renderWrappers().length).toBe(0);
  });
}

describe('function template', () => {
  testTemplateOption('itemRender');

  it('renders simple item', () => {
    const itemRender: any = jest.fn((text: string) => (
      <div className="template">
        Template
        {' '}
        {text}
      </div>
    ));
    const component = mount(
      <ComponentWithTemplates itemRender={itemRender} />,
    );
    renderItemTemplate('with data');

    expect(itemRender).toBeCalled();
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Template with data</div>');
  });

  it('renders index', () => {
    const itemRender: any = jest.fn((_, index: number) => (
      <div className="template">
        Index
        {' '}
        {index}
      </div>
    ));
    const component = mount(
      <ComponentWithTemplates itemRender={itemRender} />,
    );
    renderItemTemplate(undefined, undefined, 5);

    expect(itemRender).toBeCalled();
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Index 5</div>');
  });
});

describe('component template', () => {
  testTemplateOption('itemComponent');

  it('renders index', () => {
    const ItemTemplate = (props: any) => {
      const { data, index } = props;
      return (
        <div className="template">
          value:
          {' '}
          {data.value}
          , index:
          {' '}
          {index}
        </div>
      );
    };

    const component = mount(
      <ComponentWithTemplates itemComponent={ItemTemplate} />,
    );

    renderItemTemplate({ value: 'Value' }, undefined, 5);
    component.update();
    expect(component.find('.template').text()).toBe('value: Value, index: 5');
  });
});

describe('nested template', () => {
  it('pass integrationOptions to widget', () => {
    const ItemTemplate = () => <div>Template</div>;
    mount(
      <ComponentWithTemplates>
        <Template name="item1" render={ItemTemplate} />
        <Template name="item2" component={ItemTemplate} />
        <Template name="item3">
          <ItemTemplate />
        </Template>
      </ComponentWithTemplates>,
    );

    const options = WidgetClass.mock.calls[0][1];

    expect(options.item).toBeUndefined();

    const { integrationOptions } = options;

    expect(integrationOptions).toBeDefined();
    expect(integrationOptions.templates).toBeDefined();

    expect(integrationOptions.templates.item1).toBeDefined();
    expect(typeof integrationOptions.templates.item1.render).toBe('function');

    expect(integrationOptions.templates.item2).toBeDefined();
    expect(typeof integrationOptions.templates.item2.render).toBe('function');

    expect(integrationOptions.templates.item3).toBeDefined();
    expect(typeof integrationOptions.templates.item3.render).toBe('function');
  });

  it('renders nested templates', () => {
    const FirstTemplate = () => <div className="template">Template</div>;
    const component = mount(
      <ComponentWithTemplates>
        <Template name="item1" render={FirstTemplate} />
      </ComponentWithTemplates>,
    );
    renderTemplate('item1');
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Template</div>');
  });

  it('renders children of nested template', () => {
    const component = mount(
      <ComponentWithTemplates>
        <Template name="item1">
          <div className="template">Template</div>
        </Template>
      </ComponentWithTemplates>,
    );
    renderTemplate('item1');
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Template</div>');
  });

  it('renders new templates after component change', () => {
    const FirstTemplate = () => <div className="template">First Template</div>;
    const component = mount(
      <ComponentWithTemplates>
        <Template name="item1" render={FirstTemplate} />
      </ComponentWithTemplates>,
    );
    renderTemplate('item1');
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">First Template</div>');

    const SecondTemplate = () => <div className="template">Second Template</div>;
    component.setProps({
      children: <Template name="item1" render={SecondTemplate} />,
    });
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Second Template</div>');
  });

  it('renders new templates after children change', () => {
    const component = mount(
      <ComponentWithTemplates>
        <Template name="item1">
          <div className="template">First Template</div>
        </Template>
      </ComponentWithTemplates>,
    );
    renderTemplate('item1');
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">First Template</div>');

    component.setProps({
      children: (
        <Template name="item1">
          <div className="template">Second Template</div>
        </Template>
      ),
    });
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Second Template</div>');
  });

  it('has templates with ids genetated by keyFn', () => {
    const FirstTemplate = () => <div className="template">Template</div>;
    const keyExpr = (data) => data.text;
    const component = mount(
      <ComponentWithTemplates>
        <Template name="item1" render={FirstTemplate} keyFn={keyExpr} />
      </ComponentWithTemplates>,
    );

    renderTemplate('item1', { text: 1 });
    const componentInstance = component.instance() as any;
    const templates = Object.getOwnPropertyNames(componentInstance._templatesStore._templates);
    expect(templates.length).toBe(1);
    expect(templates[0]).toBe('1');
  });
});

describe('component/render in nested options', () => {
  class NestedComponent extends ConfigurationComponent<{
    item?: any;
    itemRender?: any;
    itemComponent?: any;
  }> {
    public static OptionName = 'option';

    public static TemplateProps = [{
      tmplOption: 'item',
      render: 'itemRender',
      component: 'itemComponent',
    }];
  }

  class CollectionNestedComponent extends ConfigurationComponent<{
    template?: any;
    render?: any;
    component?: any;
  }> {
    public static IsCollectionItem = true;

    public static OptionName = 'collection';

    public static TemplateProps = [{
      tmplOption: 'template',
      render: 'render',
      component: 'component',
    }];
  }

  it('pass integrationOptions options to widget', () => {
    const ItemTemplate = () => <div>Template</div>;
    mount(
      <TestComponent>
        <NestedComponent itemComponent={ItemTemplate} />
      </TestComponent>,
    );

    const options = WidgetClass.mock.calls[0][1];
    expect(options.option.item).toBe('option.item');

    const { integrationOptions } = options;

    expect(integrationOptions).toBeDefined();
    expect(integrationOptions.templates).toBeDefined();
    expect(integrationOptions.templates['option.item']).toBeDefined();
    expect(typeof integrationOptions.templates['option.item'].render).toBe('function');
  });

  it('pass integrationOptions to widget with Template component', () => {
    const ItemTemplate = () => <div>Template</div>;
    mount(
      <ComponentWithTemplates itemComponent={ItemTemplate}>
        <NestedComponent itemComponent={ItemTemplate} />
        <Template name="nested" render={ItemTemplate} />
      </ComponentWithTemplates>,
    );

    const options = WidgetClass.mock.calls[0][1];

    const { integrationOptions } = options;

    expect(integrationOptions.templates.nested).toBeDefined();
    expect(typeof integrationOptions.templates.nested.render).toBe('function');

    expect(integrationOptions.templates.item).toBeDefined();
    expect(typeof integrationOptions.templates.item.render).toBe('function');

    expect(integrationOptions.templates['option.item']).toBeDefined();
    expect(typeof integrationOptions.templates['option.item'].render).toBe('function');
  });

  it('pass integrationOptions options to widget with several templates', () => {
    const UserTemplate = () => <div>Template</div>;
    mount(
      <TestComponent>
        <NestedComponent itemComponent={UserTemplate} />
        <CollectionNestedComponent render={UserTemplate} />
      </TestComponent>,
    );

    const options = WidgetClass.mock.calls[0][1];

    expect(options.option.item).toBe('option.item');
    expect(options.collection[0].template).toBe('collection[0].template');

    const { integrationOptions } = options;

    expect(Object.keys(integrationOptions.templates)).toEqual(['option.item', 'collection[0].template']);
  });

  it('pass integrationOptions options for collection nested components', () => {
    const UserTemplate = () => <div>Template</div>;
    mount(
      <TestComponent>
        <CollectionNestedComponent render={UserTemplate} />
        <CollectionNestedComponent render={UserTemplate} />
        <CollectionNestedComponent>
          <NestedComponent itemRender={UserTemplate} />
        </CollectionNestedComponent>
        <CollectionNestedComponent>
          <NestedComponent />
          abc
        </CollectionNestedComponent>
        <NestedComponent>
          <CollectionNestedComponent render={UserTemplate} />
        </NestedComponent>
      </TestComponent>,
    );

    const options = WidgetClass.mock.calls[0][1];

    expect(options.collection[0].template).toBe('collection[0].template');
    expect(options.collection[1].template).toBe('collection[1].template');
    expect(options.collection[2].option.item).toBe('collection[2].option.item');
    expect(options.option.collection[0].template).toBe('option.collection[0].template');

    const { integrationOptions } = options;

    expect(Object.keys(integrationOptions.templates)).toEqual([
      'option.collection[0].template',
      'collection[0].template',
      'collection[1].template',
      'collection[2].option.item',
      'collection[3].template',
    ]);
  });

  it("pass integrationOptions for collection nested component with 'template' option if a child defined", () => {
    const UserTemplate = () => <div>Template</div>;
    mount(
      <TestComponent>
        <NestedComponent>
          <UserTemplate />
        </NestedComponent>

        <CollectionNestedComponent>
          <UserTemplate />
        </CollectionNestedComponent>

        <CollectionNestedComponent>
          <UserTemplate />
        </CollectionNestedComponent>

        <CollectionNestedComponent>
          <NestedComponent />
          <UserTemplate />
        </CollectionNestedComponent>

        <CollectionNestedComponent>
          <NestedComponent />
          abc
        </CollectionNestedComponent>

        <CollectionNestedComponent>
          <NestedComponent />
        </CollectionNestedComponent>

        <CollectionNestedComponent />

        <CollectionNestedComponent>
          <CollectionNestedComponent />
          <CollectionNestedComponent />
        </CollectionNestedComponent>
      </TestComponent>,
    );

    const options = WidgetClass.mock.calls[0][1];

    expect(options.collection[0].template).toBe('collection[0].template');
    expect(options.collection[1].template).toBe('collection[1].template');
    expect(options.collection[2].template).toBe('collection[2].template');
    expect(options.collection[3].template).toBe('collection[3].template');
    expect(options.collection[4].template).toBe(undefined);
    expect(options.collection[5].template).toBe(undefined);
    expect(options.collection[6].template).toBe(undefined);
    expect(options.option.item).toBe(undefined);
    expect(options.option.template).toBe(undefined);

    const { integrationOptions } = options;
    expect(Object.keys(integrationOptions.templates)).toEqual([
      'collection[0].template',
      'collection[1].template',
      'collection[2].template',
      'collection[3].template',
    ]);
  });

  it("pass integrationOptions for collection nested component with 'template' option for different transcluded content", () => {
    const UserTemplate = () => <div>Template</div>;
    mount(
      <TestComponent>
        <CollectionNestedComponent>
          <NestedComponent />
          <div>
            SampleText
          </div>
        </CollectionNestedComponent>
        <CollectionNestedComponent>
          {42}
        </CollectionNestedComponent>
        <CollectionNestedComponent>
          <>
            {null}
          </>
        </CollectionNestedComponent>
        <CollectionNestedComponent>
          <NestedComponent />
          {undefined}
          {null}
          {false}
          Text
        </CollectionNestedComponent>
        <CollectionNestedComponent>
          <NestedComponent />
          {undefined}
          {null}
          {false}
          <UserTemplate />
        </CollectionNestedComponent>
        <CollectionNestedComponent>
          <NestedComponent />
          {false}
          {undefined}
          {null}
        </CollectionNestedComponent>
      </TestComponent>,
    );

    const options = WidgetClass.mock.calls[0][1];

    expect(options.collection[0].template).toBe('collection[0].template');
    expect(options.collection[1].template).toBe('collection[1].template');
    expect(options.collection[2].template).toBe('collection[2].template');
    expect(options.collection[3].template).toBe('collection[3].template');
    expect(options.collection[4].template).toBe('collection[4].template');

    const { integrationOptions } = options;
    expect(Object.keys(integrationOptions.templates)).toEqual([
      'collection[0].template',
      'collection[1].template',
      'collection[2].template',
      'collection[3].template',
      'collection[4].template',
    ]);
  });

  it('renders templates', () => {
    const FirstTemplate = () => <div className="template">First Template</div>;
    const component = mount(
      <TestComponent>
        <NestedComponent itemComponent={FirstTemplate} />
      </TestComponent>,
    );
    renderTemplate('option.item');
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">First Template</div>');

    const SecondTemplate = () => <div className="template">Second Template</div>;
    component.setProps({
      children: <NestedComponent itemComponent={SecondTemplate} />,
    });
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Second Template</div>');
  });

  it('renders static templates', () => {
    const FirstTemplate = () => <div className="template">First Template</div>;
    const component = mount(
      <TestComponent>
        <CollectionNestedComponent>
          <FirstTemplate />
        </CollectionNestedComponent>
      </TestComponent>,
    );
    renderTemplate('collection[0].template');
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">First Template</div>');

    const SecondTemplate = () => <div className="template">Second Template</div>;
    component.setProps({
      children: (
        <CollectionNestedComponent>
          <SecondTemplate />
        </CollectionNestedComponent>
      ),
    });
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">Second Template</div>');
  });

  // T748280
  it('renders updates in deeply nested templates', () => {
    const getTemplate = (arg: string) => () => <div className="template">{arg}</div>;
    const TestContainer = (props: any) => {
      const { value } = props;
      return (
        <TestComponent>
          <CollectionNestedComponent>
            <NestedComponent itemComponent={getTemplate(value)} />
          </CollectionNestedComponent>
        </TestComponent>
      );
    };
    const component = mount(<TestContainer value="test" />);
    component.setProps({ value: 'test2' });
    jest.runAllTimers();

    renderTemplate('collection[0].option.item');
    component.update();
    expect(component.find('.template').html()).toBe('<div class="template">test2</div>');
  });

  it('adds nested components dynamically', () => {
    const renderItem = () => <div>Template</div>;
    const items = [{ id: 1, render: renderItem }];

    const TestContainer = (props: any) => {
      const { items: propItems } = props;
      return (
        <TestComponent>
          {propItems.map(
            (item) => <CollectionNestedComponent key={item.id} render={item.render} />,
          )}
        </TestComponent>
      );
    };

    const component = mount(<TestContainer items={items} />);
    component.setProps({
      items: [
        ...items,
        { id: 2, render: renderItem },
      ],
    });

    const updatedOptions = Widget.option.mock.calls;

    expect(updatedOptions[0][0]).toBe('integrationOptions');
    expect(Object.keys(updatedOptions[0][1].templates)).toEqual([
      'collection[0].template',
      'collection[1].template',
    ]);

    expect(updatedOptions[1][0]).toBe('collection');
    expect(updatedOptions[1][1].length).toBe(2);
    expect(updatedOptions[1][1][0].template).toBe('collection[0].template');
    expect(updatedOptions[1][1][1].template).toBe('collection[1].template');
  });

  it('removes nested components dynamically', () => {
    const renderItem = () => <div>Template</div>;
    const items = [{ id: 1, render: renderItem }, { id: 2, render: renderItem }];

    const TestContainer = (props: any) => {
      const { items: propItems } = props;
      return (
        <TestComponent>
          {propItems.map(
            (item) => <CollectionNestedComponent key={item.id} render={item.render} />,
          )}
        </TestComponent>
      );
    };

    const component = mount(<TestContainer items={items} />);
    component.setProps({
      items: items.slice(0, 1),
    });

    const updatedOptions = Widget.option.mock.calls;

    expect(updatedOptions[1][0]).toBe('collection');
    expect(updatedOptions[1][1].length).toBe(1);
    expect(updatedOptions[1][1][0].template).toBe('collection[0].template');
  });

  xit('removes deleted tempalates from integrationOptions', () => {
    const ItemTemplate = () => <div>Template</div>;
    const items = [{ id: 1, render: ItemTemplate }, { id: 2, render: ItemTemplate }];

    const TestContainer = (props: any) => {
      const { items: propItems } = props;
      return (
        <TestComponent>
          {propItems.map(
            (item) => <CollectionNestedComponent key={item.id} render={item.render} />,
          )}
        </TestComponent>
      );
    };

    const component = mount(<TestContainer items={items} />);
    component.setProps({
      items: items.slice(0, 1),
    });

    const updatedOptions = Widget.option.mock.calls;

    expect(updatedOptions[0][0]).toBe('integrationOptions');
    expect(Object.keys(updatedOptions[0][1].templates).length).toBe(1);
    expect(Object.keys(updatedOptions[0][1].templates)[0]).toBe(
      'collection[0].template',
    );
  });

  it('does not create template for widget transcluded content', () => {
    class ComponentWithTranscludedContent extends TestComponent {
      protected _templateProps = [{
        tmplOption: 'template',
        render: 'render',
        component: 'component',
        keyFn: 'keyFn',
      }];
    }

    mount(
      <ComponentWithTranscludedContent>
        Widget Transcluded Content
      </ComponentWithTranscludedContent>,
    );

    const { integrationOptions } = WidgetClass.mock.calls[0][1];
    expect(integrationOptions).toBe(undefined);
  });
});

describe('async template', () => {
  const waitForceUpdateFromTemplateRenderer = () => new Promise((ok) => requestAnimationFrame(ok));

  it('renders', async () => {
    const elementOptions: Record<string, any> = {};
    elementOptions.itemRender = (data: any) => (
      <div className="template">
        Template
        {' '}
        {data.text}
      </div>
    );

    const component = mount(React.createElement(ComponentWithAsyncTemplates, elementOptions));
    renderItemTemplate({ text: 'with data' });

    expect(component.find('.template').length).toBe(0);

    await waitForceUpdateFromTemplateRenderer();
    component.update();

    expect(component.find('.template').html()).toBe('<div class="template">Template with data</div>');
  });

  it('does not force update on each template', async () => {
    const elementOptions: Record<string, any> = {};
    elementOptions.itemRender = (data: any) => (
      <div className="template">
        Template
        {data.text}
      </div>
    );

    const component = mount(React.createElement(ComponentWithAsyncTemplates, elementOptions));
    const componentInstance = component.instance() as any;
    const renderSpy = jest.spyOn(componentInstance._templatesStore, 'renderWrappers');

    renderItemTemplate({ text: 'with data1' });
    renderItemTemplate({ text: 'with data2' });

    expect(renderSpy.mock.calls.length).toBe(0);

    await waitForceUpdateFromTemplateRenderer();
    component.update();

    expect(renderSpy.mock.calls.length).toBe(1);
    renderSpy.mockRestore();
  });
});
