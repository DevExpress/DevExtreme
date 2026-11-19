import type { Locator } from '@playwright/test';
import GridModule from '../gridCore/module';
import HeaderItem from './headerItem';

const CLASS = {
  headerItem: 'header-item',
  link: 'link',
};

export default class HeaderPanel extends GridModule {
  public getHeaderItem(idx = 0): HeaderItem {
    const itemSelector = `.${this.addWidgetPrefix(CLASS.headerItem)}`;

    return new HeaderItem(this.element.locator(itemSelector).nth(idx));
  }

  public getColumnChooserLink(): Locator {
    return this.element.locator(`.dx-${CLASS.link}`);
  }
}
