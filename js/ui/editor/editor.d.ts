import {
    UserDefinedElement
} from '../../core/element';

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
export interface EditorOptions<T = Editor> extends WidgetOptions<T> {
    /**
     * @docid
     * @default true
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
     * @public
     */
    onValueChanged?: ((e: NativeEventInfo<T> & ValueChangedInfo) => void);
    /**
     * @docid
     * @default false
     * @public
     */
    readOnly?: boolean;
    /**
     * @docid
     * @ref
     * @default null
     * @public
     */
    validationError?: any;
    /**
     * @docid
     * @default null
     * @public
     */
    validationErrors?: Array<any>;
    /**
     * @docid
     * @type Enums.ValidationMessageMode
     * @default "auto"
     * @public
     */
    validationMessageMode?: 'always' | 'auto';
    /**
     * @docid
     * @type Enums.ValidationStatus
     * @default "valid"
     * @public
     */
    validationStatus?: 'valid' | 'invalid' | 'pending';
    /**
     * @docid
     * @default null
     * @fires EditorOptions.onValueChanged
     * @public
     */
    value?: any;
    /**
     * @docid
     * @type Enums.EditorStylingMode
     * @default 'outlined'
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
 * @namespace DevExpress.ui
 */
export default class Editor extends Widget {
    constructor(element: UserDefinedElement, options?: EditorOptions)
    /**
     * @docid
     * @publicName reset()
     * @public
     */
    reset(): void;
}
