import registerComponent from '@js/core/component_registrator';
import { noop, deferRender } from '@js/core/utils/common';
import { isFunction, isDefined } from '@js/core/utils/type';
import { each } from '@js/core/utils/iterator';
import { extend } from '@js/core/utils/extend';
import Widget from '@js/ui/widget/ui.widget';
import { isMaterial } from '@js/ui/themes';
import treeListCore from './module_core';
import gridCoreUtils from '../grid_core/module_utils';

import './module_not_extended/column_headers';
import './module_columns_controller';
import './data_controller/module';
import './module_not_extended/sorting';
import './rows/module';
import './module_not_extended/context_menu';
import './module_not_extended/error_handling';
import './module_grid_view';
import './module_not_extended/header_panel';

const { callModuleItemsMethod } = treeListCore;

const DATAGRID_ROW_SELECTOR = '.dx-row';
const TREELIST_CLASS = 'dx-treelist';

treeListCore.registerModulesOrder([
  'stateStoring',
  'columns',
  'selection',
  'editorFactory',
  'columnChooser',
  'editingRowBased',
  'editingFormBased',
  'editingCellBased',
  'editing',
  'grouping',
  'masterDetail',
  'validating',
  'adaptivity',
  'data',
  'virtualScrolling',
  'columnHeaders',
  'filterRow',
  'headerPanel',
  'headerFilter',
  'sorting',
  'search',
  'rows',
  'pager',
  'columnsResizingReordering',
  'contextMenu',
  'keyboardNavigation',
  'errorHandling',
  'summary',
  'columnFixing',
  'export',
  'gridView']);

const TreeList = (Widget as any).inherit({
  _activeStateUnit: DATAGRID_ROW_SELECTOR,

  _getDefaultOptions() {
    const that = this;
    const result = that.callBase();

    each(treeListCore.modules, function () {
      if (isFunction(this.defaultOptions)) {
        extend(true, result, this.defaultOptions());
      }
    });
    return result;
  },

  _defaultOptionsRules() {
    return this.callBase().concat([
      {
        device() {
          // @ts-expect-error
          return isMaterial();
        },
        options: {
          showRowLines: true,
          showColumnLines: false,
          headerFilter: {
            height: 315,
          },
          editing: {
            useIcons: true,
          },
        },
      },
    ]);
  },

  _init() {
    const that = this;

    that.callBase();

    if (!this.option('_disableDeprecationWarnings')) {
      gridCoreUtils.logHeaderFilterDeprecatedWarningIfNeed(this);
    }

    treeListCore.processModules(that, treeListCore);

    callModuleItemsMethod(that, 'init');
  },

  _clean: noop,

  _optionChanged(args) {
    const that = this;

    callModuleItemsMethod(that, 'optionChanged', [args]);
    if (!args.handled) {
      that.callBase(args);
    }
  },

  _dimensionChanged() {
    this.updateDimensions(true);
  },

  _visibilityChanged(visible) {
    if (visible) {
      this.updateDimensions();
    }
  },

  _initMarkup() {
    this.callBase.apply(this, arguments);
    this.$element().addClass(TREELIST_CLASS);
    this.getView('gridView').render(this.$element());
  },

  _renderContentImpl() {
    this.getView('gridView').update();
  },

  _renderContent() {
    const that = this;

    deferRender(() => {
      that._renderContentImpl();
    });
  },

  _dispose() {
    const that = this;
    that.callBase();

    callModuleItemsMethod(that, 'dispose');
  },

  isReady() {
    return this.getController('data').isReady();
  },

  beginUpdate() {
    const that = this;

    that.callBase();
    callModuleItemsMethod(that, 'beginUpdate');
  },

  endUpdate() {
    const that = this;

    callModuleItemsMethod(that, 'endUpdate');
    that.callBase();
  },

  getController(name) {
    return this._controllers[name];
  },

  getView(name) {
    return this._views[name];
  },

  focus(element) {
    this.callBase();

    if (isDefined(element)) {
      this.getController('keyboardNavigation').focus(element);
    }
  },
});

TreeList.registerModule = treeListCore.registerModule.bind(treeListCore);

registerComponent('dxTreeList', TreeList);

export default TreeList;
