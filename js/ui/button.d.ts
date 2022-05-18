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

/** @public */
export type ClickEvent = NativeEventInfo<dxButton, KeyboardEvent | MouseEvent | PointerEvent> & {
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
     * @type_function_param1_field event:event
     * @type_function_param1_field validationGroup:object
     * @type_function_param1_field component:dxButton
     * @action
     * @public
     */
    onClick?: ((e: ClickEvent) => void);
    /**
     * @docid
     * @type Enums.ButtonStylingMode
     * @default 'contained'
     * @public
     */
    stylingMode?: 'text' | 'outlined' | 'contained';
    /**
     * @docid
     * @default "content"
     * @type_function_param1 buttonData:object
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
     * @type Enums.ButtonType
     * @default 'normal'
     * @public
     */
    type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
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
