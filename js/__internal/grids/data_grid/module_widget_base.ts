import $ from '@js/core/renderer';
import registerComponent from '@js/core/component_registrator';
import { deferRender, noop } from '@js/core/utils/common';
import { isFunction, isString } from '@js/core/utils/type';
import { each } from '@js/core/utils/iterator';
import { extend } from '@js/core/utils/extend';
import { logger } from '@js/core/utils/console';
import browser from '@js/core/utils/browser';
import Widget from '@js/ui/widget/ui.widget';
import { isMaterial } from '@js/ui/themes';
import gridCoreUtils from '@js/ui/grid_core/ui.grid_core.utils';
import gridCore from './module_core';

import './module_not_extended/column_headers';
import './module_columns_controller';
import './module_data_controller';
import './module_not_extended/sorting';
import './module_not_extended/rows';
import './module_not_extended/context_menu';
import './module_not_extended/error_handling';
import './module_not_extended/grid_view';
import './module_not_extended/header_panel';

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

const DataGrid = (Widget as any).inherit({
  _activeStateUnit: DATAGRID_ROW_SELECTOR,

  _getDefaultOptions() {
    const that = this;
    const result = that.callBase();

    each(gridCore.modules, function () {
      if (isFunction(this.defaultOptions)) {
        extend(true, result, this.defaultOptions());
      }
    });
    return result;
  },

  _setDeprecatedOptions() {
    this.callBase();

    extend(this._deprecatedOptions, {
      useKeyboard: { since: '19.2', alias: 'keyboardNavigation.enabled' },
      rowTemplate: { since: '21.2', message: 'Use the "dataRowTemplate" option instead' },
      'headerFilter.allowSearch': { since: '23.1', message: 'Use the "headerFilter.search.enabled" option instead' },
      'headerFilter.searchTimeout': { since: '23.1', message: 'Use the "headerFilter.search.timeout" option instead' },
    });
  },

  _defaultOptionsRules() {
    return this.callBase().concat([
      {
        device: { platform: 'ios' },
        options: {
          showRowLines: true,
        },
      },
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
  },

  _init() {
    const that = this;

    that.callBase();

    gridCoreUtils.logColumnsDeprecatedWarningIfNeed(this.NAME, this.option('columns'));

    gridCore.processModules(that, gridCore);

    gridCore.callModuleItemsMethod(that, 'init');
  },

  _clean: noop,

  _optionChanged(args) {
    const that = this;

    gridCore.callModuleItemsMethod(that, 'optionChanged', [args]);
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

  _getTemplate(templateName) {
    let template = templateName;

    if (isString(template) && template.startsWith('#')) {
      template = $(templateName);
      logger.warn(DATAGRID_DEPRECATED_TEMPLATE_WARNING);
    }

    return this.callBase(template);
  },

  _dispose() {
    const that = this;
    that.callBase();

    gridCore.callModuleItemsMethod(that, 'dispose');
  },

  isReady() {
    return this.getController('data').isReady();
  },

  beginUpdate() {
    const that = this;

    that.callBase();
    gridCore.callModuleItemsMethod(that, 'beginUpdate');
  },

  endUpdate() {
    const that = this;

    gridCore.callModuleItemsMethod(that, 'endUpdate');
    that.callBase();
  },

  getController(name) {
    return this._controllers[name];
  },

  getView(name) {
    return this._views[name];
  },

  focus(element) {
    this.getController('keyboardNavigation').focus(element);
  },
});

DataGrid.registerModule = gridCore.registerModule.bind(gridCore);

registerComponent('dxDataGrid', DataGrid);

export default DataGrid;
