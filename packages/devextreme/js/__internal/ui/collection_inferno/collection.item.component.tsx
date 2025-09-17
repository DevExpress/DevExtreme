import type { CollectionWidgetItem } from '@js/ui/collection/ui.collection_widget.base';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

export type CollectionItemProps<
  TProperties extends CollectionWidgetItem = CollectionWidgetItem,
> = TProperties & {
  isSelected?: boolean;
};

export class ItemComponent<
  TProps extends CollectionItemProps,
> extends BaseInfernoComponent<TProps> {
  render(): JSX.Element {
    const { isSelected } = this.props;
    const className = `dx-item${isSelected ? ' dx-item-selected' : ''}`;

    // @ts-expect-error ts
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.props.children?.({
      ...this.props,
      className,
    });
  }
}
