import { noop } from '@js/core/utils/common';
import { Deferred, when } from '@js/core/utils/deferred';

import CollectionWidgetEdit from './m_collection_widget.edit';

const AsyncCollectionWidget = CollectionWidgetEdit.inherit({
  _initMarkup() {
    this._deferredItems = [];
    this.callBase();
  },

  _renderItemContent(args) {
    const renderContentDeferred = Deferred();
    const itemDeferred = Deferred();
    const that = this;

    this._deferredItems[args.index] = itemDeferred;
    const $itemContent = this.callBase.call(that, args);

    itemDeferred.done(() => {
      renderContentDeferred.resolve($itemContent);
    });

    return renderContentDeferred.promise();
  },

  _onItemTemplateRendered(itemTemplate, renderArgs) {
    return () => {
      this._deferredItems[renderArgs.index].resolve();
    };
  },

  _postProcessRenderItems: noop,

  _renderItemsAsync() {
    const d = Deferred();
    when.apply(this, this._deferredItems).done(() => {
      this._postProcessRenderItems();
      d.resolve();
    });
    return d.promise();
  },

  _clean() {
    this.callBase();
    this._deferredItems = [];
  },
});

export default AsyncCollectionWidget;
