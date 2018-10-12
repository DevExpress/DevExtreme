var CollectionWidgetEdit = require("./ui.collection_widget.edit"),
    deferredUtils = require("../../core/utils/deferred"),
    Deferred = deferredUtils.Deferred,
    when = deferredUtils.when;

var AsyncCollectionWidget = CollectionWidgetEdit.inherit({
    _initMarkup: function() {
        this._initItemContentDeferred();
        this.callBase();
    },

    _getItemContentPromise(args, renderItemContent) {
        let renderContentDeferred = new Deferred(),
            itemDeferred = new Deferred(),
            that = this;

        this._deferredItems[args.index] = itemDeferred;
        let $itemContent = renderItemContent.call(that, args);

        itemDeferred.done(function() {
            renderContentDeferred.resolve($itemContent);
        });

        return renderContentDeferred.promise();
    },

    _renderItemContent: function(args) {
        return this._getItemContentPromise(args, this.callBase);
    },

    _createItemByTemplate: function(itemTemplate, renderArgs) {
        return itemTemplate.render({
            model: renderArgs.itemData,
            container: renderArgs.container,
            index: renderArgs.index,
            onRendered: this._itemTemplateRendered.bind(this, renderArgs)
        });
    },

    _itemTemplateRendered(renderArgs) {
        this._deferredItems[renderArgs.index].resolve();
    },

    _renderItemsAsync() {
        let d = new Deferred();
        when.apply(this, this._deferredItems).done(() => {
            d.resolve();
        });
        return d.promise();
    },

    _initItemContentDeferred() {
        this._deferredItems = [];
    },

    _clean: function() {
        this.callBase();
        this._initItemContentDeferred();
    }
});

module.exports = AsyncCollectionWidget;
