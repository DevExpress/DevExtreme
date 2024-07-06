import { computed } from '@ts/core/reactive';

import { View } from '../core/view';
import { DataController } from '../data_controller/data_controller';
import { Card } from './card';

export const CLASSES = {
  content: 'dx-cardview-content',
};

export class ContentView extends View {
  private readonly items = computed(
    (dataItems) => {
      let index = 0;
      return dataItems.map((dataItem) => ({
        index: index++,
      }));
    },
    [this.dataController.items],
  );

  protected vdom = computed(
    (items) => (
      <div className={CLASSES.content}>
        {items.map((item) => (
          <Card index={item.index}></Card>
        ))}
      </div>
    ),
    [this.items],
  );

  static dependencies = [DataController] as const;

  constructor(private readonly dataController: DataController) {
    super();
  }
}
