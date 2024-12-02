import * as events from 'devextreme/events';
import config from 'devextreme/core/config';
import * as testingLib from '@testing-library/react';
import * as React from 'react';
import { useLayoutEffect } from 'react';
import * as ReactDOM from 'react-dom';
import {
  fireOptionChange,
  TestComponent,
  TestComponentRef,
  TestPortalComponent,
  TestRestoreTreeComponent,
  Widget,
  WidgetClass,
} from './test-component';
import { TemplateDiscoveryContext } from '../contexts';


jest.useFakeTimers();
jest.mock('react-dom', () => ({
  __esModule: true,
  default: jest.requireActual('react-dom'),
  ...jest.requireActual('react-dom'),
}));

jest.mock('../configuration/utils', () => ({
  ...jest.requireActual('../configuration/utils'),
  isIE: jest.fn(),
}));

describe('rendering', () => {
  afterEach(() => {
    jest.clearAllMocks();
    testingLib.cleanup();
    testingLib.configure({ reactStrictMode: false });
  });

  it('renders component without children correctly', () => {
    const { container } = testingLib.render(<TestComponent />);

    expect(container.children.length).toBe(1);

    const content = container.firstChild as HTMLElement;
    expect(content.tagName.toLowerCase()).toBe('div');
  });

  it('renders component with children correctly', () => {

    const { container } = testingLib.render(
      <TestComponent>
        <span />
      </TestComponent>,
    );

    expect(container.children.length).toBe(1);

    const content = container.firstChild as HTMLElement;
    expect(content.tagName.toLowerCase()).toBe('div');
    expect(content.children.length).toBe(1);
    expect(content.children[0].tagName.toLowerCase()).toBe('span');
  });

  it('renders component with children correctly after unmount', () => {
    testingLib.configure({ reactStrictMode: true });

    const component = (
      <TestComponent>
        <div>Test</div>
      </TestComponent>
    );
    const { container } = testingLib.render(component);

    expect(container.children.length).toBe(1);

    const content = container.firstChild as HTMLElement;
    expect(content.tagName.toLowerCase()).toBe('div');
    expect(content.children.length).toBe(1);
    expect(content.children[0].tagName.toLowerCase()).toBe('div');
  });

  describe('accessing instance()', () => {
    let componentRendered = false;

    beforeEach(() => {
      WidgetClass.mockImplementation(() => {
        componentRendered = true;
        return Widget;
      })
    });

    afterEach(() => {
      WidgetClass.mockImplementation(() => Widget);
      componentRendered = false;
    });

    const MyComponent = () => {
      useLayoutEffect(() => {
        expect(componentRendered).toBeTruthy();
      })

      return (
        <TestComponent />
      );
    };

    it('renders a widget before ref callback', () => {
      expect.assertions(2);

      const ref = () => {
        expect(componentRendered).toBeTruthy();
      }
      const { unmount } = testingLib.render(<TestComponent ref={ref} />);

      // required to make the second call to ref callback (on unmount)
      // happen sooner than the afterEach cleanup method
      unmount();
    });

    it('renders a widget before useLayoutEffect', () => {
      expect.assertions(1);

      testingLib.render(<MyComponent />);
    });

    it('correctly sets the buy now link', () => {
      expect(config().buyNowLink).toBe('https://go.devexpress.com/Licensing_Installer_Watermark_DevExtremeReact.aspx');
    });

    it('correctly sets the help link', () => {
      expect(config().licensingDocLink).toBe('https://go.devexpress.com/Licensing_Documentation_DevExtremeReact.aspx');
    });
  });

  describe('nested full components', () => {
    let didRenderToDetachedBranch = false;

    beforeEach(() => {
      WidgetClass.mockImplementation((element: Element, options: any) => {
        didRenderToDetachedBranch = didRenderToDetachedBranch || (!element.isConnected && options.isTemplateTested === false);
        return Widget;
      })
    });

    afterEach(() => {
      WidgetClass.mockImplementation(() => Widget);
    });

    it('does not render a nested component\'s widget to a detached DOM branch in Strict Mode', () => {
      testingLib.configure({ reactStrictMode: true });

      const InnerComponent = () => {
        const { discoveryRendering: isTemplateTested } = React.useContext(TemplateDiscoveryContext);

        return (
          <TestComponent isTemplateTested={isTemplateTested}>
            <div>Test</div>
          </TestComponent>
        );
      };

      const component = (
        <TestComponent>
          <InnerComponent/>
        </TestComponent>
      );
      testingLib.render(component);
  
      expect(didRenderToDetachedBranch).toBeFalsy();
    });

    it('does not restore the parent tree if its child elements are still attached', () => {
      testingLib.configure({ reactStrictMode: true });

      const TreeComponentRef = React.createRef<{ restoreTree?: () => void }>();
      const ParentComponentRef = React.createRef<TestComponentRef>();

      const component = (
        <TestComponent ref={ParentComponentRef}>
          <span>Span Element</span>
          <TestRestoreTreeComponent ref={TreeComponentRef} />
        </TestComponent>
      );

      testingLib.render(component);

      const element = ParentComponentRef.current!.instance().element()!;
      const appendFn = jest.spyOn(element, 'append');

      testingLib.act(() => {
        TreeComponentRef.current?.restoreTree?.();
      });

      expect(appendFn).toHaveBeenCalledTimes(0);
    });
  });

  it('renders portal component without children correctly', () => {
    const createPortalFn = jest.spyOn(ReactDOM, 'createPortal');
    const { container } = testingLib.render(<TestPortalComponent />);

    expect(container.children.length).toBe(1);

    const content = container.firstChild as HTMLElement;
    expect(content.tagName.toLowerCase()).toBe('div');

    expect(createPortalFn.mock.calls.some(call => {
      const reactElement = call[0] as unknown as React.ReactElement;

      return reactElement.type !== TemplateDiscoveryContext.Provider
    })).toBeFalsy();
  });

  it('renders portal component with children correctly', () => {
    const createPortalFn = jest.spyOn(ReactDOM, 'createPortal');
    const { container } = testingLib.render(
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

    expect(createPortalFn.mock.calls.filter(call => {
      const reactElement = call[0] as unknown as React.ReactElement;

      return reactElement.type !== TemplateDiscoveryContext.Provider
    }).length).toEqual(1);
  });

  it('create widget on componentDidMount', () => {
    testingLib.render(<TestComponent />);

    expect(WidgetClass.mock.instances.length).toBe(1);
  });

  it('pass templatesRenderAsynchronously to widgets', () => {
    testingLib.render(
      <TestComponent />,
    );

    expect(WidgetClass.mock.calls[0][1]).toEqual({ templatesRenderAsynchronously: true });
  });

  it('creates nested component', () => {
    testingLib.render(
      <TestComponent>
        <TestComponent />
      </TestComponent>,
    );

    expect(WidgetClass.mock.instances.length).toBe(3);
    expect(WidgetClass.mock.instances[2]).toEqual({});
  });

  it('clears nested option in strict mode', () => {
    testingLib.render(
      <React.StrictMode>
        <TestComponent>
          <TestComponent />
        </TestComponent>
      </React.StrictMode>,
    );
    expect(Widget.clearExtensions).toHaveBeenCalledTimes(6);
  });

  it('do not pass children to options', () => {
    testingLib.render(
      <TestComponent>
        <TestComponent />
      </TestComponent>,
    );

    expect(WidgetClass.mock.calls[1][1].children).toBeUndefined();
  });
});

describe('element attrs management', () => {
  it('passes id, className and style to element', () => {
    const { container } = testingLib.render(
      <TestComponent id="id1" className="class1" style={{ background: 'red' }} />,
      {},
    );

    const element: HTMLElement = container.firstChild as HTMLElement;

    expect(element.id).toBe('id1');
    expect(element.className).toBe('class1');
    expect(element.style.background).toEqual('red');
  });

  it('element inline styles management in strict mode (T1180862)', () => {
    const { container } = testingLib.render(
        <React.StrictMode>
          <TestComponent style={{ color: 'red' }} />
        </React.StrictMode>,
    );

    const element: HTMLElement = container?.firstChild as HTMLElement;

    expect(element.style.color).toEqual('red');
  });

  it('updates id, className and style', () => {
    const { container, rerender } = testingLib.render(
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
    const { container, rerender } = testingLib.render(
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
    const { container, rerender } = testingLib.render(
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
    const { container, rerender } = testingLib.render(
      <TestComponent className="class1" />,
    );

    rerender(<TestComponent />);
    const element: HTMLElement = container.firstChild as HTMLElement;

    expect(element.className).toBe('');
  });
});

describe('disposing', () => {
  it('call dispose', () => {
    const component = testingLib.render(
      <TestComponent />,
    );

    component.unmount();

    expect(Widget.dispose).toBeCalled();
  });

  it('fires dxremove', () => {
    const handleDxRemove = jest.fn();
    const { container, unmount } = testingLib.render(
      <TestComponent />,
    );

    const element: HTMLElement = container.firstChild as HTMLElement;

    events.on(element, 'dxremove', handleDxRemove);

    unmount();
    expect(handleDxRemove).toHaveBeenCalledTimes(1);
  });

  it('remove option guards', () => {
    const component = testingLib.render(
      <TestComponent option1 />,
    );

    fireOptionChange('option1', false);
    component.unmount();
    jest.runAllTimers();

    expect(Widget.option.mock.calls.length).toBe(0);
  });

  it('saves and restores focus state after dispose', async () => {
    let firstRender = true;
  
    WidgetClass.mockImplementation((container: HTMLElement) => {
      const input = document.createElement('input');

      container.appendChild(input);

      if (firstRender) {
        input.focus();
      }

      firstRender = false;

      return Widget;
    })

    testingLib.render(
      <React.StrictMode>
        <TestComponent />
      </React.StrictMode>
    );

    expect(Widget.focus).toHaveBeenCalledTimes(1);
  });
});
