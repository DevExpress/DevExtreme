import { isDefined } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import { DataController } from '@ts/grids/new/grid_core/data_controller';

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
      throw errors.Error('E1042', 'CardView');
    }
  }
}
