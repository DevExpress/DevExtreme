import type {
    UserDefinedElement,
} from '../core/element';

import * as dxOverlay from './overlay';
import type {
    dxOverlayOptions,
} from './overlay';

/** @namespace DevExpress.ui */
export interface dxValidationMessageOptions extends dxOverlayOptions<dxValidationMessage> {
    mode?: string;

    validationErrors?: Array<object> | null;

    positionRequest?: string;

    boundary?: String | UserDefinedElement;

    offset?: object;
}
/** @namespace DevExpress.ui */
export default class dxValidationMessage extends dxOverlay<dxValidationMessageOptions> { }

/** @public */
export type Properties = dxValidationMessageOptions;

/** @deprecated use Properties instead */
export type Options = dxValidationMessageOptions;

/** @deprecated use Properties instead */
export type IOptions = dxValidationMessageOptions;
