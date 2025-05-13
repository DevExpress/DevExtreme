import { computed } from '@preact/signals-core';

import { ColumnsController } from '../../columns_controller/index';
import { OptionsController } from '../../options_controller/options_controller';
import { FilterController } from '../filter_controller';
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
    this.filterController.customOperations = computed((): unknown[] => {
      const config = {
        columns: this.columnsController.columns.value,
        headerFilterController: this.headerFilterController,
        headerFilterOptions: options.oneWay('headerFilter').value,
      };

      const builtInCustomOperation = [
        anyOf(config),
        noneOf(config),
      ];

      const customOperations = builtInCustomOperation
        .concat(this.filterBuilderCustomOperations.value)
        .filter((o) => o);

      return customOperations;
    });
  }
}
