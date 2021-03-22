import {
    TElement
} from '../../core/element';

import {
    TEvent
} from '../../events/index';

import Widget, {
    WidgetOptions
} from '../widget/ui.widget';

export interface EditorOptions<T = Editor> extends WidgetOptions<T> {
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
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: T, element?: TElement, model?: any, value?: any, previousValue?: any, event?: TEvent }) => void);
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
 */
export default class Editor extends Widget {
    constructor(element: TElement, options?: EditorOptions)
    /**
     * @docid
     * @publicName reset()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reset(): void;
}
