import {
    UserDefinedElement
} from '../core/element';

import dxOverlay, {
    dxOverlayOptions
} from './overlay';

export interface dxValidationMessageOptions extends dxOverlayOptions<dxValidationMessage> {
    mode?: string;

    validationErrors?: Array<object> | null;

    positionRequest?: string;

    boundary?: String | UserDefinedElement;

    offset?: object;
}

export default class dxValidationMessage extends dxOverlay<dxValidationMessageOptions> { }

/** @public */
export type Properties = dxValidationMessageOptions;

/** @deprecated use Properties instead */
export type Options = dxValidationMessageOptions;

/** @deprecated use Properties instead */
export type IOptions = dxValidationMessageOptions;
