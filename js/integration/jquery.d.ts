import { PromiseType } from "../core";
import { ElementWrapperType } from "../core/element";
import { EventType, EventExtension } from "../events";

declare module '../core' {
    interface PromiseType<T> extends JQueryPromise<T> { }
}

declare module '../core/element' {
    interface ElementWrapperType<T extends Element> extends JQuery<T> { }
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
    interface JQuery<TElement = HTMLElement> { }
    interface JQueryPromise<T> { }
    interface JQueryEventObject { }
}

export const { };