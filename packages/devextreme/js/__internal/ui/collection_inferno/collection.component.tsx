import type {
  CollectionWidgetOptions,
} from '@js/ui/collection/ui.collection_widget.base';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

export type CollectionProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetOptions<any> = CollectionWidgetOptions<any>,
> = TProperties & {};

export class CollectionComponent<
  TProps extends CollectionProps,
> extends BaseInfernoComponent<TProps> {
  render(): JSX.Element {
    // @ts-expect-error ts
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.props.children?.({
      ...this.props,
    });
  }
}
