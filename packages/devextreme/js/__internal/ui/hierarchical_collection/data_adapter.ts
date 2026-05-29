import type { DataStructure, SearchMode } from '@js/common';
import query from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isFunction } from '@js/core/utils/type';
import type { DisabledNodeSelectionMode } from '@js/ui/tree_view';
import errors from '@js/ui/widget/ui.errors';
import { getIntersection } from '@ts/core/utils/m_array';
import SearchBoxController, { getOperationBySearchMode } from '@ts/ui/collection/search_box_controller';
import TextBox from '@ts/ui/text_box/text_box';

import HierarchicalDataConverter, {
  type DataAccessors,
  type InternalNode,
  type ItemData,
  type ItemKey,
  type PublicNode,
} from './data_converter';

const EXPANDED = 'expanded';
const SELECTED = 'selected';
const DISABLED = 'disabled';

type SortOption = {
  selector: string | ((item: ItemData) => unknown);
  desc?: boolean;
} | string;

interface LangParams {
  locale?: string;
  collator?: Intl.Collator;
}

export interface DataAdapterOptions {
  dataAccessors: DataAccessors;
  items: ItemData[];

  rootValue: ItemKey;
  multipleSelection: boolean;
  recursiveSelection: boolean;
  recursiveExpansion: boolean;
  searchValue: string;

  selectionRequired?: boolean;
  dataType: DataStructure;
  sort: SortOption | SortOption[] | null;
  langParams?: LangParams;
  searchExpr?: string | Function | (string | Function)[] | ((item: ItemData) => unknown);

  dataConverter: HierarchicalDataConverter;
  onNodeChanged: (node: InternalNode) => void;

  searchMode: SearchMode;

  disabledNodeSelectionMode: DisabledNodeSelectionMode;
}

SearchBoxController.setEditorClass(TextBox);

class DataAdapter {
  options: DataAdapterOptions = {
    dataAccessors: {} as DataAccessors,
    items: [],
    multipleSelection: true,
    recursiveSelection: false,
    recursiveExpansion: false,
    rootValue: 0,
    searchValue: '',
    dataType: 'tree',
    searchMode: 'contains',
    dataConverter: new HierarchicalDataConverter(),
    onNodeChanged: noop,
    sort: null,
    disabledNodeSelectionMode: 'recursiveAndAll',
  };

  _disabledNodesKeys: ItemKey[] = [];

  _selectedNodesKeys: ItemKey[] = [];

  _expandedNodesKeys: ItemKey[] = [];

  _dataStructure: (InternalNode | null)[] = [];

  _initialDataStructure: (InternalNode | null)[] = [];

  constructor(options: DataAdapterOptions) {
    extend(this.options, options);
    this.options.dataConverter.setDataAccessors(this.options.dataAccessors);

    this._createInternalDataStructure();
    this.getTreeNodes();
  }

  setOption<K extends keyof DataAdapterOptions>(
    name: K,
    value: DataAdapterOptions[K],
  ): void {
    this.options[name] = value;

    if (name === 'recursiveSelection' || name === 'disabledNodeSelectionMode') {
      this._updateSelection();
    }
  }

  _createInternalDataStructure(): void {
    this._initialDataStructure = this.options.dataConverter.createPlainStructure(
      this.options.items,
      this.options.rootValue,
      this.options.dataType,
    );
    this._dataStructure = this.options.searchValue.length
      ? this.search(this.options.searchValue)
      : this._initialDataStructure;

    this.options.dataConverter._dataStructure = this._dataStructure;

    this._updateDisabled();
    this._updateSelection();
    this._updateExpansion();
  }

  _updateDisabled(): void {
    this._disabledNodesKeys = this._updateNodesKeysArray(DISABLED);
  }

  _updateSelection(): void {
    if (this.options.recursiveSelection) {
      this._setChildrenSelection();
      this._setParentSelection();
    }

    this._selectedNodesKeys = this._updateNodesKeysArray(SELECTED);
  }

  _updateExpansion(key?: ItemKey): void {
    if (this.options.recursiveExpansion) {
      if (key) {
        this._updateOneBranch(key);
      } else {
        this._setParentExpansion();
      }
    }

    this._expandedNodesKeys = this._updateNodesKeysArray(EXPANDED);
  }

  _updateNodesKeysArray(property: typeof SELECTED | typeof EXPANDED | typeof DISABLED): ItemKey[] {
    let array: ItemKey[] = [];

    each(this._getDataBySelectionMode(), (_index: number, node: InternalNode): void => {
      if (!this._isNodeVisible(node)) {
        return;
      }

      if (node.internalFields[property]) {
        if (property === EXPANDED || property === DISABLED || this.options.multipleSelection) {
          array.push(node.internalFields.key);
        } else {
          if (array.length) {
            this.toggleSelection(array[0], false, true);
          }
          array = [node.internalFields.key];
        }
      }
    });

    return array;
  }

  _getDataBySelectionMode(): (InternalNode | null)[] {
    return this.options.multipleSelection ? this.getData() : this.getFullData();
  }

  _isNodeVisible(node?: InternalNode): boolean {
    return node?.internalFields.item.visible !== false;
  }

  _isNodeDisabled(node?: InternalNode | null): boolean {
    return node?.internalFields.disabled ?? false;
  }

  _getByKey(data: (InternalNode | null)[], key: ItemKey): InternalNode | null {
    return data === this._dataStructure
      ? this.options.dataConverter._getByKey(key)
      : this.options.dataConverter.getByKey(data.filter(Boolean), key);
  }

  _setChildrenSelection(): void {
    each(this._dataStructure, (_index: number, node: InternalNode): void => {
      if (!node?.internalFields.childrenKeys.length) {
        return;
      }

      const isSelected = node.internalFields.selected;
      if (isSelected) {
        this._toggleChildrenSelection(node, isSelected);
      }
    });
  }

  _setParentSelection(): void {
    each(this._dataStructure, (_index: number, node: InternalNode): void => {
      if (!node) return;

      const parent = this.options.dataConverter.getParentNode(node);

      if (parent && node.internalFields.parentKey !== this.options.rootValue) {
        this._iterateParents(node, (parentNode: InternalNode): void => {
          if (this.options.disabledNodeSelectionMode === 'never' && this._isNodeDisabled(parentNode)) {
            return;
          }
          const newParentState = this._calculateSelectedState(parentNode);
          this._setFieldState(parentNode, SELECTED, newParentState);
        });
      }
    });
  }

  _setParentExpansion(): void {
    each(this._dataStructure, (_index: number, node: InternalNode): void => {
      if (!node?.internalFields.expanded) {
        return;
      }

      this._updateOneBranch(node.internalFields.key);
    });
  }

  _updateOneBranch(key: ItemKey): void {
    const node = this.getNodeByKey(key);

    this._iterateParents(node, (parent) => {
      this._setFieldState(parent, EXPANDED, true);
    });
  }

  _iterateChildren(
    node: InternalNode | null,
    recursive: boolean,
    callback: (child: InternalNode | null) => void,
    processedKeys?: ItemKey[],
  ): void {
    if (!isFunction(callback) || !node) {
      return;
    }

    if (this.options.disabledNodeSelectionMode === 'never' && this._isNodeDisabled(node)) {
      return;
    }

    const nodeKey = node.internalFields.key;
    const keys = processedKeys ?? [];
    if (nodeKey !== undefined && !keys.includes(nodeKey)) {
      keys.push(nodeKey);
      each(node.internalFields.childrenKeys, (_index: number, key: ItemKey) => {
        const child = this.getNodeByKey(key);
        callback(child);
        if (child?.internalFields.childrenKeys.length && recursive) {
          this._iterateChildren(child, recursive, callback, keys);
        }
      });
    }
  }

  _iterateParents(
    node: InternalNode | null,
    callback: (parent: InternalNode) => void,
    processedKeys?: ItemKey[],
  ): void {
    if (
      !node
      || node.internalFields.parentKey === this.options.rootValue
      || !isFunction(callback)
    ) {
      return;
    }
    const keys = processedKeys ?? [];
    const { key } = node.internalFields;

    if (!keys.includes(key)) {
      keys.push(key);
      const parent = this.options.dataConverter.getParentNode(node);
      if (parent) {
        callback(parent);
        if (parent.internalFields.parentKey !== this.options.rootValue) {
          this._iterateParents(parent, callback, keys);
        }
      }
    }
  }

  _calculateSelectedState(node: InternalNode): boolean | undefined {
    const itemsCount = node.internalFields.childrenKeys.length;
    let selectedItemsCount = 0;
    let invisibleItemsCount = 0;
    let disabledItemsCount = 0;
    let result: boolean | undefined = false;

    const isSkipDisabled = this.options.disabledNodeSelectionMode === 'never';

    for (let i = 0; i <= itemsCount - 1; i += 1) {
      const childNode = this.getNodeByKey(node.internalFields.childrenKeys[i]);
      const isChildInvisible = childNode?.internalFields.item.visible === false;
      const isChildDisabled = this._isNodeDisabled(childNode);
      const childState = childNode?.internalFields.selected;

      if (isChildInvisible) {
        invisibleItemsCount += 1;
      } else if (isChildDisabled && isSkipDisabled) {
        disabledItemsCount += 1;
      } else if (childState) {
        selectedItemsCount += 1;
      } else if (childState === undefined) {
        selectedItemsCount += 0.5;
      }
    }

    let subtractedItemsCount = invisibleItemsCount;

    if (isSkipDisabled) {
      subtractedItemsCount += disabledItemsCount;
    }

    if (itemsCount === subtractedItemsCount) {
      return node.internalFields.selected;
    }

    if (selectedItemsCount) {
      result = selectedItemsCount === itemsCount - subtractedItemsCount ? true : undefined;
    }

    return result;
  }

  _toggleChildrenSelection(node: InternalNode, state: boolean): void {
    this._iterateChildren(node, true, (child) => {
      if (!child || !this._isNodeVisible(child)) {
        return;
      }

      if (this.options.disabledNodeSelectionMode === 'recursiveAndAll'
        || !this._isNodeDisabled(child)) {
        this._setFieldState(child, SELECTED, state);
      }
    });
  }

  _setFieldState(
    node: InternalNode,
    field: typeof SELECTED | typeof EXPANDED | typeof DISABLED,
    state: boolean | undefined,
  ): void {
    if (node.internalFields[field] === state) {
      return;
    }

    node.internalFields[field] = state;
    if (node.internalFields.publicNode) {
      node.internalFields.publicNode[field] = state;
    }

    this.options.dataAccessors.setters[field](node.internalFields.item, state);

    this.options.onNodeChanged(node);
  }

  _markChildren(keys: ItemKey[]): void {
    each(keys, (_index: number, key: ItemKey) => {
      const index = this.getIndexByKey(key);
      const node = this.getNodeByKey(key);
      this._dataStructure[index] = null;

      if (node?.internalFields.childrenKeys.length) {
        this._markChildren(node.internalFields.childrenKeys);
      }
    });
  }

  _removeNode(key: ItemKey): void {
    const node = this.getNodeByKey(key);

    this._dataStructure[this.getIndexByKey(key)] = null;

    if (node?.internalFields.childrenKeys.length) {
      this._markChildren(node.internalFields.childrenKeys);
    }

    let counter = 0;
    const items = extend([], this._dataStructure);
    each(items, (index: number, item: InternalNode | null) => {
      if (!item) {
        this._dataStructure.splice(index - counter, 1);
        counter += 1;
      }
    });
  }

  _addNode(item: ItemData): void {
    const { dataConverter } = this.options;
    const node = dataConverter._convertItemToNode(
      item,
      this.options.dataAccessors.getters.parentKey(item),
    );

    this._dataStructure = this._dataStructure.concat(node);
    this._initialDataStructure = this._initialDataStructure.concat(node);
    dataConverter._dataStructure = dataConverter._dataStructure.concat(node);
  }

  _updateFields(): void {
    this.options.dataConverter.updateChildrenKeys();

    this._updateDisabled();
    this._updateSelection();
    this._updateExpansion();
  }

  getDisabledNodesKeys(): ItemKey[] {
    return this._disabledNodesKeys;
  }

  getSelectedNodesKeys(): ItemKey[] {
    return this._selectedNodesKeys;
  }

  getExpandedNodesKeys(): ItemKey[] {
    return this._expandedNodesKeys;
  }

  getData(): (InternalNode | null)[] {
    return this._dataStructure;
  }

  getFullData(): (InternalNode | null)[] {
    return this._initialDataStructure;
  }

  getNodeByItem(item: ItemData): InternalNode | null {
    let result: InternalNode | null = null;

    each(this._dataStructure, (_index: number, node: InternalNode): boolean => {
      if (node?.internalFields.item === item) {
        result = node;
        return false;
      }
      return true;
    });

    return result;
  }

  getNodesByItems(items: ItemData[]): InternalNode[] {
    const nodes: InternalNode[] = [];

    each(items, (_index: number, item: ItemData) => {
      const node = this.getNodeByItem(item);
      if (node) {
        nodes.push(node);
      }
    });

    return nodes;
  }

  getNodeByKey(
    key: ItemKey,
    data?: (InternalNode | null)[],
  ): InternalNode | null {
    return this._getByKey(data ?? this._getDataBySelectionMode(), key);
  }

  getTreeNodes(): PublicNode[] {
    const rootNodes = this.getRootNodes();
    const rootKeys = rootNodes.map((node) => node.internalFields.key);
    return this.options.dataConverter.convertToPublicNodes(rootKeys, null);
  }

  getItemsCount(): number {
    return this.options.dataConverter.getItemsCount();
  }

  _getDisabledItemsCount(): number {
    return this.options.dataConverter.getDisabledItemsCount();
  }

  getVisibleItemsCount(): number {
    return this.options.dataConverter.getVisibleItemsCount();
  }

  getPublicNode(node: InternalNode | null): PublicNode | undefined {
    return node?.internalFields.publicNode;
  }

  getRootNodes(): InternalNode[] {
    return this.getChildrenNodes(this.options.rootValue);
  }

  getChildrenNodes(parentKey: ItemKey | undefined): InternalNode[] {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return query(this._dataStructure, { langParams: this.options.langParams }).filter(['internalFields.parentKey', parentKey]).toArray();
  }

  getIndexByKey(key: ItemKey): number {
    return this.options.dataConverter.getIndexByKey(key);
  }

  addItem(item: ItemData): void {
    this._addNode(item);
    this._updateFields();
  }

  removeItem(key: ItemKey): void {
    this._removeNode(key);
    this._updateFields();
  }

  toggleSelection(key: ItemKey, state: boolean, selectRecursive?: boolean): void {
    const isSingleModeUnselect = this._isSingleModeUnselect(state);
    const dataArray = selectRecursive || isSingleModeUnselect
      ? this._initialDataStructure
      : this._dataStructure;
    const node = this._getByKey(dataArray, key);

    if (node) {
      if (this.options.disabledNodeSelectionMode === 'never' && this._isNodeDisabled(node)) {
        return;
      }

      this._setFieldState(node, SELECTED, state);

      if (this.options.recursiveSelection && !selectRecursive) {
        if (state) {
          this._setChildrenSelection();
        } else {
          this._toggleChildrenSelection(node, state);
        }
        this._setParentSelection();
      }
    }

    this._selectedNodesKeys = this._updateNodesKeysArray(SELECTED);
  }

  _isSingleModeUnselect(selectionState: boolean): boolean {
    return !this.options.multipleSelection && !selectionState;
  }

  toggleNodeDisabledState(key: ItemKey, state: boolean): void {
    const node = this.getNodeByKey(key);
    if (node) {
      this._setFieldState(node, DISABLED, state);
    }
  }

  toggleSelectAll(state: boolean): void {
    if (!isDefined(state)) {
      return;
    }

    const lastSelectedKey = this._selectedNodesKeys[this._selectedNodesKeys.length - 1];
    const dataStructure = this._isSingleModeUnselect(state)
      ? this._initialDataStructure
      : this._dataStructure;

    each(dataStructure, (_index: number, node: InternalNode) => {
      if (!this._isNodeVisible(node)) {
        return;
      }

      if (this.options.disabledNodeSelectionMode === 'recursiveAndAll'
        || !this._isNodeDisabled(node)) {
        this._setFieldState(node, SELECTED, state);
      }
    });

    this._selectedNodesKeys = this._updateNodesKeysArray(SELECTED);

    if (!state && this.options.selectionRequired) {
      this.toggleSelection(lastSelectedKey, true);
    }
  }

  isAllSelected(): boolean | undefined {
    const selectedDisabledNodesAmount = getIntersection(
      this.getSelectedNodesKeys(),
      this.getDisabledNodesKeys(),
    ).length;

    const isSkipDisabled = this.options.disabledNodeSelectionMode === 'never';

    const selectedNodesKeysAmount = this.getSelectedNodesKeys().length
      - (isSkipDisabled ? selectedDisabledNodesAmount : 0);

    if (!selectedNodesKeysAmount) {
      return false;
    }

    const subtractedNodesAmount = this.getVisibleItemsCount()
      - (isSkipDisabled ? this._getDisabledItemsCount() : 0);

    return selectedNodesKeysAmount === subtractedNodesAmount ? true : undefined;
  }

  toggleExpansion(key: ItemKey, state: boolean): void {
    const node = this.getNodeByKey(key);
    if (node) {
      this._setFieldState(node, EXPANDED, state);
      if (state) {
        this._updateExpansion(key);
      }
    }
    this._expandedNodesKeys = this._updateNodesKeysArray(EXPANDED);
  }

  isFiltered(item: InternalNode): boolean {
    return !this.options.searchValue.length
      || !!this._filterDataStructure(this.options.searchValue, [item]).length;
  }

  static _createCriteria(
    selector: DataAdapterOptions['searchExpr'],
    value: string,
    operation: string | undefined,
  ): unknown[] {
    const searchFilter: unknown[] = [];
    if (!Array.isArray(selector)) {
      return [selector, operation, value];
    }
    each(selector, (_index: number, item: string) => {
      searchFilter.push([item, operation, value], 'or');
    });

    searchFilter.pop();
    return searchFilter;
  }

  _filterDataStructure(filterValue: string, dataStructure?: InternalNode[]): InternalNode[] {
    const selector = this.options.searchExpr ?? this.options.dataAccessors.getters.display;
    const operation = getOperationBySearchMode(this.options.searchMode);

    const criteria = DataAdapter._createCriteria(selector, filterValue, operation);

    const data = dataStructure ?? this._initialDataStructure;
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return query(data, { langParams: this.options.langParams }).filter(criteria).toArray();
  }

  search(searchValue: string): (InternalNode | null)[] {
    let matches = this._filterDataStructure(searchValue);
    const { dataConverter } = this.options;

    const lookForParents = (matchesArray: InternalNode[], startIndex: number): void => {
      const { length } = matchesArray;
      let index = startIndex;

      while (index < length) {
        const node = matchesArray[index];

        if (node.internalFields.parentKey === this.options.rootValue) {
          index += 1;
        } else {
          const parent = dataConverter.getParentNode(node);

          if (!parent) {
            errors.log('W1007', node.internalFields.parentKey, node.internalFields.key);
            index += 1;
          } else {
            // eslint-disable-next-line max-depth
            if (!parent.internalFields.expanded) {
              this._setFieldState(parent, EXPANDED, true);
            }

            // eslint-disable-next-line max-depth
            if (matchesArray.includes(parent)) {
              index += 1;
            } else {
              matchesArray.splice(index, 0, parent);
              lookForParents(matchesArray, index);
              return;
            }
          }
        }
      }
    };

    lookForParents(matches, 0);

    if (this.options.sort) {
      matches = storeHelper
        // @ts-expect-error ts-error
        .queryByOptions(query(matches), {
          sort: this.options.sort,
          langParams: this.options.langParams,
        })
        .toArray();
    }

    dataConverter._indexByKey = {};
    each(matches, (index: number, node: InternalNode): void => {
      node.internalFields.childrenKeys = [];
      dataConverter._indexByKey[node.internalFields.key] = index;
    });

    dataConverter._dataStructure = matches;
    dataConverter.setChildrenKeys();

    return dataConverter._dataStructure;
  }
}

export default DataAdapter;
