module.exports = {
    _renderAsyncTemplate(template, args) {
        const result = template && template.render(args);
        if(!this._options.templatesRenderAsynchronously) {
            args.onRendered.call(this);
        }
        return result;
    },

    _waitAsyncTemplates(callback) {
        if(this._options.templatesRenderAsynchronously) {
            this._asyncTemplatesTimer = setTimeout(function() {
                callback.call(this);
                this._cleanAsyncTemplatesTimer();
            }.bind(this));
        } else {
            callback.call(this);
        }
    },

    _cleanAsyncTemplatesTimer() {
        clearTimeout(this._asyncTemplatesTimer);
    }
};
