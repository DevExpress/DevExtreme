import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import { expectClass } from '../internal/classMatcher';
import Widget from '../internal/widget';
import GridElement from './element';

const CLASS = {
  focusedState: 'dx-state-focused',
};

export default class GridModule extends GridElement {
  public readonly widgetName: WidgetName;

  constructor(element: Locator, widgetName: WidgetName) {
    super(element);
    this.widgetName = widgetName;
  }

  public addWidgetPrefix(className: string): string {
    return Widget.addClassPrefix(this.widgetName, className);
  }

  // The grid marks the view that holds the keyboard focus.
  public expectFocusedState(present = true): Promise<void> {
    return expectClass(this.element, CLASS.focusedState, present);
  }
}
