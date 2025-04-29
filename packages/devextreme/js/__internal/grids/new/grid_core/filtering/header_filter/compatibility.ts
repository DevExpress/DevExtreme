import { FilterController } from '../filter_controller';

export class CompatibilityHeaderFilterController {
  public static dependencies = [
    FilterController,
  ] as const;

  constructor(
    private readonly realFilterController: FilterController,
  ) {}

  public getCustomFilterOperations(): unknown[] {
    return this.realFilterController.customOperations.peek();
  }
}
