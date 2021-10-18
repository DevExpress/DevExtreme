import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import DataSource, { CommonDataSource } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    DataExpressionMixinOptions,
} from './editor/ui.data_expression';

import {
    Properties as PopupProperties,
} from './popup';

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
};

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxDropDownBoxOptions extends DataExpressionMixinOptions<dxDropDownBox>, dxDropDownEditorOptions<dxDropDownBox> {
    /**
     * @docid
     * @default false
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @default 'content'
     * @type_function_param1 templateData:object
     * @type_function_param1_field1 component:dxDropDownBox
     * @type_function_param1_field2 value:any
     * @type_function_return string|Element|jQuery
     * @public
     */
    contentTemplate?: template | ((templateData: ContentTemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default null
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>
     */
    dataSource?: CommonDataSource<any>;
    /**
     * @docid
     * @public
     */
    displayValueFormatter?: ((value: string | Array<any>) => string);
    /**
     * @docid
     * @default null
     * @type_function_param1 value:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    fieldTemplate?: template | ((value: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    items?: Array<any>;
    /**
     * @docid
     * @default true
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid
     * @default "change"
     * @public
     */
    valueChangeEvent?: string;

    /**
     * @docid
     * @type dxPopupOptions
     */
    dropDownOptions?: PopupProperties;
}
/**
 * @docid
 * @isEditor
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDropDownBox extends dxDropDownEditor<dxDropDownBoxOptions> {
    getDataSource(): DataSource;
}

/** @public */
export type Properties = dxDropDownBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxDropDownBoxOptions;
