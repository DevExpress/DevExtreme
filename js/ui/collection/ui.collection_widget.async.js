import CollectionWidgetEdit from './ui.collection_widget.edit';
import { Deferred, when } from '../../core/utils/deferred';
import { noop } from '../../core/utils/common';

let AsyncCollectionWidget = CollectionWidgetEdit.inherit({
    _initMarkup() {
        this._deferredItems = [];
        this.callBase();
    },

    _renderItemContent(args) {
        let renderContentDeferred = new Deferred(),
            itemDeferred = new Deferred(),
            that = this;

        this._deferredItems[args.index] = itemDeferred;
        let $itemContent = this.callBase.call(that, args);

        itemDeferred.done(() => {
            renderContentDeferred.resolve($itemContent);
        });

        return renderContentDeferred.promise();
    },

    _createItemByTemplate(itemTemplate, renderArgs) {
        return itemTemplate.render({
            model: renderArgs.itemData,
            container: renderArgs.container,
            index: renderArgs.index,
            onRendered: () => {
                this._deferredItems[renderArgs.index].resolve();
            }
        });
    },

    _postProcessRenderItems: noop,

    _renderItemsAsync() {
        let d = new Deferred();
        when.apply(this, this._deferredItems).done(() => {
            this._postProcessRenderItems();
            d.resolve();
        });
        return d.promise();
    },

    _clean() {
        this.callBase();
        this._deferredItems = [];
    }
});

module.exports = AsyncCollectionWidget;
