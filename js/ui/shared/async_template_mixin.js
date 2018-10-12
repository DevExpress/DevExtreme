var deferredUtils = require("../../core/utils/deferred"),
    Deferred = deferredUtils.Deferred,
    when = deferredUtils.when;

module.exports = {
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

    _createItemByTemplate(itemTemplate, renderArgs) {
        return this._renderAsyncTemplate(itemTemplate, {
            model: renderArgs.itemData,
            container: renderArgs.container,
            index: renderArgs.index,
            onRendered: this._itemTemplateRendered.bind(this, renderArgs)
        });
    },

    _itemTemplateRendered(renderArgs) {
        if(!this.option("deferRendering") && this._deferredItems && this._deferredItems[renderArgs.index]) {
            this._deferredItems[renderArgs.index].resolve();
        }
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

    _renderAsyncTemplate(template, args) {
        const result = template && template.render(args);
        if(!this._options.templatesRenderAsynchronously) {
            args.onRendered && args.onRendered.call(this);
        }
        return result;
    },

    _waitAsyncTemplates(callback) {
        if(this._options.templatesRenderAsynchronously) {
            this._asyncTemplatesTimers = this._asyncTemplatesTimers || [];
            const timer = setTimeout(function() {
                callback.call(this);
                clearTimeout(timer);
            }.bind(this));
            this._asyncTemplatesTimers.push(timer);
        } else {
            callback.call(this);
        }
    },

    _cleanAsyncTemplatesTimer() {
        const timers = this._asyncTemplatesTimers || [];

        for(let i = 0; i < timers.length; i++) {
            clearTimeout(timers[i]);
        }

        delete this._asyncTemplatesTimers;
    }
};
