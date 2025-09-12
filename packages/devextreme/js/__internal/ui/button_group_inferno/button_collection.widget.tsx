import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { computed } from '@ts/core/state_manager/index';
import type {
  ButtonCollectionProps,
} from '@ts/ui/button_group_inferno/button_collection.component';
import {
  ButtonCollectionComponent,
} from '@ts/ui/button_group_inferno/button_collection.component';
import type {
  ButtonCollectionItemProps,
} from '@ts/ui/button_group_inferno/button_collection.item.component';
import {
  ButtonCollectionItem,
} from '@ts/ui/button_group_inferno/button_collection.item.component';
import { InfernoCollectionWidget } from '@ts/ui/collection_inferno/inferno_collection_widget';
import type { ComponentType } from 'inferno';

export class ButtonCollection extends InfernoCollectionWidget<
  ButtonCollectionProps, ButtonCollectionItemProps
> {
  protected override getComponent(): ComponentType<ButtonCollectionProps> {
    return ButtonCollectionComponent;
  }

  protected override getItemComponent(): ComponentType<ButtonCollectionItemProps> {
    return ButtonCollectionItem;
  }

  protected override getProps(): ReadonlySignal<ButtonCollectionProps> {
    const options = this.option();

    return computed(() => ({
      ...options,
    }));
  }
}
