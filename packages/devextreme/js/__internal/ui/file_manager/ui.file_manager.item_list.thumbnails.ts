/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { name as contextMenuEventName } from '@js/common/core/events/contextmenu';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import { OPERATIONS } from '@ts/ui/file_manager/file_items_controller';
import { getDisplayFileSize } from '@ts/ui/file_manager/ui.file_manager.common';
import FileManagerItemListBase from '@ts/ui/file_manager/ui.file_manager.item_list';
import FileManagerThumbnailListBox from '@ts/ui/file_manager/ui.file_manager.items_list.thumbnails.list_box';

const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS = 'dx-filemanager-thumbnails';
const FILE_MANAGER_THUMBNAILS_ITEM_CLASS = 'dx-filemanager-thumbnails-item';
const FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS = 'dx-filemanager-thumbnails-item-thumbnail';

const FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE = 'dxFileManager_thumbnails';

class FileManagerThumbnailsItemList extends FileManagerItemListBase {
  _itemList?: FileManagerThumbnailListBox;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _refreshDeferred?: DeferredObj<any>;

  _initMarkup(): void {
    super._initMarkup();

    this.$element().addClass(FILE_MANAGER_THUMBNAILS_ITEM_LIST_CLASS);

    const contextMenuEvent = addNamespace(
      contextMenuEventName,
      FILE_MANAGER_THUMBNAILS_EVENT_NAMESPACE,
    );
    eventsEngine.on(
      this.$element(),
      contextMenuEvent,
      this._onContextMenu.bind(this),
    );

    this._createItemList();
  }

  _createItemList(): void {
    const selectionMode = this._isMultipleSelectionMode()
      ? 'multiple'
      : 'single';

    const {
      selectedItemKeys,
      focusedItemKey,
    } = this.option();

    const $itemListContainer = $('<div>').appendTo(this.$element());
    this._itemList = this._createComponent(
      $itemListContainer,
      FileManagerThumbnailListBox,
      {
        dataSource: this._createDataSource(),
        selectionMode,
        selectedItemKeys,
        focusedItemKey,
        activeStateEnabled: true,
        hoverStateEnabled: true,
        loopItemFocus: false,
        focusStateEnabled: true,
        onItemEnterKeyPressed: this._tryOpen.bind(this),
        itemThumbnailTemplate: this._getItemThumbnailContainer.bind(this),
        getTooltipText: this._getTooltipText.bind(this),
        // @ts-expect-error ts-error
        onSelectionChanged: this._onItemListSelectionChanged.bind(this),
        onFocusedItemChanged: this._onItemListFocusedItemChanged.bind(this),
        onContentReady: this._onContentReady.bind(this),
      },
    );
  }

  _onContextMenu(e): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this._isDesktop()) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: any = null;
    const targetItemElement = $(e.target).closest(this._getItemSelector());
    let targetItem = null;
    if (targetItemElement.length > 0) {
      targetItem = this._itemList?.getItemByItemElement(targetItemElement);
      this._itemList?.selectItem(targetItem);
      items = this._getFileItemsForContextMenu(targetItem);
    }

    const target = {
      itemData: targetItem,
      itemElement: targetItemElement.length ? targetItemElement : undefined,
    };
    this._showContextMenu(items, e.target, e, target);
  }

  _getItemThumbnailCssClass(): string {
    return FILE_MANAGER_THUMBNAILS_ITEM_THUMBNAIL_CLASS;
  }

  _getItemSelector(): string {
    return `.${FILE_MANAGER_THUMBNAILS_ITEM_CLASS}`;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTooltipText(fileItemInfo) {
    const item = fileItemInfo.fileItem;
    if (item.tooltipText) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return item.tooltipText;
    }

    let text = `${item.name}\r\n`;
    if (!item.isDirectory) {
      text += `${messageLocalization.format(
        'dxFileManager-listThumbnailsTooltipTextSize',
      )}: ${getDisplayFileSize(item.size)}\r\n`;
    }
    text += `${messageLocalization.format(
      'dxFileManager-listThumbnailsTooltipTextDateModified',
    )}: ${item.dateModified}`;
    return text;
  }

  _onItemDblClick(e): void {
    const $item = $(e.currentTarget);
    const item = this._itemList?.getItemByItemElement($item);
    this._tryOpen(item);
  }

  _tryOpen(item): void {
    if (item) {
      this._raiseSelectedItemOpened(item);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getItemsInternal(): DeferredObj<any> {
    return super._getItemsInternal().then((items) => {
      // @ts-expect-error ts-error
      const deferred = new Deferred();
      // eslint-disable-next-line no-restricted-globals,@typescript-eslint/no-unsafe-return
      setTimeout(() => deferred.resolve(items));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return deferred.promise();
    });
  }

  _disableDragging(): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDefaultOptions() {
    return {
      ...super._getDefaultOptions(),
      focusStateEnabled: true,
    };
  }

  _onItemListSelectionChanged({ addedItemKeys, removedItemKeys }): void {
    const selectedItemInfos = this.getSelectedItems();
    const selectedItems = selectedItemInfos?.map(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (itemInfo) => itemInfo.fileItem,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const selectedItemKeys = selectedItems?.map((item) => item.key);

    this._tryRaiseSelectionChanged({
      selectedItemInfos,
      selectedItems,
      selectedItemKeys,
      currentSelectedItemKeys: addedItemKeys,
      currentDeselectedItemKeys: removedItemKeys,
    });
  }

  _onItemListFocusedItemChanged({ item, itemElement }): void {
    if (!this._isMultipleSelectionMode()) {
      this._selectItemSingleSelection(item);
    }

    const fileSystemItem = item?.fileItem || null;
    this._onFocusedItemChanged({
      item: fileSystemItem,
      itemKey: fileSystemItem?.key,
      itemElement: itemElement || undefined,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getScrollable() {
    return this._itemList?.getScrollable();
  }

  _setSelectedItemKeys(itemKeys): void {
    this._itemList?.option('selectedItemKeys', itemKeys);
  }

  _setFocusedItemKey(itemKey): void {
    this._itemList?.option('focusedItemKey', itemKey);
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-misused-promises
  refresh(options?, operation?) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actualOptions: any = {
      dataSource: this._createDataSource(),
    };

    if (
      options
      && Object.prototype.hasOwnProperty.call(options, 'focusedItemKey')
    ) {
      actualOptions.focusedItemKey = options.focusedItemKey;
    }
    if (
      options
      && Object.prototype.hasOwnProperty.call(options, 'selectedItemKeys')
    ) {
      actualOptions.selectedItemKeys = options.selectedItemKeys;
    }

    if (
      !isDefined(actualOptions.focusedItemKey)
      && operation === OPERATIONS.NAVIGATION
    ) {
      this._needResetScrollPosition = true;
    }
    this._itemList?.option(actualOptions);

    // @ts-expect-error ts-error
    this._refreshDeferred = new Deferred();
    return this._refreshDeferred?.promise();
  }

  _deselectItem(item): void {
    const itemElement = this._itemList?.getItemElementByItem(item);
    this._itemList?.unselectItem(itemElement);
  }

  _selectItemSingleSelection(item): void {
    if (item) {
      this._itemList?.selectItem(item);
    } else {
      this._itemList?.clearSelection();
    }
  }

  clearSelection(): void {
    this._itemList?.clearSelection();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getSelectedItems() {
    return this._itemList?.getSelectedItems();
  }
}

export default FileManagerThumbnailsItemList;
