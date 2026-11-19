import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import RootToolbar from './rootToolbar';

const CLASS = {
  CONTENT: '.dx-htmleditor-content',
};

export default class HtmlEditor extends Widget {
  public getName(): WidgetName { return 'dxHtmlEditor'; }

  public get content(): Locator {
    return this.element.locator(CLASS.CONTENT);
  }

  public get toolbar(): RootToolbar {
    return new RootToolbar(this.page);
  }
}
