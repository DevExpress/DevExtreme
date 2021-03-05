import { PromiseType } from "../core";
import { EventType, EventExtension } from "../events";

declare module '../core' {
    interface PromiseType<T> extends JQueryPromise<T> { }
}

declare module '../events' {
    interface EventType extends JQueryEventObject {
        cancel?: boolean;
    }

    interface EventExtension {
        jQueryEvent?: JQueryEventObject;
    }
}

declare global {
    interface JQuery { }
    interface JQueryPromise<T> { }
    interface JQueryEventObject { }
}

export const { };