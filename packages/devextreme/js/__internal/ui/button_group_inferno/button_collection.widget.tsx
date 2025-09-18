import { isDefined, isFunction, isString } from '@js/core/utils/type';
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
import type { CollectionItemProps } from '@ts/ui/collection_inferno/collection.item.component';
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

  protected getItemProps(
    item: ButtonCollectionItemProps,
    index: number,
  ): CollectionItemProps<ButtonCollectionItemProps> {
    const template = item.template ?? this.props?.buttonTemplate;
    const hasCustomTemplate = isFunction(template)
      || (isString(template) && this.option('integrationOptions.templates')[template]);

    return {
      ...super.getItemProps(item, index),
      isFirst: index === 0,
      isLast: index === (this.props?.items?.length ?? 0) - 1,
      hasWidth: isDefined(this.props?.width),
      focusStateEnabled: false,
      // // @ts-expect-error ts-error
      // onClick: null,
      hoverStateEnabled: this.props?.hoverStateEnabled,
      activeStateEnabled: this.props?.activeStateEnabled,
      stylingMode: this.props?.stylingMode,
      template,
      // @ts-expect-error ts-error
      _templateData: hasCustomTemplate ? item : {},
    };
  }

  protected override getProps(): ReadonlySignal<ButtonCollectionProps> {
    const options = this.option();

    return computed(() => ({
      ...options,
    }));
  }
}
