import './module_not_extended/column_headers';
import './m_columns_controller';
import './data_controller/m_data_controller';
import './module_not_extended/sorting';
import './rows/m_rows';
import './module_not_extended/context_menu';
import './module_not_extended/error_handling';
import './m_grid_view';
import './module_not_extended/header_panel';

import registerComponent from '@js/core/component_registrator';
import { deferRender } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isFunction } from '@js/core/utils/type';
import { isMaterialBased } from '@js/ui/themes';
import type { Properties as dxTreeListOptions } from '@js/ui/tree_list';
import Widget from '@js/ui/widget/ui.widget';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import treeListCore from './m_core';

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

class TreeList extends Widget<dxTreeListOptions> {
  public _deprecatedOptions: any;

  public _activeStateUnit = DATAGRID_ROW_SELECTOR;

  protected _getDefaultOptions() {
    // @ts-expect-error
    const result = super._getDefaultOptions();

    each(treeListCore.modules, function () {
      if (isFunction(this.defaultOptions)) {
        extend(true, result, this.defaultOptions());
      }
    });
    return result;
  }

  protected _setDeprecatedOptions() {
    // @ts-expect-error
    super._setDeprecatedOptions();

    extend(this._deprecatedOptions, {
      'columnChooser.allowSearch': { since: '23.1', message: 'Use the "columnChooser.search.enabled" option instead' },
      'columnChooser.searchTimeout': { since: '23.1', message: 'Use the "columnChooser.search.timeout" option instead' },
    });
  }

  protected _defaultOptionsRules() {
    // @ts-expect-error
    return super._defaultOptionsRules().concat([
      {
        device() {
          // @ts-expect-error
          return isMaterialBased();
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
  }

  protected _init() {
    const that = this;

    // @ts-expect-error
    super._init();

    if (!this.option('_disableDeprecationWarnings')) {
      gridCoreUtils.logHeaderFilterDeprecatedWarningIfNeed(this);
    }

    treeListCore.processModules(that, treeListCore);

    callModuleItemsMethod(that, 'init');
  }

  protected _clean() {}

  protected _optionChanged(args) {
    const that = this;

    callModuleItemsMethod(that, 'optionChanged', [args]);
    if (!args.handled) {
      // @ts-expect-error
      super._optionChanged(args);
    }
  }

  private _dimensionChanged() {
    // @ts-expect-error
    this.updateDimensions(true);
  }

  private _visibilityChanged(visible) {
    if (visible) {
      // @ts-expect-error
      this.updateDimensions();
    }
  }

  private _initMarkup() {
    // @ts-expect-error
    super._initMarkup.apply(this, arguments);
    (this.$element() as any).addClass(TREELIST_CLASS);
    this.getView('gridView').render(this.$element());
  }

  private _renderContentImpl() {
    this.getView('gridView').update();
  }

  private _renderContent() {
    const that = this;

    deferRender(() => {
      that._renderContentImpl();
    });
  }

  private _dispose() {
    const that = this;
    // @ts-expect-error
    super._dispose();

    callModuleItemsMethod(that, 'dispose');
  }

  private isReady() {
    return this.getController('data').isReady();
  }

  public beginUpdate() {
    super.beginUpdate();
    callModuleItemsMethod(this, 'beginUpdate');
  }

  public endUpdate() {
    callModuleItemsMethod(this, 'endUpdate');
    super.endUpdate();
  }

  private getController(name) {
    // @ts-expect-error
    return this._controllers[name];
  }

  private getView(name) {
    // @ts-expect-error
    return this._views[name];
  }

  public focus(element?) {
    super.focus();

    if (isDefined(element)) {
      this.getController('keyboardNavigation').focus(element);
    }
  }

  public static registerModule() {
    treeListCore.registerModule.apply(treeListCore, arguments as any);
  }
}

// @ts-expect-error
registerComponent('dxTreeList', TreeList);

export default TreeList;
