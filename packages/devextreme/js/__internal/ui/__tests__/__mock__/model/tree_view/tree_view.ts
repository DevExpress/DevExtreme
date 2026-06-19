import TreeView from '@js/ui/tree_view';

import type { CheckBoxModel } from '../checkbox';
import { TextBoxModel } from '../textbox';
import { NodeModel } from './node';
import type { TreeViewNodeStructure } from './types';

const CLASSES = {
  treeView: 'dx-treeview',
  searchBox: 'dx-treeview-search',
  node: 'dx-treeview-node',
  nodeContainer: 'dx-treeview-node-container',
};

export class TreeViewModel {
  constructor(protected readonly root: HTMLElement) {}

  public getInstance(): TreeView {
    return TreeView.getInstance(this.root) as TreeView;
  }

  public getStructure(): TreeViewNodeStructure[] {
    return this.getRootNodes().map((node) => node.getStructure());
  }

  public expandAll(): void {
    const MAX_DEPTH = 10;
    for (let depth = 0; depth < MAX_DEPTH; depth += 1) {
      const collapsedNodes = this.getNodes().filter((node) => node.isCollapsed());

      if (!collapsedNodes.length) return;
      collapsedNodes.forEach((node) => node.expand());
    }
  }

  public setSearchValue(value: string): void {
    this.getSearchBox().setValue(value);
  }

  public selectItemByText(text: string): void {
    this.getNodeByText(text)?.getCheckBox()?.toggle();
  }

  public getNodeByText(text: string): NodeModel | null {
    return this.getNodes().find((node) => node.getText().includes(text)) ?? null;
  }

  public getCheckboxByText(text: string): CheckBoxModel | null {
    return this.getNodeByText(text)?.getCheckBox() ?? null;
  }

  private getSearchBox(): TextBoxModel {
    return new TextBoxModel(this.root.querySelector(`.${CLASSES.searchBox}`) as HTMLElement);
  }

  private getRootNodes(): NodeModel[] {
    return NodeModel.fromContainer(this.root.querySelector(`.${CLASSES.nodeContainer}`));
  }

  private getNodes(): NodeModel[] {
    return Array.from(this.root.querySelectorAll(`.${CLASSES.node}`))
      .map((element) => new NodeModel(element as HTMLElement));
  }
}
