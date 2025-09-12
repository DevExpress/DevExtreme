import type {
  CollectionWidgetOptions,
} from '@js/ui/collection/ui.collection_widget.base';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';

export type CollectionProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetOptions<any> = CollectionWidgetOptions<any>,
> = TProperties & {};

export interface CollectionChildrenProps {
  isSelected: (index: number) => boolean;
}

export class CollectionComponent<
  TProps extends CollectionProps,
> extends BaseInfernoComponent<TProps> {
  isSelected = (index: number): boolean => index === this.props.selectedIndex;

  render(): JSX.Element {
    // @ts-expect-error ts
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.props.children?.({
      ...this.props,
      isSelected: this.isSelected,
    });
  }
}
