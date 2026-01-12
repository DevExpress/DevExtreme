import { equalByValue } from '@js/core/utils/common';
import type { Item as TreeViewItemProperties, Properties as TreeViewProperties } from '@js/ui/tree_view';
import dxTreeView from '@js/ui/tree_view';

import { InfernoWrapper } from './widget_wrapper';

export class TreeView<
  TItem extends TreeViewItemProperties = TreeViewItemProperties,
> extends InfernoWrapper<
    TreeViewProperties,
    dxTreeView<TItem>
  > {
  protected getComponentFabric(): typeof dxTreeView {
    return dxTreeView;
  }

  protected updateComponentOptions(prevProps: TreeViewProperties, props: TreeViewProperties): void {
    const itemsOnlySelectionChanged = this.isItemsOnlySelectionChanged(prevProps, props);
    const propsToUpdate = { ...props };

    if (itemsOnlySelectionChanged) {
      this.updateSelection(props.items ?? []);
      delete propsToUpdate.items;
    }

    const scrollTop = this.component?.getScrollable()?.scrollTop();

    super.updateComponentOptions(prevProps, propsToUpdate);

    this.component?.getScrollable()?.scrollTo({ top: scrollTop });
  }

  private isItemsOnlySelectionChanged(
    prevProps: TreeViewProperties,
    props: TreeViewProperties,
  ): boolean {
    const oldItems = (prevProps.items ?? []).map(({ selected, ...restProps }: TItem) => restProps);
    const newItems = (props.items ?? []).map(({ selected, ...restProps }: TItem) => restProps);

    const onlySelectionChanged = equalByValue(oldItems, newItems);

    return onlySelectionChanged;
  }

  private updateSelection(items: TItem[]): void {
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
