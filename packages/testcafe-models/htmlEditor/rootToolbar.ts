import Toolbar from '../toolbar';
import ToolbarItem from '../toolbar/toolbarItem';

const CLASS = {
  ROOT: '.dx-htmleditor-toolbar',
};

type ToolbarItemName = 'image' | 'color' | 'link' | 'ai' | 'bold' | 'italic';

export default class RootToolbar extends Toolbar {
  constructor() {
    super(CLASS.ROOT);
  }

  public getItemByName(itemName: ToolbarItemName): ToolbarItem {
    return new ToolbarItem(this.element.find(`.dx-${itemName}-format`));
  }
}
