export default class AsyncTemplateHelper {
    waitAsyncTemplates(callback) {
        this._asyncTemplatesTimers = this._asyncTemplatesTimers || [];
        const timer = setTimeout(() => {
            callback();
            clearTimeout(timer);
        });
        this._asyncTemplatesTimers.push(timer);
    }

    cleanAsyncTemplatesTimer() {
        const timers = this._asyncTemplatesTimers || [];

        timers.forEach(timer => clearTimeout(timer));
        delete this._asyncTemplatesTimers;
    }
}
