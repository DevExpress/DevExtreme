import './module_not_extended/column_headers';
import './columns_controller';
import './data_source/data_source_module';
import './module_not_extended/filter';
import './data_controller/data_controller';
import './module_not_extended/sorting';
import './rows/m_rows';
import './module_not_extended/context_menu';
import './module_not_extended/error_handling';
import './grid_view';
import './module_not_extended/header_panel';

import registerComponent from '@js/core/component_registrator';
import type { UserDefinedElement } from '@js/core/element';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import { isMaterialBased } from '@js/ui/themes';
import type { Properties as dxTreeListOptions } from '@js/ui/tree_list';
import type { GridCoreHelper, Module } from '@ts/grids/grid_core/types';
import GridCoreWidget from '@ts/grids/grid_core/widget_base';

import treeListCore from './core';

const TREELIST_CLASS = 'dx-treelist';

treeListCore.registerModulesOrder([
  'dataSource',
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
  'errorHandling',
  'summary',
  'columnFixing',
  'export',
  'toast',
  'gridView',
]);

class TreeList extends GridCoreWidget<dxTreeListOptions> {
  private _initMarkup(): void {
    // @ts-expect-error
    super._initMarkup();
    this.$element().addClass(TREELIST_CLASS);
    this.getView('gridView').render(this.$element());
  }

  private static registerModule(name: string, module: Module): void {
    treeListCore.registerModule(name, module);
  }

  protected _defaultOptionsRules(): DefaultOptionsRule<dxTreeListOptions>[] {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- untyped in Widget d.ts
    return super._defaultOptionsRules().concat([
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
        },
      },
    ]);
  }

  protected _init(): void {
    super._init();

    // @ts-expect-error the widget has no index signature of the component instance
    treeListCore.processModules(this, treeListCore);

    treeListCore.callModuleItemsMethod(this, 'init');
  }

  protected getGridCoreHelper(): GridCoreHelper {
    return treeListCore;
  }

  public focus(element?: UserDefinedElement): void {
    this.getController('keyboardNavigation').focus(element);
  }
}

// @ts-expect-error
registerComponent('dxTreeList', TreeList);

export default TreeList;
