import $ from '@js/core/renderer';
import { noop, equalByValue } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import { selectionModule } from '@js/ui/grid_core/ui.grid_core.selection';
import treeListCore from '../module_core';

const TREELIST_SELECT_ALL_CLASS = 'dx-treelist-select-all';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';

const originalRowClick = selectionModule.extenders.views.rowsView._rowClick;
const originalHandleDataChanged = selectionModule.extenders.controllers.data._handleDataChanged;

const nodeExists = function (array, currentKey) {
  return !!array.filter((key) => key === currentKey).length;
};

treeListCore.registerModule('selection', extend(true, {}, selectionModule, {
  defaultOptions() {
    return extend(true, selectionModule.defaultOptions(), {
      selection: {
        showCheckBoxesMode: 'always',
        recursive: false,
      },
    });
  },
  extenders: {
    controllers: {
      data: {
        _handleDataChanged(e) {
          const selectionController = this.getController('selection');
          const isRecursiveSelection = selectionController.isRecursiveSelection();

          if (isRecursiveSelection && (!e || e.changeType !== 'updateSelectionState')) {
            selectionController.updateSelectionState({
              selectedItemKeys: this.option('selectedRowKeys'),
            });
          }
          originalHandleDataChanged.apply(this, arguments as any);
        },

        loadDescendants() {
          const that = this;
          const d = that.callBase.apply(that, arguments);
          const selectionController = that.getController('selection');
          const isRecursiveSelection = selectionController.isRecursiveSelection();

          if (isRecursiveSelection) {
            d.done(() => {
              selectionController.updateSelectionState({
                selectedItemKeys: that.option('selectedRowKeys'),
              });
            });
          }

          return d;
        },
      },

      selection: {
        init() {
          this.callBase.apply(this, arguments);
          this._selectionStateByKey = {};
        },

        _getSelectionConfig() {
          const config = this.callBase.apply(this, arguments);

          const { plainItems } = config;
          config.plainItems = (cached) => {
            let result;
            if (cached) {
              result = this._dataController.getCachedStoreData();
            }

            // @ts-expect-error
            result ||= plainItems.apply(this, arguments).map((item) => item.data);
            return result || [];
          };
          config.isItemSelected = (item) => {
            const key = this._dataController.keyOf(item);

            return this.isRowSelected(key);
          };
          config.isSelectableItem = (item) => !!item;
          config.getItemData = (item) => item;
          config.allowLoadByRange = () => false;
          return config;
        },

        renderSelectCheckBoxContainer($container, model) {
          const that = this;
          const rowsView = that.component.getView('rowsView');

          $container.addClass(CELL_FOCUS_DISABLED_CLASS);

          const $checkbox = rowsView._renderSelectCheckBox($container, {
            value: model.row.isSelected,
            row: model.row,
            column: model.column,
          });

          rowsView._attachCheckBoxClickEvent($checkbox);
        },

        _updateSelectColumn: noop,

        _getSelectAllNodeKeys() {
          const { component } = this;
          const root = component.getRootNode();
          const cache = {};
          const keys: any[] = [];
          const isRecursiveSelection = this.isRecursiveSelection();

          root && treeListCore.foreachNodes(root.children, (node) => {
            if (node.key !== undefined && (node.visible || isRecursiveSelection)) {
              keys.push(node.key);
            }

            if (!node.visible) {
              return true;
            }

            return isRecursiveSelection ? false : component.isRowExpanded(node.key, cache);
          });

          return keys;
        },

        isSelectAll() {
          const selectedRowKeys = this.option('selectedRowKeys') || [];
          if (selectedRowKeys.length === 0) return false;

          const { component } = this;
          const visibleKeys = this._getSelectAllNodeKeys();
          const isRecursiveSelection = this.isRecursiveSelection();
          let hasIndeterminateState = false;

          const selectedVisibleKeys = visibleKeys.filter((key) => {
            const isRowSelected = component.isRowSelected(key, isRecursiveSelection);
            if (isRowSelected === undefined) {
              hasIndeterminateState = true;
            }
            return isRowSelected;
          });

          if (!selectedVisibleKeys.length) {
            return hasIndeterminateState ? undefined : false;
          } if (selectedVisibleKeys.length === visibleKeys.length) {
            return true;
          }
        },

        selectAll() {
          const visibleKeys = this._getSelectAllNodeKeys().filter((key) => !this.isRowSelected(key));

          this.focusedItemIndex(-1);

          return this.selectRows(visibleKeys, true);
        },

        deselectAll() {
          const visibleKeys = this._getSelectAllNodeKeys();

          this.focusedItemIndex(-1);

          return this.deselectRows(visibleKeys);
        },

        selectedItemKeys(value, preserve, isDeselect, isSelectAll) {
          const that = this;
          const selectedRowKeys = that.option('selectedRowKeys');
          const isRecursiveSelection = this.isRecursiveSelection();
          const normalizedArgs = isRecursiveSelection && that._normalizeSelectionArgs({
            keys: isDefined(value) ? value : [],
          }, preserve, !isDeselect);

          if (normalizedArgs && !equalByValue(normalizedArgs.selectedRowKeys, selectedRowKeys)) {
            that._isSelectionNormalizing = true;
            return this.callBase(normalizedArgs.selectedRowKeys, false, false, false)
              .always(() => {
                that._isSelectionNormalizing = false;
              })
              .done((items) => {
                normalizedArgs.selectedRowsData = items;
                that._fireSelectionChanged(normalizedArgs);
              });
          }

          return this.callBase(value, preserve, isDeselect, isSelectAll);
        },

        changeItemSelection(itemIndex, keyboardKeys) {
          const isRecursiveSelection = this.isRecursiveSelection();

          if (isRecursiveSelection && !keyboardKeys.shift) {
            const key = this._dataController.getKeyByRowIndex(itemIndex);
            return this.selectedItemKeys(key, true, this.isRowSelected(key)).done(() => {
              this.isRowSelected(key) && this.callBase(itemIndex, keyboardKeys, true);
            });
          }

          return this.callBase.apply(this, arguments);
        },

        _updateParentSelectionState(node, isSelected) {
          const that = this;
          let state = isSelected;
          const parentNode = node.parent;

          if (parentNode) {
            if (parentNode.children.length > 1) {
              if (isSelected === false) {
                const hasSelectedState = parentNode.children.some((childNode) => that._selectionStateByKey[childNode.key]);

                state = hasSelectedState ? undefined : false;
              } else if (isSelected === true) {
                const hasNonSelectedState = parentNode.children.some((childNode) => !that._selectionStateByKey[childNode.key]);

                state = hasNonSelectedState ? undefined : true;
              }
            }

            this._selectionStateByKey[parentNode.key] = state;

            if (parentNode.parent && parentNode.parent.level >= 0) {
              this._updateParentSelectionState(parentNode, state);
            }
          }
        },

        _updateChildrenSelectionState(node, isSelected) {
          const that = this;
          const { children } = node;

          children && children.forEach((childNode) => {
            that._selectionStateByKey[childNode.key] = isSelected;

            if (childNode.children.length > 0) {
              that._updateChildrenSelectionState(childNode, isSelected);
            }
          });
        },

        _updateSelectionStateCore(keys, isSelected) {
          const dataController = this._dataController;

          for (let i = 0; i < keys.length; i++) {
            this._selectionStateByKey[keys[i]] = isSelected;
            const node = dataController.getNodeByKey(keys[i]);

            if (node) {
              this._updateParentSelectionState(node, isSelected);
              this._updateChildrenSelectionState(node, isSelected);
            }
          }
        },

        _getSelectedParentKeys(key, selectedItemKeys, useCash) {
          let selectedParentNode;
          const node = this._dataController.getNodeByKey(key);
          let parentNode = node && node.parent;
          let result: any[] = [];

          while (parentNode && parentNode.level >= 0) {
            result.unshift(parentNode.key);
            const isSelected = useCash ? !nodeExists(selectedItemKeys, parentNode.key) && this.isRowSelected(parentNode.key) : selectedItemKeys.indexOf(parentNode.key) >= 0;

            if (isSelected) {
              selectedParentNode = parentNode;
              result = this._getSelectedParentKeys(selectedParentNode.key, selectedItemKeys, useCash).concat(result);
              break;
            } else if (useCash) {
              break;
            }

            parentNode = parentNode.parent;
          }

          return selectedParentNode && result || [];
        },

        _getSelectedChildKeys(key, keysToIgnore) {
          const childKeys: any[] = [];
          const node = this._dataController.getNodeByKey(key);

          node && treeListCore.foreachNodes(node.children, (childNode) => {
            const ignoreKeyIndex = keysToIgnore.indexOf(childNode.key);

            if (ignoreKeyIndex < 0) {
              childKeys.push(childNode.key);
            }

            return ignoreKeyIndex > 0 || ignoreKeyIndex < 0 && this._selectionStateByKey[childNode.key] === undefined;
          });

          return childKeys;
        },

        _normalizeParentKeys(key, args) {
          const that = this;
          let keysToIgnore = [key];
          const parentNodeKeys = that._getSelectedParentKeys(key, args.selectedRowKeys);

          if (parentNodeKeys.length) {
            keysToIgnore = keysToIgnore.concat(parentNodeKeys);

            keysToIgnore.forEach((key) => {
              const index = args.selectedRowKeys.indexOf(key);

              if (index >= 0) {
                args.selectedRowKeys.splice(index, 1);
              }
            });

            const childKeys = that._getSelectedChildKeys(parentNodeKeys[0], keysToIgnore);
            args.selectedRowKeys = args.selectedRowKeys.concat(childKeys);
          }
        },

        _normalizeChildrenKeys(key, args) {
          const node = this._dataController.getNodeByKey(key);

          node && node.children.forEach((childNode) => {
            const index = args.selectedRowKeys.indexOf(childNode.key);
            if (index >= 0) {
              args.selectedRowKeys.splice(index, 1);
            }

            this._normalizeChildrenKeys(childNode.key, args);
          });
        },

        _normalizeSelectedRowKeysCore(keys, args, preserve, isSelect) {
          const that = this;

          keys.forEach((key) => {
            if (preserve && that.isRowSelected(key) === isSelect) {
              return;
            }

            that._normalizeChildrenKeys(key, args);
            const index = args.selectedRowKeys.indexOf(key);

            if (isSelect) {
              if (index < 0) {
                args.selectedRowKeys.push(key);
              }
              args.currentSelectedRowKeys.push(key);
            } else {
              if (index >= 0) {
                args.selectedRowKeys.splice(index, 1);
              }
              args.currentDeselectedRowKeys.push(key);
              that._normalizeParentKeys(key, args);
            }
          });
        },

        _normalizeSelectionArgs(args, preserve, isSelect) {
          let result;
          const keys = Array.isArray(args.keys) ? args.keys : [args.keys];
          const selectedRowKeys = this.option('selectedRowKeys') || [];

          if (keys.length) {
            result = {
              currentSelectedRowKeys: [],
              currentDeselectedRowKeys: [],
              selectedRowKeys: preserve ? selectedRowKeys.slice(0) : [],
            };

            this._normalizeSelectedRowKeysCore(keys, result, preserve, isSelect);
          }

          return result;
        },

        _updateSelectedItems(args) {
          this.updateSelectionState(args);
          this.callBase(args);
        },

        _fireSelectionChanged() {
          if (!this._isSelectionNormalizing) {
            this.callBase.apply(this, arguments);
          }
        },

        _isModeLeavesOnly(mode) {
          return mode === 'leavesOnly';
        },

        _removeDuplicatedKeys(keys) {
          const result: any[] = [];
          const processedKeys = {};

          keys.forEach((key) => {
            if (!processedKeys[key]) {
              processedKeys[key] = true;
              result.push(key);
            }
          });

          return result;
        },

        _getAllChildKeys(key) {
          const childKeys: any[] = [];
          const node = this._dataController.getNodeByKey(key);

          node && treeListCore.foreachNodes(node.children, (childNode) => {
            childKeys.push(childNode.key);
          }, true);

          return childKeys;
        },

        _getAllSelectedRowKeys(keys) {
          let result = [];

          keys.forEach((key) => {
            const parentKeys = this._getSelectedParentKeys(key, [], true);
            const childKeys = this._getAllChildKeys(key);

            result.push.apply(result, parentKeys.concat([key], childKeys));
          });

          result = this._removeDuplicatedKeys(result);

          return result;
        },

        _getParentSelectedRowKeys(keys) {
          const that = this;
          const result: any[] = [];

          keys.forEach((key) => {
            const parentKeys = that._getSelectedParentKeys(key, keys);
            !parentKeys.length && result.push(key);
          });

          return result;
        },

        _getLeafSelectedRowKeys(keys) {
          const that = this;
          const result: any[] = [];
          const dataController = that._dataController;

          keys.forEach((key) => {
            const node = dataController.getNodeByKey(key);
            node && !node.hasChildren && result.push(key);
          });

          return result;
        },

        isRecursiveSelection() {
          const selectionMode = this.option('selection.mode');
          const isRecursive = this.option('selection.recursive');

          return selectionMode === 'multiple' && isRecursive;
        },

        updateSelectionState(options) {
          const removedItemKeys = options.removedItemKeys || [];
          const selectedItemKeys = options.selectedItemKeys || [];

          if (this.isRecursiveSelection()) {
            this._updateSelectionStateCore(removedItemKeys, false);
            this._updateSelectionStateCore(selectedItemKeys, true);
          }
        },

        isRowSelected(key, isRecursiveSelection) {
          const result = this.callBase.apply(this, arguments);

          isRecursiveSelection = isRecursiveSelection ?? this.isRecursiveSelection();

          if (!result && isRecursiveSelection) {
            if (key in this._selectionStateByKey) {
              return this._selectionStateByKey[key];
            }
            return false;
          }

          return result;
        },

        getSelectedRowKeys(mode) {
          const that = this;

          if (!that._dataController) {
            return [];
          }

          let selectedRowKeys = that.callBase.apply(that, arguments);

          if (mode) {
            if (this.isRecursiveSelection()) {
              selectedRowKeys = this._getAllSelectedRowKeys(selectedRowKeys);
            }

            if (mode !== 'all') {
              if (mode === 'excludeRecursive') {
                selectedRowKeys = that._getParentSelectedRowKeys(selectedRowKeys);
              } else if (that._isModeLeavesOnly(mode)) {
                selectedRowKeys = that._getLeafSelectedRowKeys(selectedRowKeys);
              }
            }
          }
          return selectedRowKeys;
        },

        getSelectedRowsData(mode) {
          const that = this;
          const dataController = that._dataController;
          const selectedKeys = this.getSelectedRowKeys(mode) || [];
          const selectedRowsData: any[] = [];

          selectedKeys.forEach((key) => {
            const node = dataController.getNodeByKey(key);
            node && selectedRowsData.push(node.data);
          });

          return selectedRowsData;
        },

        refresh() {
          this._selectionStateByKey = {};
          return this.callBase.apply(this, arguments);
        },
      },
    },
    views: {
      columnHeadersView: {
        _processTemplate(template, options) {
          const that = this;
          let resultTemplate;
          const renderingTemplate = this.callBase(template, options);

          const firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();

          if (renderingTemplate && options.rowType === 'header' && options.column.index === firstDataColumnIndex) {
            resultTemplate = {
              render(options) {
                if (that.option('selection.mode') === 'multiple') {
                  that.renderSelectAll(options.container, options.model);
                }

                renderingTemplate.render(options);
              },
            };
          } else {
            resultTemplate = renderingTemplate;
          }

          return resultTemplate;
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        renderSelectAll($cell, options) {
          $cell.addClass(TREELIST_SELECT_ALL_CLASS);

          this._renderSelectAllCheckBox($cell);
        },

        _isSortableElement($target) {
          return this.callBase($target) && !$target.closest(`.${SELECT_CHECKBOX_CLASS}`).length;
        },
      },

      rowsView: {
        _renderIcons($iconContainer, options) {
          this.callBase.apply(this, arguments);

          if (!options.row.isNewRow && this.option('selection.mode') === 'multiple') {
            this.getController('selection').renderSelectCheckBoxContainer($iconContainer, options);
          }

          return $iconContainer;
        },

        _rowClick(e) {
          const $targetElement = $(e.event.target);

          if (this.isExpandIcon($targetElement)) {
            this.callBase.apply(this, arguments);
          } else {
            // @ts-expect-error
            originalRowClick.apply(this, arguments);
          }
        },
      },
    },
  },
}));
