import {
    NativeEventInfo
} from '../../events/index';

import Widget, {
    WidgetOptions
} from '../widget/ui.widget';

export interface ValueChangedInfo {
    readonly previousValue?: any;
    readonly value?: any;
}

/** @namespace DevExpress.ui */
export interface EditorOptions<TComponent> extends WidgetOptions<TComponent> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isValid?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:object
     * @type_function_param1_field5 previousValue:object
     * @type_function_param1_field6 event:event
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: NativeEventInfo<TComponent> & ValueChangedInfo) => void);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readOnly?: boolean;
    /**
     * @docid
     * @ref
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationError?: any;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationErrors?: Array<any>;
    /**
     * @docid
     * @type Enums.ValidationMessageMode
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationMessageMode?: 'always' | 'auto';
    /**
     * @docid
     * @type Enums.ValidationStatus
     * @default "valid"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationStatus?: 'valid' | 'invalid' | 'pending';
    /**
     * @docid
     * @default null
     * @fires EditorOptions.onValueChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
    /**
     * @docid
     * @type Enums.EditorStylingMode
     * @default 'outlined'
     * @prevFileNamespace DevExpress.ui
     * @hidden
     */
    stylingMode?: 'outlined' | 'underlined' | 'filled';
}
/**
 * @docid
 * @inherits Widget
 * @module ui/editor/editor
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 */
export default class Editor<TProperties = Properties> extends Widget<TProperties> {
    /**
     * @docid
     * @publicName reset()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reset(): void;
}

type Properties = EditorOptions<Editor<Properties>>;
