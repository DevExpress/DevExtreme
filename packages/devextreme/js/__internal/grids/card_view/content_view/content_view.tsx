import dxLoadPanel from '@js/ui/load_panel';
import { computed } from '@ts/core/reactive';

import { ColumnsController } from '../columns_controller/columns_controller';
import type { Column, DataRow } from '../columns_controller/types';
import { asInferno, View } from '../core/view';
import { createWidgetWrapper } from '../core/widget_wrapper';
import { DataController } from '../data_controller/data_controller';
import { OptionsController } from '../options_controller/options_controller';
import { Card } from './card';
import { NoData } from './no_data';

export const CLASSES = {
  content: 'dx-cardview-content',
};

const LoadPanel = createWidgetWrapper(dxLoadPanel);

export class ContentView extends View {
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
    (items, isLoading, noDataText) => (
      <>
        <div className={CLASSES.content}>
          {<LoadPanel visible={isLoading}></LoadPanel>}
          {
            (!isLoading && items.length === 0) && (
              <NoData
                text={noDataText}
              ></NoData>
            )
          }
          {items.map((item) => (
            <Card row={item}></Card>
          ))}
        </div>
      </>
    ),
    [
      this.items,
      this.dataController.isLoading,
      this.options.oneWay('noDataText'),
    ],
  );

  static dependencies = [DataController, ColumnsController, OptionsController] as const;

  constructor(
    private readonly dataController: DataController,
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
  ) {
    super();
  }
}
