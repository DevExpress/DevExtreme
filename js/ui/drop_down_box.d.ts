import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

import {
    DataExpressionMixinOptions
} from './editor/ui.data_expression';

/** @public */
export type ChangeEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type ClosedEvent = EventInfo<dxDropDownBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type CutEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type DisposingEvent = EventInfo<dxDropDownBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDropDownBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type OpenedEvent = EventInfo<dxDropDownBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxDropDownBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxDropDownBox>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxDropDownBox> & ValueChangedInfo;

/** @public */
export type ContentTemplateData = {
    component: dxDropDownBox;
    readonly value?: any;
}

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

export interface dxDropDownBoxOptions extends DataExpressionMixinOptions<dxDropDownBox>, dxDropDownEditorOptions<dxDropDownBox> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @default 'content'
     * @type_function_param1 templateData:object
     * @type_function_param1_field1 component:dxDropDownBox
     * @type_function_param1_field2 value:any
     * @type_function_param2 contentElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((templateData: ContentTemplateData, contentElement: TElement) => string | TElement);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type_function_param1 value:string|Array<any>
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayValueFormatter?: ((value: string | Array<any>) => string);
    /**
     * @docid
     * @default null
     * @type_function_param1 value:object
     * @type_function_param2 fieldElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((value: any, fieldElement: TElement) => string | TElement);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<any>;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid
     * @default "change"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueChangeEvent?: string;
}
/**
 * @docid
 * @isEditor
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @hasTranscludedContent
 * @module ui/drop_down_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxDropDownBox extends dxDropDownEditor {
    constructor(element: TElement, options?: dxDropDownBoxOptions)
    getDataSource(): DataSource;
}

export type Options = dxDropDownBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxDropDownBoxOptions;
