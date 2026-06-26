import { CheckBoxModel } from '../checkbox';
import type { TreeViewNodeStructure } from './types';

const CLASSES = {
  node: 'dx-treeview-node',
  item: 'dx-treeview-item',
  itemContent: 'dx-treeview-item-content',
  nodeContainer: 'dx-treeview-node-container',
  toggle: 'dx-treeview-toggle-item-visibility',
  checkbox: 'dx-checkbox',
};

const SELECTORS = {
  collapsed: '[aria-expanded="false"]',
};

export class NodeModel {
  constructor(private readonly root: HTMLElement) {}

  public static fromContainer(container: Element | null): NodeModel[] {
    if (!container) return [];

    return Array.from(container.children)
      .filter((element) => element.classList.contains(CLASSES.node))
      .map((element) => new NodeModel(element as HTMLElement));
  }

  public getElement(): HTMLElement {
    return this.root;
  }

  public getText(): string {
    return this.root.querySelector(`:scope > .${CLASSES.item} > .${CLASSES.itemContent}`)?.textContent ?? '';
  }

  public isCollapsed(): boolean {
    return this.root.matches(SELECTORS.collapsed);
  }

  public expand(): void {
    if (this.isCollapsed()) {
      this.root.querySelector<HTMLElement>(`.${CLASSES.toggle}`)?.click();
    }
  }

  public getCheckBox(): CheckBoxModel | null {
    const checkbox = this.root.querySelector<HTMLElement>(`.${CLASSES.checkbox}`);
    return checkbox ? new CheckBoxModel(checkbox) : null;
  }

  public getChildren(): NodeModel[] {
    return NodeModel.fromContainer(this.root.querySelector(`:scope > .${CLASSES.nodeContainer}`));
  }

  public getStructure(): TreeViewNodeStructure {
    return {
      text: this.getText(),
      children: this.getChildren().map((child) => child.getStructure()),
    };
  }
}
