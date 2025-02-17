import {
    UserDefinedElement,
} from '../core/element';

import dxOverlay, {
    dxOverlayOptions,
} from './overlay';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxValidationMessageOptions extends dxOverlayOptions<dxValidationMessage> {
    mode?: string;

    validationErrors?: Array<object> | null;

    positionSide?: string;

    boundary?: String | UserDefinedElement;

    offset?: object;
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class dxValidationMessage extends dxOverlay<dxValidationMessageOptions> { }

export type Properties = dxValidationMessageOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxValidationMessageOptions;
