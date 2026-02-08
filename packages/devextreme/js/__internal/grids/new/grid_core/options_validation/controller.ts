import { isDefined } from '@js/core/utils/type';
import { DataController } from '@ts/grids/new/grid_core/data_controller/index';

import { throwError } from './utils';

export class OptionsValidationController {
  public static dependencies = [
    DataController,
  ] as const;

  constructor(
    private readonly dataController: DataController,
  ) {
  }

  public validateKeyExpr(): void {
    const keyExpr = this.dataController.dataSource.peek().key();

    if (!isDefined(keyExpr)) {
      throwError('E1042', 'CardView');
    }
  }
}
