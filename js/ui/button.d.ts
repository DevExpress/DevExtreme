import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type ClickEvent = NativeEventInfo<dxButton> & {
    validationGroup?: any;
}

/** @public */
export type ContentReadyEvent = EventInfo<dxButton>;

/** @public */
export type DisposingEvent = EventInfo<dxButton>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxButton>;

/** @public */
export type OptionChangedEvent = EventInfo<dxButton> & ChangedOptionInfo;

/** @public */
export type TemplateData = {
    readonly text?: string;
    readonly icon?: string;
}

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
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 validationGroup:object
     * @type_function_param1_field1 component:dxButton
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: ClickEvent) => void);
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
     * @type_function_param2 contentElement:DxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((data: TemplateData, contentElement: DxElement) => string | UserDefinedElement);
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
    constructor(element: UserDefinedElement, options?: dxButtonOptions)
}

/** @public */
export type Properties = dxButtonOptions;

/** @deprecated use Properties instead */
export type Options = dxButtonOptions;

/** @deprecated use Properties instead */
export type IOptions = dxButtonOptions;
