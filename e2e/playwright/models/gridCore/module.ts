import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import GridElement from './element';

export default class GridModule extends GridElement {
  public readonly widgetName: WidgetName;

  constructor(element: Locator, widgetName: WidgetName) {
    super(element);
    this.widgetName = widgetName;
  }

  public addWidgetPrefix(className: string): string {
    return Widget.addClassPrefix(this.widgetName, className);
  }
}
