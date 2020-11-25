import '../../jquery_augmentation';

import {
    dxElement
} from '../../core/element';

import {
    event
} from '../../events/index';

import Widget, {
    WidgetOptions
} from '../widget/ui.widget';

export interface EditorOptions<T = Editor> extends WidgetOptions<T> {
    /**
     * @docid EditorOptions.isValid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isValid?: boolean;
    /**
     * @docid EditorOptions.onValueChanged
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:object
     * @type_function_param1_field5 previousValue:object
     * @type_function_param1_field6 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: T, element?: dxElement, model?: any, value?: any, previousValue?: any, event?: event }) => any);
    /**
     * @docid EditorOptions.readOnly
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readOnly?: boolean;
    /**
     * @docid EditorOptions.validationError
     * @ref
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationError?: any;
    /**
     * @docid EditorOptions.validationErrors
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationErrors?: Array<any>;
    /**
     * @docid EditorOptions.validationMessageMode
     * @type Enums.ValidationMessageMode
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationMessageMode?: 'always' | 'auto';
    /**
     * @docid EditorOptions.validationStatus
     * @type Enums.ValidationStatus
     * @default "valid"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationStatus?: 'valid' | 'invalid' | 'pending';
    /**
     * @docid EditorOptions.value
     * @default null
     * @fires EditorOptions.onValueChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
}
/**
 * @docid Editor
 * @inherits Widget
 * @module ui/editor/editor
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class Editor extends Widget {
    constructor(element: Element, options?: EditorOptions)
    constructor(element: JQuery, options?: EditorOptions)
    /**
     * @docid Editor.reset
     * @publicName reset()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reset(): void;
}
