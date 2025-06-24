import messageLocalization from '@js/localization/message';
import { computed, effect, signal } from '@ts/core/reactive/index';

import { ColumnsController } from '../columns_controller/columns_controller';
import { DataController } from '../data_controller/index';

export class AccessibilityController {
  public static dependencies = [
    ColumnsController,
    DataController,
  ] as const;

  private readonly firstRender = signal(true);

  private readonly description = computed(
    // @ts-expect-error ts-error
    () => messageLocalization.format('dxCardView-ariaCardView', this.dataController.totalCount.value, this.columnsController.visibleColumns.value.length),
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
      // TODO: First Render refactor
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.componentDescription.value;

      if (!firstRender) {
        this.firstRender.value = false;
      }
      firstRender = false;
    });
  }
}
