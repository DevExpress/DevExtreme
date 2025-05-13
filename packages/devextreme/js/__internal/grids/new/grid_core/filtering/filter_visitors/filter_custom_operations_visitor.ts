import { computed, effect } from '@preact/signals-core';

import { ColumnsController } from '../../columns_controller/index';
import type { Column } from '../../columns_controller/types';
import { getColumnByIndexOrName } from '../../columns_controller/utils';
import { OptionsController } from '../../options_controller/options_controller';
import { FilterController } from '../filter_controller';
import type { HeaderFilterRootOptions } from '../header_filter/index';
import { CompatibilityHeaderFilterController } from '../header_filter/index';
import { anyOf, noneOf } from '../legacy_filter_custom_operations';

export class FilterCustomOperationsVisitor {
  private readonly filterBuilderCustomOperations = this.options.oneWay('filterBuilder.customOperations');

  public static dependencies = [
    OptionsController,
    ColumnsController,
    CompatibilityHeaderFilterController,
    FilterController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
    private readonly headerFilterController: CompatibilityHeaderFilterController,
    private readonly filterController: FilterController,
  ) {
    effect(() => {
      const config = {
        columnOption: (columnName: string): Column | undefined => {
          const columns = this.columnsController.columns.peek();

          return getColumnByIndexOrName(columns, columnName);
        },
        getHeaderFilterOptions: (): HeaderFilterRootOptions => this.options.oneWay('headerFilter').peek(),
        headerFilterController: this.headerFilterController,
      };

      const builtInCustomOperation = [
        anyOf(config),
        noneOf(config),
      ];

      const customOperations = builtInCustomOperation
        .concat(this.filterBuilderCustomOperations.value)
        .filter((o) => o);

      this.filterController.customOperations.value = customOperations;
    });
  }
}
