export default class AsyncTemplateHelper {
    waitAsyncTemplates(callback) {
        // if(this._options.silent('templatesRenderAsynchronously')) {
        this._asyncTemplatesTimers = this._asyncTemplatesTimers || [];
        const timer = setTimeout(() => {
            callback();
            clearTimeout(timer);
        });
        this._asyncTemplatesTimers.push(timer);
        // } else {
        //     callback.call(this);
        // }
    }

    cleanAsyncTemplatesTimer() {
        const timers = this._asyncTemplatesTimers || [];

        timers.forEach(timer => clearTimeout(timer));
        delete this._asyncTemplatesTimers;
    }
}
