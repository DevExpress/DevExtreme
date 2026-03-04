import { PopupModel } from '@ts/ui/__tests__/__mock__/model/popup';

const CLASSES = {
  headerFilterMenu: 'dx-header-filter-menu',
  listItemContent: 'dx-list-item-content',
};

const SELECTORS = {
  okButton: '[role="button"][aria-label*="OK"]',
};

export class HeaderFilterModel extends PopupModel {
  public getOKButton(): HTMLElement {
    const popup = this.getPopupWrapper();
    return popup?.querySelector(SELECTORS.okButton) as HTMLElement;
  }

  public getListItems(): HTMLElement[] {
    const popup = this.getPopupWrapper();
    const listItems = popup?.querySelectorAll(`.${CLASSES.listItemContent}`);
    return Array.from(listItems ?? []) as HTMLElement[];
  }

  public getListItem(index: number): HTMLElement {
    const listItems = this.getListItems();
    return listItems[index];
  }
}
