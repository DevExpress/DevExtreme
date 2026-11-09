import './module_not_extended/column_headers';
import './columns_controller';
import './data_source/data_source_module';
import './module_not_extended/filter';
import './module_not_extended/data_controller';
import './module_not_extended/sorting';
import './module_not_extended/rows';
import './module_not_extended/context_menu';
import './module_not_extended/error_handling';
import './module_not_extended/grid_view';
import './module_not_extended/header_panel';

import type { template } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import type { Device } from '@js/core/devices';
import type { UserDefinedElement } from '@js/core/element';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import $ from '@js/core/renderer';
import type { FunctionTemplate } from '@js/core/templates/function_template';
import browser from '@js/core/utils/browser';
import { logger } from '@js/core/utils/console';
import { isString } from '@js/core/utils/type';
import type { Properties } from '@js/ui/data_grid';
import { isMaterialBased } from '@js/ui/themes';
import type { GridCoreHelper, Module } from '@ts/grids/grid_core/types';
import GridCoreWidget from '@ts/grids/grid_core/widget_base';

import gridCore from './core';

const DATAGRID_DEPRECATED_TEMPLATE_WARNING = 'Specifying grid templates with the jQuery selector name is now deprecated. Use the DOM Node or the jQuery object that references this selector instead.';

gridCore.registerModulesOrder([
  'dataSource',
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
  'filter',
  'data',
  'virtualScrolling',
  'aiColumn',
  'columnHeaders',
  'filterRow',
  'headerPanel',
  'aiAssistant',
  'headerFilter',
  'sorting',
  'search',
  'rows',
  'pager',
  'columnsResizingReordering',
  'contextMenu',
  'keyboardNavigation',
  'headersKeyboardNavigation',
  'groupPanelKeyboardNavigation',
  'errorHandling',
  'summary',
  'columnFixing',
  'export',
  'toast',
  'gridView',
]);

class DataGrid extends GridCoreWidget<Properties> {
  private _defaultOptionsRules(): DefaultOptionsRule<Properties>[] {
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
        device(): boolean {
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
        device(): boolean {
          return !!browser.webkit;
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
        device(device: Device): boolean {
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

  protected _init(): void {
    super._init();

    // @ts-expect-error
    gridCore.processModules(this, gridCore);

    gridCore.callModuleItemsMethod(this, 'init');
  }

  private _initMarkup(): void {
    // @ts-expect-error
    super._initMarkup();
    this.getView('gridView').render(this.$element());
  }

  private static registerModule(name: string, module: Module): void {
    gridCore.registerModule(name, module);
  }

  protected getGridCoreHelper(): GridCoreHelper {
    return gridCore;
  }

  public _getTemplate(templateName: template): FunctionTemplate {
    if (isString(templateName) && templateName.startsWith('#')) {
      const $template = $(templateName);

      logger.warn(DATAGRID_DEPRECATED_TEMPLATE_WARNING);

      return super._getTemplate($template);
    }

    return super._getTemplate(templateName);
  }

  public focus(element?: UserDefinedElement): void {
    this.getController('keyboardNavigation').focus(element);
  }
}

// @ts-expect-error
registerComponent('dxDataGrid', DataGrid);

export default DataGrid;
