import { fx } from '@js/common/core/animation';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as dblclickEvent } from '@js/common/core/events/double_click';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import {
  Deferred,
  // @ts-expect-error ts-error
  fromPromise,
  when,
} from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getImageContainer } from '@js/core/utils/icon';
import { each } from '@js/core/utils/iterator';
import { getHeight } from '@js/core/utils/size';
import {
  isDefined, isFunction, isPlainObject, isPrimitive, isString,
} from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { DxEvent, NativeEventInfo } from '@js/events';
import type { InitializedEvent, Properties as CheckBoxProperties, ValueChangedEvent } from '@js/ui/check_box';
import type {
  Item, Properties, TreeViewCheckBoxMode, TreeViewExpandEvent,
} from '@js/ui/tree_view';
import supportUtils from '@ts/core/utils/m_support';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import CheckBox from '@ts/ui/check_box/index';
import type { ActionArgs, CollectionItemInfo, PostprocessRenderItemInfo } from '@ts/ui/collection/collection_widget.base';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';
import type { DataAdapterOptions } from '@ts/ui/hierarchical_collection/data_adapter';
import type {
  InternalNode, ItemData, ItemKey, PublicNode,
} from '@ts/ui/hierarchical_collection/data_converter';
import HierarchicalCollectionWidget from '@ts/ui/hierarchical_collection/hierarchical_collection_widget';
import type { LoadIndicatorProperties } from '@ts/ui/load_indicator';
import LoadIndicator from '@ts/ui/load_indicator';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL, SCROLLABLE_CONTENT_CLASS } from '@ts/ui/scroll_view/consts';
import Scrollable from '@ts/ui/scroll_view/scrollable';
import { getRelativeOffset } from '@ts/ui/scroll_view/utils/get_relative_offset';

const WIDGET_CLASS = 'dx-treeview';

const NODE_CLASS = `${WIDGET_CLASS}-node`;
const NODE_CONTAINER_CLASS = `${NODE_CLASS}-container`;
const NODE_LOAD_INDICATOR_CLASS = `${NODE_CLASS}-loadindicator`;
const OPENED_NODE_CONTAINER_CLASS = `${NODE_CLASS}-container-opened`;
const IS_LEAF = `${NODE_CLASS}-is-leaf`;

export const ITEM_CLASS = `${WIDGET_CLASS}-item`;
const ITEM_WITH_CHECKBOX_CLASS = `${ITEM_CLASS}-with-checkbox`;
const ITEM_WITH_CUSTOM_EXPANDER_ICON_CLASS = `${ITEM_CLASS}-with-custom-expander-icon`;
const CUSTOM_EXPANDER_ICON_ITEM_CONTAINER_CLASS = `${WIDGET_CLASS}-custom-expander-icon-item-container`;

const ITEM_WITHOUT_CHECKBOX_CLASS = `${ITEM_CLASS}-without-checkbox`;
const ITEM_DATA_KEY = `${ITEM_CLASS}-data`;

const TOGGLE_ITEM_VISIBILITY_CLASS = `${WIDGET_CLASS}-toggle-item-visibility`;
const CUSTOM_COLLAPSE_ICON_CLASS = `${WIDGET_CLASS}-custom-collapse-icon`;
const CUSTOM_EXPAND_ICON_CLASS = `${WIDGET_CLASS}-custom-expand-icon`;

const LOAD_INDICATOR_CLASS = `${WIDGET_CLASS}-loadindicator`;
const LOAD_INDICATOR_WRAPPER_CLASS = `${WIDGET_CLASS}-loadindicator-wrapper`;
const TOGGLE_ITEM_VISIBILITY_OPENED_CLASS = `${WIDGET_CLASS}-toggle-item-visibility-opened`;
const SELECT_ALL_ITEM_CLASS = `${WIDGET_CLASS}-select-all-item`;

const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const SELECTED_ITEM_CLASS = 'dx-state-selected';
const EXPAND_EVENT_NAMESPACE = 'dxTreeView_expand';
const DATA_ITEM_ID = 'data-item-id';
const ITEM_URL_CLASS = 'dx-item-url';
const CHECK_BOX_CLASS = 'dx-checkbox';
const CHECK_BOX_ICON_CLASS = 'dx-checkbox-icon';
const ROOT_NODE_CLASS = `${WIDGET_CLASS}-root-node`;
export const EXPANDER_ICON_STUB_CLASS = `${WIDGET_CLASS}-expander-icon-stub`;

type TreeViewItem = Item & {
  url?: string;
};
type TreeViewNode = InternalNode & TreeViewItem;

export interface TreeViewBaseProperties extends Properties<TreeViewNode>, Omit<
  CollectionWidgetEditProperties<TreeViewBase, Item>,
  keyof Properties<TreeViewNode>
> {
  deferRendering?: boolean;

  _supportItemUrl?: boolean;
}

class TreeViewBase extends HierarchicalCollectionWidget<TreeViewBaseProperties, TreeViewNode> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dataSource!: any;

  // eslint-disable-next-line no-restricted-globals
  _setFocusedItemTimeout?: ReturnType<typeof setTimeout>;

  _$selectAllItem?: dxElementWrapper;

  _contentAlreadyRendered?: boolean;

  _skipContentReadyAndItemExpanded?: boolean;

  _treeViewLoadIndicator?: dxElementWrapper;

  _scrollable!: Scrollable;

  _filter!: {
    custom?: unknown[];
    internal?: unknown[];
  };

  _selectAllValueChangedAction?: (event?: Record<string, unknown>) => void;

  protected _activeStateUnit(): string {
    return `.${ITEM_CLASS}`;
  }

  _supportedKeys(): SupportedKeys {
    const click = (e: DxEvent<KeyboardEvent>): void => {
      const { focusedElement } = this.option();

      const $itemElement = $(focusedElement);

      if (!$itemElement.length) {
        return;
      }

      e.target = $itemElement.get(0);
      e.currentTarget = $itemElement.get(0);

      this._processItemClick(e, $itemElement.children(`.${ITEM_CLASS}`));

      const { expandEvent } = this.option();

      const expandEventName = this._getEventNameByOption(expandEvent);
      const expandByClick = expandEventName === addNamespace(
        clickEventName,
        EXPAND_EVENT_NAMESPACE,
      );

      if (expandByClick) {
        this._expandEventHandler(e);
      }
    };

    const select = (e: DxEvent<KeyboardEvent>): void => {
      e.preventDefault();
      const { focusedElement } = this.option();
      const $focusedElement = $(focusedElement);
      const checkboxInstance = this._getCheckBoxInstance($focusedElement);
      const { disabled, value } = checkboxInstance.option();

      if (!disabled) {
        const currentState = value;

        this._updateItemSelection(
          !currentState,
          $focusedElement.find(`.${ITEM_CLASS}`).get(0),
          e,
        );
      }
    };

    const toggleExpandedNestedItems = (state: boolean, e: DxEvent<KeyboardEvent>): void => {
      const { expandAllEnabled } = this.option();

      if (!expandAllEnabled) {
        return;
      }

      e.preventDefault();

      const { focusedElement } = this.option();
      const $rootElement = $(focusedElement);

      if (!$rootElement.length) {
        return;
      }

      const rootItem = this._getItemData($rootElement.find(`.${ITEM_CLASS}`));
      this._toggleExpandedNestedItems([rootItem], state);
    };

    return {
      ...super._supportedKeys(),
      enter: this._showCheckboxes() ? select : click,
      space: this._showCheckboxes() ? select : click,
      asterisk: (e): void => {
        toggleExpandedNestedItems(true, e);
      },
      minus: (e): void => {
        toggleExpandedNestedItems(false, e);
      },
    };
  }

  _toggleExpandedNestedItems(items: ItemData[] | undefined, state: boolean): void {
    if (!items) {
      return;
    }

    for (let i = 0, len = items.length; i < len; i += 1) {
      const item = items[i];
      const node = this._dataAdapter.getNodeByItem(item);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._toggleExpandedState(node, state);
      this._toggleExpandedNestedItems(item.items, state);
    }
  }

  _getNodeElement(node: TreeViewNode, cache?: {
    $nodeByKey?: Record<string, dxElementWrapper>;
  }): dxElementWrapper {
    const key = this._encodeString(node.internalFields.key);

    if (cache) {
      if (!cache.$nodeByKey) {
        cache.$nodeByKey = {};

        const $nodes = this.$element().find(`.${NODE_CLASS}`);

        $nodes.each((_index: number, element: Element): boolean => {
          const $node = $(element);

          const nodeKey = $node.attr(DATA_ITEM_ID) as string;
          // @ts-expect-error ts-error
          cache.$nodeByKey[nodeKey] = $node;

          return true;
        });
      }
      return cache.$nodeByKey[key] || $();
    }
    const element = this.$element().get(0).querySelector(`[${DATA_ITEM_ID}="${key}"]`);

    return $(element);
  }

  _widgetClass(): string {
    return WIDGET_CLASS;
  }

  _getDefaultOptions(): TreeViewBaseProperties {
    const defaultOptions = {
      ...super._getDefaultOptions(),
      animationEnabled: true,
      dataStructure: 'tree',
      deferRendering: true,
      expandAllEnabled: false,
      hasItemsExpr: 'hasItems',
      selectNodesRecursive: true,
      expandNodesRecursive: true,
      showCheckBoxesMode: 'none',
      expandIcon: null,
      collapseIcon: null,
      selectAllText: messageLocalization.format('dxList-selectAll'),
      onItemSelectionChanged: null,
      onItemExpanded: null,
      onItemCollapsed: null,
      scrollDirection: 'vertical',
      useNativeScrolling: true,
      virtualModeEnabled: false,
      rootValue: 0,
      focusStateEnabled: false,
      selectionMode: 'multiple',
      expandEvent: 'dblclick',
      selectByClick: false,
      createChildren: null,
      onSelectAllValueChanged: null,
      _supportItemUrl: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(true, defaultOptions, {
      integrationOptions: {
        useDeferUpdateForTemplates: false,
      },
    });
  }

  _defaultOptionsRules(): DefaultOptionsRule<TreeViewBaseProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return !supportUtils.nativeScrolling;
        },
        options: {
          useNativeScrolling: false,
        },
      },
    ]);
  }

  _initSelectedItems(): void {}

  // @ts-expect-error ts-error

  _syncSelectionOptions(): Promise<unknown> {
    return Deferred().resolve().promise();
  }

  _fireSelectionChanged(): void {
    this._createActionByOption('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    })();
  }

  _createSelectAllValueChangedAction(): void {
    this._selectAllValueChangedAction = this._createActionByOption('onSelectAllValueChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _fireSelectAllValueChanged(value: ValueChangedEvent['value']): void {
    this._selectAllValueChangedAction?.({ value });
  }

  _checkBoxModeChange(
    value: TreeViewCheckBoxMode | undefined,
    previousValue: TreeViewCheckBoxMode | undefined,
  ): void {
    const { searchEnabled } = this.option();
    const previousSelectAllEnabled = this._selectAllEnabled(previousValue);
    const previousItemsContainer = this._itemContainer(searchEnabled, previousSelectAllEnabled);

    this._detachClickEvent(previousItemsContainer);
    this._detachExpandEvent(previousItemsContainer);

    if (previousValue === 'none' || value === 'none') {
      return;
    }

    const selectAllExists = this._$selectAllItem?.length;

    switch (value) {
      case 'selectAll':
        if (!selectAllExists) {
          this._createSelectAllValueChangedAction();
          this._renderSelectAllItem();
        }
        break;
      case 'normal':
        if (selectAllExists) {
          this._$selectAllItem?.remove();
          delete this._$selectAllItem;
        }
        break;
      default:
        break;
    }
  }

  _removeSelection(): void {
    each(this._dataAdapter.getFullData(), (_index: number, node: TreeViewNode): void => {
      if (!this._hasChildren(node)) {
        return;
      }

      this._dataAdapter.toggleSelection(node.internalFields.key, false, true);
    });
  }

  _optionChanged(args: OptionChanged<TreeViewBaseProperties>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'selectAllText':
        if (this._$selectAllItem) {
          // @ts-expect-error ts-error
          this._$selectAllItem.dxCheckBox('instance').option('text', value);
        }
        break;
      case 'showCheckBoxesMode':
        this._checkBoxModeChange(value, previousValue);
        this._invalidate();
        break;
      case 'scrollDirection':
        this.getScrollable().option('direction', value);
        break;
      case 'useNativeScrolling':
        this.getScrollable().option('useNative', value);
        break;
      case 'items':
        delete this._$selectAllItem;
        super._optionChanged(args);
        break;
      case 'dataSource':
        super._optionChanged(args);
        this._initDataAdapter();
        this._filter = {};
        break;
      case 'hasItemsExpr':
        this._initAccessors();
        this.repaint();
        break;
      case 'expandEvent':
        this._attachExpandEvent();
        break;
      case 'deferRendering':
      case 'dataStructure':
      case 'rootValue':
      case 'createChildren':
      case 'expandNodesRecursive':
      case 'onItemSelectionChanged':
      case 'onItemExpanded':
      case 'onItemCollapsed':
      case 'expandAllEnabled':
      case 'animationEnabled':
      case 'virtualModeEnabled':
      case 'selectByClick':
      case '_supportItemUrl':
        break;
      case 'selectionMode':
        this._initDataAdapter();
        super._optionChanged(args);
        break;
      case 'onSelectAllValueChanged':
        this._createSelectAllValueChangedAction();
        break;
      case 'selectNodesRecursive':
        this._dataAdapter.setOption('recursiveSelection', args.value ?? false);
        this.repaint();
        break;
      case 'expandIcon':
      case 'collapseIcon':
        this.repaint();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _initDataSource(): void {
    if (this._useCustomChildrenLoader()) {
      // @ts-expect-error ts-error
      this._loadChildrenByCustomLoader(null).done((newItems: TreeViewNode[]) => {
        if (newItems?.length) {
          this.option('items', newItems);
        }
      });
    } else {
      super._initDataSource();

      if (this._isVirtualMode()) {
        this._initVirtualMode();
      }
    }
  }

  _initVirtualMode(): void {
    const filter = this._filter;

    if (!filter.custom) {
      filter.custom = this._dataSource.filter();
    }

    if (!filter.internal) {
      const { parentIdExpr, rootValue } = this.option();

      filter.internal = [parentIdExpr, rootValue];
    }
  }

  _useCustomChildrenLoader(): boolean {
    const { createChildren } = this.option();

    return isFunction(createChildren) && this._isDataStructurePlain();
  }

  _loadChildrenByCustomLoader(parentNode: TreeViewNode): Promise<unknown> {
    const { createChildren } = this.option();

    const invocationResult = createChildren?.call(this, parentNode);

    if (Array.isArray(invocationResult)) {
      return Deferred().resolve(invocationResult).promise();
    }

    if (invocationResult && isFunction(invocationResult.then)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fromPromise(invocationResult);
    }

    return Deferred().resolve([]).promise();
  }

  _combineFilter(): unknown[] | undefined {
    if (!this._filter.custom?.length) {
      return this._filter.internal;
    }

    return [this._filter.custom, this._filter.internal];
  }

  _dataSourceLoadErrorHandler(): void {
    this._renderEmptyMessage();
  }

  _init(): void {
    this._filter = {};
    super._init();

    this._initStoreChangeHandlers();
  }

  _dataSourceChangedHandler(newItems: Item[]): void {
    const { items = [] } = this.option();

    if (this._initialized && this._isVirtualMode() && items.length) {
      return;
    }

    this.option('items', newItems);
  }

  _removeTreeViewLoadIndicator(): void {
    if (!this._treeViewLoadIndicator) return;
    this._treeViewLoadIndicator.remove();
    // @ts-expect-error ts-error
    this._treeViewLoadIndicator = null;
  }

  _createTreeViewLoadIndicator(): dxElementWrapper {
    this._treeViewLoadIndicator = $('<div>').addClass(LOAD_INDICATOR_CLASS);
    this._createComponent(
      this._treeViewLoadIndicator,
      LoadIndicator,
      {} as LoadIndicatorProperties,
    );
    return this._treeViewLoadIndicator;
  }

  _dataSourceLoadingChangedHandler(isLoading: boolean): void {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let resultFilter;

    if (this._isVirtualMode()) {
      resultFilter = this._combineFilter();
      this._dataSource.filter(resultFilter);
    }

    if (isLoading && !this._dataSource.isLoaded()) {
      this.option('items', []);

      const $wrapper = $('<div>').addClass(LOAD_INDICATOR_WRAPPER_CLASS);

      this._createTreeViewLoadIndicator().appendTo($wrapper);

      this.itemsContainer().append($wrapper);

      if (this._isVirtualMode() && this._dataSource.filter() !== resultFilter) {
        this._dataSource.filter([]);
      }
    } else {
      this._removeTreeViewLoadIndicator();
    }
  }

  _initStoreChangeHandlers(): void {
    const { dataStructure } = this.option();
    if (dataStructure !== 'plain') {
      return;
    }

    this._dataSource?.store()
      .on('inserted', (newItem: TreeViewNode): void => {
        const { items = [] } = this.option();

        this.option().items = items.concat(newItem);
        this._dataAdapter.addItem(newItem);

        if (!this._dataAdapter.isFiltered(newItem)) {
          return;
        }
        // @ts-expect-error ts-error
        this._updateLevel(this._parentIdGetter(newItem));
      }).on('removed', (removedKey: ItemKey): void => {
        const node = this._dataAdapter.getNodeByKey(removedKey);

        if (isDefined(node)) {
          const { items = [] } = this.option();
          const index = this._dataAdapter.getIndexByKey(node.internalFields.key);
          // @ts-expect-error ts-error
          items[index] = 0;
          this._markChildrenItemsToRemove(node);
          this._removeItems();

          this._dataAdapter.removeItem(removedKey);
          // @ts-expect-error ts-error
          this._updateLevel(this._parentIdGetter(node));
        }
      });
  }

  _markChildrenItemsToRemove(node: InternalNode | null): void {
    const keys = node?.internalFields.childrenKeys;

    each(keys, (_index: number, key: ItemKey): void => {
      const { items = [] } = this.option();
      const index = this._dataAdapter.getIndexByKey(key);
      // @ts-expect-error ts-error
      items[index] = 0;
      this._markChildrenItemsToRemove(this._dataAdapter.getNodeByKey(key));
    });
  }

  _removeItems(): void {
    const items = extend(true, [], this.option('items'));
    let counter = 0;

    each(items, (index: number, item: Item): void => {
      if (!item) {
        // @ts-expect-error ts-error
        this.option('items').splice(index - counter, 1);
        counter += 1;
      }
    });
  }

  _updateLevel(parentId: ItemKey): void {
    const $container = this._getContainerByParentKey(parentId);

    this._renderNodes(this._dataAdapter.getChildrenNodes(parentId), $container);
  }

  _getOldContainer($itemElement: dxElementWrapper): dxElementWrapper {
    if ($itemElement.length) {
      return $itemElement.children(`.${NODE_CONTAINER_CLASS}`);
    }

    const scrollable = this.getScrollable();

    if (scrollable) {
      return $(scrollable.content()).children();
    }
    return $();
  }

  _getContainerByParentKey(parentId: ItemKey): dxElementWrapper {
    const node = this._dataAdapter.getNodeByKey(parentId);
    const $itemElement = node ? this._getNodeElement(node) : $();

    this._getOldContainer($itemElement).remove();
    const $container = this._renderNodeContainer($itemElement);

    if (this._isRootLevel(parentId)) {
      const scrollable = this.getScrollable();

      if (!scrollable) {
        this._renderScrollableContainer();
      }
      $(scrollable.content()).append($container);
    }

    return $container;
  }

  _isRootLevel(parentId: ItemKey): boolean {
    const { rootValue } = this.option();

    return parentId === rootValue;
  }

  _getAccessors(): string[] {
    const accessors = super._getAccessors();

    accessors.push('hasItems');

    return accessors;
  }

  _getDataAdapterOptions(): Partial<DataAdapterOptions> {
    const {
      rootValue,
      expandNodesRecursive = true,
      selectionRequired = false,
      dataStructure = 'tree',
    } = this.option();

    return {
      rootValue,
      multipleSelection: !this._isSingleSelection(),
      recursiveSelection: this._isRecursiveSelection(),
      recursiveExpansion: expandNodesRecursive,
      searchValue: '',
      selectionRequired,
      dataType: dataStructure,
      sort: this._dataSource?.sort(),
      langParams: this._dataSource?.loadOptions?.()?.langParams,
    };
  }

  _initMarkup(): void {
    this._renderScrollableContainer();
    this._renderEmptyMessage(this._dataAdapter.getRootNodes());

    super._initMarkup();

    this._setAriaRole();
  }

  _setAriaRole(): void {
    const { items } = this.option();

    if (items?.length) {
      this.setAria({ role: 'tree' });
    }
  }

  _renderContentImpl(): void {
    const $nodeContainer = this._renderNodeContainer();

    $(this.getScrollable().content()).append($nodeContainer);

    const { items } = this.option();

    if (!items?.length) {
      return;
    }

    this._renderNodes(this._dataAdapter.getRootNodes(), $nodeContainer);

    this._attachExpandEvent();

    if (this._selectAllEnabled()) {
      this._createSelectAllValueChangedAction();
      this._renderSelectAllItem($nodeContainer);
    }
  }

  _isVirtualMode(): boolean {
    const { virtualModeEnabled, dataSource } = this.option();

    return !!virtualModeEnabled && this._isDataStructurePlain() && !!dataSource;
  }

  _isDataStructurePlain(): boolean {
    const { dataStructure } = this.option();

    return dataStructure === 'plain';
  }

  _fireContentReadyAction(): void {
    // @ts-expect-error ts-error
    const dataSource = this.getDataSource();
    const skipContentReadyAction = (dataSource
      && !dataSource.isLoaded())
      || this._skipContentReadyAndItemExpanded;

    const scrollable = this.getScrollable();

    if (scrollable && hasWindow()) {
      scrollable.update();
    }

    if (!skipContentReadyAction) {
      super._fireContentReadyAction();
    }

    if (scrollable && hasWindow()) {
      scrollable.update();
    }
  }

  _renderScrollableContainer(): void {
    const { useNativeScrolling, scrollDirection } = this.option();

    this._scrollable = this._createComponent(
      $('<div>').appendTo(this.$element()),
      Scrollable,
      {
        useNative: useNativeScrolling,
        direction: scrollDirection,
        useKeyboard: false,
      },
    );
  }

  _renderNodeContainer($parent?: dxElementWrapper): dxElementWrapper {
    const $container = $('<ul>').addClass(NODE_CONTAINER_CLASS);

    this.setAria('role', 'group', $container);

    if ($parent?.length) {
      const itemData = this._getItemData($parent.children(`.${ITEM_CLASS}`));
      // @ts-expect-error ts-error
      if (this._expandedGetter(itemData)) {
        $container.addClass(OPENED_NODE_CONTAINER_CLASS);
      }

      $container.appendTo($parent);
    }
    return $container;
  }

  _createDOMElement($nodeContainer: dxElementWrapper, node: TreeViewNode): dxElementWrapper {
    const $node = $('<li>')
      .addClass(NODE_CLASS)
      .attr(DATA_ITEM_ID, this._encodeString(node.internalFields.key))
      .prependTo($nodeContainer);

    const attrs: Record<string, string | number | boolean> = {
      role: 'treeitem',
      // @ts-expect-error ts-error
      label: this._displayGetter?.(node.internalFields.item) ?? '',
      level: this._getLevel($nodeContainer),
    };

    const hasChildNodes = !!node?.internalFields?.childrenKeys?.length;

    if (hasChildNodes) {
      attrs.expanded = node.internalFields.expanded ?? false;
    }

    this.setAria(attrs, $node);

    return $node;
  }

  _getLevel($nodeContainer: dxElementWrapper): number {
    const parent = $nodeContainer.parent();

    return parent.hasClass('dx-scrollable-content')
      ? 1
      : parseInt(parent.attr('aria-level') ?? '0', 10) + 1;
  }

  _showCheckboxes(): boolean {
    const { showCheckBoxesMode } = this.option();
    return showCheckBoxesMode !== 'none';
  }

  _hasCustomExpanderIcons(): boolean {
    const { expandIcon, collapseIcon } = this.option();

    return !!expandIcon || !!collapseIcon;
  }

  _selectAllEnabled(showCheckBoxesMode?: TreeViewCheckBoxMode): boolean {
    const { showCheckBoxesMode: currentShowCheckBoxesMode } = this.option();
    const mode = showCheckBoxesMode ?? currentShowCheckBoxesMode;

    return mode === 'selectAll' && !this._isSingleSelection();
  }

  _renderNodes(nodes: TreeViewNode[], $nodeContainer: dxElementWrapper): void {
    const length = nodes.length - 1;
    for (let i = length; i >= 0; i -= 1) {
      this._renderItem(i, nodes[i], $nodeContainer);
    }
    this._renderedItemsCount += nodes.length;
  }

  _renderItem(
    nodeIndex: number,
    node: TreeViewNode,
    $nodeContainer: dxElementWrapper,
  ): dxElementWrapper {
    const $node = this._createDOMElement($nodeContainer, node);
    const nodeData = node.internalFields;
    const showCheckBox = this._showCheckboxes();

    $node.addClass(showCheckBox ? ITEM_WITH_CHECKBOX_CLASS : ITEM_WITHOUT_CHECKBOX_CLASS);
    $node.toggleClass(INVISIBLE_STATE_CLASS, nodeData.item.visible === false);

    if (this._hasCustomExpanderIcons()) {
      $node.addClass(ITEM_WITH_CUSTOM_EXPANDER_ICON_CLASS);
      $nodeContainer.addClass(CUSTOM_EXPANDER_ICON_ITEM_CONTAINER_CLASS);
    }

    this.setAria('selected', nodeData.selected, $node);
    this._toggleSelectedClass($node, nodeData.selected);

    if (nodeData.disabled) {
      this.setAria('disabled', nodeData.disabled, $node);
    }

    super._renderItem(
      this._renderedItemsCount + nodeIndex,
      // @ts-expect-error ts-error
      nodeData.item,
      $node,
    );

    const parent = this._getNode(node.internalFields.parentKey);

    if (!parent) {
      $node.addClass(ROOT_NODE_CLASS);
    }

    if (nodeData.item.visible !== false) {
      this._renderChildren($node, node);
    }

    return $node;
  }

  _setAriaSelectionAttribute(): void {}

  _renderChildren($node: dxElementWrapper, node: TreeViewNode): void {
    if (!this._hasChildren(node)) {
      this._addLeafClass($node);
      $('<div>')
        .addClass(EXPANDER_ICON_STUB_CLASS)
        .appendTo(this._getItem($node));
      return;
    }

    if (this._hasCustomExpanderIcons()) {
      this._renderCustomExpanderIcons($node, node);
    } else {
      this._renderDefaultExpanderIcons($node, node);
    }

    if (this._shouldRenderSublevel(node.internalFields.expanded)) {
      // @ts-expect-error ts-error
      this._loadSublevel(node).done((childNodes: TreeViewNode[]) => {
        this._renderSublevel(
          $node,
          // @ts-expect-error ts-error
          this._getActualNode(node),
          childNodes,
        );
      });
    }
  }

  _shouldRenderSublevel(expanded: boolean | undefined): boolean {
    const { deferRendering } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return expanded || !deferRendering;
  }

  _getActualNode(cachedNode: TreeViewNode): TreeViewNode | null {
    return this._dataAdapter.getNodeByKey(cachedNode.internalFields.key);
  }

  _hasChildren(node: TreeViewNode): boolean {
    if (this._isVirtualMode() || this._useCustomChildrenLoader()) {
      // @ts-expect-error ts-error
      return this._hasItemsGetter(node.internalFields.item) !== false;
    }

    return super._hasChildren(node);
  }

  _loadSublevel(node: TreeViewNode): Promise<unknown> {
    const deferred = Deferred();
    const childrenNodes = this._getChildNodes(node);

    if (childrenNodes.length) {
      deferred.resolve(childrenNodes);
    } else {
      this._loadNestedItems(node).done((items) => {
        deferred.resolve(this._dataAdapter.getNodesByItems(items));
      });
    }

    return deferred.promise();
  }

  _getItemExtraPropNames(): string[] {
    return ['url', 'linkAttr'];
  }

  _addContent($container: dxElementWrapper, itemData: TreeViewNode): void {
    const { html, url } = itemData;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _supportItemUrl } = this.option();

    if (_supportItemUrl && url) {
      $container.html(html);
      const link = this._getLinkContainer(
        this._getIconContainer(itemData),
        this._getTextContainer(itemData),
        itemData,
      );
      $container.append(link);
    } else {
      super._addContent($container, itemData);
    }
  }

  _postprocessRenderItem(args: PostprocessRenderItemInfo<TreeViewNode>): void {
    const { itemData, itemElement } = args;

    if (this._showCheckboxes()) {
      this._renderCheckBox(itemElement, this._getNode(itemData));
    }

    super._postprocessRenderItem(args);
  }

  _renderSublevel(
    $node: dxElementWrapper,
    node: TreeViewNode,
    childNodes: TreeViewNode[],
  ): void {
    const $nestedNodeContainer = this._renderNodeContainer($node);

    const keySet = new Set(node.internalFields.childrenKeys);
    const childNodesByChildrenKeys = childNodes.filter(
      (childNode) => keySet.has(childNode.internalFields.key),
    );
    this._renderNodes(childNodesByChildrenKeys, $nestedNodeContainer);

    if (childNodesByChildrenKeys.length && !node.internalFields.selected) {
      const firstChild = childNodesByChildrenKeys[0];
      this._updateParentsState(firstChild, this._getNodeElement(firstChild));
    }

    this._normalizeIconState($node, childNodesByChildrenKeys.length);

    if (node.internalFields.expanded) {
      $nestedNodeContainer.addClass(OPENED_NODE_CONTAINER_CLASS);
    }
  }

  _executeItemRenderAction(
    itemIndex: number,
    itemData: TreeViewNode,
    itemElement: HTMLElement,
  ): void {
    const node = this._getNode(itemElement);

    this._getItemRenderAction()({
      itemElement,
      itemIndex,
      itemData,
      node: this._dataAdapter.getPublicNode(node),
    });
  }

  _addLeafClass($node: dxElementWrapper): void {
    $node.addClass(IS_LEAF);
  }

  _expandEventHandler(e: DxEvent): void {
    const $nodeElement = $(e.currentTarget.parentNode as Element);

    if (!$nodeElement.hasClass(IS_LEAF)) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._toggleExpandedState(e.currentTarget, undefined, e);
    }
  }

  _attachExpandEvent(): void {
    const { expandEvent } = this.option();

    const expandedEventName = this._getEventNameByOption(expandEvent);
    const $itemsContainer = this._itemContainer();

    this._detachExpandEvent($itemsContainer);
    eventsEngine.on(
      $itemsContainer,
      expandedEventName,
      this._itemSelector(),
      this._expandEventHandler.bind(this),
    );
  }

  _detachExpandEvent(itemsContainer: dxElementWrapper): void {
    eventsEngine.off(itemsContainer, `.${EXPAND_EVENT_NAMESPACE}`, this._itemSelector());
  }

  _getEventNameByOption(name: TreeViewExpandEvent | undefined): string {
    const event = name === 'click' ? clickEventName : dblclickEvent;
    return addNamespace(event, EXPAND_EVENT_NAMESPACE);
  }

  _getNode(
    identifier: ItemKey | TreeViewNode | TreeViewItem | Element | null,
  ): TreeViewNode | null {
    if (!isDefined(identifier)) {
      return null;
    }

    if (isPrimitive(identifier)) {
      return this._dataAdapter.getNodeByKey(identifier);
    }

    if (isPlainObject(identifier) && 'internalFields' in identifier) {
      return identifier;
    }
    // @ts-expect-error ts-error
    const itemElement = $(identifier).get(0);
    if (!itemElement) {
      return null;
    }

    if (domAdapter.isElementNode(itemElement)) {
      return this._getNodeByElement(itemElement);
    }

    // @ts-expect-error ts-error
    return this._dataAdapter.getNodeByItem(itemElement);
  }

  _getNodeByElement(itemElement: Element | dxElementWrapper): TreeViewNode | null {
    const $node = $(itemElement).closest(`.${NODE_CLASS}`);
    const itemKeyAttr = $node.attr(DATA_ITEM_ID);

    if (!isDefined(itemKeyAttr)) {
      return null;
    }

    const key = this._decodeString(itemKeyAttr);

    return this._dataAdapter.getNodeByKey(key);
  }

  _toggleExpandedState(
    itemElement: TreeViewNode | ItemKey | Element | null,
    state: boolean | undefined,
    e?: DxEvent,
  ): Promise<unknown> {
    const node = this._getNode(itemElement);
    if (!node) {
      return Deferred().reject().promise();
    }
    if (node.internalFields.disabled) {
      return Deferred().reject().promise();
    }

    const currentState = node.internalFields.expanded;
    if (currentState === state) {
      return Deferred().resolve().promise();
    }

    if (this._hasChildren(node)) {
      const $node = this._getNodeElement(node);

      if ($node.find(`.${NODE_LOAD_INDICATOR_CLASS}:not(.${INVISIBLE_STATE_CLASS})`).length) {
        return Deferred().reject().promise();
      }

      if (!currentState && !this._nodeHasRenderedChildren($node)) {
        this._createLoadIndicator($node);
      }
    }

    const newState = state ?? !currentState;

    this._dataAdapter.toggleExpansion(node.internalFields.key, newState);

    return this._updateExpandedItemsUI(node, newState, e);
  }

  _nodeHasRenderedChildren($node: dxElementWrapper): number {
    const $nodeContainer = $node.children(`.${NODE_CONTAINER_CLASS}`);
    return $nodeContainer.not(':empty').length;
  }

  _getItem($node: dxElementWrapper): dxElementWrapper {
    return $node.children(`.${ITEM_CLASS}`).eq(0);
  }

  _createLoadIndicator($node: dxElementWrapper): void {
    const $treeviewItem = this._getItem($node);

    this._createComponent(
      $('<div>').addClass(NODE_LOAD_INDICATOR_CLASS),
      LoadIndicator,
      {} as LoadIndicatorProperties,
    ).$element().appendTo($treeviewItem);

    const $icon = $treeviewItem.children(`.${TOGGLE_ITEM_VISIBILITY_CLASS},.${CUSTOM_EXPAND_ICON_CLASS}`);
    $icon.hide();
  }

  _renderExpanderIcon(
    $node: dxElementWrapper,
    node: TreeViewNode,
    $icon: dxElementWrapper,
    iconClass: string,
  ): void {
    $icon.appendTo(this._getItem($node));
    $icon.addClass(iconClass);

    if (node.internalFields.disabled) {
      $icon.addClass(DISABLED_STATE_CLASS);
    }

    this._renderToggleItemVisibilityIconClick($icon, node);
  }

  _renderDefaultExpanderIcons(
    $node: dxElementWrapper,
    node: TreeViewNode,
  ): void {
    const $treeViewItem = this._getItem($node);

    const $icon = $('<div>')
      .addClass(TOGGLE_ITEM_VISIBILITY_CLASS)
      .appendTo($treeViewItem);

    if (node.internalFields.expanded) {
      $icon.addClass(TOGGLE_ITEM_VISIBILITY_OPENED_CLASS);
      $node.parent().addClass(OPENED_NODE_CONTAINER_CLASS);
    }

    if (node.internalFields.disabled) {
      $icon.addClass(DISABLED_STATE_CLASS);
    }

    this._renderToggleItemVisibilityIconClick($icon, node);
  }

  _renderCustomExpanderIcons(
    $node: dxElementWrapper,
    node: TreeViewNode,
  ): void {
    const { expandIcon, collapseIcon } = this.option();

    const $expandIcon = getImageContainer(expandIcon ?? collapseIcon) ?? $();
    const $collapseIcon = getImageContainer(collapseIcon ?? expandIcon) ?? $();

    this._renderExpanderIcon($node, node, $expandIcon, CUSTOM_EXPAND_ICON_CLASS);
    this._renderExpanderIcon($node, node, $collapseIcon, CUSTOM_COLLAPSE_ICON_CLASS);

    const isNodeExpanded = node.internalFields.expanded;

    if (isNodeExpanded) {
      $node.parent().addClass(OPENED_NODE_CONTAINER_CLASS);
    }

    this._toggleCustomExpanderIcons($expandIcon, $collapseIcon, isNodeExpanded);
  }

  _renderToggleItemVisibilityIconClick(
    $icon: dxElementWrapper,
    node: TreeViewNode,
  ): void {
    // @ts-expect-error ts-error
    const eventName = addNamespace(clickEventName, this.NAME);

    eventsEngine.off($icon, eventName);
    eventsEngine.on($icon, eventName, (e: DxEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._toggleExpandedState(node.internalFields.key, undefined, e);
      return false;
    });
  }

  _toggleCustomExpanderIcons(
    $expandIcon: dxElementWrapper,
    $collapseIcon: dxElementWrapper,
    isNodeExpanded: boolean | undefined,
  ): void {
    $collapseIcon.toggle(isNodeExpanded);
    $expandIcon.toggle(!isNodeExpanded);
  }

  _updateExpandedItemsUI(
    node: TreeViewNode,
    state: boolean,
    e: DxEvent | undefined,
  ): Promise<unknown> {
    const $node = this._getNodeElement(node);
    const isHiddenNode = !$node.length || (state && $node.is(':hidden'));
    const { expandNodesRecursive } = this.option();

    if (expandNodesRecursive && isHiddenNode) {
      const parentNode = this._getNode(node.internalFields.parentKey);

      if (parentNode) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._updateExpandedItemsUI(parentNode, state, e);
      }
    }

    if (!this._hasCustomExpanderIcons()) {
      const $icon = this._getItem($node).children(`.${TOGGLE_ITEM_VISIBILITY_CLASS}`);

      $icon.toggleClass(TOGGLE_ITEM_VISIBILITY_OPENED_CLASS, state);
    } else if (this._nodeHasRenderedChildren($node)) {
      const $item = this._getItem($node);
      const $childExpandIcons = $item.children(`.${CUSTOM_EXPAND_ICON_CLASS}`);
      const $childCollapseIcons = $item.children(`.${CUSTOM_COLLAPSE_ICON_CLASS}`);

      this._toggleCustomExpanderIcons($childExpandIcons, $childCollapseIcons, state);
    }

    const $nodeContainer = $node.children(`.${NODE_CONTAINER_CLASS}`);

    const nodeContainerExists = $nodeContainer.length > 0;

    const completionCallback = Deferred();
    if (!state || (nodeContainerExists && !$nodeContainer.is(':empty'))) {
      this._animateNodeContainer(node, state, e, completionCallback);
      return completionCallback.promise();
    }

    if (node.internalFields.childrenKeys.length === 0
      && (this._isVirtualMode() || this._useCustomChildrenLoader())) {
      this._loadNestedItemsWithUpdate(node, state, e, completionCallback);
      return completionCallback.promise();
    }

    this._renderSublevel($node, node, this._getChildNodes(node));
    this._fireContentReadyAction();
    this._animateNodeContainer(node, state, e, completionCallback);
    return completionCallback.promise();
  }

  _loadNestedItemsWithUpdate(
    node: TreeViewNode,
    state: boolean,
    e: DxEvent | undefined,
    completionCallback: DeferredObj<unknown>,
  ): void {
    const $node = this._getNodeElement(node);
    this._loadNestedItems(node).done((items: TreeViewNode[]): void => {
      // @ts-expect-error ts-error
      const actualNodeData: TreeViewNode = this._getActualNode(node);

      this._renderSublevel($node, actualNodeData, this._dataAdapter.getNodesByItems(items));

      if (!items?.length) {
        completionCallback.resolve();
        return;
      }

      this._fireContentReadyAction();
      this._animateNodeContainer(actualNodeData, state, e, completionCallback);
    });
  }

  _loadNestedItems(node: TreeViewNode): DeferredObj<TreeViewNode[]> {
    if (this._useCustomChildrenLoader()) {
      const publicNode = this._dataAdapter.getPublicNode(node);
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._loadChildrenByCustomLoader(publicNode).done((newItems: TreeViewNode[]): void => {
        if (!this._areNodesExists(newItems)) {
          this._appendItems(newItems);
        }
      });
    }

    if (!this._isVirtualMode()) {
      // @ts-expect-error ts-error
      return Deferred().resolve([]).promise();
    }

    const { parentIdExpr } = this.option();

    this._filter.internal = [parentIdExpr, node.internalFields.key];
    this._dataSource.filter(this._combineFilter());

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._dataSource.load().done((newItems) => {
      if (!this._areNodesExists(newItems)) {
        this._appendItems(newItems);
      }
    });
  }

  _areNodesExists(newItems: TreeViewNode[]): boolean {
    const keyOfRootItem = this.keyOf(newItems[0]);
    const fullData = this._dataAdapter.getFullData();

    return !!this._dataAdapter.getNodeByKey(keyOfRootItem, fullData);
  }

  _appendItems(newItems: TreeViewNode[]): void {
    const { items = [] } = this.option();

    this.option().items = items.concat(newItems);
    this._initDataAdapter();
  }

  _animateNodeContainer(
    node: TreeViewNode,
    state: boolean,
    e: DxEvent | undefined,
    completionCallback: DeferredObj<unknown>,
  ): void {
    const $node = this._getNodeElement(node);
    const $nodeContainer = $node.children(`.${NODE_CONTAINER_CLASS}`);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (node && completionCallback && $nodeContainer.length === 0) {
      completionCallback.resolve();
    }

    // NOTE: The height of node container is should be used when the container is shown (T606878)
    $nodeContainer.addClass(OPENED_NODE_CONTAINER_CLASS);

    const nodeHeight = getHeight($nodeContainer);
    const { animationEnabled } = this.option();

    fx.stop($nodeContainer.get(0), true);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate($nodeContainer.get(0), {
      // @ts-expect-error ts-error
      type: 'custom',
      duration: animationEnabled ? 400 : 0,
      from: {
        // @ts-expect-error ts-error
        maxHeight: state ? 0 : nodeHeight,
      },
      to: {
        // @ts-expect-error ts-error
        maxHeight: state ? nodeHeight : 0,
      },
      complete: () => {
        $nodeContainer.css('maxHeight', 'none');
        $nodeContainer.toggleClass(OPENED_NODE_CONTAINER_CLASS, state);
        this.setAria('expanded', state, $node);
        this.getScrollable().update();
        this._fireExpandedStateUpdatedEvent(state, node, e);

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        if (completionCallback) {
          completionCallback.resolve();
        }
      },
    });
  }

  _fireExpandedStateUpdatedEvent(
    isExpanded: boolean,
    node: TreeViewNode,
    e?: DxEvent | undefined,
  ): void {
    if (!this._hasChildren(node) || this._skipContentReadyAndItemExpanded) {
      return;
    }

    const optionName = isExpanded ? 'onItemExpanded' : 'onItemCollapsed';
    if (isDefined(e)) {
      this._itemDXEventHandler(e, optionName, { node: this._dataAdapter.getPublicNode(node) });
    } else {
      const target = this._getNodeElement(node);
      const actionArgs = {
        event: e,
        node: this._dataAdapter.getPublicNode(node),
      };
      this._itemEventHandler(target, optionName, actionArgs);
    }
  }

  _normalizeIconState($node: dxElementWrapper, hasNewItems: number): void {
    const $loadIndicator = $node.find(`.${NODE_LOAD_INDICATOR_CLASS}`);

    if ($loadIndicator.length) {
      LoadIndicator.getInstance($loadIndicator)?.option('visible', false);
    }

    const $treeViewItem = this._getItem($node);
    const $toggleItem = $treeViewItem.children(`.${CUSTOM_COLLAPSE_ICON_CLASS},.${TOGGLE_ITEM_VISIBILITY_CLASS}`);

    if (hasNewItems) {
      $toggleItem.show();
      return;
    }

    $toggleItem.removeClass(TOGGLE_ITEM_VISIBILITY_CLASS);
    $node.addClass(IS_LEAF);
  }

  _emptyMessageContainer(): dxElementWrapper {
    const scrollable = this.getScrollable();
    return scrollable ? $(scrollable.content()) : super._emptyMessageContainer();
  }

  _renderContent(): void {
    const { items } = this.option();

    if (items?.length) {
      this._contentAlreadyRendered = true;
    }

    super._renderContent();
  }

  _renderSelectAllItem($container?: dxElementWrapper): void {
    const { selectAllText, focusStateEnabled } = this.option();

    const $selectAllContainer = $container ?? this.$element().find(`.${NODE_CONTAINER_CLASS}`).first();

    this._$selectAllItem = $('<div>').addClass(SELECT_ALL_ITEM_CLASS);

    const isAllSelected = this._dataAdapter.isAllSelected();
    this._createComponent(this._$selectAllItem, CheckBox, {
      value: isAllSelected,
      elementAttr: { 'aria-label': messageLocalization.format('dxList-selectAll') },
      text: selectAllText,
      focusStateEnabled,
      onValueChanged: (event: ValueChangedEvent) => {
        this._onSelectAllCheckboxValueChanged(event);
      },
      onInitialized: (event: Required<InitializedEvent>): void => {
        const { component } = event;
        component.registerKeyHandler('enter', () => {
          const { value } = component.option();

          component.option('value', !value);
        });
      },
    });

    this._toggleSelectedClass(this._$selectAllItem, isAllSelected);

    $selectAllContainer.before(this._$selectAllItem);
  }

  _onSelectAllCheckboxValueChanged(args: ValueChangedEvent): void {
    this._toggleSelectAll(args);
    this._fireSelectAllValueChanged(args.value);
  }

  _toggleSelectAll(args: ValueChangedEvent): void {
    this._dataAdapter.toggleSelectAll(args.value);
    this._updateItemsUI();
    this._fireSelectionChanged();
  }

  _renderCheckBox($node: dxElementWrapper, node: TreeViewNode | null): void {
    const $checkbox = $('<div>').appendTo($node);

    this._createComponent<CheckBox, CheckBoxProperties>($checkbox, CheckBox, {
      value: node?.internalFields.selected,
      onValueChanged: (e: ValueChangedEvent) => {
        this._changeCheckboxValue(e);
      },
      focusStateEnabled: false,
      elementAttr: { 'aria-label': messageLocalization.format('CheckState') },
      // @ts-expect-error ts-error
      disabled: this._disabledGetter(node),
    });
  }

  _toggleSelectedClass($node: dxElementWrapper, value: boolean | undefined): void {
    $node.toggleClass(SELECTED_ITEM_CLASS, !!value);
  }

  _toggleNodeDisabledState(node: TreeViewNode, state: boolean): void {
    const $node = this._getNodeElement(node);
    const $item = $node.find(`.${ITEM_CLASS}`).eq(0);

    this._dataAdapter.toggleNodeDisabledState(node.internalFields.key, state);

    $item.toggleClass(DISABLED_STATE_CLASS, !!state);

    if (this._showCheckboxes()) {
      const checkbox = this._getCheckBoxInstance($node);
      checkbox.option('disabled', !!state);
    }
  }

  _itemOptionChanged(item: Item, property: keyof Item, value: unknown): void {
    const node = this._dataAdapter.getNodeByItem(item);
    const { disabledExpr } = this.option();

    if (node && property === disabledExpr) {
      this._toggleNodeDisabledState(node, Boolean(value));
    }
  }

  _changeCheckboxValue(e: ValueChangedEvent): void {
    const $node = $(e.element).closest(`.${NODE_CLASS}`);
    const $item = this._getItem($node);

    const item = this._getItemData($item);
    const node = this._getNodeByElement($item);
    const { value } = e;

    if (node && node.internalFields.selected === value) {
      return;
    }

    this._updateItemSelection(value, item, e.event);
  }

  _isSingleSelection(): boolean {
    const { selectionMode } = this.option();

    return selectionMode === 'single';
  }

  _isRecursiveSelection(): boolean {
    const { selectionMode, selectNodesRecursive } = this.option();

    return !!selectNodesRecursive && selectionMode !== 'single';
  }

  _isLastSelectedBranch(
    publicNode: PublicNode,
    selectedNodesKeys: ItemKey[],
    deep?: boolean,
  ): boolean {
    const keyIndex = selectedNodesKeys.indexOf(publicNode.key);

    if (keyIndex >= 0) {
      selectedNodesKeys.splice(keyIndex, 1);
    }

    if (deep) {
      each(publicNode.children, (_index: number, childNode: PublicNode): void => {
        this._isLastSelectedBranch(childNode, selectedNodesKeys, true);
      });
    }

    if (publicNode.parent) {
      this._isLastSelectedBranch(publicNode.parent, selectedNodesKeys);
    }

    return selectedNodesKeys.length === 0;
  }

  _isLastRequired(node: TreeViewNode): boolean {
    const { selectionRequired } = this.option();
    const isSingleMode = this._isSingleSelection();
    const selectedNodesKeys = this.getSelectedNodeKeys();

    if (!selectionRequired) {
      return false;
    }

    if (isSingleMode) {
      return selectedNodesKeys.length === 1;
    }
    return this._isLastSelectedBranch(
      node.internalFields.publicNode,
      selectedNodesKeys.slice(),
      true,
    );
  }

  _updateItemSelection(
    value: boolean,
    itemElement: Element | TreeViewNode | ItemKey | null,
    event?: DxEvent,
  ): boolean {
    const node = this._getNode(itemElement);
    if (!node || node.visible === false) {
      return false;
    }

    if (node.internalFields.selected === value) {
      return true;
    }

    if (!value && this._isLastRequired(node)) {
      if (this._showCheckboxes()) {
        const $node = this._getNodeElement(node);
        this._getCheckBoxInstance($node).option('value', true);
      }
      return false;
    }

    if (value && this._isSingleSelection()) {
      const selectedKeys = this.getSelectedNodeKeys();
      each(selectedKeys, (_index: number, key: ItemKey): void => {
        this._dataAdapter.toggleSelection(key, false);
        this._updateItemsUI();
        // @ts-expect-error ts-error
        this._fireItemSelectionChanged(this._getNode(key));
      });
    }

    this._dataAdapter.toggleSelection(node.internalFields.key, value);
    const isAllSelected = this._dataAdapter.isAllSelected();
    // @ts-expect-error ts-error
    const needFireSelectAllChanged = this._selectAllEnabled() && this._$selectAllItem.dxCheckBox('instance').option('value') !== isAllSelected;
    this._updateItemsUI();

    this._fireItemSelectionChanged(node, event);
    this._fireSelectionChanged();
    if (needFireSelectAllChanged) {
      this._fireSelectAllValueChanged(isAllSelected);
    }
    return true;
  }

  _fireItemSelectionChanged(node: TreeViewNode, event?: DxEvent): void {
    // @ts-expect-error ts-error
    const initiator = event ?? this._findItemElementByItem(node.internalFields.item);
    const handler = event ? this._itemDXEventHandler : this._itemEventHandler;
    // @ts-expect-error ts-error
    handler.call(this, initiator, 'onItemSelectionChanged', {
      node: this._dataAdapter.getPublicNode(node),
      itemData: node?.internalFields.item,
    });
  }

  _getCheckBoxInstance($node: dxElementWrapper): CheckBox {
    const $treeViewItem = this._getItem($node);
    // @ts-expect-error ts-error
    return $treeViewItem.children(`.${CHECK_BOX_CLASS}`).dxCheckBox('instance') as CheckBox;
  }

  _updateItemsUI(): void {
    const cache = {};

    each(this._dataAdapter.getData(), (_index: number, node: InternalNode): void => {
      const $node = this._getNodeElement(node, cache);
      const nodeSelection = node.internalFields.selected;

      if (!$node.length) {
        return;
      }

      this._toggleSelectedClass($node, nodeSelection);
      this.setAria('selected', nodeSelection, $node);

      if (this._showCheckboxes()) {
        this._getCheckBoxInstance($node).option('value', nodeSelection);
      }
    });

    if (this._selectAllEnabled()) {
      // @ts-expect-error ts-error
      const selectAllCheckbox = this._$selectAllItem.dxCheckBox('instance');

      selectAllCheckbox.option('onValueChanged', undefined);
      selectAllCheckbox.option('value', this._dataAdapter.isAllSelected());
      selectAllCheckbox.option('onValueChanged', this._onSelectAllCheckboxValueChanged.bind(this));
    }
  }

  _updateParentsState(
    node: TreeViewNode | null,
    $node: dxElementWrapper,
  ): void {
    if (!$node || !node) {
      return;
    }

    const parentNode = this._dataAdapter.getNodeByKey(node.internalFields.parentKey);
    const $parentNode = $($node.parents(`.${NODE_CLASS}`)[0]);

    if (this._showCheckboxes()) {
      const parentValue = parentNode?.internalFields.selected;
      this._getCheckBoxInstance($parentNode)?.option('value', parentValue);
      this._toggleSelectedClass($parentNode, parentValue);
    }

    const { rootValue } = this.option();

    if (parentNode?.internalFields.parentKey !== rootValue) {
      this._updateParentsState(parentNode, $parentNode);
    }
  }

  _itemEventHandlerImpl(
    initiator: dxElementWrapper | Element,
    action: (event?: Record<string, unknown>) => void,
    actionArgs: ActionArgs<Item>,
  ): void {
    const $itemElement = $(initiator).closest(`.${NODE_CLASS}`).children(`.${ITEM_CLASS}`);

    return action(extend(this._extendActionArgs($itemElement), actionArgs));
  }

  _itemContextMenuHandler(e: DxEvent): void {
    this._createEventHandler('onItemContextMenu', e);
  }

  _itemHoldHandler(e: DxEvent): void {
    this._createEventHandler('onItemHold', e);
  }

  _createEventHandler(eventName: keyof TreeViewBaseProperties, e: DxEvent): void {
    const node = this._getNodeByElement(e.currentTarget) as TreeViewNode;

    this._itemDXEventHandler(e, eventName, { node: this._dataAdapter.getPublicNode(node) });
  }

  _itemClass(): string {
    return ITEM_CLASS;
  }

  _itemDataKey(): string {
    return ITEM_DATA_KEY;
  }

  _attachClickEvent(): void {
    const $itemContainer = this._itemContainer();
    this._detachClickEvent($itemContainer);

    const {
      clickEventNamespace, itemSelector, pointerDownEventNamespace, nodeSelector,
    } = this._getItemClickEventData();

    eventsEngine.on(
      $itemContainer,
      clickEventNamespace,
      itemSelector,
      (e: DxEvent<MouseEvent | PointerEvent | TouchEvent>): void => {
        if ($(e.target).hasClass(CHECK_BOX_ICON_CLASS) || $(e.target).hasClass(CHECK_BOX_CLASS)) {
          return;
        }
        this._processItemClick(e, $(e.currentTarget));
      },
    );

    eventsEngine.on($itemContainer, pointerDownEventNamespace, nodeSelector, (e) => {
      this._itemPointerHandler(e);
    });
  }

  _detachClickEvent(itemsContainer: dxElementWrapper): void {
    const {
      clickEventNamespace, itemSelector, pointerDownEventNamespace, nodeSelector,
    } = this._getItemClickEventData();

    eventsEngine.off(itemsContainer, clickEventNamespace, itemSelector);
    eventsEngine.off(itemsContainer, pointerDownEventNamespace, nodeSelector);
  }

  _getItemClickEventData(): {
    clickEventNamespace: string;
    itemSelector: string;
    pointerDownEventNamespace: string;
    nodeSelector: string;
  } {
    const itemSelector = `.${this._itemClass()}`;
    const nodeSelector = `.${NODE_CLASS}, .${SELECT_ALL_ITEM_CLASS}`;
    // @ts-expect-error ts-error
    const clickEventNamespace = addNamespace(clickEventName, this.NAME);
    // @ts-expect-error ts-error
    const pointerDownEventNamespace = addNamespace(pointerEvents.down, this.NAME);

    return {
      clickEventNamespace,
      itemSelector,
      pointerDownEventNamespace,
      nodeSelector,
    };
  }

  _itemClick(
    args: NativeEventInfo<
      TreeViewBase,
      KeyboardEvent | MouseEvent | PointerEvent | TouchEvent
    > & CollectionItemInfo<TreeViewItem>,
  ): void {
    const { event, itemData } = args;
    const target = event?.target[0] || event?.target;
    const link = target.getElementsByClassName(ITEM_URL_CLASS)[0];

    if (itemData.url && link) {
      this._clickByLink(link);
    }
  }

  _processItemClick(
    e: DxEvent<KeyboardEvent | MouseEvent | PointerEvent | TouchEvent>,
    $item: dxElementWrapper,
  ): void {
    const itemData = this._getItemData($item);

    const node = this._getNodeByElement($item);

    if (!node) return;

    this._itemDXEventHandler(e, 'onItemClick', {
      node: this._dataAdapter.getPublicNode(node),
    }, {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      beforeExecute: (e) => {
        // @ts-expect-error ts-error
        this._itemClick(e.args[0]);
      },
    });

    const { selectByClick } = this.option();

    if (selectByClick && !e.isDefaultPrevented()) {
      this._updateItemSelection(
        !node.internalFields.selected,
        itemData,
        e,
      );
    }
  }

  _updateSelectionToFirstItem($items: dxElementWrapper, startIndex: number): void {
    let itemIndex = startIndex;

    while (itemIndex >= 0) {
      const $item = $($items[itemIndex]);
      this._updateItemSelection(true, $item.find(`.${ITEM_CLASS}`).get(0));
      itemIndex -= 1;
    }
  }

  _updateSelectionToLastItem($items: dxElementWrapper, startIndex: number): void {
    const { length } = $items;
    let itemIndex = startIndex;

    while (itemIndex < length) {
      const $item = $($items[itemIndex]);
      this._updateItemSelection(true, $item.find(`.${ITEM_CLASS}`).get(0));
      itemIndex += 1;
    }
  }

  focus(): void {
    const { items = [] } = this.option();
    if (this._selectAllEnabled() && items.length) {
      // @ts-expect-error ts-error
      eventsEngine.trigger(this._$selectAllItem, 'focus');
      return;
    }

    super.focus();
  }

  _focusInHandler(e: DxEvent): void {
    this._updateFocusState(e, true);

    const isSelectAllItem = $(e.target).hasClass(SELECT_ALL_ITEM_CLASS);

    if (isSelectAllItem || this.option('focusedElement')) {
      clearTimeout(this._setFocusedItemTimeout);

      // eslint-disable-next-line no-restricted-globals
      this._setFocusedItemTimeout = setTimeout(() => {
        const { focusedElement } = this.option();
        const element = isSelectAllItem
          ? getPublicElement($(this._$selectAllItem))
          : $(focusedElement);

        this._setFocusedItem($(element));
      });

      return;
    }

    const $activeItem = this._getActiveItem();
    this.option('focusedElement', getPublicElement($activeItem.closest(`.${NODE_CLASS}`)));
  }

  _itemPointerHandler(e: DxEvent): void {
    const { focusStateEnabled } = this.option();

    if (!focusStateEnabled) {
      return;
    }

    const $target = $(e.target).closest(`.${NODE_CLASS}, .${SELECT_ALL_ITEM_CLASS}`);

    if (!$target.length) {
      return;
    }

    const itemElement = $target.hasClass(DISABLED_STATE_CLASS) ? null : $target;
    // @ts-expect-error ts-error
    this.option('focusedElement', getPublicElement(itemElement));
  }

  _findNonDisabledNodes($nodes: dxElementWrapper): dxElementWrapper {
    return $nodes.not(`:has(>.${ITEM_CLASS}.${DISABLED_STATE_CLASS})`);
  }

  _moveFocus(location: string, e: DxEvent<KeyboardEvent>): void {
    const { rtlEnabled } = this.option();

    const FOCUS_UP = 'up';
    const FOCUS_DOWN = 'down';
    const FOCUS_FIRST = 'first';
    const FOCUS_LAST = 'last';
    const FOCUS_LEFT = rtlEnabled ? 'right' : 'left';
    const FOCUS_RIGHT = rtlEnabled ? 'left' : 'right';

    this.$element()
      .find(`.${NODE_CONTAINER_CLASS}`)
      .each((_index: number, nodeContainer: Element): boolean => {
        fx.stop(nodeContainer, true);
        return true;
      });

    const $items = this._nodeElements();

    if (!$items?.length) {
      return;
    }

    switch (location) {
      case FOCUS_UP: {
        const $prevItem = this._prevItem($items);
        this.option('focusedElement', getPublicElement($prevItem));

        const prevItemElement = this._getNodeItemElement($prevItem);
        this.getScrollable().scrollToElement(prevItemElement);
        if (e.shiftKey && this._showCheckboxes()) {
          this._updateItemSelection(true, prevItemElement);
        }
        break;
      }
      case FOCUS_DOWN: {
        const $nextItem = this._nextItem($items);
        this.option('focusedElement', getPublicElement($nextItem));

        const nextItemElement = this._getNodeItemElement($nextItem);
        this.getScrollable().scrollToElement(nextItemElement);
        if (e.shiftKey && this._showCheckboxes()) {
          this._updateItemSelection(true, nextItemElement);
        }
        break;
      }
      case FOCUS_FIRST: {
        const $firstItem = $items.first();
        if (e.shiftKey && this._showCheckboxes()) {
          this._updateSelectionToFirstItem($items, $items.index(this._prevItem($items)));
        }

        this.option('focusedElement', getPublicElement($firstItem));
        this.getScrollable().scrollToElement(this._getNodeItemElement($firstItem));
        break;
      }
      case FOCUS_LAST: {
        const $lastItem = $items.last();

        if (e.shiftKey && this._showCheckboxes()) {
          this._updateSelectionToLastItem($items, $items.index(this._nextItem($items)));
        }

        this.option('focusedElement', getPublicElement($lastItem));
        this.getScrollable().scrollToElement(this._getNodeItemElement($lastItem));
        break;
      }
      case FOCUS_RIGHT: {
        this._expandFocusedContainer();
        break;
      }
      case FOCUS_LEFT: {
        this._collapseFocusedContainer();
        break;
      }
      default:
        super._moveFocus(location, e);
    }
  }

  _getNodeItemElement($node: dxElementWrapper): Element {
    return $node.find(`.${ITEM_CLASS}`).get(0);
  }

  _nodeElements(): dxElementWrapper {
    return this.$element()
      .find(`.${NODE_CLASS}`)
      .not(':hidden');
  }

  _expandFocusedContainer(): void {
    const { focusedElement } = this.option();
    const $focusedNode = $(focusedElement);
    if (!$focusedNode.length || $focusedNode.hasClass(IS_LEAF)) {
      return;
    }

    const $node = $focusedNode.find(`.${NODE_CONTAINER_CLASS}`).eq(0);

    if ($node.hasClass(OPENED_NODE_CONTAINER_CLASS)) {
      const $nextItem = this._nextItem(this._findNonDisabledNodes(this._nodeElements()));
      this.option('focusedElement', getPublicElement($nextItem));
      this.getScrollable().scrollToElement(this._getNodeItemElement($nextItem));
      return;
    }

    const node = this._getNodeByElement(this._getItem($focusedNode));
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._toggleExpandedState(node, true);
  }

  _getClosestNonDisabledNode($node: dxElementWrapper): dxElementWrapper {
    const isNodeDisabled = ($el: dxElementWrapper): boolean => $el.children(`.${ITEM_CLASS}.${DISABLED_STATE_CLASS}`).length > 0;

    let currentNode = $node;

    do {
      currentNode = currentNode.parent().closest(`.${NODE_CLASS}`);
    } while (currentNode.length && isNodeDisabled(currentNode));

    return currentNode;
  }

  _collapseFocusedContainer(): void {
    const { focusedElement } = this.option();
    const $focusedNode = $(focusedElement);

    if (!$focusedNode.length) {
      return;
    }

    const nodeElement = $focusedNode.find(`.${NODE_CONTAINER_CLASS}`).eq(0);

    if (!$focusedNode.hasClass(IS_LEAF) && nodeElement.hasClass(OPENED_NODE_CONTAINER_CLASS)) {
      const node = this._getNodeByElement(this._getItem($focusedNode));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._toggleExpandedState(node, false);
    } else {
      const collapsedNode = this._getClosestNonDisabledNode($focusedNode);

      if (collapsedNode.length) {
        this.option('focusedElement', getPublicElement(collapsedNode));
      }

      this.getScrollable().scrollToElement(this._getNodeItemElement(collapsedNode));
    }
  }

  _encodeString(value: string): string;
  _encodeString(value: number): number;
  _encodeString(value: ItemKey): ItemKey;

  _encodeString(value: ItemKey): ItemKey {
    return isString(value)
      ? encodeURI(value)
      : value;
  }

  _decodeString(value: string): string;
  _decodeString(value: number): number;
  _decodeString(value: ItemKey): ItemKey;

  _decodeString(value: ItemKey): ItemKey {
    return isString(value)
      ? decodeURI(value)
      : value;
  }

  getScrollable(): Scrollable {
    return this._scrollable;
  }

  updateDimensions(): Promise<unknown> {
    const deferred = Deferred();

    const scrollable = this.getScrollable();
    if (scrollable) {
      scrollable.update().done(() => {
        // @ts-expect-error ts-error
        deferred.resolveWith(this);
      });
    } else {
      // @ts-expect-error ts-error
      deferred.resolveWith(this);
    }

    return deferred.promise();
  }

  // @ts-expect-error ts-error
  selectItem(itemElement: TreeViewNode | ItemKey | Element | null): boolean {
    return this._updateItemSelection(true, itemElement);
  }

  unselectItem(itemElement: TreeViewNode | ItemKey | Element | null): boolean {
    return this._updateItemSelection(false, itemElement);
  }

  expandItem(itemElement: TreeViewNode | ItemKey | Element | null): Promise<unknown> {
    return this._toggleExpandedState(itemElement, true);
  }

  collapseItem(itemElement: TreeViewNode | ItemKey | Element | null): Promise<unknown> {
    return this._toggleExpandedState(itemElement, false);
  }

  getNodes(): PublicNode[] {
    return this._dataAdapter.getTreeNodes();
  }

  getSelectedNodes(): (PublicNode | undefined)[] {
    return this.getSelectedNodeKeys().map((key: ItemKey): PublicNode | undefined => {
      const node = this._dataAdapter.getNodeByKey(key) as TreeViewNode;
      return this._dataAdapter.getPublicNode(node);
    });
  }

  getSelectedNodeKeys(): ItemKey[] {
    return this._dataAdapter.getSelectedNodesKeys();
  }

  selectAll(): void {
    if (this._selectAllEnabled()) {
      // @ts-expect-error ts-error
      this._$selectAllItem.dxCheckBox('instance').option('value', true);
    } else {
      this._toggleSelectAll({ value: true } as ValueChangedEvent);
    }
  }

  unselectAll(): void {
    if (this._selectAllEnabled()) {
      // @ts-expect-error ts-error
      this._$selectAllItem.dxCheckBox('instance').option('value', false);
    } else {
      this._toggleSelectAll({ value: false } as ValueChangedEvent);
    }
  }

  _allItemsExpandedHandler(): void {
    this._skipContentReadyAndItemExpanded = false;
    this._fireContentReadyAction();
  }

  expandAll(): void {
    const nodes = this._dataAdapter.getData();
    const expandingPromises: Promise<unknown>[] = [];

    this._skipContentReadyAndItemExpanded = true;

    // NOTE: This is needed to support animation on expandAll,
    //  but stop triggering multiple contentReady/itemExpanded events.

    nodes.forEach((node) => expandingPromises.push(
      this._toggleExpandedState(node?.internalFields.key ?? null, true),
    ));

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.allSettled(expandingPromises).then(() => this._allItemsExpandedHandler?.());
  }

  collapseAll(): void {
    each(this._dataAdapter.getExpandedNodesKeys(), (_index: number, key: ItemKey): void => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._toggleExpandedState(key, false);
    });
  }

  scrollToItem(keyOrItemOrElement: ItemKey | Element | TreeViewItem): Promise<unknown> {
    const node = this._getNode(keyOrItemOrElement);
    if (!node) {
      return Deferred().reject().promise();
    }

    const nodeKeysToExpand: ItemKey[] = [];
    let parentNode = node.internalFields.publicNode.parent;

    while (parentNode != null) {
      if (!parentNode.expanded) {
        nodeKeysToExpand.push(parentNode.key);
      }
      parentNode = parentNode.parent;
    }

    const scrollCallback = Deferred();
    // @ts-expect-error ts-error
    this._expandNodes(nodeKeysToExpand.reverse()).always(() => {
      const $element = this._getNodeElement(node);

      if ($element?.length) {
        this.scrollToElementTopLeft($element[0]);
        scrollCallback.resolve();
      } else {
        scrollCallback.reject();
      }
    });

    return scrollCallback.promise();
  }

  scrollToElementTopLeft(targetElement: HTMLElement): void {
    const scrollable = this.getScrollable();
    const { scrollDirection, rtlEnabled } = this.option();

    const targetLocation = { top: 0, left: 0 };
    const relativeOffset = getRelativeOffset(SCROLLABLE_CONTENT_CLASS, targetElement);

    if (scrollDirection !== DIRECTION_VERTICAL) {
      const containerElement = $(scrollable.container()).get(0);

      targetLocation.left = rtlEnabled
        ? relativeOffset.left + targetElement.offsetWidth - containerElement.clientWidth
        : relativeOffset.left;
    }
    if (scrollDirection !== DIRECTION_HORIZONTAL) {
      targetLocation.top = relativeOffset.top;
    }

    scrollable.scrollTo(targetLocation);
  }

  _expandNodes(keysToExpand: ItemKey[]): Promise<unknown> {
    if (!keysToExpand || keysToExpand.length === 0) {
      return Deferred().resolve().promise();
    }

    const resultCallback = Deferred();
    const callbacksByNodes = keysToExpand.map((key: ItemKey) => this.expandItem(key));

    when.apply($, callbacksByNodes)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .done(() => resultCallback.resolve())
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .fail(() => resultCallback.reject());

    return resultCallback.promise();
  }

  _dispose(): void {
    super._dispose();
    clearTimeout(this._setFocusedItemTimeout);
    // @ts-expect-error ts-error
    this._allItemsExpandedHandler = null;
  }
}

export default TreeViewBase;
