import { PromiseType } from "../core";

declare module '../core' {
    export interface PromiseType<T> extends JQueryPromise<T> { }
}

declare global {
    interface JQuery { }
    interface JQueryPromise<T> { }
    interface JQueryEventObject {
        cancel?: boolean;
    }
}

export const { };