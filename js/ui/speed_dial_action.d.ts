import {
    DxElement
} from '../core/element';

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
export type ClickEvent = NativeEventInfo<dxSpeedDialAction> & {
    actionElement?: DxElement
}

/** @public */
export type ContentReadyEvent = EventInfo<dxSpeedDialAction> & {
    actionElement?: DxElement
};

/** @public */
export type DisposingEvent = EventInfo<dxSpeedDialAction>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSpeedDialAction>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSpeedDialAction> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxSpeedDialActionOptions extends WidgetOptions<dxSpeedDialAction> {
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    index?: number;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    label?: string;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 event:event
     * @type_function_param1_field2 component:this
     * @type_function_param1_field3 element:DxElement
     * @type_function_param1_field4 actionElement:DxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: ClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSpeedDialAction
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 actionElement:DxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContentReady?: ((e: ContentReadyEvent) => void);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @inherits Widget
 * @module ui/speed_dial_action
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSpeedDialAction extends Widget<dxSpeedDialActionOptions> { }

/** @public */
export type Properties = dxSpeedDialActionOptions;

/** @deprecated use Properties instead */
export type Options = dxSpeedDialActionOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSpeedDialActionOptions;
