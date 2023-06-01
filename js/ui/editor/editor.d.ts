import {
    NativeEventInfo,
} from '../../events/index';

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
    /** @docid */
    readonly previousValue?: any;
    /** @docid */
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
     * @publicName reset()
     * @public
     */
    reset(): void;
}

interface EditorInstance extends Editor<Properties> { }

type Properties = EditorOptions<EditorInstance>;
