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
