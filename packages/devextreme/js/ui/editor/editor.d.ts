import {
    NativeEventInfo,
} from '../../common/core/events';

import Widget, {
    WidgetOptions,
} from '../widget/ui.widget';

import {
    EditorStyle,
    Position,
    ValidationMessageMode,
    ValidationStatus,
} from '../../common';

/**
 * @docid
 * @hidden
 */
export interface ValueChangedInfo {
    /**
     * @docid
     * @type object
     */
    readonly previousValue?: any;
    /**
     * @docid
     * @type object
     */
    readonly value?: any;
}

/**
 * @namespace DevExpress.ui
 * @docid
 * @hidden
 */
export interface EditorOptions<TComponent> extends WidgetOptions<TComponent> {
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
     * @type_function_param1_field value:object
     * @type_function_param1_field previousValue:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onValueChanged?: ((e: NativeEventInfo<TComponent, Event> & ValueChangedInfo) => void);
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
     * @default "auto"
     * @public
     */
    validationMessageMode?: ValidationMessageMode;
    /**
     * @docid
     * @default "bottom"
     * @public
     */
    validationMessagePosition?: Position;
    /**
     * @docid
     * @default "valid"
     * @public
     */
    validationStatus?: ValidationStatus;
    /**
     * @docid
     * @default null
     * @fires EditorOptions.onValueChanged
     * @public
     */
    value?: any;
    /**
     * @docid
     * @default 'outlined'
     * @hidden
     */
    stylingMode?: EditorStyle;

     /**
     * @docid
     * @default false
     * @public
     */
    readonly isDirty?: boolean;
}
/**
 * @docid
 * @inherits Widget
 * @hidden
 * @namespace DevExpress.ui
 */
export default class Editor<TProperties = Properties> extends Widget<TProperties> {
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;

    /**
     * @docid
     * @type_function_param1 value:any
     * @publicName reset(value)
     * @public
     */
    reset(value?: any): void;
}

interface EditorInstance extends Editor<Properties> { }

type Properties = EditorOptions<EditorInstance>;
