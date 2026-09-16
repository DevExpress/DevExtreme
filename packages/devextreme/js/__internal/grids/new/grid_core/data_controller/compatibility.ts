import createCallback from '@js/core/utils/callbacks';
import type DataSource from '@js/data/data_source';
import { effect } from '@ts/core/state_manager/index';

import { OptionsController } from '../options_controller/options_controller';
import { DataController } from './data_controller';

export class CompatibilityDataController {
  public dataSourceChanged = createCallback();

  public static dependencies = [DataController, OptionsController] as const;

  constructor(
    private readonly realDataController: DataController,
    private readonly options: OptionsController,
  ) {
    effect(() => {
      this.dataSourceChanged.fire(
        this.realDataController.dataSource.value,
      );
    });
  }

  public dataSource(): DataSource | undefined {
    return this.options.oneWay('dataSource').peek()
      ? this.realDataController.dataSource.peek()
      : undefined;
  }
}
