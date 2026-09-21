import { OptionsController } from '../options_controller/options_controller';

// Reused grid_core views reach the adapter through the dataSource controller. The new
// architecture has no adapter, so the mock answers from the dataSource option instead.
export class CompatibilityDataSourceController {
  public static dependencies = [OptionsController] as const;

  private readonly dataSourceOption = this.options.oneWay('dataSource');

  constructor(
    private readonly options: OptionsController,
  ) {}

  public hasAdapter(): boolean {
    return !!this.dataSourceOption.peek();
  }
}
