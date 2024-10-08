/* eslint-disable spellcheck/spell-checker */
import { computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type { Content as BaseContent } from '@ts/grids/new/grid_core/content_view/content';
import { View } from '@ts/grids/new/grid_core/core/view';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';

export const CLASSES = {
  content: 'dx-cardview-content',
};

export class Content extends View implements BaseContent {
  private readonly items = computed(
    (dataItems, columns: Column[]) => dataItems.map(
      (item) => this.columnsController.createDataRow(
        item,
        columns,
      ),
    ),
    [this.dataController.items, this.columnsController.columns],
  );

  public vdom = computed(
    (items) => (
      <>
        <table>
          <tbody>
            {items.map((item) => (
              <tr>
                {item.cells.map((cell) => (
                  <td>{cell.value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ),
    [this.items],
  );

  public static dependencies = [
    DataController, ColumnsController,
  ] as const;

  constructor(
    private readonly dataController: DataController,
    private readonly columnsController: ColumnsController,
  ) {
    super();
  }
}
