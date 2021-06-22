import {
    UserDefinedElement,
} from '../core/element';

import dxOverlay, {
    dxOverlayOptions
} from './overlay';

/** @namespace DevExpress.ui */
export interface dxValidationMessageOptions<T = dxValidationMessage> extends dxOverlayOptions<T> {
    mode?: string;

    validationErrors?: Array<object> | null;

    positionRequest?: string;

    boundary?: String | UserDefinedElement;

    offset?: object;
}
/** @namespace DevExpress.ui */
export default class dxValidationMessage extends dxOverlay {
    constructor(element: UserDefinedElement, options?: dxValidationMessageOptions)
}

export type Options = dxValidationMessageOptions;
export type IOptions = dxValidationMessageOptions;
