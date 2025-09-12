import type { CollectionWidgetItem, ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';

export type CollectionItemProps<
  TProperties extends ItemLike = CollectionWidgetItem,
> = TProperties & {
  isSelected?: boolean;
};

export class ItemComponent<
  TProps extends CollectionItemProps,
> extends BaseInfernoComponent<TProps> {
  render(): JSX.Element {
    const { text, isSelected } = this.props;
    const className = `dx-item ${isSelected ? ' dx-item-selected' : ''}`;

    return (
      <div className={className}>
        {text}
      </div>
    );
  }
}
