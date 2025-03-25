import { equalByValue } from '@js/core/utils/common';
import type { Item as TreeViewItemProperties, Properties as TreeViewProperties } from '@js/ui/tree_view';
import dxTreeView from '@js/ui/tree_view';

import { InfernoWrapper } from './widget_wrapper';

export class TreeView extends InfernoWrapper<TreeViewProperties, dxTreeView> {
  protected getComponentFabric(): typeof dxTreeView {
    return dxTreeView;
  }

  protected updateComponentOptions(prevProps: TreeViewProperties, props: TreeViewProperties): void {
    const itemsOnlySelectionChanged = this.isItemsOnlySelectionChanged(prevProps, props);
    const updatedPrevProps = { ...prevProps };

    if (itemsOnlySelectionChanged) {
      this.updateSelection(props.items ?? []);
      updatedPrevProps.items = props.items;
    }

    const scrollTop = this.component?.getScrollable()?.scrollTop();

    super.updateComponentOptions(updatedPrevProps, props);

    this.component?.getScrollable()?.scrollTo({ top: scrollTop });
  }

  private isItemsOnlySelectionChanged(
    prevProps: TreeViewProperties,
    props: TreeViewProperties,
  ): boolean {
    const oldItems = prevProps.items ?? [];
    const newItems = props.items ?? [];

    if (oldItems.length !== newItems.length) {
      return false;
    }

    for (let i = 0; i < newItems.length; i += 1) {
      oldItems[i].selected = newItems[i].selected;
    }

    const onlySelectionChanged = equalByValue(oldItems, newItems);

    return onlySelectionChanged;
  }

  private updateSelection(items: TreeViewItemProperties[]): void {
    const treeView = this.component;

    if (!treeView) {
      return;
    }

    const selectedKeys = treeView.getSelectedNodeKeys();

    treeView.beginUpdate();

    items.forEach((item, index) => {
      const isSelected = selectedKeys.includes(item.id);

      if (item.selected && !isSelected) {
        treeView.selectItem(index);
      }
      if (!item.selected && isSelected) {
        treeView.unselectItem(index);
      }
    });

    treeView.endUpdate();
  }
}
