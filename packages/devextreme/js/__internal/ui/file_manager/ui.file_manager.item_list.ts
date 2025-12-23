// eslint-disable-next-line @stylistic/max-len
/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars */
import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as dblClickName } from '@js/common/core/events/double_click';
import { addNamespace } from '@js/common/core/events/utils/index';
import { CustomStore } from '@js/common/data/custom_store';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { when } from '@js/core/utils/deferred';
import { getImageContainer } from '@js/core/utils/icon';
import { hasWindow } from '@js/core/utils/window';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

const FILE_MANAGER_FILES_VIEW_CLASS = 'dx-filemanager-files-view';
const FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE = 'dxFileManager_open';

interface FileManagerItemListBaseActions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectionChanged?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFocusedItemChanged?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectedItemOpened?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContextMenuShowing?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemListDataLoaded?: (e?: any) => void;
}

interface FileManagerItemListBaseOptions extends WidgetProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectionChanged?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFocusedItemChanged?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectedItemOpened?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContextMenuShowing?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemListDataLoaded?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItems?: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemThumbnail?: (args?: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextMenu?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectionMode?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItemKeys?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  focusedItemKey?: any;
}

class FileManagerItemListBase extends Widget<FileManagerItemListBaseOptions> {
  _lockFocusedItemProcessing?: boolean;

  _needResetScrollPosition?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _focusedItemKey?: any;

  _actions!: FileManagerItemListBaseActions;

  _itemCount!: number;

  _hasParentDirectoryItem?: boolean;

  _parentDirectoryItemKey?: boolean | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _refreshDeferred?: DeferredObj<any>;

  _init(): void {
    this._initActions();

    this._lockFocusedItemProcessing = false;
    this._focusedItemKey = this.option('focusedItemKey');

    super._init();
  }

  _initMarkup(): void {
    this._needResetScrollPosition = false;
    this.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);

    const dblClickEventName = addNamespace(
      dblClickName,
      FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE,
    );
    eventsEngine.on(
      this.$element(),
      dblClickEventName,
      this._getItemSelector(),
      this._onItemDblClick.bind(this),
    );

    super._initMarkup();
  }

  _initActions(): void {
    this._actions = {
      onError: this._createActionByOption('onError'),
      onSelectionChanged: this._createActionByOption('onSelectionChanged'),
      onFocusedItemChanged: this._createActionByOption('onFocusedItemChanged'),
      onSelectedItemOpened: this._createActionByOption('onSelectedItemOpened'),
      onContextMenuShowing: this._createActionByOption('onContextMenuShowing'),
      onItemListDataLoaded: this._createActionByOption('onItemListDataLoaded'),
    };
  }

  _getDefaultOptions(): FileManagerItemListBaseOptions {
    return {
      ...super._getDefaultOptions(),
      selectionMode: 'single',
      selectedItemKeys: [],
      focusedItemKey: undefined,
      contextMenu: undefined,
      getItems: undefined,
      getItemThumbnail: undefined,
      onError: undefined,
      onSelectionChanged: undefined,
      onFocusedItemChanged: undefined,
      onSelectedItemOpened: undefined,
      onContextMenuShowing: undefined,
    };
  }

  _optionChanged(args): void {
    const { name } = args;

    switch (name) {
      case 'selectionMode':
      case 'contextMenu':
      case 'getItems':
      case 'getItemThumbnail':
        this.repaint();
        break;
      case 'selectedItemKeys':
        this._setSelectedItemKeys(args.value);
        break;
      case 'focusedItemKey':
        if (!this._lockFocusedItemProcessing) {
          this._setFocusedItemKey(args.value);
        }
        break;
      case 'onError':
      case 'onSelectedItemOpened':
      case 'onSelectionChanged':
      case 'onFocusedItemChanged':
      case 'onContextMenuShowing':
      case 'onItemListDataLoaded':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getItems(): DeferredObj<any> {
    return this._getItemsInternal()
      .done((itemInfos): void => {
        this._itemCount = itemInfos.length;
        if (this._itemCount === 0) {
          this._resetFocus();
        }

        const parentDirectoryItem = this._findParentDirectoryItem(itemInfos);
        this._hasParentDirectoryItem = !!parentDirectoryItem;
        this._parentDirectoryItemKey = parentDirectoryItem
          ? parentDirectoryItem.fileItem.key
          : null;
      })
      .always(() => {
        this._onDataLoaded();
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getItemsInternal(): DeferredObj<any> {
    const { getItems: itemsGetter } = this.option();
    const itemsResult = itemsGetter ? itemsGetter() : [];
    return when(itemsResult);
  }

  _raiseOnError(error): void {
    this._actions.onError?.({ error });
  }

  _raiseSelectionChanged(args): void {
    this._actions.onSelectionChanged?.(args);
  }

  _raiseFocusedItemChanged(args): void {
    this._actions.onFocusedItemChanged?.(args);
  }

  _raiseSelectedItemOpened(fileItemInfo): void {
    this._actions.onSelectedItemOpened?.({ fileItemInfo });
  }

  _raiseContextMenuShowing(e): void {
    this._actions.onContextMenuShowing?.(e);
  }

  _raiseItemListDataLoaded(): void {
    this._actions.onItemListDataLoaded?.();
  }

  _onDataLoaded(): void {
    this._raiseItemListDataLoaded();
    this._refreshDeferred?.resolve();
  }

  _onContentReady(): void {
    if (this._needResetScrollPosition) {
      this._resetScrollTopPosition();
      this._needResetScrollPosition = false;
    }
  }

  _tryRaiseSelectionChanged({
    selectedItemInfos,
    selectedItems,
    selectedItemKeys,
    currentSelectedItemKeys,
    currentDeselectedItemKeys,
  }): void {
    const parentDirectoryItem = this._findParentDirectoryItem(
      this.getSelectedItems(),
    );
    if (parentDirectoryItem) {
      this._deselectItem(parentDirectoryItem);
    }

    let raiseEvent = !this._hasParentDirectoryItem;
    raiseEvent = raiseEvent
      || this._hasValidKeys(currentSelectedItemKeys)
      || this._hasValidKeys(currentDeselectedItemKeys);

    if (raiseEvent) {
      // eslint-disable-next-line no-param-reassign
      selectedItemInfos = this._filterOutItemByPredicate(
        selectedItemInfos,
        (item) => item.fileItem.key === this._parentDirectoryItemKey,
      );
      // eslint-disable-next-line no-param-reassign
      selectedItems = this._filterOutParentDirectory(selectedItems);
      // eslint-disable-next-line no-param-reassign
      selectedItemKeys = this._filterOutParentDirectoryKey(
        selectedItemKeys,
        true,
      );
      // eslint-disable-next-line no-param-reassign
      currentSelectedItemKeys = this._filterOutParentDirectoryKey(
        currentSelectedItemKeys,
        true,
      );
      // eslint-disable-next-line no-param-reassign
      currentDeselectedItemKeys = this._filterOutParentDirectoryKey(
        currentDeselectedItemKeys,
        true,
      );
      this._raiseSelectionChanged({
        selectedItemInfos,
        selectedItems,
        selectedItemKeys,
        currentSelectedItemKeys,
        currentDeselectedItemKeys,
      });
    }
  }

  _onFocusedItemChanged(args): void {
    if (this._focusedItemKey === args.itemKey) {
      return;
    }

    this._focusedItemKey = args.itemKey;

    this._lockFocusedItemProcessing = true;
    this.option('focusedItemKey', args.itemKey);
    this._lockFocusedItemProcessing = false;

    this._raiseFocusedItemChanged(args);
  }

  _resetFocus(): void {}

  _resetScrollTopPosition(): void {
    if (!hasWindow()) {
      return;
    }
    // @ts-expect-error ts-error
    // eslint-disable-next-line no-restricted-globals,@typescript-eslint/no-unsafe-return
    setTimeout(() => this._getScrollable()?.scrollTo(0));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getScrollable() {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemThumbnail(fileInfo) {
    const { getItemThumbnail: itemThumbnailGetter } = this.option();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return itemThumbnailGetter
      ? itemThumbnailGetter(fileInfo)
      : { thumbnail: '' };
  }

  _getItemThumbnailContainer(fileInfo): dxElementWrapper | undefined {
    const { thumbnail, cssClass } = this._getItemThumbnail(fileInfo);

    const $itemThumbnail = getImageContainer(thumbnail)?.addClass(
      this._getItemThumbnailCssClass(),
    );

    if (cssClass) {
      $itemThumbnail?.addClass(cssClass);
    }

    return $itemThumbnail;
  }

  _getItemThumbnailCssClass(): string {
    return '';
  }

  _getItemSelector(): void {}

  _onItemDblClick(e): void {}

  _isDesktop(): boolean {
    return devices.real().deviceType === 'desktop';
  }

  _showContextMenu(items, element, event, target): void {
    this._contextMenu.showAt(items, element, event, target);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get _contextMenu() {
    const { contextMenu } = this.option();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return contextMenu;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _findParentDirectoryItem(itemInfos) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < itemInfos.length; i += 1) {
      const itemInfo = itemInfos[i];
      if (this._isParentDirectoryItem(itemInfo)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return itemInfo;
      }
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFileItemsForContextMenu(fileItem) {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any[] = this.getSelectedItems();

    if (this._isParentDirectoryItem(fileItem)) {
      result.push(fileItem);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _isParentDirectoryItem(itemInfo) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return itemInfo.fileItem.isParentFolder;
  }

  _hasValidKeys(keys): boolean {
    return (
      keys.length > 1
      || (keys.length === 1 && keys[0] !== this._parentDirectoryItemKey)
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _filterOutParentDirectory(array, createNewArray?: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._filterOutItemByPredicate(
      array,
      (item): boolean => item.key === this._parentDirectoryItemKey,
      createNewArray,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _filterOutParentDirectoryKey(array, createNewArray?: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._filterOutItemByPredicate(
      array,
      (key): boolean => key === this._parentDirectoryItemKey,
      createNewArray,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _filterOutItemByPredicate(array, predicate, createNewArray?: boolean) {
    let result = array;
    let index = -1;

    for (let i = 0; i < array.length; i += 1) {
      if (predicate(array[i])) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      if (createNewArray) {
        result = [...array];
      }
      result.splice(index, 1);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  _isMultipleSelectionMode(): boolean {
    const { selectionMode } = this.option();
    return selectionMode === 'multiple';
  }

  _deselectItem(item): void {}

  _setSelectedItemKeys(itemKeys): void {}

  _setFocusedItemKey(itemKey): void {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createDataSource() {
    return {
      store: new CustomStore({
        key: 'fileItem.key',
        load: this._getItems.bind(this),
      }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getSelectedItems() {}

  clearSelection(): void {}

  selectItem(): void {}

  refresh(options?, operation?): void {}
}

export default FileManagerItemListBase;
