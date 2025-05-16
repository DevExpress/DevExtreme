import { computed, effect, signal } from '@preact/signals-core';

import { ColumnsController } from '../columns_controller/columns_controller';
import { DataController } from '../data_controller/index';

export class AccessibilityController {
  public static dependencies = [
    ColumnsController,
    DataController,
  ] as const;

  private readonly firstRender = signal(true);

  private readonly description = computed(
    () => `Card view with ${this.dataController.totalCount.value} cards and ${this.columnsController.visibleColumns.value.length} fields`,
  );

  public readonly componentDescription = computed(
    () => this.description.value,
  );

  public readonly componentStatus = computed(
    () => {
      if (this.firstRender.value) {
        return '';
      }
      return this.componentDescription.value;
    },
  );

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly dataController: DataController,
  ) {
    let firstRender = true;

    effect(() => {
      // TODO: FirstRender refactor
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.dataController.totalCount.value;

      if (!firstRender) {
        this.firstRender.value = false;
      }
      firstRender = false;
    });
  }
}
