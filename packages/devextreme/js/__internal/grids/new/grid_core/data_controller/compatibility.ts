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
    effect(
      (dataSource) => {
        this.dataSourceChanged.fire(dataSource);
      },
      [this.realDataController.dataSource],
    );
  }

  public dataSource(): DataSource {
    // eslint-disable-next-line spellcheck/spell-checker
    return this.realDataController.dataSource.unreactive_get();
  }
}
