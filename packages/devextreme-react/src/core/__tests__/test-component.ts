/* eslint-disable max-classes-per-file */
import { Component, IHtmlOptions } from '../component';
import DOMComponent from 'devextreme/core/dom_component';
const eventHandlers: { [index: string]: ((e?: any) => void)[] } = {};

const Widget = {
  option: jest.fn(),
  resetOption: jest.fn(),
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
  focus: jest.fn(),
  element: (undefined as unknown as Element),
  on: (event: string, handler: (e: any) => void): void => {
    if (eventHandlers[event]) {
      eventHandlers[event].push(handler);
    } else {
      eventHandlers[event] = [handler];
    }
  },
  off: (event: string, handler: (e: any) => void) => {
    eventHandlers[event] = eventHandlers[event].filter((e) => e !== handler);
  },
  clearExtensions: jest.fn(),
  dispose: jest.fn(() => {
    if (Widget.element) {
      const dxDomComponent = new DOMComponent(Widget.element);
      dxDomComponent.dispose();
    }
  }),
  skipOptionsRollBack: false,
};

const WidgetClass = jest.fn<typeof Widget, any>(() => Widget);

class TestComponent<P = any> extends Component<P & IHtmlOptions> {
  protected _WidgetClass = WidgetClass;

  protected useDeferUpdateFlag = true;

  get element(): HTMLElement {
    return this._element;
  }

  get instance(): any {
    return {
      element: () => this.element,
    };
  }

  _createWidget(element?: Element): void {
    eventHandlers.optionChanged = [];
    Widget.option.mockImplementation((name: string) => name === 'integrationOptions.useDeferUpdateForTemplates');

    super._createWidget(element);
    Widget.element = this._element;
    Widget.option.mockReset();
  }

  clearExtensions(): void {
    super.clearExtensions();
    Widget.clearExtensions();
  }
}
class TestPortalComponent<P = any> extends TestComponent<P> {
  protected isPortalComponent = true;
}

function fireOptionChange(fullName: string, value: unknown): void {
  eventHandlers.optionChanged?.forEach((e) => e({
    name: fullName.split('.')[0],
    fullName,
    value,
  }));
}

export {
  TestComponent,
  TestPortalComponent,
  Widget,
  WidgetClass,
  eventHandlers,
  fireOptionChange,
};
