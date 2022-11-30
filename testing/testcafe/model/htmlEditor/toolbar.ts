type ToolbarItemName = 'image' | 'color';

export default class Toolbar {
  private readonly htmlEditor: Selector;

  constructor(htmlEditor: Selector) {
    this.htmlEditor = htmlEditor;
  }

  public item(itemName: ToolbarItemName): Selector {
    return this.htmlEditor.find(`.dx-${itemName}-format`).parent().parent();
  }
}
