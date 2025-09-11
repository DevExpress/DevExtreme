import type {
  CollectionWidgetItem as CollectionWidgetItemProperties,
  ItemLike,
} from '@js/ui/collection/ui.collection_widget.base';
import { infernoRenderer } from '@ts/core/m_inferno_renderer';
import { effect, type ReadonlySignal } from '@ts/core/state_manager/index';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';
// eslint-disable-next-line spellcheck/spell-checker
import { type ComponentType, rerender } from 'inferno';

/*
 * Widget inherited from Class, its properties values and constructor are run after ctor and _initMarkup
 */
export abstract class InfernoCollectionWidget<
  TProperties extends {},
  TItem extends ItemLike = CollectionWidgetItemProperties,
> extends CollectionWidget<TProperties, TItem> {
  protected cleanupRenderSubscription?: () => void;

  private props?: TProperties;

  private firstRender = true;

  protected abstract getComponent(): ComponentType<TProperties>;
  protected abstract getItemComponent(): ComponentType<TItem>;

  protected abstract getProps(): ReadonlySignal<TProperties>;

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      selectionMode: 'single',
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
           {/* eslint-disable-next-line @typescript-eslint/no-unsafe-return */}
           {({ items, isSelected }) => items.map((item, index) => (
                 // @ts-expect-error
                 <ItemComponent value={item} isSelected={isSelected(index)} />
           ))}
         </ContainerComponent>
      );

      infernoRenderer.renderIntoContainer(content, root, !this.firstRender);
      // infernoRenderer.render(ViewComponent, props, root, !this.firstRender);
      this.firstRender = false;
    });
  }

  /*  _renderItems(): () => void {
    const root = this._itemContainer().get(0);
    const ContainerComponent = this.getComponent();
    const props = this.getProps();

    return effect(() => {
      this.props = props;

      const content = (
        <ContainerComponent {...props} />
      );

      infernoRenderer.renderIntoContainer(content, root, !this.firstRender);
      // infernoRenderer.render(ContainerComponent, props, root, !this.firstRender);
      this.firstRender = false;
    });
  } */

  _renderContentImpl(): void {
    super._renderContentImpl();
    this.cleanupRenderSubscription = this._renderItems();
    // NOTE: We flush all Inferno async render operations after initial render
    // Because after component creation markup should be ready
    // eslint-disable-next-line spellcheck/spell-checker
    rerender();
  }

  public _initMarkup(): void {
    super._initMarkup();

    this.firstRender = true;
  }

  public _clean(): void {
    this.cleanupRenderSubscription?.();
    infernoRenderer.renderIntoContainer(null, this.$element().get(0), true);
    // infernoRenderer.render(null, null, this.$element().get(0), true);
    super._clean();
  }
}
