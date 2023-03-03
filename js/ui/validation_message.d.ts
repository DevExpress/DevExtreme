import {
    UserDefinedElement,
} from '../core/element';

import dxOverlay, {
    dxOverlayOptions,
} from './overlay';

/** @namespace DevExpress.ui */
export interface dxValidationMessageOptions extends dxOverlayOptions<dxValidationMessage> {
    mode?: string;

    validationErrors?: Array<object> | null;

    positionSide?: string;

    boundary?: String | UserDefinedElement;

    offset?: object;

    /**
     * @docid
     * @default false
     * @public
     */
    preventScrollEvents?: boolean;
}
/** @namespace DevExpress.ui */
export default class dxValidationMessage extends dxOverlay<dxValidationMessageOptions> { }

/** @public */
export type Properties = dxValidationMessageOptions;

/** @deprecated use Properties instead */
export type Options = dxValidationMessageOptions;
