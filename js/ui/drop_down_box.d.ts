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
    ComponentEvent,
    ComponentNativeEvent
} from '../events';

import dxDropDownEditor, {
    dxDropDownEditorOptions
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

import {
    DataExpressionMixinOptions
} from './editor/ui.data_expression';

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxDropDownBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentNativeEvent<dxDropDownBox> & ValueChangedInfo;
/**
 * @public
 */
export type ClosedEvent = ComponentEvent<dxDropDownBox>;
/**
 * @public
 */
export type OpenedEvent = ComponentEvent<dxDropDownBox>;
/**
 * @public
 */
export type ChangeEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type CopyEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type CutEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type InputEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type PasteEvent = ComponentNativeEvent<dxDropDownBox>;
/**
 * @public
 */
export type ContentData = {
    component: dxDropDownBox;
    readonly value?: any;
}

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
    contentTemplate?: template | ((templateData: ContentData, contentElement: TElement) => string | TElement);
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
