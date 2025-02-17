import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
    SimplifiedSearchMode,
} from '../../common';

import { DataSource } from '../../common/data';

import {
    EventInfo,
    NativeEventInfo,
    ItemInfo,
} from '../../common/core/events';

import {
    ValueChangedInfo,
} from '../editor/editor';

import {
    DataExpressionMixinOptions,
} from '../editor/ui.data_expression';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
} from './ui.drop_down_editor';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface SelectionChangedInfo<T = any> {
    /**
     * 
     */
    readonly selectedItem: T;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDropDownListOptions<TComponent> extends DataExpressionMixinOptions<TComponent>, dxDropDownEditorOptions<TComponent> {
    /**
     * Returns the value currently displayed by the UI component.
     */
    displayValue?: string | undefined;
    /**
     * Specifies a custom template for group captions.
     */
    groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether data items should be grouped.
     */
    grouped?: boolean;
    /**
     * The minimum number of characters that must be entered into the text box to begin a search. Applies only if searchEnabled is true.
     */
    minSearchLength?: number;
    /**
     * Specifies the text or HTML markup displayed by the UI component if the item collection is empty.
     */
    noDataText?: string;
    /**
     * A function that is executed when a list item is clicked or tapped.
     */
    onItemClick?: ((e: NativeEventInfo<TComponent, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo) => void);
    /**
     * A function that is executed when a list item is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: EventInfo<TComponent> & SelectionChangedInfo) => void);
    /**
     * A function that is executed after the UI component&apos;s value is changed.
     */
    onValueChanged?: ((e: NativeEventInfo<TComponent, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo) => void);
    /**
     * Specifies whether to allow search operations.
     */
    searchEnabled?: boolean;
    /**
     * Specifies the name of a data source item field or an expression whose value is compared to the search criterion.
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * Specifies a comparison operation used to search UI component items.
     */
    searchMode?: SimplifiedSearchMode;
    /**
     * Specifies the time delay, in milliseconds, after the last character has been typed in, before a search is executed.
     */
    searchTimeout?: number;
    /**
     * Gets the currently selected item.
     */
    selectedItem?: any;
    /**
     * Specifies whether or not the UI component displays unfiltered values until a user types a number of characters exceeding the minSearchLength property value.
     */
    showDataBeforeSearch?: boolean;
    /**
     * Specifies the currently selected value. May be an object if dataSource contains objects, the store key is specified, and valueExpr is not set.
     */
    value?: any;
    /**
     * Specifies the DOM events after which the UI component&apos;s value should be updated.
     */
    valueChangeEvent?: string;
    /**
     * Specifies whether text that exceeds the drop-down list width should be wrapped.
     */
    wrapItemText?: boolean;
    /**
     * Specifies whether the widget uses item&apos;s text a title attribute.
     */
    useItemTextAsTitle?: boolean;
}
/**
 * A base class for drop-down list UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class dxDropDownList<TProperties> extends dxDropDownEditor<TProperties> {
    getDataSource(): DataSource;
}
