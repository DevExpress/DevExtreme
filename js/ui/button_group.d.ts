import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    TEvent
} from '../events/index';

import {
    CollectionWidgetItem
} from './collection/ui.collection_widget.base';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxButtonGroupOptions extends WidgetOptions<dxButtonGroup> {
    /**
     * @docid
     * @default "content"
     * @type_function_param1 buttonData:object
     * @type_function_param2 buttonContent:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttonTemplate?: template | ((buttonData: any, buttonContent: TElement) => string | TElement);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxButtonGroupItem>;
    /**
     * @docid
     * @default 'text'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: { component?: dxButtonGroup, element?: TElement, model?: any, itemData?: any, itemElement?: TElement, itemIndex?: number, event?: TEvent }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 addedItems:array<any>
     * @type_function_param1_field5 removedItems:array<any>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxButtonGroup, element?: TElement, model?: any, addedItems?: Array<any>, removedItems?: Array<any> }) => any);
    /**
     * @docid
     * @fires dxButtonGroupOptions.onSelectionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItemKeys?: Array<any>;
    /**
     * @docid
     * @fires dxButtonGroupOptions.onSelectionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItems?: Array<any>;
    /**
     * @docid
     * @type Enums.ButtonGroupSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @type Enums.ButtonStylingMode
     * @default 'contained'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stylingMode?: 'text' | 'outlined' | 'contained';
}
/**
 * @docid
 * @inherits Widget
 * @module ui/button_group
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxButtonGroup extends Widget {
    constructor(element: TElement, options?: dxButtonGroupOptions)
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 */
export interface dxButtonGroupItem extends CollectionWidgetItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hint?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @type Enums.ButtonType
     * @default 'normal'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
}

export type Options = dxButtonGroupOptions;

/** @deprecated use Options instead */
export type IOptions = dxButtonGroupOptions;
