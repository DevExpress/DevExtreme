import createCallback from '@js/core/utils/callbacks';
import type DataSource from '@js/data/data_source';
import { effect } from '@ts/core/reactive/index';

import { DataController } from './data_controller';

export class CompatibilityDataController {
  public dataSourceChanged = createCallback();

  public static dependencies = [DataController] as const;

  constructor(
    private readonly realDataController: DataController,
  ) {
    effect(() => {
      this.dataSourceChanged.fire(
        this.realDataController.dataSource.value,
      );
    });
  }

  public dataSource(): DataSource {
    return this.realDataController.dataSource.peek();
  }
}
