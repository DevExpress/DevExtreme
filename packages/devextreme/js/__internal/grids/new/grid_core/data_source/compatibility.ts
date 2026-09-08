import { DataController } from '../data_controller/data_controller';

// Reused grid_core views reach the adapter through the dataSource controller. The new
// architecture has no adapter, so the mock answers from the DataSource itself.
export class CompatibilityDataSourceController {
  public static dependencies = [DataController] as const;

  constructor(
    private readonly realDataController: DataController,
  ) {}

  public hasAdapter(): boolean {
    return !!this.realDataController.dataSource.peek();
  }
}
