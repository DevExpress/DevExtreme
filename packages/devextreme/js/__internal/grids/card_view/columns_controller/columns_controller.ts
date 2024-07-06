import { computed } from '@ts/core/reactive';

import { OptionsController } from '../options_controller/options_controller';

export class ColumnsController {
  columnsConfiguration = this.options.oneWay('columns');

  columns = computed((columnsConfiguration) => {

  }, [this.columnsConfiguration]);

  static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {}
}
