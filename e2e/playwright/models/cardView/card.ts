import type { Locator } from '@playwright/test';
import GridModule from '../gridCore/module';

export const CLASS = {
  header: 'card-header',
  toolbarItem: 'dx-toolbar-item',
};

export default class Card extends GridModule {
  public getHeader(): Locator {
    return this.element.locator(`.${this.addWidgetPrefix(CLASS.header)}`);
  }

  public getToolbarItem(index: number): Locator {
    return this.getHeader().locator(`.${CLASS.toolbarItem}`).nth(index);
  }
}
