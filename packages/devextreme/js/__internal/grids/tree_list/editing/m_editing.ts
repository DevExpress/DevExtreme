/* eslint-disable max-classes-per-file */
import '../module_not_extended/editor_factory';

import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import { dataControllerEditingExtenderMixin, editingModule } from '@ts/grids/grid_core/editing/m_editing';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import type { RowsView } from '../../grid_core/views/m_rows_view';
import treeListCore from '../m_core';

const TREELIST_EXPAND_ICON_CONTAINER_CLASS = 'dx-treelist-icon-container';
const SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';

const DATA_EDIT_DATA_INSERT_TYPE = 'insert';

class EditingController extends editingModule.controllers.editing {
  protected _generateNewItem(key) {
    const item: any = super._generateNewItem(key);

    item.data = {
      key,
    };
    item.children = [];
    item.level = 0;
    item.parentKey = this.option('rootValue');

    return item;
  }

  protected _isProcessedItem() {
    return true;
  }

  protected _setInsertAfterOrBeforeKey(change, parentKey) {
    const dataSourceAdapter = this._dataController.dataSource();
    const key = parentKey || dataSourceAdapter?.parentKeyOf(change.data);

    if (key !== undefined && key !== this.option('rootValue')) {
      change.insertAfterKey = key;
    } else {
      // @ts-expect-error
      super._setInsertAfterOrBeforeKey.apply(this, arguments);
    }
  }

  protected _getLoadedRowIndex(items, change) {
    const dataSourceAdapter = this._dataController.dataSource();
    const parentKey = dataSourceAdapter?.parentKeyOf(change.data);

    if (parentKey !== undefined && parentKey !== this.option('rootValue')) {
      const rowIndex = gridCoreUtils.getIndexByKey(parentKey, items);
      // @ts-expect-error
      if (rowIndex >= 0 && this._dataController.isRowExpanded(parentKey)) {
        // @ts-expect-error
        return super._getLoadedRowIndex.apply(this, arguments);
      }
      return -1;
    }
    // @ts-expect-error
    return super._getLoadedRowIndex.apply(this, arguments);
  }

  protected _isEditColumnVisible() {
    // @ts-expect-error
    const result = super._isEditColumnVisible.apply(this, arguments);
    const editingOptions: any = this.option('editing');

    return result || editingOptions.allowAdding;
  }

  protected _isDefaultButtonVisible(button, options) {
    // @ts-expect-error
    const result = super._isDefaultButtonVisible.apply(this, arguments);
    const { row } = options;

    if (button.name === 'add') {
      return this.allowAdding(options) && row.rowIndex !== this._getVisibleEditRowIndex() && !(row.removed || row.isNewRow);
    }

    return result;
  }

  protected _getEditingButtons(options) {
    // @ts-expect-error
    const buttons = super._getEditingButtons.apply(this, arguments);

    if (!options.column.buttons) {
      buttons.unshift(this._getButtonConfig('add', options));
    }

    return buttons;
  }

  protected _beforeSaveEditData(change) {
    // @ts-expect-error
    const result = super._beforeSaveEditData.apply(this, arguments);

    if (change && change.type !== DATA_EDIT_DATA_INSERT_TYPE) {
      const store = this._dataController?.store();
      const key = store?.key();

      if (!isDefined(key)) {
        throw errors.Error('E1045');
      }
    }

    return result;
  }

  private addRowByRowIndex(rowIndex) {
    const row = this._dataController.getVisibleRows()[rowIndex];

    return this.addRow(row ? row.key : undefined);
  }

  protected addRow(key) {
    if (key === undefined) {
      key = this.option('rootValue');
    }

    return super.addRow.call(this, key);
  }

  protected _addRowCore(data, parentKey, oldEditRowIndex) {
    const rootValue = this.option('rootValue');
    const dataSourceAdapter = this._dataController.dataSource();
    const parentKeyGetter = dataSourceAdapter.createParentIdGetter();

    parentKey = parentKeyGetter(data);

    // @ts-expect-error
    if (parentKey !== undefined && parentKey !== rootValue && !this._dataController.isRowExpanded(parentKey)) {
      // @ts-expect-error
      const deferred = new Deferred();

      // @ts-expect-error
      this._dataController.expandRow(parentKey).done(() => {
        setTimeout(() => {
          super._addRowCore.call(this, data, parentKey, oldEditRowIndex).done(deferred.resolve).fail(deferred.reject);
        });
      }).fail(deferred.reject);

      return deferred.promise();
    }

    return super._addRowCore.call(this, data, parentKey, oldEditRowIndex);
  }

  protected _initNewRow(options, parentKey?) {
    const dataSourceAdapter = this._dataController.dataSource();
    const parentIdSetter = dataSourceAdapter.createParentIdSetter();

    parentIdSetter(options.data, parentKey);

    // @ts-expect-error
    return super._initNewRow.apply(this, arguments);
  }

  private allowAdding(options) {
    return this._allowEditAction('allowAdding', options);
  }

  protected _needToCloseEditableCell($targetElement) {
    // @ts-expect-error
    return super._needToCloseEditableCell.apply(this, arguments) || $targetElement.closest(`.${TREELIST_EXPAND_ICON_CONTAINER_CLASS}`).length && this.isEditing();
  }

  protected getButtonLocalizationNames() {
    const names = super.getButtonLocalizationNames.apply(this);
    // @ts-expect-error
    names.add = 'dxTreeList-editingAddRowToNode';

    return names;
  }
}

const rowsView = (Base: ModuleType<RowsView>) => class TreeListEditingRowsViewExtender extends editingModule.extenders.views.rowsView(Base) {
  private _renderCellCommandContent($container, options) {
    const editingController = this._editingController;
    const isEditRow = options.row && editingController.isEditRow(options.row.rowIndex);
    const isEditing = options.isEditing || isEditRow;

    if (!options.isOnForm && !isEditing) {
      // @ts-expect-error
      return super._renderCellCommandContent.apply(this, arguments);
    }

    return false;
  }

  private validateClick(e) {
    const $targetElement = $(e.event.target);
    const originalClickHandler = e.event.type === 'dxdblclick' ? super._rowDblClick : super._rowClick;

    if ($targetElement.closest(`.${SELECT_CHECKBOX_CLASS}`).length) {
      return false;
    }

    return !this.needToCallOriginalClickHandler(e, originalClickHandler);
  }

  private needToCallOriginalClickHandler(e, originalClickHandler) {
    const $targetElement = $(e.event.target);

    if (!$targetElement.closest(`.${TREELIST_EXPAND_ICON_CONTAINER_CLASS}`).length) {
      originalClickHandler.call(this, e);
      return true;
    }

    return false;
  }

  protected _rowClick(e) {
    if (this.validateClick(e)) {
      // @ts-expect-error
      super._rowClickTreeListHack.apply(this, arguments);
    }
  }

  protected _rowDblClick(e) {
    if (this.validateClick(e)) {
      // @ts-expect-error
      super._rowDblClickTreeListHack.apply(this, arguments);
    }
  }
};

const data = (Base: ModuleType<DataController>) => class DataControllerTreeListEditingExtender extends dataControllerEditingExtenderMixin(Base) {
  private changeRowExpand() {
    this._editingController.refresh();
    // @ts-expect-error
    return super.changeRowExpand.apply(this, arguments);
  }
};

treeListCore.registerModule('editing', {
  defaultOptions() {
    return extend(true, editingModule.defaultOptions(), {
      editing: {
        texts: {
          addRowToNode: messageLocalization.format('dxTreeList-editingAddRowToNode'),
        },
      },
    });
  },
  controllers: {
    editing: EditingController,
  },
  extenders: {
    controllers: {
      data,
    },
    views: {
      rowsView,
      headerPanel: editingModule.extenders.views.headerPanel,
    },
  },
});
