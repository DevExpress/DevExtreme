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

var TREELIST_EXPAND_ICON_CONTAINER_CLASS = 'dx-treelist-icon-container',
    SELECT_CHECKBOX_CLASS = 'dx-select-checkbox',

    DATA_EDIT_DATA_INSERT_TYPE = 'insert';

var EditingController = editingModule.controllers.editing.inherit((function() {
    return {
        _generateNewItem: function(key) {
            var item = this.callBase(key);

            item.data = {
                key: key
            };
            item.children = [];
            item.level = 0;
            item.parentKey = this.option('rootValue');

            return item;
        },

        _needInsertItem: function(editData, changeType, items, item) {
            var parentKey = editData.key.parentKey;
            if(parentKey !== undefined && parentKey !== this.option('rootValue')) {
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
                editingOptions = this.option('editing');

            return result || editingOptions && editingOptions.allowAdding;
        },

        _isDefaultButtonVisible: function(button, options) {
            var result = this.callBase.apply(this, arguments),
                row = options.row;

            if(button.name === 'add') {
                return this.allowAdding(options) && row.rowIndex !== this._getVisibleEditRowIndex() && !(row.removed || row.isNewRow);
            }

            return result;
        },

        _getEditingButtons: function(options) {
            var buttons = this.callBase.apply(this, arguments);

            if(!options.column.buttons) {
                buttons.unshift(this._getButtonConfig('add', options));
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
                    throw errors.Error('E1045');
                }
            }

            return result;
        },

        addRowByRowIndex: function(rowIndex) {
            var dataController = this.getController('data'),
                row = dataController.getVisibleRows()[rowIndex];

            return this.addRow(row ? row.key : undefined);
        },

        addRow: function(key) {
            var that = this,
                callBase = that.callBase,
                dataController = that.getController('data');

            if(key !== undefined && !dataController.isRowExpanded(key)) {
                var deferred = new Deferred();
                dataController.expandRow(key).done(function() {
                    setTimeout(function() {
                        callBase.call(that, key).done(deferred.resolve).fail(deferred.reject);
                    });
                }).fail(deferred.reject);
                return deferred.promise();
            }

            if(key === undefined) {
                key = that.option('rootValue');
            }

            return callBase.call(that, key);
        },

        _initNewRow: function(options, parentKey) {
            var dataController = this.getController('data'),
                dataSourceAdapter = dataController.dataSource(),
                parentIdSetter = dataSourceAdapter.createParentIdSetter();

            parentIdSetter(options.data, parentKey);

            this.callBase.apply(this, arguments);
        },

        allowAdding: function(options) {
            return this._allowEditAction('allowAdding', options);
        },

        _needToCloseEditableCell: function($targetElement) {
            return this.callBase.apply(this, arguments) || $targetElement.closest('.' + TREELIST_EXPAND_ICON_CONTAINER_CLASS).length && this.isEditing();
        },

        getButtonLocalizationNames() {
            var names = this.callBase.apply(this);
            names.add = 'dxTreeList-editingAddRowToNode';

            return names;
        }
    };
})());

var originalRowClick = editingModule.extenders.views.rowsView._rowClick,
    originalRowDblClick = editingModule.extenders.views.rowsView._rowDblClick;

var validateClick = function(e) {
    var $targetElement = $(e.event.target),
        originalClickHandler = e.event.type === 'dxdblclick' ? originalRowDblClick : originalRowClick;

    if($targetElement.closest('.' + SELECT_CHECKBOX_CLASS).length) {
        return false;
    }

    return !needToCallOriginalClickHandler.call(this, e, originalClickHandler);
};

var needToCallOriginalClickHandler = function(e, originalClickHandler) {
    var $targetElement = $(e.event.target);

    if(!$targetElement.closest('.' + TREELIST_EXPAND_ICON_CONTAINER_CLASS).length) {
        originalClickHandler.call(this, e);
        return true;
    }

    return false;
};

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
        if(validateClick.call(this, e)) {
            this.callBase.apply(this, arguments);
        }
    },

    _rowDblClick: function(e) {
        if(validateClick.call(this, e)) {
            this.callBase.apply(this, arguments);
        }
    }
});

treeListCore.registerModule('editing', {
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
                    addRowToNode: messageLocalization.format('dxTreeList-editingAddRowToNode'),
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
