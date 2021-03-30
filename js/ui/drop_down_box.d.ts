import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    ComponentClosedEvent,
    ComponentOpenedEvent
} from './drop_down_editor/ui.drop_down_editor';

import {
    ComponentValueChangedEvent
} from './editor/editor';

import {
    DataExpressionMixinOptions
} from './editor/ui.data_expression';

import {
    ComponentChangeEvent,
    ComponentCopyEvent,
    ComponentCutEvent,
    ComponentEnterKeyEvent,
    ComponentFocusInEvent,
    ComponentFocusOutEvent,
    ComponentInputEvent,
    ComponentKeyDownEvent,
    ComponentKeyPressEvent,
    ComponentKeyUpEvent,
    ComponentPasteEvent,
} from './text_box/ui.text_editor.base';

import {
    ComponentContentReadyEvent
} from './widget/ui.widget'

/**
 * @public
 */
export type ContentReadyEvent = ComponentContentReadyEvent<dxDropDownBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxDropDownBox>;
/**
 * @public
 */
export type ClosedEvent = ComponentClosedEvent<dxDropDownBox>;
/**
 * @public
 */
export type OpenedEvent = ComponentOpenedEvent<dxDropDownBox>;
/**
 * @public
 */
export type ChangeEvent = ComponentChangeEvent<dxDropDownBox>;
/**
 * @public
 */
export type CopyEvent = ComponentCopyEvent<dxDropDownBox>;
/**
 * @public
 */
export type CutEvent = ComponentCutEvent<dxDropDownBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentEnterKeyEvent<dxDropDownBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentFocusInEvent<dxDropDownBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentFocusOutEvent<dxDropDownBox>;
/**
 * @public
 */
export type InputEvent = ComponentInputEvent<dxDropDownBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentKeyDownEvent<dxDropDownBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentKeyPressEvent<dxDropDownBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentKeyUpEvent<dxDropDownBox>;
/**
 * @public
 */
export type PasteEvent = ComponentPasteEvent<dxDropDownBox>;
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
