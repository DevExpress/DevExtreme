import { TreeViewModel } from '@ts/ui/__tests__/__mock__/model/tree_view';

const CLASSES = {
  columnChooser: 'dx-datagrid-column-chooser',
  columnChooserList: 'dx-datagrid-column-chooser-list',
  popupWrapper: 'dx-popup-wrapper',
};

export class ColumnChooserModel {
  constructor(protected readonly root: HTMLElement) {}

  private getPopupWrapper(): HTMLElement | null {
    return document.body.querySelector(`.${CLASSES.popupWrapper}.${CLASSES.columnChooser}`);
  }

  private getOverlay(): HTMLElement | null {
    const wrapper = this.getPopupWrapper();
    return wrapper?.querySelector('.dx-overlay-content') ?? null;
  }

  private getTreeView(): TreeViewModel | null {
    const overlay = this.getOverlay();
    if (!overlay) return null;

    const treeViewElement = overlay.querySelector(`.${CLASSES.columnChooserList}`) as HTMLElement;
    return treeViewElement ? new TreeViewModel(treeViewElement) : null;
  }

  public isVisible(): boolean {
    return this.getOverlay() !== null;
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
