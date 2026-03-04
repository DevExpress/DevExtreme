import { PopupModel } from '@ts/ui/__tests__/__mock__/model/popup';
import { TreeViewModel } from '@ts/ui/__tests__/__mock__/model/tree_view';

export class ColumnChooserModel extends PopupModel {
  private readonly columnChooserListClass: string;

  constructor(widgetName: string) {
    super();
    this.columnChooserListClass = `dx-${widgetName}-column-chooser-list`;
  }

  private getTreeView(): TreeViewModel | null {
    const overlay = this.getOverlayContent();
    if (!overlay) return null;

    const treeViewElement = overlay.querySelector(`.${this.columnChooserListClass}`) as HTMLElement;
    return treeViewElement ? new TreeViewModel(treeViewElement) : null;
  }

  public searchColumn(text: string): void {
    const treeView = this.getTreeView();
    treeView?.setSearchValue(text);
  }

  public toggleColumn(columnText: string): void {
    const treeView = this.getTreeView();
    const checkBox = treeView?.getCheckboxByText(columnText);
    checkBox?.toggle();
  }
}
