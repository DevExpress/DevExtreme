import {
    TElement
} from '../core/element';

import dxOverlay, {
    dxOverlayOptions
} from './overlay';

export interface dxValidationMessageOptions<T = dxValidationMessage> extends dxOverlayOptions<T> {
    mode?: string;

    validationErrors?: Array<object> | null;

    positionRequest?: string;

    boundary?: String | TElement;

    offset?: object;
}

export default class dxValidationMessage extends dxOverlay {
    constructor(element: TElement, options?: dxValidationMessageOptions)
}

declare global {
interface JQuery {
    dxValidationMessage(): JQuery;
    dxValidationMessage(options: "instance"): dxValidationMessage;
    dxValidationMessage(options: string): any;
    dxValidationMessage(options: string, ...params: any[]): any;
    dxValidationMessage(options: dxValidationMessageOptions): JQuery;
}
}
export type Options = dxValidationMessageOptions;
export type IOptions = dxValidationMessageOptions;
