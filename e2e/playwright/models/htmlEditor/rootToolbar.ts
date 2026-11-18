import type { Page } from '@playwright/test';
import Toolbar from '../toolbar';
import ToolbarItem from '../toolbar/toolbarItem';

const CLASS = {
  ROOT: '.dx-htmleditor-toolbar',
};

type ToolbarItemName = 'image' | 'color' | 'link' | 'ai' | 'bold' | 'italic';

export default class RootToolbar extends Toolbar {
  constructor(page: Page) {
    super(page, CLASS.ROOT);
  }

  public getItemByName(itemName: ToolbarItemName): ToolbarItem {
    return new ToolbarItem(this.element.locator(`.dx-${itemName}-format`));
  }
}
