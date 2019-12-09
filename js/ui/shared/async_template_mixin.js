module.exports = {
    _waitAsyncTemplates(callback) {
        if(this._optionSilent('templatesRenderAsynchronously')) {
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
