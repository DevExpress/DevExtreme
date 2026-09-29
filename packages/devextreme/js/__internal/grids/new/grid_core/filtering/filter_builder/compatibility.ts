import { FilterController } from '../filter_controller';
import { FilterSyncController } from '../filter_sync/controller';

export class CompatibilityFilterBuilderController {
  public static dependencies = [
    FilterController,
    FilterSyncController,
  ] as const;

  constructor(
    private readonly realFilterController: FilterController,
    private readonly realFilterSyncController: FilterSyncController,
  ) {}

  public getCustomFilterOperations(): unknown[] {
    return this.realFilterController.customOperations.peek();
  }
}
