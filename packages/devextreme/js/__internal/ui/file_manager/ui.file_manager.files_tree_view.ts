/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { getImageContainer } from '@js/core/utils/icon';
import { isNumeric } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import TreeViewSearch from '@js/ui/tree_view';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import type FileManagerContextMenu from '@ts/ui/file_manager/ui.file_manager.context_menu';
import FileManagerFileActionsButton from '@ts/ui/file_manager/ui.file_manager.file_actions_button';

const FILE_MANAGER_DIRS_TREE_CLASS = 'dx-filemanager-dirs-tree';
const FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS = 'dx-filemanager-focused-item';
const FILE_MANAGER_DIRS_TREE_ITEM_TEXT_CLASS = 'dx-filemanager-dirs-tree-item-text';
const TREE_VIEW_ITEM_CLASS = 'dx-treeview-item';

interface FileManagerFilesTreeViewActions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDirectoryClick?: (e: any) => void;
  onFilesTreeViewContentReady?: () => void;
}

interface FileManagerFilesTreeViewOptions extends WidgetProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFolder?: any;
  contextMenu?: FileManagerContextMenu;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItems?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDirectories?: (...args: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDirectoryClick?: (e: any) => void;
  onFilesTreeViewContentReady?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemListDataLoaded?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCurrentDirectory?: any;
  storeExpandedState?: boolean;
}

class FileManagerFilesTreeView extends Widget<FileManagerFilesTreeViewOptions> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getCurrentDirectory?: any;

  _storeExpandedState!: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _createFileActionsButton?: any;

  _filesTreeView?: TreeViewSearch;

  _actions!: FileManagerFilesTreeViewActions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _scrollTopPosition?: any;

  _$focusedElement?: dxElementWrapper | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _activeFileActionsButton?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCurrentDirectory?: any;

  _initMarkup(): void {
    this._initActions();
    const { getCurrentDirectory, storeExpandedState } = this.option();
    this._getCurrentDirectory = getCurrentDirectory;

    this._createFileActionsButton = noop;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._storeExpandedState = storeExpandedState || false;

    const $treeView = $('<div>')
      .addClass(FILE_MANAGER_DIRS_TREE_CLASS)
      .appendTo(this.$element());

    const treeViewOptions = {
      dataStructure: 'plain',
      rootValue: '',
      createChildren: this._onFilesTreeViewCreateSubDirectories.bind(this),
      itemTemplate: this._createFilesTreeViewItemTemplate.bind(this),
      keyExpr: 'getInternalKey',
      parentIdExpr: 'parentDirectory.getInternalKey',
      // eslint-disable-next-line @stylistic/max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/explicit-function-return-type
      displayExpr: (itemInfo) => itemInfo.getDisplayName(),
      hasItemsExpr: 'fileItem.hasSubDirectories',
      onItemClick: (e): void => this._actions.onDirectoryClick?.(e),
      onItemExpanded: (e): void => this._onFilesTreeViewItemExpanded(e),
      onItemCollapsed: (e): void => this._onFilesTreeViewItemCollapsed(e),
      onItemRendered: (e): void => this._onFilesTreeViewItemRendered(e),
      onContentReady: (): void => this._actions.onFilesTreeViewContentReady?.(),
    };

    if (this._contextMenu) {
      this._contextMenu.option('onContextMenuHidden', () => this._onContextMenuHidden());
      // @ts-expect-error ts-error
      treeViewOptions.onItemContextMenu = (e): void => this._onFilesTreeViewItemContextMenu(e);
      this._createFileActionsButton = (
        element,
        options,
      ): FileManagerFileActionsButton => this._createComponent(
        element,
        FileManagerFileActionsButton,
        options,
      );
    }

    this._filesTreeView = this._createComponent(
      $treeView,
      TreeViewSearch,
      treeViewOptions,
    );
  }

  _initActions(): void {
    this._actions = {
      onDirectoryClick: this._createActionByOption('onDirectoryClick'),
      onFilesTreeViewContentReady: this._createActionByOption(
        'onFilesTreeViewContentReady',
      ),
    };
  }

  _render(): void {
    super._render();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    // eslint-disable-next-line no-restricted-globals
    setTimeout((): void => {
      that._updateFocusedElement();
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _onFilesTreeViewCreateSubDirectories(rootItem) {
    const { getDirectories } = this.option();
    const directoryInfo = rootItem?.itemData || null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getDirectories?.(directoryInfo, true);
  }

  _onFilesTreeViewItemRendered({ itemData }): void {
    const currentDirectory = this._getCurrentDirectory();
    if (
      currentDirectory?.fileItem.equals(itemData.fileItem)
    ) {
      this._updateFocusedElement();
      this._restoreScrollTopPosition();
    }
  }

  _onFilesTreeViewItemExpanded({ itemData }): void {
    if (this._storeExpandedState) {
      itemData.expanded = true;
    }
  }

  _onFilesTreeViewItemCollapsed({ itemData }): void {
    if (this._storeExpandedState) {
      itemData.expanded = false;
    }
  }

  _createFilesTreeViewItemTemplate(itemData, itemIndex, itemElement): void {
    const $itemElement = $(itemElement);
    const $itemWrapper = $itemElement.closest(this._filesTreeViewItemSelector);
    $itemWrapper.data('item', itemData);

    const $image = getImageContainer(itemData.icon);

    const $text = $('<span>')
      .text(itemData.getDisplayName())
      .addClass(FILE_MANAGER_DIRS_TREE_ITEM_TEXT_CLASS);

    const $button = $('<div>');
    // @ts-expect-error ts-error
    $itemElement.append($image, $text, $button);

    this._createFileActionsButton($button, {
      onClick: (e) => this._onFileItemActionButtonClick(e),
    });
  }

  _onFilesTreeViewItemContextMenu({ itemElement, event }): void {
    event.preventDefault();
    event.stopPropagation();
    const itemData = $(itemElement).data('item');
    this._contextMenu?.showAt([itemData], itemElement, event, {
      itemData,
      itemElement,
    });
  }

  _onFileItemActionButtonClick({ component, element, event }): void {
    event.stopPropagation();
    const itemElement = component
      .$element()
      .closest(this._filesTreeViewItemSelector);
    const itemData = itemElement.data('item');
    const target = { itemData, itemElement, isActionButton: true };
    this._contextMenu?.showAt([itemData], element, event, target);
    this._activeFileActionsButton = component;
    this._activeFileActionsButton.setActive(true);
  }

  _onContextMenuHidden(): void {
    if (this._activeFileActionsButton) {
      this._activeFileActionsButton.setActive(false);
    }
  }

  toggleNodeDisabledState(key, state): void {
    const node = this._getNodeByKey(key);
    if (!node) {
      return;
    }
    const items = this._filesTreeView?.option('items');
    const itemIndex = items
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      ?.map((item) => item.getInternalKey())
      .indexOf(node.getInternalKey());
    if (itemIndex !== -1) {
      this._filesTreeView?.option(`items[${itemIndex}].disabled`, state);
    }
  }

  _saveScrollTopPosition(): void {
    if (!hasWindow()) {
      return;
    }
    this._scrollTopPosition = this._filesTreeView?.getScrollable().scrollTop();
  }

  _restoreScrollTopPosition(): void {
    if (!hasWindow() || !isNumeric(this._scrollTopPosition)) {
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    setTimeout(() => this._filesTreeView?.getScrollable().scrollTo(this._scrollTopPosition));
  }

  _updateFocusedElement(): void {
    const directoryInfo = this._getCurrentDirectory();
    const $element = this._getItemElementByKey(directoryInfo?.getInternalKey());
    if (this._$focusedElement) {
      this._$focusedElement.toggleClass(
        FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS,
        false,
      );
    }
    this._$focusedElement = $element || $();
    this._$focusedElement?.toggleClass(
      FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS,
      true,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getNodeByKey(key) {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._filesTreeView?._getNode(key);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getPublicNode(key) {
    // @ts-expect-error ts-error
    // eslint-disable-next-line no-unsafe-optional-chaining
    const nodesQueue = [...this._filesTreeView?.getNodes()];
    while (nodesQueue.length) {
      const node = nodesQueue.shift();
      if (node.itemData.getInternalKey() === key) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return node;
      } if (node.children.length) {
        nodesQueue.push(...node.children);
      }
    }
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemElementByKey(key) {
    const node = this._getNodeByKey(key);
    if (node) {
      // @ts-expect-error ts-error
      const $node = this._filesTreeView?._getNodeElement(node);
      if ($node) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return $node.children(this._filesTreeViewItemSelector);
      }
    }
    return null;
  }

  _getDefaultOptions(): FileManagerFilesTreeViewOptions {
    return {
      ...super._getDefaultOptions(),
      storeExpandedState: false,
      initialFolder: undefined,
      contextMenu: undefined,
      getItems: undefined,
      getCurrentDirectory: undefined,
      onDirectoryClick: undefined,
    };
  }

  _optionChanged(args): void {
    const { name } = args;

    switch (name) {
      case 'storeExpandedState':
        // @ts-expect-error ts-error
        this._storeExpandedState = this.option(name);
        break;
      case 'getItems':
      case 'rootFolderDisplayName':
      case 'initialFolder':
      case 'contextMenu':
        this.repaint();
        break;
      case 'getCurrentDirectory':
        this.getCurrentDirectory = this.option(name);
        break;
      case 'onDirectoryClick':
      case 'onFilesTreeViewContentReady':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }

  get _filesTreeViewItemSelector(): string {
    return `.${TREE_VIEW_ITEM_CLASS}`;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get _contextMenu() {
    const { contextMenu } = this.option();

    return contextMenu;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  toggleDirectoryExpandedState(directoryInfo, state) {
    // @ts-expect-error ts-error
    const deferred = new Deferred();
    const treeViewNode = this._getPublicNode(directoryInfo?.getInternalKey());
    if (!treeViewNode) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return deferred.reject().promise();
    }
    if (
      treeViewNode.expanded === state
      || (treeViewNode.itemsLoaded
        && !treeViewNode.itemData.fileItem.hasSubDirectories)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return deferred.resolve().promise();
    }
    const action = state ? 'expandItem' : 'collapseItem';
    return this._filesTreeView?.[action](directoryInfo.getInternalKey());
  }

  refresh(): void {
    this._$focusedElement = null;
    this._saveScrollTopPosition();
    this._filesTreeView?.option('dataSource', []);
  }

  updateCurrentDirectory(): void {
    if (this._disposed) {
      return;
    }
    this._updateFocusedElement();
    if (this._storeExpandedState) {
      this._updateExpandedStateToCurrentDirectory();
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _updateExpandedStateToCurrentDirectory() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.toggleDirectoryExpandedStateRecursive(
      this._getCurrentDirectory().parentDirectory,
      true,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  toggleDirectoryExpandedStateRecursive(directoryInfo, state) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dirLine: any = [];
    for (
      let dirInfo = directoryInfo;
      dirInfo;
      dirInfo = dirInfo.parentDirectory
    ) {
      dirLine.unshift(dirInfo);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.toggleDirectoryLineExpandedState(dirLine, state);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  toggleDirectoryLineExpandedState(dirLine, state) {
    if (!dirLine.length) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().resolve().promise();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.toggleDirectoryExpandedState(dirLine.shift(), state)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .then(() => this.toggleDirectoryLineExpandedState(dirLine, state));
  }
}

export default FileManagerFilesTreeView;
