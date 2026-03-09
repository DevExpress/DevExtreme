import TreeView from '@js/ui/tree_view';

import { CheckBoxModel } from './checkbox';
import { TextBoxModel } from './textbox';

const CLASSES = {
  treeView: 'dx-treeview',
  searchBox: 'dx-treeview-search',
  node: 'dx-treeview-node',
  item: 'dx-treeview-item',
  checkbox: 'dx-checkbox',
};

export class TreeViewModel {
  constructor(protected readonly root: HTMLElement) {}

  public getInstance(): TreeView {
    return TreeView.getInstance(this.root) as TreeView;
  }

  private getSearchBox(): TextBoxModel {
    return new TextBoxModel(this.root?.querySelector(`.${CLASSES.searchBox}`) as HTMLElement);
  }

  public setSearchValue(value: string): void {
    const searchBox = this.getSearchBox();
    searchBox.setValue(value);
  }

  private getNodes(): NodeListOf<HTMLElement> | null {
    return this.root?.querySelectorAll(`.${CLASSES.node}`) ?? null;
  }

  public getNodeByText(text: string): HTMLElement | null {
    const nodes = this.getNodes();
    if (!nodes) return null;

    const foundNode = Array.from(nodes).find((node) => {
      const itemElement = node.querySelector(`.${CLASSES.item}`);
      const nodeText = itemElement?.textContent;
      return nodeText?.includes(text);
    }) ?? null;

    return foundNode;
  }

  public getCheckboxByText(text: string): CheckBoxModel | null {
    const node = this.getNodeByText(text);
    const checkboxElement = node?.querySelector(`.${CLASSES.checkbox}`) as HTMLElement;
    return checkboxElement ? new CheckBoxModel(checkboxElement) : null;
  }
}
