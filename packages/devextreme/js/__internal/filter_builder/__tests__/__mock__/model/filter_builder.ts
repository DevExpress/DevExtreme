import { PopupModel } from '@ts/ui/__tests__/__mock__/model/popup';
import { TreeViewModel } from '@ts/ui/__tests__/__mock__/model/tree_view';

const CLASSES = {
  filterBuilder: 'dx-filterbuilder',
  groupOperation: 'dx-filterbuilder-group-operation',
  treeView: 'dx-treeview',
  popupWrapper: 'dx-popup-wrapper',
  itemField: 'dx-filterbuilder-item-field',
  itemOperation: 'dx-filterbuilder-item-operation',
};

export class FilterBuilderModel extends PopupModel {
  public getElement(): HTMLElement {
    const content = this.getOverlayContent();
    return content?.querySelector<HTMLElement>(`.${CLASSES.filterBuilder}`) as HTMLElement;
  }

  public getGroupOperationButton(): HTMLElement {
    const element = this.getElement();
    return element.querySelector<HTMLElement>(`.${CLASSES.groupOperation}`) as HTMLElement;
  }

  public getFieldButton(): HTMLElement {
    const element = this.getElement();
    return element.querySelector<HTMLElement>(`.${CLASSES.itemField}`) as HTMLElement;
  }

  public getOperationButton(): HTMLElement {
    const element = this.getElement();
    return element.querySelector<HTMLElement>(`.${CLASSES.itemOperation}`) as HTMLElement;
  }

  public getTreeView(): TreeViewModel {
    const popups = Array.from(document.body.querySelectorAll<HTMLElement>(`.${CLASSES.popupWrapper}`));
    const treeViewPopup = popups.find((popup) => popup.querySelector(`.${CLASSES.treeView}`));
    const treeViewElement = treeViewPopup?.querySelector<HTMLElement>(`.${CLASSES.treeView}`);

    return new TreeViewModel(treeViewElement as HTMLElement);
  }
}
