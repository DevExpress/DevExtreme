import {
    ElementIntake,
    THTMLElement
} from '../core/element';

import dxOverlay, {
    dxOverlayOptions
} from './overlay';

export interface dxValidationMessageOptions<T = dxValidationMessage> extends dxOverlayOptions<T> {
    mode?: string;

    validationErrors?: Array<object> | null;

    positionRequest?: string;

    boundary?: String | ElementIntake;

    offset?: object;
}

export default class dxValidationMessage extends dxOverlay {
    constructor(element: ElementIntake, options?: dxValidationMessageOptions)
}

export type Options = dxValidationMessageOptions;
export type IOptions = dxValidationMessageOptions;
