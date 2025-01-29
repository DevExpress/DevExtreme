import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import type { ItemRenderInfo } from '@ts/ui/collection/collection_widget.base';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/m_collection_widget.edit';
import CollectionWidgetEdit from '@ts/ui/collection/m_collection_widget.edit';

class CollectionWidgetAsync<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetEditProperties<any, TItem, TKey>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
> extends CollectionWidgetEdit<TProperties> {
  _asyncTemplateItemsMap!: Record<string, DeferredObj<unknown>>;

  _initMarkup(): void {
    this._asyncTemplateItemsMap = {};
    super._initMarkup();
  }

  _render(): void {
    super._render();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._planPostRenderActions();
  }

  _renderItemContent(args: ItemRenderInfo<TItem>): DeferredObj<dxElementWrapper> {
    const renderContentDeferred = Deferred();
    const itemDeferred = Deferred();
    const uniqueKey = `dx${new Guid()}`;

    this._asyncTemplateItemsMap[uniqueKey] = itemDeferred;
    const $itemContent = super._renderItemContent({ ...args, uniqueKey });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    itemDeferred.done(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      renderContentDeferred.resolve($itemContent);
    });
    // @ts-expect-error ts-error
    return renderContentDeferred.promise();
  }

  _onItemTemplateRendered(
    itemTemplate: { source: () => unknown },
    renderArgs: ItemRenderInfo<TItem>,
  ) {
    return (): void => {
      const { uniqueKey } = renderArgs;

      if (uniqueKey) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._asyncTemplateItemsMap[uniqueKey]?.resolve();
      }
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _postProcessRenderItems(): void {}

  _planPostRenderActions(...args: unknown[]): Promise<unknown> {
    const d = Deferred();
    const asyncTemplateItems = Object.values<DeferredObj<unknown>>(this._asyncTemplateItemsMap);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    when.apply(this, asyncTemplateItems).done(() => {
      // @ts-expect-error ts-error
      this._postProcessRenderItems(...args);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      d.resolve().done(() => {
        this._asyncTemplateItemsMap = {};
      });
    });

    return d.promise();
  }

  _clean(): void {
    super._clean();

    const asyncTemplateItems = Object.values<DeferredObj<unknown>>(this._asyncTemplateItemsMap);

    asyncTemplateItems.forEach((item) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      item.reject();
    });

    this._asyncTemplateItemsMap = {};
  }
}

export default CollectionWidgetAsync;
