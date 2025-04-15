/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive';
import { state } from '@ts/core/reactive';
import { removeFieldConditionsFromFilter } from '@ts/filter_builder/m_utils';

import { ColumnsController } from '../../columns_controller';
import type { Column } from '../../columns_controller/types';
import { getColumnIndexByName } from '../../columns_controller/utils';
import { DataController } from '../../data_controller';
import { OptionsController } from '../../options_controller/options_controller';
import { FilterController } from '../filter_controller';
import { getDataSourceOptions, getFilterType } from './legacy_header_filter';
import type { PopupState } from './types';
import { getColumnIdentifier } from './utils';

export class HeaderFilterViewController {
  private readonly popupState = state<PopupState>(null);

  public readonly popupState$: SubsGets<PopupState> = this.popupState;

  public static dependencies = [
    OptionsController,
    DataController,
    ColumnsController,
    FilterController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly dataController: DataController,
    private readonly columnsController: ColumnsController,
    private readonly filterController: FilterController,
  ) { }

  public openPopup(
    element: Element,
    column: Column,
    onFilterCloseCallback?: () => void,
  ): void {
    const rootDataSource = this.dataController.getStoreLoadAdapter();
    const rootHeaderFilterOptions = this.options.oneWay('headerFilter').unreactive_get();
    const displayFilter = this.filterController.displayFilter.unreactive_get();
    const columnId = getColumnIdentifier(column);
    const actualFilter = removeFieldConditionsFromFilter(displayFilter, columnId);

    const filterDataSourceOptions = getDataSourceOptions(
      rootDataSource,
      {
        ...column,
        filterType: column.filterType,
        filterValues: column.headerFilter?.values,
      },
      // NOTE: Only text used from root options
      {
        texts: rootHeaderFilterOptions.texts,
      },
      actualFilter,
    );

    const type = getFilterType(column);
    const colsController = this.columnsController;

    this.popupState.update({
      element,
      options: {
        type,
        headerFilter: { ...column.headerFilter },
        dataSource: filterDataSourceOptions,
        filterType: column.filterType,
        // NOTE: Copy array because of mutations in legacy code
        filterValues: Array.isArray(column.headerFilter?.values)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ? [...column.headerFilter!.values]
          : column.headerFilter?.values,
        apply() {
          // NOTE: Copy array because of mutations in legacy code
          const values = Array.isArray(this.filterValues)
            ? [...this.filterValues]
            : this.filterValues;
          const { filterType } = this;
          colsController.updateColumns(
            (columns) => {
              const index = getColumnIndexByName(columns, column.name);
              const newColumns = [...columns];

              newColumns[index] = {
                ...newColumns[index],
                headerFilter: {
                  ...newColumns[index].headerFilter,
                  values,
                },
                filterType,
              };
              return newColumns;
            },
          );

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
