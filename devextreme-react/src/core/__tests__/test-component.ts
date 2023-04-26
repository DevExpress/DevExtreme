/* eslint-disable max-classes-per-file */
import { Component } from '../component';

const eventHandlers: { [index: string]: ((e?: any) => void)[] } = {};

const Widget = {
  option: jest.fn(),
  resetOption: jest.fn(),
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
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
  dispose: jest.fn(),
  skipOptionsRollBack: false,
};

const WidgetClass = jest.fn(() => Widget);

class TestComponent<P = any> extends Component<P> {
  protected _WidgetClass = WidgetClass;

  protected useDeferUpdateFlag = true;

  _createWidget(element?: Element): void {
    eventHandlers.optionChanged = [];
    Widget.option.mockImplementation((name: string) => name === 'integrationOptions.useDeferUpdateForTemplates');

    super._createWidget(element);
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
