import {
    NativeEventInfo,
} from '../../events/index';

import Widget, {
    WidgetOptions,
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
     * @public
     */
    isValid?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field6 value:object
     * @type_function_param1_field5 previousValue:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:this
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
