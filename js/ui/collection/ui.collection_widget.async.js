import CollectionWidgetEdit from './ui.collection_widget.edit';
import { Deferred, when } from '../../core/utils/deferred';
import { noop } from '../../core/utils/common';

const AsyncCollectionWidget = CollectionWidgetEdit.inherit({
    _initMarkup() {
        this._deferredItems = [];
        this.callBase();
    },

    _renderItemContent(args) {
        const renderContentDeferred = new Deferred();
        const itemDeferred = new Deferred();
        const that = this;

        this._deferredItems[args.index] = itemDeferred;
        const $itemContent = this.callBase.call(that, args);

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
        const d = new Deferred();
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

export default AsyncCollectionWidget;
