import { isObject } from '@js/core/utils/type';
import type {
  CollectionWidgetItem,
  CollectionWidgetOptions,
  ItemLike,
} from '@js/ui/collection/ui.collection_widget.base';
import { infernoRenderer } from '@ts/core/m_inferno_renderer';
import { effect, type ReadonlySignal } from '@ts/core/state_manager/index';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';
import type { CollectionProps } from '@ts/ui/collection_inferno/collection.component';
import type { CollectionItemProps } from '@ts/ui/collection_inferno/collection.item.component';
// eslint-disable-next-line spellcheck/spell-checker
import { type ComponentType, rerender } from 'inferno';

export abstract class InfernoCollectionWidget<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetOptions<any> = CollectionWidgetOptions<any>,
  TItem extends ItemLike = CollectionWidgetItem,
> extends CollectionWidget<TProperties, TItem> {
  protected cleanupRenderSubscription?: () => void;

  protected props?: TProperties;

  private firstRender?: boolean;

  protected abstract getComponent(): ComponentType<CollectionProps<TProperties>>;

  protected abstract getItemComponent(): ComponentType<CollectionItemProps>;

  protected abstract getProps(): ReadonlySignal<TProperties>;

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      selectionMode: 'single',
    };
  }

  protected getItemProps(
    item: TItem,
    index: number,
  ): CollectionItemProps {
    return {
      ...isObject(item) ? item : { text: String(item) },
      isSelected: index === this.props?.selectedIndex,
    };
  }

  _renderItems(): () => void {
    const root = this._itemContainer().get(0);
    const ItemComponent = this.getItemComponent();
    const ContainerComponent = this.getComponent();
    const props = this.getProps();

    return effect(() => {
      this.props = props.value;

      const content = (
        <ContainerComponent {...props.value}>
           {({ items }: { items: TItem[] }) => items.map((item, index) => {
             const itemProps = this.getItemProps(item, index);

             return <ItemComponent {...itemProps} />;
           })}
        </ContainerComponent>
      );

      infernoRenderer.renderIntoContainer(content, root, !this.firstRender);
      // infernoRenderer.render(ViewComponent, props, root, !this.firstRender);
      this.firstRender = false;
    });
  }

  _renderContentImpl(): void {
    super._renderContentImpl();
    this.cleanupRenderSubscription = this._renderItems();
    // NOTE: We flush all Inferno async render operations after initial render
    // Because after component creation markup should be ready
    // eslint-disable-next-line spellcheck/spell-checker
    rerender();
  }

  _initMarkup(): void {
    super._initMarkup();

    this.firstRender = true;
  }

  _clean(): void {
    this.cleanupRenderSubscription?.();
    infernoRenderer.renderIntoContainer(null, this.$element().get(0), true);
    // infernoRenderer.render(null, null, this.$element().get(0), true);

    super._clean();
  }
}
