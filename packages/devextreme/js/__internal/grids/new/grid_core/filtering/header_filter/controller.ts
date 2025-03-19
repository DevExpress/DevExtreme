/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { state } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { DataController } from '@ts/grids/new/grid_core/data_controller';
import {
  getDataSourceOptions,
  getFilterType,
} from '@ts/grids/new/grid_core/filtering/header_filter/legacy_header_filter';
import { OptionsController } from '@ts/grids/new/grid_core/options_controller/options_controller';

export type PopupState = {
  element: Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>;
} | null;

export class HeaderFilterController {
  public static dependencies = [
    OptionsController,
    DataController,
    ColumnsController,
  ] as const;

  private readonly popupState = state<PopupState>(null);

  public readonly popupState$: SubsGets<PopupState> = this.popupState;

  constructor(
    private readonly optionsController: OptionsController,
    private readonly dataController: DataController,
    private readonly columnsController: ColumnsController,
  ) {
  }

  public openPopup(
    element: Element,
    column: Column,
    onFilterCloseCallback?: () => void,
  ): void {
    const rootDataSource = this.dataController.dataSource.unreactive_get();
    const rootHeaderFilterOptions = this.optionsController.oneWay('headerFilter').unreactive_get();

    const filterDataSourceOptions = getDataSourceOptions(
      rootDataSource,
      {
        ...column,
        filterType: column.headerFilter?.filterType,
        filterValues: column.headerFilter?.values,
      },
      // NOTE: Only text used from root options
      {
        texts: rootHeaderFilterOptions.texts,
      },
    );

    const type = getFilterType(column);
    const colsController = this.columnsController;

    this.popupState.update({
      element,
      options: {
        type,
        headerFilter: { ...column.headerFilter },
        dataSource: filterDataSourceOptions,
        filterType: column.headerFilter?.filterType,
        // NOTE: Copy array because of mutations in legacy code
        filterValues: Array.isArray(column.headerFilter?.values)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ? [...column.headerFilter!.values]
          : column.headerFilter?.values,
        apply() {
          colsController.columnOption(column, 'headerFilter', {
            ...column.headerFilter,
            filterType: this.filterType,
            // NOTE: Copy array because of mutations in legacy code
            values: Array.isArray(this.filterValues)
              ? [...this.filterValues]
              : this.filterValues,
          });

          onFilterCloseCallback?.();
        },
        hidePopupCallback: () => {
          this.popupState.update(null);
          onFilterCloseCallback?.();
        },
      },
    });
  }
}
