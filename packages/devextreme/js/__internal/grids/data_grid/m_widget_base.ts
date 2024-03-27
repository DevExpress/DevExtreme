import './module_not_extended/column_headers';
import './m_columns_controller';
import './m_data_controller';
import './module_not_extended/sorting';
import './module_not_extended/rows';
import './module_not_extended/context_menu';
import './module_not_extended/error_handling';
import './module_not_extended/grid_view';
import './module_not_extended/header_panel';

import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { deferRender } from '@js/core/utils/common';
import { logger } from '@js/core/utils/console';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isFunction, isString } from '@js/core/utils/type';
import type { Properties } from '@js/ui/data_grid';
import { isMaterialBased } from '@js/ui/themes';
import Widget from '@js/ui/widget/ui.widget';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import gridCore from './m_core';

const DATAGRID_ROW_SELECTOR = '.dx-row';
const DATAGRID_DEPRECATED_TEMPLATE_WARNING = 'Specifying grid templates with the jQuery selector name is now deprecated. Use the DOM Node or the jQuery object that references this selector instead.';

gridCore.registerModulesOrder([
  'stateStoring',
  'columns',
  'selection',
  'editorFactory',
  'columnChooser',
  'grouping',
  'editing',
  'editingRowBased',
  'editingFormBased',
  'editingCellBased',
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

class DataGrid extends Widget<Properties> {
  _activeStateUnit = DATAGRID_ROW_SELECTOR;

  private readonly _controllers: any;

  private readonly _views: any;

  private _getDefaultOptions() {
    // @ts-expect-error
    const result = super._getDefaultOptions();

    each(gridCore.modules, function () {
      if (isFunction(this.defaultOptions)) {
        extend(true, result, this.defaultOptions());
      }
    });
    return result;
  }

  private _setDeprecatedOptions() {
    // @ts-expect-error
    super._setDeprecatedOptions();

    // @ts-expect-error
    extend(this._deprecatedOptions, {
      useKeyboard: { since: '19.2', alias: 'keyboardNavigation.enabled' },
      rowTemplate: { since: '21.2', message: 'Use the "dataRowTemplate" option instead' },
      'columnChooser.allowSearch': { since: '23.1', message: 'Use the "columnChooser.search.enabled" option instead' },
      'columnChooser.searchTimeout': { since: '23.1', message: 'Use the "columnChooser.search.timeout" option instead' },
    });
  }

  private _defaultOptionsRules() {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._defaultOptionsRules().concat([
      {
        device: { platform: 'ios' },
        options: {
          showRowLines: true,
        },
      },
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
          selection: {
            showCheckBoxesMode: 'always',
          },
        },
      },
      {
        device() {
          return browser.webkit;
        },
        options: {
          loadingTimeout: 30, // T344031
          loadPanel: {
            animation: {
              show: {
                easing: 'cubic-bezier(1, 0, 1, 0)',
                duration: 500,
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            },
          },
        },
      },
      {
        device(device) {
          return device.deviceType !== 'desktop';
        },
        options: {
          grouping: {
            expandMode: 'rowClick',
          },
        },
      },
    ]);
  }

  private _init() {
    const that = this;

    // @ts-expect-error
    super._init();

    gridCoreUtils.logHeaderFilterDeprecatedWarningIfNeed(that);

    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    gridCore.processModules(that, gridCore as any);

    gridCore.callModuleItemsMethod(that, 'init');
  }

  private _clean() {

  }

  private _optionChanged(args) {
    const that = this;

    gridCore.callModuleItemsMethod(that, 'optionChanged', [args]);
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

  public _getTemplate(templateName) {
    let template = templateName;

    if (isString(template) && template.startsWith('#')) {
      template = $(templateName);
      logger.warn(DATAGRID_DEPRECATED_TEMPLATE_WARNING);
    }

    return super._getTemplate(template);
  }

  private _dispose() {
    const that = this;
    // @ts-expect-error
    super._dispose();

    gridCore.callModuleItemsMethod(that, 'dispose');
  }

  private isReady() {
    return this.getController('data').isReady();
  }

  public beginUpdate() {
    const that = this;

    super.beginUpdate();
    gridCore.callModuleItemsMethod(that, 'beginUpdate');
  }

  public endUpdate() {
    const that = this;

    gridCore.callModuleItemsMethod(that, 'endUpdate');
    super.endUpdate();
  }

  private getController(name) {
    return this._controllers[name];
  }

  private getView(name) {
    return this._views[name];
  }

  public focus(element?) {
    this.getController('keyboardNavigation').focus(element);
  }

  static registerModule(name, module) {
    gridCore.registerModule(name, module);
  }
}

// @ts-expect-error
registerComponent('dxDataGrid', DataGrid);

export default DataGrid;
