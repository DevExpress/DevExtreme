import './ui.tree_list.editor_factory';
import $ from '../../core/renderer';
import errors from '../widget/ui.errors';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { Deferred } from '../../core/utils/deferred';
import messageLocalization from '../../localization/message';
import treeListCore from './ui.tree_list.core';
import gridCoreUtils from '../grid_core/ui.grid_core.utils';
import editingModule from '../grid_core/ui.grid_core.editing';

var TREELIST_EXPAND_ICON_CONTAINER_CLASS = "dx-treelist-icon-container",
    SELECT_CHECKBOX_CLASS = "dx-select-checkbox",

    DATA_EDIT_DATA_INSERT_TYPE = "insert";

var EditingController = editingModule.controllers.editing.inherit((function() {
    return {
        _generateNewItem: function(key) {
            var item = this.callBase(key);

            item.data = {
                key: key
            };
            item.children = [];
            item.level = 0;
            item.parentKey = this.option("rootValue");

            return item;
        },

        _needInsertItem: function(editData, changeType, items, item) {
            var parentKey = editData.key.parentKey;
            if(parentKey !== undefined && parentKey !== this.option("rootValue")) {
                var rowIndex = gridCoreUtils.getIndexByKey(parentKey, items);
                if(rowIndex >= 0 && this._dataController.isRowExpanded(parentKey)) {
                    items.splice(rowIndex + 1, 0, item);
                }
                return false;
            }
            return this.callBase.apply(this, arguments);
        },

        _isEditColumnVisible: function() {
            var result = this.callBase.apply(this, arguments),
                editingOptions = this.option("editing");

            return result || editingOptions && editingOptions.allowAdding;
        },

        _isDefaultButtonVisible: function(button, options) {
            var result = this.callBase.apply(this, arguments),
                row = options.row;

            if(button.name === "add") {
                return this.allowAdding(options) && row.rowIndex !== this._getVisibleEditRowIndex() && !(row.removed || row.inserted);
            }

            return result;
        },

        _getEditingButtons: function(options) {
            var buttons = this.callBase.apply(this, arguments);

            if(!options.column.buttons) {
                buttons.unshift(this._getButtonConfig("add", options));
            }

            return buttons;
        },

        _beforeSaveEditData: function(editData) {
            var key,
                store,
                dataController = this._dataController,
                result = this.callBase.apply(this, arguments);

            if(editData && editData.type !== DATA_EDIT_DATA_INSERT_TYPE) {
                store = dataController && dataController.store();
                key = store && store.key();

                if(!isDefined(key)) {
                    throw errors.Error("E1045");
                }
            }

            return result;
        },

        addRowByRowIndex: function(rowIndex) {
            var dataController = this.getController("data"),
                row = dataController.getVisibleRows()[rowIndex];

            return this.addRow(row ? row.key : undefined);
        },

        addRow: function(key) {
            var that = this,
                callBase = this.callBase,
                dataController = this.getController("data");

            if(key !== undefined && !dataController.isRowExpanded(key)) {
                var d = new Deferred();
                dataController.expandRow(key).done(function() {
                    setTimeout(function() {
                        callBase.call(that, key);
                        d.resolve();
                    });
                }).fail(d.reject);
                return d;
            }

            callBase.call(that, key);
        },

        _initNewRow: function(options, insertKey) {
            var parentKey = insertKey.parentKey,
                dataController = this.getController("data"),
                dataSourceAdapter = dataController.dataSource(),
                parentIdSetter = dataSourceAdapter.createParentIdSetter();

            if(parentKey === undefined) {
                parentKey = this.option("rootValue");
                insertKey.parentKey = parentKey;
            }

            parentIdSetter(options.data, parentKey);

            this.callBase.apply(this, arguments);
        },

        allowAdding: function(options) {
            return this._allowEditAction("allowAdding", options);
        },

        _needToCloseEditableCell: function($targetElement) {
            return this.callBase.apply(this, arguments) || $targetElement.closest("." + TREELIST_EXPAND_ICON_CONTAINER_CLASS).length && this.isEditing();
        }
    };
})());

var originalRowClick = editingModule.extenders.views.rowsView._rowClick;

var RowsViewExtender = extend({}, editingModule.extenders.views.rowsView, {
    _renderCellCommandContent: function($container, options) {
        var editingController = this._editingController,
            isEditRow = options.row && editingController.isEditRow(options.row.rowIndex),
            isEditing = options.isEditing || isEditRow;

        if(!isEditing) {
            return this.callBase.apply(this, arguments);
        }

        return false;
    },

    _rowClick: function(e) {
        var $targetElement = $(e.event.target);

        if($targetElement.closest("." + SELECT_CHECKBOX_CLASS).length) {
            return;
        }

        if($targetElement.closest("." + TREELIST_EXPAND_ICON_CONTAINER_CLASS).length) {
            this.callBase.apply(this, arguments);
        } else {
            originalRowClick.apply(this, arguments);
        }
    }
});

treeListCore.registerModule("editing", {
    defaultOptions: function() {
        return extend(true, editingModule.defaultOptions(), {
            editing: {
                /**
                 * @name dxTreeListOptions.editing.texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name dxTreeListOptions.editing.texts.addRowToNode
                     * @type string
                     * @default "Add"
                     */
                    addRowToNode: messageLocalization.format("dxTreeList-editingAddRowToNode"),
                }
            }
        });
    },
    controllers: {
        editing: EditingController
    },
    extenders: {
        controllers: extend(true, {}, editingModule.extenders.controllers, {
            data: {
                changeRowExpand: function() {
                    this._editingController.refresh();
                    return this.callBase.apply(this, arguments);
                }
            }
        }),
        views: {
            rowsView: RowsViewExtender,
            headerPanel: editingModule.extenders.views.headerPanel
        }
    }
});
