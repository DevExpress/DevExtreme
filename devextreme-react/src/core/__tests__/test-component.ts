/* eslint-disable max-classes-per-file */
import { Component } from '../component';

const eventHandlers: { [index: string]: (e?: any) => void } = {};

const Widget = {
  option: jest.fn(),
  resetOption: jest.fn(),
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
  on: (event: string, handler: (e: any) => void): void => {
    eventHandlers[event] = handler;
  },
  dispose: jest.fn(),
};

const WidgetClass = jest.fn(() => Widget);

class TestComponent<P = any> extends Component<P> {
  protected _WidgetClass = WidgetClass;

  _createWidget(element?: Element): void {
    Widget.option.mockImplementation((name: string) => name === 'integrationOptions.useDeferUpdateForTemplates');

    super._createWidget(element);
    Widget.option.mockReset();
  }
}
class TestPortalComponent<P = any> extends TestComponent<P> {
  protected isPortalComponent = true;
}

function fireOptionChange(fullName: string, value: unknown): void {
  eventHandlers.optionChanged({
    name: fullName.split('.')[0],
    fullName,
    value,
  });
}

export {
  TestComponent,
  TestPortalComponent,
  Widget,
  WidgetClass,
  eventHandlers,
  fireOptionChange,
};
