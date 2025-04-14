import type { DataSource } from '@js/common/data';
import { state } from '@ts/core/reactive';

import { OptionsController } from '../options_controller/options_controller';

export class SharedController {
  public static dependencies = [
    OptionsController,
  ] as const;

  public readonly dataSource = state<DataSource<unknown, unknown> | undefined>(undefined);

  constructor(
    private readonly optionsController: OptionsController,
  ) { }
}
