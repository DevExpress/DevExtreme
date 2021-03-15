declare global {
    interface JQuery { }
    interface JQueryPromise<T> { }
    interface JQueryCallback { }
    interface JQueryEventObject {
        cancel?: boolean;
    }
}

export const { };
