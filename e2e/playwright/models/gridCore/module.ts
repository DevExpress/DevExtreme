import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import FocusableElement from '../internal/focusable';
import Widget from '../internal/widget';

export default class GridModule extends FocusableElement {
  public readonly widgetName: WidgetName;

  constructor(element: Locator, widgetName: WidgetName) {
    super(element);
    this.widgetName = widgetName;
  }

  public addWidgetPrefix(className: string): string {
    return Widget.addClassPrefix(this.widgetName, className);
  }
}
