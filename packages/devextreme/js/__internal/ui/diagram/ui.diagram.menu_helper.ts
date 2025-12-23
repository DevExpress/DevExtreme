/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';
import { getImageContainer } from '@js/core/utils/icon';

const DIAGRAM_CONTEXT_MENU_CLASS = 'dx-diagram-contextmenu';

const DiagramMenuHelper = {
  getContextMenuItemTemplate(contextMenu, itemData, itemIndex, itemElement): void {
    const $itemElement = $(itemElement);
    $itemElement.empty();

    const itemKey = itemData.rootCommand !== undefined ? itemData.rootCommand : -1;
    if (itemData.icon && !itemData.checked) {
      const $iconElement = getImageContainer(itemData.icon);
      if ($iconElement) {
        $itemElement.append($iconElement);
      }
    } else if (
      contextMenu._menuHasCheckedItems
      && contextMenu._menuHasCheckedItems[itemKey] === true
    ) {
      const $checkElement = getImageContainer('check');
      if ($checkElement) {
        $checkElement.css('visibility', !itemData.checked ? 'hidden' : 'visible');
        $itemElement.append($checkElement);
      }
    }
    $itemElement.append(
      // @ts-expect-error ts-error
      `<span class="dx-menu-item-text">${itemData.text}</span>`,
    );
    if (Array.isArray(itemData.items) && itemData.items.length > 0) {
      $itemElement.append(
        // @ts-expect-error ts-error
        '<span class="dx-menu-item-popout-container"><div class="dx-menu-item-popout"></div></span>',
      );
    }
  },
  getContextMenuCssClass(): string {
    return DIAGRAM_CONTEXT_MENU_CLASS;
  },
  onContextMenuItemClick(widget, itemData, actionHandler): void {
    if (
      (itemData.command !== undefined || itemData.name !== undefined)
      && (!Array.isArray(itemData.items) || !itemData.items.length)
    ) {
      // @ts-expect-error ts-error
      const parameter = DiagramMenuHelper.getItemCommandParameter(
        widget,
        itemData,
      );
      actionHandler.call(this, itemData.command, itemData.name, parameter);
    } else if (
      itemData.rootCommand !== undefined
      && itemData.value !== undefined
    ) {
      const parameter = DiagramMenuHelper.getItemCommandParameter(
        widget,
        itemData,
        itemData.value,
      );
      actionHandler.call(this, itemData.rootCommand, undefined, parameter);
    }
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getItemValue(item) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return typeof item.value === 'object'
      ? JSON.stringify(item.value)
      : item.value;
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getItemOptionText(contextMenu, indexPath) {
    if (contextMenu) {
      // eslint-disable-next-line no-param-reassign
      indexPath = indexPath.slice();
      const parentItemOptionText = this._getParentItemOptionText(indexPath);
      if (
        contextMenu._originalItemsInfo?.[parentItemOptionText]
      ) {
        indexPath[indexPath.length - 1]
          += contextMenu._originalItemsInfo[parentItemOptionText].indexPathCorrection;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getItemOptionTextCore(indexPath);
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getParentItemOptionText(indexPath) {
    const parentIndexPath = indexPath.slice(0, indexPath.length - 1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getItemOptionTextCore(parentIndexPath);
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemOptionTextCore(indexPath) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return indexPath.reduce((r, i): string => `${r}items[${i}].`, '');
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getItemCommandParameter(widget, item, value) {
    if (item.getParameter) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return item.getParameter(widget);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  },
  updateContextMenuItems(contextMenu, itemOptionText, rootCommandKey, items): void {
    if (!contextMenu._originalItemsInfo) {
      contextMenu._originalItemsInfo = {};
    }
    if (!contextMenu._originalItemsInfo[itemOptionText]) {
      contextMenu._originalItemsInfo[itemOptionText] = {
        items: contextMenu.option(`${itemOptionText}items`) || [],
      };
    }
    // eslint-disable-next-line no-param-reassign
    items = items.map((item) => ({
      value: this.getItemValue(item),
      text: item.text,
      checked: item.checked,
      widget: contextMenu,
      rootCommand: rootCommandKey,
    }));

    const originalItems = contextMenu._originalItemsInfo[itemOptionText].items;
    contextMenu.option(`${itemOptionText}items`, items.concat(originalItems));

    if (
      contextMenu._originalItemsInfo[itemOptionText]
      && originalItems.length
    ) {
      contextMenu._originalItemsInfo[itemOptionText].indexPathCorrection = items.length;
    }
  },
  updateContextMenuItemVisible(contextMenu, itemOptionText, visible): void {
    contextMenu.option(`${itemOptionText}visible`, visible);
  },
  updateContextMenuItemValue(
    contextMenu,
    itemOptionText,
    rootCommandKey,
    value,
  ): void {
    const items = contextMenu.option(`${itemOptionText}items`);
    if (typeof value === 'boolean' && !items?.length) {
      this._setContextMenuHasCheckedItems(contextMenu, -1);
      contextMenu.option(`${itemOptionText}checked`, value);
    } else if (value !== undefined) {
      this._setContextMenuHasCheckedItems(contextMenu, rootCommandKey);
      if (Array.isArray(items)) {
        items.forEach((item): void => {
          item.checked = item.value === value;
        });
      }
    }
  },
  _setContextMenuHasCheckedItems(contextMenu, key): void {
    if (!contextMenu._menuHasCheckedItems) {
      contextMenu._menuHasCheckedItems = {};
    }
    contextMenu._menuHasCheckedItems[key] = true;
  },
};

export default DiagramMenuHelper;
