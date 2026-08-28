import { createDataGrid } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type {
  DataChange, ProcessedItem, UpdateChange,
} from '@ts/grids/grid_core/data_controller/types';

declare class ExposedDataController extends DataController {
  public _items: ProcessedItem[];

  public applyChangesOnly: (change: DataChange) => void;
}

const createRefreshChange = (items: ProcessedItem[]): DataChange => ({
  changeType: 'refresh',
  repaintChangesOnly: true,
  items,
});

export const refreshRow = async (
  oldItem: ProcessedItem,
  newItem: ProcessedItem,
): Promise<UpdateChange> => {
  const { instance } = await createDataGrid({
    dataSource: [],
    columns: ['name', 'age'],
    repaintChangesOnly: true,
  });
  const dataController = instance.getController('data') as unknown as ExposedDataController;

  dataController._items = [oldItem];

  const change = createRefreshChange([newItem]);

  dataController.applyChangesOnly(change);

  // `rowIndices` is [] for the row with unchanged state, and `[0]` for updated row
  return change as UpdateChange;
};
