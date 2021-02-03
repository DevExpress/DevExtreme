import * as events from 'devextreme/events';

import { mount, React, shallow } from './setup';
import {
  fireOptionChange, TestComponent, Widget, WidgetClass,
} from './test-component';

describe('rendering', () => {
  it('renders correctly', () => {
    const component = shallow(
      <TestComponent />,
    );
    expect(component.type()).toBe('div');
  });

  it('create widget on componentDidMount', () => {
    shallow(
      <TestComponent />,
    );

    expect(WidgetClass.mock.instances.length).toBe(1);
  });

  it('pass templatesRenderAsynchronously to widgets', () => {
    shallow(
      <TestComponent />,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({ templatesRenderAsynchronously: true });
  });

  it('creates nested component', () => {
    mount(
      <TestComponent>
        <TestComponent />
      </TestComponent>,
    );

    expect(WidgetClass.mock.instances.length).toBe(2);
    expect(WidgetClass.mock.instances[1]).toEqual({});
  });

  it('do not pass children to options', () => {
    mount(
      <TestComponent>
        <TestComponent />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1].children).toBeUndefined();
  });
});

describe('element attrs management', () => {
  it('passes id, className and style to element', () => {
    const component = mount(
      <TestComponent id="id1" className="class1" style={{ background: 'red' }} />,
    );

    const node = component.getDOMNode();

    expect(node.id).toBe('id1');
    expect(node.className).toBe('class1');
    expect((node as HTMLElement).style.background).toEqual('red');
  });

  it('updates id, className and style', () => {
    const component = mount(
      <TestComponent id="id1" className="class1" style={{ background: 'red' }} />,
    );

    const node = component.getDOMNode();
    component.setProps({
      id: 'id2',
      className: 'class2',
      style: {
        background: 'blue',
      },
    });

    expect(node.id).toBe('id2');
    expect(node.className).toBe('class2');
    expect((node as HTMLElement).style.background).toEqual('blue');
  });

  it('sets id, className and style after init', () => {
    const component = mount(
      <TestComponent />,
    );

    const node = component.getDOMNode();
    component.setProps({
      id: 'id1',
      className: 'class1',
      style: {
        background: 'red',
      },
    });

    expect(node.id).toBe('id1');
    expect(node.className).toBe('class1');
    expect((node as HTMLElement).style.background).toEqual('red');
  });

  it('cleans className (empty string)', () => {
    const component = mount(
      <TestComponent className="class1" />,
    );

    const node = component.getDOMNode();
    component.setProps({
      className: '',
    });

    expect(node.className).toBe('');
  });

  it('cleans className (undefined)', () => {
    const component = mount(
      <TestComponent className="class1" />,
    );

    const node = component.getDOMNode();
    component.setProps({
      className: undefined,
    });

    expect(node.className).toBe('');
  });
});

describe('disposing', () => {
  it('call dispose', () => {
    const component = shallow(
      <TestComponent />,
    );

    component.unmount();

    expect(Widget.dispose).toBeCalled();
  });

  it('fires dxremove', () => {
    const handleDxRemove = jest.fn();
    const component = mount(
      <TestComponent />,
    );

    events.on(component.getDOMNode(), 'dxremove', handleDxRemove);
    component.unmount();

    expect(handleDxRemove).toHaveBeenCalledTimes(1);
  });

  it('remove option guards', () => {
    const component = shallow(
      <TestComponent option1 />,
    );

    fireOptionChange('option1', false);
    component.unmount();
    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(0);
  });
});
