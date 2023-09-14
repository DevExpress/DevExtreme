import Toolbar from '../toolbar';

const CLASS = {
  ROOT: '.dx-htmleditor-toolbar',
};

type ToolbarItemName = 'image' | 'color' | 'link';

export default class RootToolbar extends Toolbar {
  constructor() {
    super(CLASS.ROOT);
  }

  public getItemByName(itemName: ToolbarItemName): Selector {
    return this.element.find(`.dx-${itemName}-format`).parent().parent();
  }
}
