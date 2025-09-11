import registerComponent from '@js/core/component_registrator';
import type CollectionItem from '@ts/ui/collection/item';
import type { CollectionItemProps } from '@ts/ui/counter/collection.item.component';
import { ItemComponent } from '@ts/ui/counter/collection.item.component';
import type { CollectionProps } from '@ts/ui/counter/collection.wrapper.component';
import { CollectionComponent } from '@ts/ui/counter/collection.wrapper.component';
import type { CounterProps } from '@ts/ui/counter/counter.types';
import { InfernoCollectionWidget } from '@ts/ui/counter/inferno_collection_widget';
import { InfernoWidget } from '@ts/ui/counter/inferno_widget';
import type { ComponentType } from 'inferno';

import { CounterComponentWithProvider as CounterComponent } from './counter.component';
// import { CounterComponentWithHOC as CounterComponent } from './counter.component';

/* class Counter extends InfernoWidget<CounterProps> {
  protected override getComponent(): ComponentType<CounterProps> {
    return CounterComponent;
  }

  protected override getProps(): CounterProps {
    const { count = 0, onClick } = this.option();

    return {
      count,
      onClick,
      step: 1,
    };
  }
} */

// registerComponent('dxCounter', Counter);

// export default Counter;

const normalizeIndex = (index: number, length: number): number => {
  if (index < 0) {
    return -1;
  }

  if (index >= length) {
    return length - 1;
  }

  return index;
};

class Collection extends InfernoCollectionWidget<CollectionProps, CollectionItemProps> {
  protected override getComponent(): ComponentType<CollectionProps> {
    return CollectionComponent;
  }

  protected override getItemComponent(): ComponentType<CollectionItemProps> {
    return ItemComponent;
  }

  protected override getProps(): CollectionProps {
    const { items, selectedIndex } = this.option();

    return {
      items,
      selectedIndex: normalizeIndex(selectedIndex ?? -1, items.length),
    };
  }
}

registerComponent('dxCounter', Collection);

export default Collection;
