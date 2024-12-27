import Guid from '@js/core/guid';
import { noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';

import CollectionWidgetEdit from './m_collection_widget.edit';

const AsyncCollectionWidget = CollectionWidgetEdit.inherit({
  _initMarkup() {
    this._asyncTemplateItemsMap = {};
    this.callBase();
  },

  _render() {
    this.callBase(arguments);
    this._planPostRenderActions();
  },

  _renderItemContent(args) {
    const renderContentDeferred = Deferred();
    const itemDeferred = Deferred();
    const uniqueKey = `dx${new Guid()}`;

    this._asyncTemplateItemsMap[uniqueKey] = itemDeferred;
    const $itemContent = this.callBase({ ...args, uniqueKey });

    itemDeferred.done(() => {
      renderContentDeferred.resolve($itemContent);
    });

    return renderContentDeferred.promise();
  },

  _onItemTemplateRendered(itemTemplate, renderArgs) {
    return () => {
      this._asyncTemplateItemsMap[renderArgs.uniqueKey]?.resolve();
    };
  },

  _postProcessRenderItems: noop,

  _planPostRenderActions(...args: unknown[]) {
    const d = Deferred();
    const asyncTemplateItems = Object.values<DeferredObj<unknown>>(this._asyncTemplateItemsMap);

    when.apply(this, asyncTemplateItems).done(() => {
      this._postProcessRenderItems(...args);

      d.resolve().done(() => {
        this._asyncTemplateItemsMap = {};
      });
    });

    return d.promise();
  },

  _clean() {
    this.callBase();

    const asyncTemplateItems = Object.values<DeferredObj<unknown>>(this._asyncTemplateItemsMap);

    asyncTemplateItems.forEach((item) => {
      item.reject();
    });

    this._asyncTemplateItemsMap = {};
  },
});

export default AsyncCollectionWidget;
