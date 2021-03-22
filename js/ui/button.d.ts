import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    TEvent
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxButtonOptions extends WidgetOptions<dxButton> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 validationGroup:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: { component?: dxButton, element?: TElement, model?: any, event?: TEvent, validationGroup?: any }) => void);
    /**
     * @docid
     * @type Enums.ButtonStylingMode
     * @default 'contained'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stylingMode?: 'text' | 'outlined' | 'contained';
    /**
     * @docid
     * @default "content"
     * @type_function_param1 buttonData:object
     * @type_function_param1_field1 text:string
     * @type_function_param1_field2 icon:string
     * @type_function_param2 contentElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((buttonData: { text?: string, icon?: string }, contentElement: TElement) => string | TElement);
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @type Enums.ButtonType
     * @default 'normal'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useSubmitBehavior?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationGroup?: string;
}
/**
 * @docid
 * @inherits Widget
 * @hasTranscludedContent
 * @module ui/button
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxButton extends Widget {
    constructor(element: TElement, options?: dxButtonOptions)
}

export type Options = dxButtonOptions;

/** @deprecated use Options instead */
export type IOptions = dxButtonOptions;
