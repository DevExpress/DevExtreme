import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    ButtonType,
    ButtonStylingMode,
} from '../types/enums';

/** @public */
export type ClickEvent = NativeEventInfo<dxButton> & {
    validationGroup?: any;
};

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
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxButtonOptions extends WidgetOptions<dxButton> {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default ""
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
     * @public
     */
    onClick?: ((e: ClickEvent) => void);
    /**
     * @docid
     * @default 'contained'
     * @public
     */
    stylingMode?: ButtonStylingMode;
    /**
     * @docid
     * @default "content"
     * @type_function_param1 buttonData:object
     * @type_function_param1_field1 text:string
     * @type_function_param1_field2 icon:string
     * @type_function_return string|Element|jQuery
     * @public
     */
    template?: template | ((data: TemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default ""
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default 'normal'
     * @public
     */
    type?: ButtonType;
    /**
     * @docid
     * @default false
     * @public
     */
    useSubmitBehavior?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    validationGroup?: string;
}
/**
 * @docid
 * @inherits Widget
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxButton extends Widget<dxButtonOptions> { }

/** @public */
export type Properties = dxButtonOptions;

/** @deprecated use Properties instead */
export type Options = dxButtonOptions;
