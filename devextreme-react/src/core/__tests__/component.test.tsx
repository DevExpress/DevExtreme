import * as events from 'devextreme/events';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { isIE } from '../configuration/utils';
import {
  fireOptionChange,
  TestComponent,
  TestPortalComponent,
  Widget,
  WidgetClass,
} from './test-component';
import { TemplatesRenderer } from '../templates-renderer';

jest.useFakeTimers();

jest.mock('../configuration/utils', () => ({
  ...require.requireActual('../configuration/utils'),
  isIE: jest.fn(),
}));

describe('rendering', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders component without children correctly', () => {
    const templatesRendererRenderFn = jest.spyOn(TemplatesRenderer.prototype, 'render');
    const { container } = render(<TestComponent />);

    expect(container.children.length).toBe(1);

    const content = container.firstChild as HTMLElement;
    expect(content.tagName.toLowerCase()).toBe('div');

    expect(templatesRendererRenderFn).toHaveBeenCalledTimes(1);
  });

  it('renders component with children correctly', () => {
    const templatesRendererRenderFn = jest.spyOn(TemplatesRenderer.prototype, 'render');
    const { container } = render(
      <TestComponent>
        <span />
      </TestComponent>,
    );

    expect(container.children.length).toBe(1);

    const content = container.firstChild as HTMLElement;
    expect(content.tagName.toLowerCase()).toBe('div');
    expect(content.children.length).toBe(1);
    expect(content.children[0].tagName.toLowerCase()).toBe('span');

    expect(templatesRendererRenderFn).toHaveBeenCalledTimes(1);
  });

  it('renders portal component without children correctly', () => {
    const createPortalFn = jest.spyOn(ReactDOM, 'createPortal');
    const templatesRendererRenderFn = jest.spyOn(TemplatesRenderer.prototype, 'render');
    const { container } = render(<TestPortalComponent />);

    expect(container.children.length).toBe(1);

    const content = container.firstChild as HTMLElement;
    expect(content.tagName.toLowerCase()).toBe('div');

    expect(createPortalFn).not.toHaveBeenCalled();
    expect(templatesRendererRenderFn).toHaveBeenCalledTimes(1);
  });

  it('renders portal component with children correctly', () => {
    const createPortalFn = jest.spyOn(ReactDOM, 'createPortal');
    const templatesRendererRenderFn = jest.spyOn(TemplatesRenderer.prototype, 'render');
    const { container } = render(
      <TestPortalComponent>
        <span />
      </TestPortalComponent>,
    );

    expect(container.children.length).toBe(1);

    const content = container.firstChild as HTMLElement;
    expect(content.tagName.toLowerCase()).toBe('div');
    expect(content.children.length).toBe(1);

    const portal = content.firstChild as HTMLElement;
    expect(portal.tagName.toLowerCase()).toBe('div');
    expect(portal.style).toMatchObject({
      display: 'contents',
    });
    expect(portal.children.length).toBe(1);
    expect(portal.children[0].tagName.toLowerCase()).toBe('span');

    expect(createPortalFn).toHaveBeenCalledTimes(1);
    expect(templatesRendererRenderFn).toHaveBeenCalledTimes(2);
  });

  it('renders portal component with children correctly (IE11)', () => {
    (isIE as jest.Mock).mockImplementation(() => true);
    const templatesRendererRenderFn = jest.spyOn(TemplatesRenderer.prototype, 'render');
    const { container } = render(
      <TestPortalComponent>
        <span />
      </TestPortalComponent>,
    );

    expect(container.children.length).toBe(1);

    const content = container.firstChild as HTMLElement;
    expect(content.tagName.toLowerCase()).toBe('div');
    expect(content.children.length).toBe(1);

    const portal = content.firstChild as HTMLElement;
    expect(portal.tagName.toLowerCase()).toBe('div');
    expect(portal.style).toMatchObject({
      width: '100%',
      height: '100%',
      padding: '0px',
      margin: '0px',
    });
    expect(portal.children.length).toBe(1);
    expect(portal.children[0].tagName.toLowerCase()).toBe('span');

    expect(templatesRendererRenderFn).toHaveBeenCalledTimes(2);
  });

  it('create widget on componentDidMount', () => {
    render(<TestComponent />);

    expect(WidgetClass.mock.instances.length).toBe(1);
  });

  it('pass templatesRenderAsynchronously to widgets', () => {
    render(
      <TestComponent />,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({ templatesRenderAsynchronously: true });
  });

  it('creates nested component', () => {
    render(
      <TestComponent>
        <TestComponent />
      </TestComponent>,
    );

    expect(WidgetClass.mock.instances.length).toBe(2);
    expect(WidgetClass.mock.instances[1]).toEqual({});
  });

  it('do not pass children to options', () => {
    render(
      <TestComponent>
        <TestComponent />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1].children).toBeUndefined();
  });
});

describe('element attrs management', () => {
  it('passes id, className and style to element', () => {
    const { container } = render(
      <TestComponent id="id1" className="class1" style={{ background: 'red' }} />, {
      },
    );

    const element: HTMLElement = container.firstChild as HTMLElement;

    expect(element.id).toBe('id1');
    expect(element.className).toBe('class1');
    expect(element.style.background).toEqual('red');
  });

  it('updates id, className and style', () => {
    const { container, rerender } = render(
      <TestComponent id="id1" className="class1" style={{ background: 'red' }} />,
    );

    rerender(
      <TestComponent
        id="id2"
        className="class2"
        style={{ background: 'blue' }}
      />,
    );

    const element: HTMLElement = container.firstChild as HTMLElement;

    expect(element.id).toBe('id2');

    expect(element.className).toBe('class2');
    expect(element.style.background).toEqual('blue');
  });

  it('sets id, className and style after init', () => {
    const { container, rerender } = render(
      <TestComponent />,
    );

    rerender(
      <TestComponent
        id="id1"
        className="class1"
        style={{ background: 'red' }}
      />,
    );

    const element: HTMLElement = container.firstChild as HTMLElement;

    expect(element.id).toBe('id1');
    expect(element.className).toBe('class1');
    expect(element.style.background).toEqual('red');
  });

  it('cleans className (empty string)', () => {
    const { container, rerender } = render(
      <TestComponent className="class1" />,
    );

    rerender(
      <TestComponent
        className=""
      />,
    );

    expect(container.className).toBe('');
  });

  it('cleans className (undefined)', () => {
    const { container, rerender } = render(
      <TestComponent className="class1" />,
    );

    rerender(<TestComponent />);
    const element: HTMLElement = container.firstChild as HTMLElement;

    expect(element.className).toBe('');
  });
});

describe('disposing', () => {
  it('call dispose', () => {
    const component = render(
      <TestComponent />,
    );

    component.unmount();

    expect(Widget.dispose).toBeCalled();
  });

  it('fires dxremove', () => {
    const handleDxRemove = jest.fn();
    const { container, unmount } = render(
      <TestComponent />,
    );

    const element: HTMLElement = container.firstChild as HTMLElement;

    events.on(element, 'dxremove', handleDxRemove);

    unmount();
    expect(handleDxRemove).toHaveBeenCalledTimes(1);
  });

  it('remove option guards', () => {
    const component = render(
      <TestComponent option1 />,
    );

    fireOptionChange('option1', false);
    component.unmount();
    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(0);
  });
});
