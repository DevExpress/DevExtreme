import { FilterController } from '../filter_controller';
import { FilterSyncController } from './controller';

export class CompatibilityFilterSyncController {
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
