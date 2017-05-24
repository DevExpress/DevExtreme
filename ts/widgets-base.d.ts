/// <reference path="core.d.ts" />

declare module DevExpress.ui {
    /** @docid_ignore template */

    export interface dxValidatorValidationAdapter {
        /** @docid dxValidatorOptions_adapter_getValue */
        getValue?: Function;

        /** @docid dxValidatorOptions_adapter_validationRequestsCallbacks */
        validationRequestsCallbacks?: JQueryCallback;

        /** @docid dxValidatorOptions_adapter_applyValidationResults */
        applyValidationResults?: (params: validationEngine.ValidatorValidationResult) => void;

        /** @docid dxValidatorOptions_adapter_reset */
        reset?: Function;

        /** @docid dxValidatorOptions_adapter_focus */
        focus?: Function;

        /** @docid dxValidatorOptions_adapter_bypass */
        bypass?: Function;
    }

    export interface dxValidatorOptions extends DOMComponentOptions {
        /** @docid dxValidatorOptions_validationRules */
        validationRules?: Array<any>;

        /** @docid dxValidatorOptions_name */
        name?: string;

        /** @docid dxValidatorOptions_adapter */
        adapter?: dxValidatorValidationAdapter;

        /** @docid dxValidatorOptions_validationGroup */
        validationGroup?: string;

        /** @docid dxValidatorOptions_onValidated */
        onValidated?: (params: validationEngine.ValidatorValidationResult) => void;
    }


    /** @docid dxValidator */
    export class dxValidator extends DOMComponent implements validationEngine.IValidator {
        constructor(element: JQuery, options?: dxValidatorOptions);
        constructor(element: Element, options?: dxValidatorOptions);

        /** @docid_ignore dxValidatorMethods_beginUpdate */
        /** @docid_ignore dxValidatorMethods_defaultOptions */
        /** @docid_ignore dxValidatorMethods_endUpdate */
        /** @docid_ignore dxValidatorOptions_rtlEnabled */

        /** @docid dxValidatorMethods_validate */
        validate(): validationEngine.ValidatorValidationResult;
        /** @docid dxValidatorMethods_reset */
        reset(): void;
        /** @docid dxValidatorMethods_focus */
        focus(): void;
    }

    export interface dxValidationGroupOptions extends DOMComponentOptions { }

    /** @docid dxValidationGroup */
    export class dxValidationGroup extends DOMComponent {
        constructor(element: JQuery, options?: dxValidationGroupOptions);
        constructor(element: Element, options?: dxValidationGroupOptions);

        /** @docid_ignore dxValidationGroupMethods_beginUpdate */
        /** @docid_ignore dxValidationGroupMethods_defaultOptions */
        /** @docid_ignore dxValidationGroupMethods_endUpdate */
        /** @docid_ignore dxValidationGroupOptions_rtlEnabled */

        /** @docid dxValidationGroupMethods_validate */
        validate(): validationEngine.ValidationGroupValidationResult;
        /** @docid dxValidationGroupMethods_reset */
        reset(): void;
    }

    export interface dxValidationSummaryOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxValidationSummaryOptions_focusStateEnabled */
        /** @docid_ignore dxValidationSummaryOptions_noDataText */
        /** @docid_ignore dxValidationSummaryOptions_itemRender */
        /** @docid_ignore dxValidationSummaryOptions_activeStateEnabled */
        /** @docid_ignore dxValidationSummaryOptions_dataSource */
        /** @docid_ignore dxValidationSummaryOptions_disabled */
        /** @docid_ignore dxValidationSummaryOptions_height */
        /** @docid_ignore dxValidationSummaryOptions_hint */
        /** @docid_ignore dxValidationSummaryOptions_itemHoldTimeout */
        /** @docid_ignore dxValidationSummaryOptions_onItemContextMenu */
        /** @docid_ignore dxValidationSummaryOptions_onItemHold */
        /** @docid_ignore dxValidationSummaryOptions_onItemRendered */
        /** @docid_ignore dxValidationSummaryOptions_onItemSelect */
        /** @docid_ignore dxValidationSummaryOptions_onSelectionChanged */
        /** @docid_ignore dxValidationSummaryOptions_rtlEnabled */
        /** @docid_ignore dxValidationSummaryOptions_selectedIndex */
        /** @docid_ignore dxValidationSummaryOptions_selectedItem */
        /** @docid_ignore dxValidationSummaryOptions_selectedItems */
        /** @docid_ignore dxValidationSummaryOptions_selectedItemKeys */
        /** @docid_ignore dxValidationSummaryOptions_keyExpr */
        /** @docid_ignore dxValidationSummaryOptions_visible */
        /** @docid_ignore dxValidationSummaryOptions_width */
        /** @docid_ignore dxValidationSummaryOptions_accessKey */
        /** @docid_ignore dxValidationSummaryOptions_tabIndex */

        /** @docid dxValidationSummaryOptions_validationGroup */
        validationGroup?: string;
    }

    /** @docid dxValidationSummary */
    export class dxValidationSummary extends CollectionWidget {
        constructor(element: JQuery, options?: dxValidationSummaryOptions);
        constructor(element: Element, options?: dxValidationSummaryOptions);

        /** @docid_ignore dxValidationSummaryMethods_registerKeyHandler */
        /** @docid_ignore dxValidationSummaryMethods_focus */

        /** @docid_ignore dxValidationSummaryMethods_getDataSource */
    }

    export interface dxResizableOptions extends DOMComponentOptions {
        /** @docid_ignore dxResizableOptions_stepPrecision */

        /** @docid dxResizableOptions_handles */
        handles?: string;

        /** @docid dxResizableOptions_minWidth */
        minWidth?: number;

        /** @docid dxResizableOptions_maxWidth */
        maxWidth?: number;

        /** @docid dxResizableOptions_minHeight */
        minHeight?: number;

        /** @docid dxResizableOptions_maxHeight */
        maxHeight?: number;

        /** @docid dxResizableOptions_onResizeStart */
        onResizeStart?: Function;

        /** @docid dxResizableOptions_onResize */
        onResize?: Function;

        /** @docid dxResizableOptions_onResizeEnd */
        onResizeEnd?: Function;
    }

    /** @docid dxResizable */
    export class dxResizable extends DOMComponent {
        constructor(element: JQuery, options?: dxResizableOptions);
        constructor(element: Element, options?: dxResizableOptions);
    }

    export interface dxTooltipOptions extends dxPopoverOptions {
        /** @docid_ignore dxTooltipOptions_showtitle*/
        /** @docid_ignore dxTooltipOptions_title*/
        /** @docid_ignore dxTooltipOptions_titleTemplate */
        /** @docid_ignore dxTooltipOptions_toolbarItems*/
        /** @docid_ignore dxTooltipOptions_showCloseButton*/
        /** @docid_ignore dxTooltipOptions_onTitleRendered */
    }

    /** @docid dxTooltip */
    export class dxTooltip extends dxPopover {
        constructor(element: JQuery, options?: dxTooltipOptions);
        constructor(element: Element, options?: dxTooltipOptions);
    }

    export interface dxDropDownListOptions extends dxDropDownEditorOptions, DataExpressionMixinOptions {
        /** @docid_ignore dxDropDownListOptions_fieldTemplate*/
        /** @docid_ignore dxDropDownListOptions_fieldRender*/
        /** @docid_ignore dxDropDownListOptions_contentTemplate*/
        /** @docid_ignore dxDropDownListOptions_contentRender*/
        /** @docid_ignore dxDropDownListOptions_applyValueMode*/
        /** @docid_ignore dxDropDownListOptions_value*/

        /** @docid dxDropDownListOptions_displayValue */
        displayValue?: string;

        /** @docid dxDropDownListOptions_minSearchLength */
        minSearchLength?: number;

        /** @docid dxDropDownListOptions_showDataBeforeSearch */
        showDataBeforeSearch?: boolean;

        /** @docid dxDropDownListOptions_searchExpr */
        searchExpr?: any;

        /** @docid dxDropDownListOptions_searchMode */
        searchMode?: string;

        /** @docid dxDropDownListOptions_searchTimeout */
        searchTimeout?: number;

        /** @docid dxDropDownListOptions_onValueChanged */
        onValueChanged?: Function;

        /** @docid dxDropDownListOptions_valueChangeEvent */
        valueChangeEvent?: string;

        /** @docid dxDropDownListOptions_searchEnabled */
        searchEnabled?: boolean;

        /** @docid dxDropDownListOptions_pagingEnabled */
        pagingEnabled?: boolean;

        /** @docid dxDropDownListOptions_noDataText */
        noDataText?: string;

        /** @docid dxDropDownListOptions_onSelectionChanged */
        onSelectionChanged?: Function;

        /** @docid dxDropDownListOptions_onItemClick */
        onItemClick?: Function;

        /** @docid dxDropDownListOptions_onContentReady */
        onContentReady?: Function;
    }

    /** @docid dxDropDownList */
    export class dxDropDownList extends dxDropDownEditor implements DataHelperMixin  {
        constructor(element: JQuery, options?: dxDropDownListOptions);
        constructor(element: Element, options?: dxDropDownListOptions);

        getDataSource(): DevExpress.data.DataSource;
    }

    export interface dxToolbarOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxToolbarOptions_activeStateEnabled */
        /** @docid_ignore dxToolbarOptions_selectedIndex */
        /** @docid_ignore dxToolbarOptions_selectedItem */
        /** @docid_ignore dxToolbarOptions_selectedItems */
        /** @docid_ignore dxToolbarOptions_selectedItemKeys */
        /** @docid_ignore dxToolbarOptions_keyExpr */
        /** @docid_ignore dxToolbarOptions_submenuType */
        /** @docid_ignore dxToolbarOptions_onSelectionChanged */
        /** @docid_ignore dxToolbarOptions_focusStateEnabled */
        /** @docid_ignore dxToolbarOptions_accessKey */
        /** @docid_ignore dxToolbarOptions_tabIndex */

        /** @docid dxToolbarOptions_menuItemTemplate */
        menuItemTemplate?: any;

        /** @docid dxToolbarOptions_renderAs */
        renderAs?: string;
    }

    /** @docid dxToolbar */
    export class dxToolbar extends CollectionWidget {
        constructor(element: JQuery, options?: dxToolbarOptions);
        constructor(element: Element, options?: dxToolbarOptions);

        /** @docid_ignore dxToolbarItemTemplate_location */
        /** @docid_ignore dxToolbarItemTemplate_locateInMenu */
        /** @docid_ignore dxToolbarItemTemplate_showText */
        /** @docid_ignore dxToolbarItemTemplate_menuItemTemplate */
        /** @docid_ignore dxToolbarItemTemplate_options */
        /** @docid_ignore dxToolbarItemTemplate_widget */

        /** @docid_ignore dxToolbarMethods_registerKeyHandler */
        /** @docid_ignore dxToolbarMethods_focus */
    }

    export interface dxToastOptions extends dxOverlayOptions {
        /** @docid_ignore dxToastOptions_disabled */
        /** @docid_ignore dxToastOptions_dragEnabled */
        /** @docid_ignore dxToastOptions_resizeEnabled */
        /** @docid_ignore dxToastOptions_closeOnOutsideClick */

        /** @docid dxToastOptions_animation */
        animation?: {
            /** @docid dxToastOptions_animation_show */
            show?: fx.AnimationOptions;

            /** @docid dxToastOptions_animation_hide */
            hide?: fx.AnimationOptions;
        };

        /** @docid dxToastOptions_displaytime */
        displayTime?: number;

        /** @docid dxToastOptions_height */
        height?: any;

        /** @docid dxToastOptions_message */
        message?: string;

        /** @docid dxToastOptions_position */
        position?: PositionOptions;

        /** @docid dxToastOptions_shading */
        shading?: boolean;

        /** @docid dxToastOptions_type */
        type?: string;

        /** @docid dxToastOptions_width */
        width?: any;

        /** @docid dxToastOptions_closeOnBackButton */
        closeOnBackButton?: boolean;

        /** @docid dxToastOptions_closeOnSwipe */
        closeOnSwipe?: boolean;

        /** @docid dxToastOptions_closeOnClick */
        closeOnClick?: boolean;
    }

    /** @docid dxToast */
    export class dxToast extends dxOverlay {
        constructor(element: JQuery, options?: dxToastOptions);
        constructor(element: Element, options?: dxToastOptions);
    }

    export interface dxTextEditorOptions extends EditorOptions {
        /** @docid dxTextEditorOptions_onChange */
        onChange?: Function;

        /** @docid dxTextEditorOptions_onCopy */
        onCopy?: Function;

        /** @docid dxTextEditorOptions_onCut */
        onCut?: Function;

        /** @docid dxTextEditorOptions_onEnterKey */
        onEnterKey?: Function;

        /** @docid dxTextEditorOptions_onFocusIn */
        onFocusIn?: Function;

        /** @docid dxTextEditorOptions_onFocusOut */
        onFocusOut?: Function;

        /** @docid dxTextEditorOptions_onInput */
        onInput?: Function;

        /** @docid dxTextEditorOptions_onKeyDown */
        onKeyDown?: Function;

        /** @docid dxTextEditorOptions_onKeyPress */
        onKeyPress?: Function;

        /** @docid dxTextEditorOptions_onKeyUp */
        onKeyUp?: Function;

        /** @docid dxTextEditorOptions_onPaste */
        onPaste?: Function;

        /** @docid dxTextEditorOptions_placeholder */
        placeholder?: string;

        /** @docid dxTextEditorOptions_showClearButton */
        showClearButton?: boolean;

        /** @docid dxTextEditorOptions_value */
        value?: any;

        /** @docid dxTextEditorOptions_valueChangeEvent */
        valueChangeEvent?: string;

        /** @docid dxTextEditorOptions_spellcheck */
        spellcheck?: boolean;

        /** @docid dxTextEditorOptions_attr */
        attr?: Object;

        /** @docid dxTextEditorOptions_inputAttr */
        inputAttr?: Object;

        /** @docid dxTextEditorOptions_text */
        text?: string;

        /** @docid dxTextEditorOptions_focusStateEnabled */
        focusStateEnabled?: boolean;

        /** @docid dxTextEditorOptions_hoverStateEnabled */
        hoverStateEnabled?: boolean;

        /** @docid dxTextEditorOptions_mask */
        mask?: string;

        /** @docid dxTextEditorOptions_maskChar */
        maskChar?: string;

        /** @docid dxTextEditorOptions_maskRules */
        maskRules?: Object;

        /** @docid dxTextEditorOptions_maskInvalidMessage */
        maskInvalidMessage?: string;

        /** @docid dxTextEditorOptions_useMaskedValue */
        useMaskedValue?: boolean;

        /** @docid dxTextEditorOptions_name */
        name?: string;
    }

    /** @docid dxTextEditor */
    export class dxTextEditor extends Editor {
        constructor(element: JQuery, options?: dxTextEditorOptions);
        constructor(element: Element, options?: dxTextEditorOptions);

        /** @docid dxTextEditorMethods_blur */
        blur(): void;

        /** @docid dxTextEditorMethods_focus */
        focus(): void;
    }

    export interface dxTextBoxOptions extends dxTextEditorOptions {
        /** @docid dxTextBoxOptions_maxlength */
        maxLength?: any;

        /** @docid dxTextBoxOptions_mode */
        mode?: string;
    }

    /** @docid dxTextbox */
    export class dxTextBox extends dxTextEditor {
        constructor(element: JQuery, options?: dxTextBoxOptions);
        constructor(element: Element, options?: dxTextBoxOptions);
    }

    export interface dxTextAreaOptions extends dxTextBoxOptions {
        /** @docid_ignore dxTextAreaOptions_mode */
        /** @docid_ignore dxTextAreaOptions_showClearButton */
        /** @docid_ignore dxTextAreaOptions_mask */
        /** @docid_ignore dxTextAreaOptions_maskChar */
        /** @docid_ignore dxTextAreaOptions_maskRules */
        /** @docid_ignore dxTextAreaOptions_maskInvalidMessage */
        /** @docid_ignore dxTextAreaOptions_useMaskedValue */

        /** @docid dxTextAreaOptions_spellcheck */
        spellcheck?: boolean;

        /** @docid dxTextAreaOptions_minHeight */
        minHeight?: any;

        /** @docid dxTextAreaOptions_maxHeight */
        maxHeight?: any;

        /** @docid dxTextAreaOptions_autoResizeEnabled */
        autoResizeEnabled?: boolean;
    }

    /** @docid dxTextArea */
    export class dxTextArea extends dxTextBox {
        constructor(element: JQuery, options?: dxTextAreaOptions);
        constructor(element: Element, options?: dxTextAreaOptions);
    }

    export interface dxTabsOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxTabsOptions_activeStateEnabled*/
        /** @docid_ignore dxTabsOptions_noDataText */
        /** @docid_ignore dxTabsOptions_selectedItems */
        /** @docid_ignore dxTabsOptions_hoverStateEnabled */
        /** @docid_ignore dxTabsOptions_focusStateEnabled */

        /** @docid dxTabsOptions_selectionMode */
        selectionMode?: string;

        /** @docid dxTabsOptions_scrollByContent */
        scrollByContent?: boolean;

        /** @docid dxTabsOptions_scrollingEnabled */
        scrollingEnabled?: boolean;

        /** @docid dxTabsOptions_showNavButtons */
        showNavButtons?: boolean;
    }

    /** @docid dxTabs */
    export class dxTabs extends CollectionWidget {
        constructor(element: JQuery, options?: dxTabsOptions);
        constructor(element: Element, options?: dxTabsOptions);

        /** @docid_ignore dxTabsItemTemplate_icon */
        /** @docid_ignore dxTabsItemTemplate_iconSrc */
        /** @docid_ignore dxTabsItemTemplate_badge */
    }

    export interface dxTabPanelOptions extends dxMultiViewOptions {
        /** @docid_ignore dxTabPanelItemTemplate_title */
        /** @docid_ignore dxTabPanelOptions_animationEnabled */
        /** @docid_ignore dxTabPanelOptions_hoverStateEnabled */
        /** @docid_ignore dxTabPanelOptions_focusStateEnabled */
        /** @docid_ignore dxTabPanelOptions_swipeEnabled */

        /** @docid dxTabPanelOptions_onTitleClick */
        onTitleClick?: any;

        /** @docid dxTabPanelOptions_onTitleHold */
        onTitleHold?: Function;

        /** @docid dxTabPanelOptions_onTitleRendered */
        onTitleRendered?: Function;

        /** @docid dxTabPanelOptions_itemTitleTemplate */
        itemTitleTemplate?: any;

        /** @docid dxTabPanelOptions_scrollByContent */
        scrollByContent?: boolean;

        /** @docid dxTabPanelOptions_scrollingEnabled */
        scrollingEnabled?: boolean;

        /** @docid dxTabPanelOptions_showNavButtons */
        showNavButtons?: boolean;
    }

    /** @docid dxTabPanel */
    export class dxTabPanel extends dxMultiView {
        constructor(element: JQuery, options?: dxTabPanelOptions);
        constructor(element: Element, options?: dxTabPanelOptions);

        /** @docid_ignore dxTabPanelItemTemplate_icon */
        /** @docid_ignore dxTabPanelItemTemplate_iconSrc */
        /** @docid_ignore dxTabPanelItemTemplate_badge */
        /** @docid_ignore dxTabPanelItemTemplate_visible */
        /** @docid_ignore dxTabPanelItemTemplate_tabtemplate */
    }

    export interface dxSelectBoxOptions extends dxDropDownListOptions {
        /** @docid_ignore dxSelectBoxOptions_autocompletionEnabled */
        /** @docid_ignore dxSelectBoxOptions_allowClearing */

        /** @docid dxSelectBoxOptions_valueChangeEvent */
        valueChangeEvent?: string;

        /** @docid dxSelectBoxOptions_fieldTemplate */
        fieldTemplate?: any;

        /** @docid dxSelectBoxOptions_placeholder */
        placeholder?: string;

        /** @docid dxSelectBoxOptions_acceptCustomValue */
        acceptCustomValue?: boolean;

        /** @docid dxSelectBoxOptions_showSelectionControls */
        showSelectionControls?: boolean;

        /** @docid dxSelectBoxOptions_onCustomItemCreating */
        onCustomItemCreating?: Function;
    }

    /** @docid dxSelectbox */
    export class dxSelectBox extends dxDropDownList {
        constructor(element: JQuery, options?: dxSelectBoxOptions);
        constructor(element: Element, options?: dxSelectBoxOptions);
    }

    export interface dxTagBoxOptions extends dxSelectBoxOptions {
        /** @docid_ignore dxTagBoxOptions_closeAction */
        /** @docid_ignore dxTagBoxOptions_hiddenAction */
        /** @docid_ignore dxTagBoxOptions_itemRender */
        /** @docid_ignore dxTagBoxOptions_openAction */
        /** @docid_ignore dxTagBoxOptions_shownAction */
        /** @docid_ignore dxTagBoxOptions_maxLength */
        /** @docid_ignore dxTagBoxOptions_onCopy */
        /** @docid_ignore dxTagBoxOptions_onCut */
        /** @docid_ignore dxTagBoxOptions_onPaste */
        /** @docid_ignore dxTagBoxOptions_spellcheck */
        /** @docid_ignore dxTagBoxOptions_displayValue */
        /** @docid_ignore dxTagBoxOptions_valueChangeEvent */
        /** @docid_ignore dxTagBoxOptions_selectedItem */

        /** @docid dxTagBoxOptions_values */
        values?: Array<any>;

        /** @docid dxTagBoxOptions_value */
        value?: Array<any>;

        /** @docid dxTagBoxOptions_selectedItems */
        selectedItems?: Array<any>;

        /** @docid dxTagBoxOptions_applyValueMode */
        applyValueMode?: string;

        /** @docid dxTagBoxOptions_hideSelectedItems */
        hideSelectedItems?: boolean;

        /** @docid dxTagBoxOptions_selectAllMode */
        selectAllMode?: string;

        /** @docid dxTagBoxOptions_onSelectAllValueChanged */
        onSelectAllValueChanged?: Function;

        /** @docid dxTagBoxOptions_multiline */
        multiline?: boolean;

        /** @docid dxTagBoxOptions_onSelectionChanged */
        onSelectionChanged?: Function;

        /** @docid dxTagBoxOptions_tagTemplate */
        tagTemplate?: any;
    }

    /** @docid dxTagBox */
    export class dxTagBox extends dxSelectBox {
        constructor(element: JQuery, options?: dxTagBoxOptions);
        constructor(element: Element, options?: dxTagBoxOptions);
    }

    export interface dxScrollViewOptions extends dxScrollableOptions {
        /** @docid dxScrollViewOptions_onPullDown */
        onPullDown?: Function;

        /** @docid dxScrollViewOptions_pulledDownText */
        pulledDownText?: string;

        /** @docid dxScrollViewOptions_pullingDownText */
        pullingDownText?: string;

        /** @docid dxScrollViewOptions_onReachBottom */
        onReachBottom?: Function;

        /** @docid dxScrollViewOptions_reachBottomText */
        reachBottomText?: string;

        /** @docid dxScrollViewOptions_refreshingText */
        refreshingText?: string;
    }

    /** @docid dxscrollview */
    export class dxScrollView extends dxScrollable {
        constructor(element: JQuery, options?: dxScrollViewOptions);
        constructor(element: Element, options?: dxScrollViewOptions);

        /** @docid dxscrollviewmethods_isFull */
        isFull(): boolean;

        /** @docid dxscrollviewmethods_refresh */
        refresh(): void;

        /** @docid dxscrollviewmethods_release */
        release(preventScrollBottom: boolean): JQueryPromise<void>;

        /** @docid dxscrollviewmethods_toggleLoading */
        toggleLoading(showOrHide: boolean): void;
    }

    export interface dxScrollableLocation {
        top?: number;
        left?: number;
    }

    export interface dxScrollableOptions extends DOMComponentOptions {
        /** @docid dxScrollableOptions_direction */
        direction?: string;

        /** @docid dxScrollableOptions_disabled */
        disabled?: boolean;

        /** @docid dxScrollableOptions_onScroll */
        onScroll?: Function;

        /** @docid dxScrollableOptions_showScrollbar */
        showScrollbar?: string;

        /** @docid dxScrollableOptions_onUpdated */
        onUpdated?: Function;

        /** @docid dxScrollableOptions_useNative */
        useNative?: boolean;

        /** @docid dxScrollableOptions_bounceEnabled */
        bounceEnabled?: boolean;

        /** @docid dxScrollableOptions_scrollByContent */
        scrollByContent?: boolean;

        /** @docid dxScrollableOptions_scrollByThumb */
        scrollByThumb?: boolean;
    }

    /** @docid dxscrollable */
    export class dxScrollable extends DOMComponent {
        constructor(element: JQuery, options?: dxScrollableOptions);
        constructor(element: Element, options?: dxScrollableOptions);

        /** @docid dxscrollablemethods_clientHeight */
        clientHeight(): number;

        /** @docid dxscrollablemethods_clientWidth */
        clientWidth(): number;

        /** @docid dxscrollablemethods_content */
        content(): JQuery;

        /** @docid dxscrollablemethods_scrollBy#scrollBy(distance) */
        scrollBy(distance: number): void;

        /** @docid dxscrollablemethods_scrollBy#scrollBy(distanceObject) */
        scrollBy(distanceObject: dxScrollableLocation): void;

        /** @docid dxscrollablemethods_scrollHeight */
        scrollHeight(): number;

        /** @docid dxscrollablemethods_scrollLeft */
        scrollLeft(): number;

        /** @docid dxscrollablemethods_scrollOffset */
        scrollOffset(): dxScrollableLocation;

        /** @docid dxscrollablemethods_scrollTo#scrollTo(targetLocation) */
        scrollTo(targetLocation: number): void;

        /** @docid dxscrollablemethods_scrollTo#scrollTo(targetLocationObject) */
        scrollTo(targetLocation: dxScrollableLocation): void;

        /** @docid dxscrollablemethods_scrollToElement */
        scrollToElement(element: Element): void;

        /** @docid dxscrollablemethods_scrollTop */
        scrollTop(): number;

        /** @docid dxscrollablemethods_scrollWidth */
        scrollWidth(): number;

        /** @docid dxscrollablemethods_update */
        update(): void;
    }

    export interface dxRadioGroupOptions extends EditorOptions, DataExpressionMixinOptions {
        /** @docid_ignore dxRadioGroupOptions_hoverStateEnabled */
        /** @docid_ignore dxRadioGroupOptions_focusStateEnabled */
        /** @docid_ignore dxRadioGroupOptions_value */

        /** @docid dxRadioGroupOptions_activeStateEnabled */
        activeStateEnabled?: boolean;

        /** @docid dxRadioGroupOptions_layout */
        layout?: string;

        /** @docid dxRadioGroupOptions_name */
        name?: string;
    }

    /** @docid_ignore dxRadioButton */
    /** @docid dxRadioGroup */
    export class dxRadioGroup extends CollectionWidget {
        constructor(element: JQuery, options?: dxRadioGroupOptions);
        constructor(element: Element, options?: dxRadioGroupOptions);
    }

    export interface dxPopupToolbarItemOptions {
        /** @docid dxPopupOptions_toolbarItems_disabled */
        disabled?: boolean;

        /** @docid dxPopupOptions_toolbarItems_html */
        html?: string;

        /** @docid dxPopupOptions_toolbarItems_location */
        location?: string;

        /** @docid dxPopupOptions_toolbarItems_options */
        options?: Object;

        /** @docid dxPopupOptions_toolbarItems_template */
        template?: any;

        /** @docid dxPopupOptions_toolbarItems_text */
        text?: string;

        /** @docid dxPopupOptions_toolbarItems_toolbar */
        toolbar?: string;

        /** @docid dxPopupOptions_toolbarItems_visible */
        visible?: boolean;

        /** @docid dxPopupOptions_toolbarItems_widget */
        widget?: string;
    }

    export interface dxPopupOptions extends dxOverlayOptions {
        /** @docid_ignore dxPopupOptions_focusStateEnabled * /
        /** @docid_ignore dxPopupOptions_animation */
        /** @docid_ignore dxPopupOptions_animation_show */
        /** @docid_ignore dxPopupOptions_animation_hide */

        /** @docid dxPopupOptions_dragEnabled */
        dragEnabled?: boolean;

        /** @docid dxPopupOptions_resizeEnabled */
        resizeEnabled?: boolean;

        /** @docid dxPopupOptions_onResizeStart */
        onResizeStart?: Function;

        /** @docid dxPopupOptions_onResize */
        onResize?: Function;

        /** @docid dxPopupOptions_onResizeEnd */
        onResizeEnd?: Function;

        /** @docid dxPopupOptions_fullScreen */
        fullScreen?: boolean;

        /** @docid dxPopupOptions_position */
        position?: PositionOptions;

        /** @docid dxPopupOptions_showtitle */
        showTitle?: boolean;

        /** @docid dxPopupOptions_title */
        title?: string;

        /** @docid dxPopupOptions_titleTemplate */
        titleTemplate?: any;

        /** @docid dxPopupOptions_width */
        width?: any;

        /** @docid_ignore dxPopupOptions_buttons */

        /** @docid dxPopupOptions_toolbarItems */
        toolbarItems?: Array<dxPopupToolbarItemOptions>;

        /** @docid dxPopupOptions_showCloseButton */
        showCloseButton?: boolean;

        /** @docid dxPopupOptions_onTitleRendered */
        onTitleRendered?: Function;
    }

    /** @docid dxPopup */
    export class dxPopup extends dxOverlay {
        constructor(element: JQuery, options?: dxPopupOptions);
        constructor(element: Element, options?: dxPopupOptions);
    }

    export interface dxPopoverOptions extends dxPopupOptions {
        /** @docid_ignore dxPopoverOptions_closeOnOutsideClick*/
        /** @docid_ignore dxPopoverOptions_dragEnabled*/
        /** @docid_ignore dxPopoverOptions_resizeEnabled*/
        /** @docid_ignore dxPopoverOptions_onResizeStart*/
        /** @docid_ignore dxPopoverOptions_onResize*/
        /** @docid_ignore dxPopoverOptions_onResizeEnd*/
        /** @docid_ignore dxPopoverOptions_fullScreen*/
        /** @docid_ignore dxPopoverOptions_focusStateEnabled */
        /** @docid_ignore dxPopoverOptions_accessKey */
        /** @docid_ignore dxPopoverOptions_tabIndex */

        /** @docid dxPopoverOptions_animation */
        animation?: {
            /** @docid dxPopoverOptions_animation_show */
            show?: fx.AnimationOptions;

            /** @docid dxPopoverOptions_animation_hide */
            hide?: fx.AnimationOptions;
        };

        /** @docid dxPopoverOptions_height */
        height?: any;

        /** @docid dxPopoverOptions_position */
        position?: PositionOptions;

        /** @docid dxPopoverOptions_shading */
        shading?: boolean;

        /** @docid dxPopoverOptions_showtitle */
        showTitle?: boolean;

        /** @docid dxPopoverOptions_target */
        target?: any;

        /** @docid dxPopoverOptions_width */
        width?: any;

        /** @docid dxPopoverOptions_showEvent */
        showEvent?: {
        /** @docid dxPopoverOptions_showEvent_name */
            name?: String;

            /** @docid dxPopoverOptions_showEvent_delay */
            delay?: Number;
        };

        /** @docid dxPopoverOptions_hideEvent */
        hideEvent?: {
        /** @docid dxPopoverOptions_hideEvent_name */
            name?: String;

            /** @docid dxPopoverOptions_hideEvent_delay */
            delay?: Number;
        };
    }

    /** @docid dxPopover */
    export class dxPopover extends dxPopup {
        constructor(element: JQuery, options?: dxPopoverOptions);
        constructor(element: Element, options?: dxPopoverOptions);

        /** @docid dxPopoverMethods_show */
        show(target?: any): JQueryPromise<void>;

        /** @docid_ignore dxPopoverMethods_registerKeyHandler */
        /** @docid_ignore dxPopoverMethods_focus */
    }

    export interface dxOverlayOptions extends WidgetOptions {
        /** @docid_ignore dxOverlayOptions_activeStateEnabled*/

        /** @docid dxOverlayOptions_animation */
        animation?: {
            /** @docid dxOverlayOptions_animation_show */
            show?: fx.AnimationOptions;

            /** @docid dxOverlayOptions_animation_hide */
            hide?: fx.AnimationOptions;
        };

        /** @docid dxOverlayOptions_closeOnBackButton */
        closeOnBackButton?: boolean;

        /** @docid dxOverlayOptions_closeOnOutsideClick */
        closeOnOutsideClick?: any;

        /** @docid dxOverlayOptions_contentTemplate */
        contentTemplate?: any;

        /** @docid dxOverlayOptions_deferRendering */
        deferRendering?: boolean;

        /** @docid dxOverlayOptions_dragEnabled */
        dragEnabled?: boolean;

        /** @docid dxOverlayOptions_height */
        height?: any;

        /** @docid dxOverlayOptions_maxHeight */
        maxHeight?: any;

        /** @docid dxOverlayOptions_maxWidth */
        maxWidth?: any;

        /** @docid dxOverlayOptions_minHeight */
        minHeight?: any;

        /** @docid dxOverlayOptions_minWidth */
        minWidth?: any;

        /** @docid dxOverlayOptions_onHidden */
        onHidden?: Function;

        /** @docid dxOverlayOptions_onHiding */
        onHiding?: Function;

        /** @docid dxOverlayOptions_position */
        position?: PositionOptions;

        /** @docid dxOverlayOptions_shading */
        shading?: boolean;

        /** @docid dxOverlayOptions_shadingColor */
        shadingColor?: string;

        /** @docid dxOverlayOptions_onShowing */
        onShowing?: Function;

        /** @docid dxOverlayOptions_onShown */
        onShown?: Function;

        /** @docid dxOverlayOptions_onContentReady */
        onContentReady?: Function;

        /** @docid dxOverlayOptions_visible */
        visible?: boolean;

        /** @docid dxOverlayOptions_width */
        width?: any;
    }

    /** @docid dxOverlay */
    export class dxOverlay extends Widget {
        constructor(element: JQuery, options?: dxOverlayOptions);
        constructor(element: Element, options?: dxOverlayOptions);

        /** @docid dxOverlaymethods_content */
        content(): JQuery;

        /** @docid dxOverlaymethods_hide */
        hide(): JQueryPromise<void>;

        /** @docid dxOverlaymethods_repaint */
        repaint(): void;

        /** @docid dxOverlaymethods_show */
        show(): JQueryPromise<void>;

        /** @docid dxOverlaymethods_toggle */
        toggle(showing: boolean): JQueryPromise<void>;

        /** @docid ui_dxOverlay */
        /** @docid ui_dxOverlayMethods_baseZIndex */
        static baseZIndex(zIndex: number): void;
    }

    export interface dxNumberBoxOptions extends dxTextEditorOptions {
        /** @docid_ignore dxNumberBoxOptions_mask */
        /** @docid_ignore dxNumberBoxOptions_maskChar */
        /** @docid_ignore dxNumberBoxOptions_maskRules */
        /** @docid_ignore dxNumberBoxOptions_maskInvalidMessage */
        /** @docid_ignore dxNumberBoxOptions_useMaskedValue */
        /** @docid_ignore dxNumberBoxOptions_spellcheck */

        /** @docid dxNumberBoxOptions_max */
        max?: number;

        /** @docid dxNumberBoxOptions_min */
        min?: number;

        /** @docid dxNumberBoxOptions_showSpinButtons */
        showSpinButtons?: boolean;

        /** @docid dxNumberBoxOptions_useTouchSpinButtons */
        useTouchSpinButtons?: boolean;

        /** @docid dxNumberBoxOptions_step */
        step?: number;

        /** @docid dxNumberBoxOptions_value */
        value?: number;

        /** @docid dxNumberBoxOptions_mode */
        mode?: string;

        /** @docid dxNumberBoxOptions_invalidValueMessage */
        invalidValueMessage?: string;
    }

    /** @docid dxNumberBox */
    export class dxNumberBox extends dxTextEditor {
        constructor(element: JQuery, options?: dxNumberBoxOptions);
        constructor(element: Element, options?: dxNumberBoxOptions);
    }

    export interface dxNavBarOptions extends dxTabsOptions {
        /** @docid dxNavBarOptions_scrollingEnabled */
        scrollingEnabled?: boolean;

        /** @docid_ignore dxNavBarOptions_showNavButtons */
        /** @docid_ignore dxNavBarOptions_scrollByContent */
    }

    /** @docid dxNavBar */
    export class dxNavBar extends dxTabs {
        constructor(element: JQuery, options?: dxNavBarOptions);
        constructor(element: Element, options?: dxNavBarOptions);

        /** @docid_ignore dxNavBarItemTemplate_badge */
    }

    export interface dxMultiViewOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxMultiViewOptions_noDataText */
        /** @docid_ignore dxMultiViewOptions_selectedItems */
        /** @docid_ignore dxMultiViewOptions_selectedItemKeys */
        /** @docid_ignore dxMultiViewOptions_keyExpr */
        /** @docid_ignore dxMultiViewOptions_focusStateEnabled */

        /** @docid dxMultiViewOptions_animationenabled */
        animationEnabled?: boolean;

        /** @docid dxMultiViewOptions_loop */
        loop?: boolean;

        /** @docid dxMultiViewOptions_selectedIndex */
        selectedIndex?: number;

        /** @docid dxMultiViewOptions_swipeenabled */
        swipeEnabled?: boolean;

        /** @docid dxMultiViewOptions_deferRendering */
        deferRendering?: boolean;
    }

    /** @docid dxMultiView */
    export class dxMultiView extends CollectionWidget {
        constructor(element: JQuery, options?: dxMultiViewOptions);
        constructor(element: Element, options?: dxMultiViewOptions);

        /** @docid_ignore dxMultiViewItemTemplate_visible */
    }

    /** @docid MapLocation */
    export interface dxMapLocation {
        /** @docid MapLocation_lat */
        lat?: number;

        /** @docid MapLocation_lng */
        lng?: number;
    }

    export interface dxMapMarker {
        /** @docid dxMapOptions_markers_iconSrc */
        iconSrc?: string;

        /** @docid dxMapOptions_markers_location */
        location?: dxMapLocation;

        /** @docid dxMapOptions_markers_onClick */
        onClick?: Function;

        /** @docid dxMapOptions_markers_tooltip */
        tooltip?: {
            /** @docid dxMapOptions_markers_tooltip_isShown */
            isShown?: boolean;

            /** @docid dxMapOptions_markers_tooltip_text */
            text?: string;
        }
    }

    export interface dxMapRoute {
        /** @docid dxMapOptions_routes_color */
        color?: string;

        /** @docid dxMapOptions_routes_mode */
        mode?: string;

        /** @docid dxMapOptions_routes_opacity */
        opacity?: number;

        /** @docid dxMapOptions_routes_locations */
        locations?: Array<dxMapLocation>;

        /** @docid dxMapOptions_routes_weight */
        weight?: number;
    }

    export interface dxMapOptions extends WidgetOptions {
        /** @docid dxMapOptions_autoAdjust */
        autoAdjust?: boolean;

        /** @docid_ignore dxMapOptions_bounds */
        /** @docid_ignore dxMapOptions_bounds_northEast */
        /** @docid_ignore dxMapOptions_bounds_northEast_lat */
        /** @docid_ignore dxMapOptions_bounds_northEast_lng */
        /** @docid_ignore dxMapOptions_bounds_southWest */
        /** @docid_ignore dxMapOptions_bounds_southWest_lat */
        /** @docid_ignore dxMapOptions_bounds_southWest_lng */
        /** @docid_ignore dxMapOptions_focusStateEnabled  * /

        /** @docid dxMapOptions_center */
        center?: dxMapLocation;

        /** @docid dxMapOptions_onClick */
        onClick?: any;

        /** @docid dxMapOptions_controls */
        controls?: boolean;

        /** @docid dxMapOptions_height */
        height?: any;

        /** @docid dxMapOptions_key */
        key?: {
            /** @docid dxMapOptions_key_bing */
            bing?: string;

            /** @docid dxMapOptions_key_google */
            google?: string;

            /** @docid dxMapOptions_key_googleStatic */
            googleStatic?: string;
        }

        /** @docid dxMapOptions_onMarkerAdded */
        onMarkerAdded?: Function;

        /** @docid dxMapOptions_markerIconSrc */
        markerIconSrc?: string;

        /** @docid dxMapOptions_onMarkerRemoved */
        onMarkerRemoved?: Function;

        /** @docid dxMapOptions_markers */
        markers?: Array<dxMapMarker>;

        /** @docid dxMapOptions_provider */
        provider?: string;

        /** @docid dxMapOptions_onReady */
        onReady?: Function;

        /** @docid dxMapOptions_onRouteAdded */
        onRouteAdded?: Function;

        /** @docid dxMapOptions_onRouteRemoved */
        onRouteRemoved?: Function;

        /** @docid dxMapOptions_routes */
        routes?: Array<dxMapRoute>;

        /** @docid dxMapOptions_type */
        type?: string;

        /** @docid dxMapOptions_width */
        width?: any;

        /** @docid dxMapOptions_zoom */
        zoom?: number;
    }

    /** @docid dxmap */
    export class dxMap extends Widget {
        constructor(element: JQuery, options?: dxMapOptions);
        constructor(element: Element, options?: dxMapOptions);

        /** @docid dxmapmethods_addmarker */
        addMarker(markerOptions: Object): JQueryPromise<Object>;

        /** @docid dxmapmethods_addroute */
        addRoute(routeOptions: Object): JQueryPromise<Object>;

        /** @docid dxmapmethods_removemarker */
        removeMarker(marker: Object): JQueryPromise<void>;

        /** @docid dxmapmethods_removeroute */
        removeRoute(route: any): JQueryPromise<void>;
    }

    export interface dxLookupOptions extends dxDropDownListOptions {
        /** @docid_ignore dxLookupOptions_onChange*/
        /** @docid_ignore dxLookupOptions_onCopy*/
        /** @docid_ignore dxLookupOptions_onCut*/
        /** @docid_ignore dxLookupOptions_onEnterKey*/
        /** @docid_ignore dxLookupOptions_onFocusIn*/
        /** @docid_ignore dxLookupOptions_onFocusOut*/
        /** @docid_ignore dxLookupOptions_onInput*/
        /** @docid_ignore dxLookupOptions_onKeyDown*/
        /** @docid_ignore dxLookupOptions_onKeyPress*/
        /** @docid_ignore dxLookupOptions_onKeyUp*/
        /** @docid_ignore dxLookupOptions_maxlength*/
        /** @docid_ignore dxLookupOptions_showClearButton*/
        /** @docid_ignore dxLookupOptions_onPaste*/
        /** @docid_ignore dxLookupOptions_readOnly*/
        /** @docid_ignore dxLookupOptions_pagingEnabled */
        /** @docid_ignore dxLookupOptions_fieldEditEnabled */
        /** @docid_ignore dxLookupOptions_acceptCustomValue */
        /** @docid_ignore dxLookupOptions_spellcheck */

        /** @docid dxLookupOptions_applyValueMode */
        applyValueMode?: string;

        /** @docid dxLookupOptions_animation */
        animation?: {
            /** @docid dxLookupOptions_animation_show */
            show?: fx.AnimationOptions;
            /** @docid dxLookupOptions_animation_hide */
            hide?: fx.AnimationOptions;
        };

        /** @docid dxLookupOptions_cancelButtonText */
        cancelButtonText?: string;

        /** @docid dxLookupOptions_clearButtonText */
        clearButtonText?: string;

        /** @docid dxLookupOptions_cleanSearchOnOpening */
        cleanSearchOnOpening?: boolean;

        /** @docid dxLookupOptions_closeOnOutsideClick */
        closeOnOutsideClick?: any;

        /** @docid dxLookupOptions_applyButtonText */
        applyButtonText?: string;

        /** @docid dxLookupOptions_fullScreen */
        fullScreen?: boolean;

        /** @docid dxLookupOptions_focusStateEnabled */
        focusStateEnabled?: boolean;

        /** @docid dxLookupOptions_grouped */
        grouped?: boolean;

        /** @docid dxLookupOptions_groupTemplate */
        groupTemplate?: any;

        /** @docid dxLookupOptions_nextButtonText */
        nextButtonText?: string;

        /** @docid dxLookupOptions_onPageLoading */
        onPageLoading?: Function;

        /** @docid dxLookupOptions_pageLoadMode */
        pageLoadMode?: string;

        /** @docid dxLookupOptions_pageLoadingText */
        pageLoadingText?: string;

        /** @docid dxLookupOptions_placeholder */
        placeholder?: string;

        /** @docid dxLookupOptions_popupHeight */
        popupHeight?: any;

        /** @docid dxLookupOptions_popupWidth */
        popupWidth?: any;

        /** @docid dxLookupOptions_position */
        position?: PositionOptions;

        /** @docid dxLookupOptions_pulledDownText */
        pulledDownText?: string;

        /** @docid dxLookupOptions_pullingDownText */
        pullingDownText?: string;

        /** @docid dxLookupOptions_onPullRefresh */
        onPullRefresh?: Function;

        /** @docid dxLookupOptions_pullRefreshEnabled */
        pullRefreshEnabled?: boolean;

        /** @docid dxLookupOptions_refreshingText */
        refreshingText?: string;

        /** @docid dxLookupOptions_onScroll */
        onScroll?: Function;

        /** @docid dxLookupOptions_searchEnabled */
        searchEnabled?: boolean;

        /** @docid dxLookupOptions_searchPlaceholder */
        searchPlaceholder?: string;

        /** @docid dxLookupOptions_shading */
        shading?: boolean;

        /** @docid dxLookupOptions_showCancelButton */
        showCancelButton?: boolean;

        /** @docid dxLookupOptions_showNextButton */
        showNextButton?: boolean;

        /** @docid dxLookupOptions_title */
        title?: string;

        /** @docid dxLookupOptions_titleTemplate */
        titleTemplate?: any;

        /** @docid dxLookupOptions_useNativeScrolling */
        useNativeScrolling?: boolean;

        /** @docid dxLookupOptions_usePopover */
        usePopover?: boolean;

        /** @docid dxLookupOptions_onValueChanged */
        onValueChanged?: Function;

        /** @docid dxLookupOptions_onTitleRendered */
        onTitleRendered?: Function;

        /** @docid dxLookupOptions_showPopupTitle */
        showPopupTitle?: boolean;

        /** @docid dxLookupOptions_fieldTemplate */
        fieldTemplate?: any;
    }

    /** @docid dxlookup */
    export class dxLookup extends dxDropDownList {
        constructor(element: JQuery, options?: dxLookupOptions);
        constructor(element: Element, options?: dxLookupOptions);
    }

    export interface dxLoadPanelOptions extends dxOverlayOptions {
        /** @docid_ignore dxLoadPanelOptions_closeOnBackButton */
        /** @docid_ignore dxLoadPanelOptions_disabled */
        /** @docid_ignore dxLoadPanelOptions_dragEnabled */
        /** @docid_ignore dxLoadPanelOptions_resizeEnabled */
        /** @docid_ignore dxLoadPanelOptions_contentTemplate */
        /** @docid_ignore dxLoadPanelOptions_accessKey */
        /** @docid_ignore dxLoadPanelOptions_tabIndex */
        /** @docid_ignore dxLoadPanelOptions_shadingColor */
        /** @docid_ignore dxLoadPanelOptions_animation_show */
        /** @docid_ignore dxLoadPanelOptions_animation_hide */

        /** @docid dxLoadPanelOptions_animation */
        animation?: fx.AnimationOptions;

        /** @docid dxLoadPanelOptions_delay */
        delay?: number;

        /** @docid dxLoadPanelOptions_height */
        height?: number;

        /** @docid dxLoadPanelOptions_indicatorSrc */
        indicatorSrc?: string;

        /** @docid dxLoadPanelOptions_message */
        message?: string;

        /** @docid dxLoadPanelOptions_showIndicator */
        showIndicator?: boolean;

        /** @docid dxLoadPanelOptions_showPane */
        showPane?: boolean;

        /** @docid dxLoadPanelOptions_width */
        width?: number;

        /** @docid dxLoadPanelOptions_focusStateEnabled */
        focusStateEnabled?: boolean;
    }

    /** @docid dxLoadPanel */
    export class dxLoadPanel extends dxOverlay {
        constructor(element: JQuery, options?: dxLoadPanelOptions);
        constructor(element: Element, options?: dxLoadPanelOptions);

        /** @docid_ignore dxLoadPanelMethods_registerKeyHandler */
        /** @docid_ignore dxLoadPanelMethods_focus */
    }

    export interface dxLoadIndicatorOptions extends WidgetOptions {
        /** @docid_ignore dxLoadIndicatoroptions_disabled */
        /** @docid_ignore dxLoadIndicatoroptions_hoverStateEnabled */
        /** @docid_ignore dxLoadIndicatoroptions_activeStateEnabled */
        /** @docid_ignore dxLoadIndicatoroptions_focusStateEnabled */
        /** @docid_ignore dxLoadIndicatoroptions_accessKey */
        /** @docid_ignore dxLoadIndicatoroptions_tabIndex */

        /** @docid dxLoadIndicatoroptions_indicatorsrc */
        indicatorSrc?: string;
    }

    /** @docid dxLoadIndicator */
    export class dxLoadIndicator extends Widget {
        constructor(element: JQuery, options?: dxLoadIndicatorOptions);
        constructor(element: Element, options?: dxLoadIndicatorOptions);

        /** @docid_ignore dxLoadIndicatorMethods_registerKeyHandler */
        /** @docid_ignore dxLoadIndicatorMethods_focus */
    }

    export interface ListOptionsMenuItem {
        /** @docid dxListOptions_menuItems_text */
        text?: string;

        /** @docid dxListOptions_menuItems_action */
        action?: (itemElement: Element, itemData: any) => void;
    }

    export interface dxListOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxListOptions_selectedIndex */
        /** @docid_ignore dxListOptions_selectedItem */
        /** @docid_ignore dxListOptions_focusStateEnabled */

        /** @docid_ignore dxListOptions_autoPagingEnabled */
        /** @docid_ignore dxListOptions_showNextButton */

        /** @docid_ignore dxListOptions_hoverStateEnabled */

        /** @docid dxListOptions_grouped */
        grouped?: boolean;

        /** @docid dxListOptions_groupTemplate */
        groupTemplate?: any;

        /** @docid dxListOptions_onItemDeleting */
        onItemDeleting?: Function;

        /** @docid dxListOptions_onItemDeleted */
        onItemDeleted?: Function;

        /** @docid dxListOptions_onGroupRendered */
        onGroupRendered?: Function;

        /** @docid dxListOptions_onItemReordered */
        onItemReordered?: Function;

        /** @docid dxListOptions_onItemClick */
        onItemClick?: any;

        /** @docid dxListOptions_onItemSwipe */
        onItemSwipe?: Function;

        /** @docid dxListOptions_nextButtonText */
        nextButtonText?: string;

        /** @docid dxListOptions_onPageLoading */
        onPageLoading?: Function;

        /** @docid dxListOptions_pageLoadingText */
        pageLoadingText?: string;

        /** @docid dxListOptions_pulledDownText */
        pulledDownText?: string;

        /** @docid dxListOptions_pullingDownText */
        pullingDownText?: string;

        /** @docid dxListOptions_onPullRefresh */
        onPullRefresh?: Function;

        /** @docid dxListOptions_pullRefreshEnabled */
        pullRefreshEnabled?: boolean;

        /** @docid dxListOptions_refreshingText */
        refreshingText?: string;

        /** @docid dxListOptions_onScroll */
        onScroll?: Function;

        /** @docid dxListOptions_scrollingEnabled */
        scrollingEnabled?: boolean;

        /** @docid dxListOptions_showScrollbar */
        showScrollbar?: string;

        /** @docid dxListOptions_useNativeScrolling */
        useNativeScrolling?: boolean;

        /** @docid dxListOptions_bounceEnabled */
        bounceEnabled?: boolean;

        /** @docid dxListOptions_scrollByContent */
        scrollByContent?: boolean;

        /** @docid dxListOptions_scrollByThumb */
        scrollByThumb?: boolean;

        /** @docid dxListOptions_onItemContextMenu */
        onItemContextMenu?: Function;

        /** @docid dxListOptions_onItemHold */
        onItemHold?: Function;

        /** @docid dxListOptions_collapsibleGroups */
        collapsibleGroups?: boolean;

        /** @docid dxListOptions_pageLoadMode */
        pageLoadMode?: string;

        /** @docid dxListOptions_showSelectionControls */
        showSelectionControls?: boolean;

        /** @docid dxListOptions_selectionMode */
        selectionMode?: string;

        /** @docid dxListOptions_selectAllMode */
        selectAllMode?: string;

        /** @docid dxListOptions_selectAllText */
        selectAllText?: string;

        /** @docid dxListOptions_onSelectAllValueChanged */
        onSelectAllValueChanged?: Function;

        /** @docid dxListOptions_menuItems */
        menuItems?: Array<ListOptionsMenuItem>;

        /** @docid dxListOptions_menuMode */
        menuMode?: string;

        /** @docid dxListOptions_allowItemDeleting */
        allowItemDeleting?: boolean;

        /** @docid dxListOptions_itemDeleteMode */
        itemDeleteMode?: string;

        /** @docid dxListOptions_allowItemReordering */
        allowItemReordering?: boolean;

        /** @docid dxListOptions_indicateLoading */
        indicateLoading?: boolean;

        /** @docid dxListOptions_activeStateEnabled */
        activeStateEnabled?: boolean;
    }

    /** @docid dxList */
    export class dxList extends CollectionWidget {
        constructor(element: JQuery, options?: dxListOptions);
        constructor(element: Element, options?: dxListOptions);

        /** @docid_ignore dxListItemTemplate_key */
        /** @docid_ignore dxListItemTemplate_badge */
        /** @docid_ignore dxListItemTemplate_showChevron */
        /** @docid_ignore dxListMethods_getFlatIndexByItemElement */
        /** @docid_ignore dxListMethods_getItemByIndex */
        /** @docid_ignore dxListMethods_getItemElementByFlatIndex */

        /** @docid dxListMethods_clientHeight */
        clientHeight(): number;

        /** @docid dxListMethods_deleteItem#deleteItem(itemIndex) */
        deleteItem(itemIndex: any): JQueryPromise<void>;

        /** @docid dxListMethods_deleteItem#deleteItem(itemElement) */
        deleteItem(itemElement: Element): JQueryPromise<void>;

        /** @docid dxListMethods_isItemSelected#isItemSelected(itemIndex) */
        isItemSelected(itemIndex: any): boolean;

        /** @docid dxListMethods_isItemSelected#isItemSelected(itemElement) */
        isItemSelected(itemElement: Element): boolean;

        /** @docid dxListMethods_reload */
        reload(): void;

        /** @docid dxListMethods_reorderItem#reorderItem(itemElement,toItemElement) */
        reorderItem(itemElement: Element, toItemElement: Element): JQueryPromise<void>;

        /** @docid dxListMethods_reorderItem#reorderItem(itemIndex,toItemIndex) */
        reorderItem(itemIndex: any, toItemIndex: any): JQueryPromise<void>;

        /** @docid dxListMethods_scrollBy */
        scrollBy(distance: number): void;

        /** @docid dxListMethods_scrollHeight */
        scrollHeight(): number;

        /** @docid dxListMethods_scrollTo */
        scrollTo(location: number): void;

        /** @docid dxListMethods_scrollToItem#scrollToItem(itemElement) */
        scrollToItem(itemElement: Element): void;

        /** @docid dxListMethods_scrollToItem#scrollToItem(itemIndex) */
        scrollToItem(itemIndex: any): void;

        /** @docid dxListMethods_scrollTop */
        scrollTop(): number;

        /** @docid dxListMethods_selectAll */
        selectAll(): void;

        /** @docid dxListMethods_unselectAll */
        unselectAll(): void;

        /** @docid dxListMethods_selectItem#selectItem(itemElement) */
        selectItem(itemElement: Element): void;

        /** @docid dxListMethods_selectItem#selectItem(itemIndex) */
        selectItem(itemIndex: any): void;

        /** @docid dxListMethods_unselectItem#unselectItem(itemElement) */
        unselectItem(itemElement: Element): void;

        /** @docid dxListMethods_unselectItem#unselectItem(itemIndex) */
        unselectItem(itemIndex: any): void;

        /** @docid dxListMethods_updateDimensions */
        updateDimensions(): JQueryPromise<void>;

        /** @docid dxListMethods_expandGroup */
        expandGroup(groupIndex: number): JQueryPromise<void>;

        /** @docid dxListMethods_collapseGroup */
        collapseGroup(groupIndex: number): JQueryPromise<void>;
    }

    export interface dxGalleryOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxGalleryOptions_activeStateEnabled */
        /** @docid_ignore dxGalleryOptions_focusStateEnabled */
        /** @docid_ignore dxGalleryOptions_noDataText */
        /** @docid_ignore dxGalleryOptions_selectedItems */
        /** @docid_ignore dxGalleryOptions_selectedItemKeys */
        /** @docid_ignore dxGalleryOptions_keyExpr */

        /** @docid dxGalleryOptions_animationDuration */
        animationDuration?: number;

        /** @docid dxGalleryOptions_animationEnabled */
        animationEnabled?: boolean;

        /** @docid dxGalleryOptions_indicatorEnabled */
        indicatorEnabled?: boolean;

        /** @docid dxGalleryOptions_loop */
        loop?: boolean;

        /** @docid dxGalleryOptions_selectedindex */
        selectedIndex?: number;

        /** @docid dxGalleryOptions_showIndicator */
        showIndicator?: boolean;

        /** @docid dxGalleryOptions_showNavButtons */
        showNavButtons?: boolean;

        /** @docid dxGalleryOptions_slideshowdelay */
        slideshowDelay?: number;

        /** @docid dxGalleryOptions_swipeEnabled */
        swipeEnabled?: boolean;

        /** @docid dxGalleryOptions_wrapAround */
        wrapAround?: boolean;

        /** @docid dxGalleryOptions_stretchImages */
        stretchImages?: boolean;

        /** @docid dxGalleryOptions_initialItemWidth */
        initialItemWidth?: number;
    }

    /** @docid dxgallery */
    export class dxGallery extends CollectionWidget {
        constructor(element: JQuery, options?: dxGalleryOptions);
        constructor(element: Element, options?: dxGalleryOptions);

        /** @docid_ignore dxGalleryItemTemplate_imageSrc */
        /** @docid_ignore dxGalleryItemTemplate_imageAlt */
        /** @docid_ignore dxGalleryItemTemplate_visible */

        /** @docid dxgallerymethods_goToItem */
        goToItem(itemIndex: number, animation: boolean): JQueryPromise<any>;

        /** @docid dxgallerymethods_nextItem */
        nextItem(animation: boolean): JQueryPromise<any>;

        /** @docid dxgallerymethods_prevItem */
        prevItem(animation: boolean): JQueryPromise<any>;
    }

    export interface dxDropDownEditorOptions extends dxTextBoxOptions {
        /** @docid_ignore dxDropDownEditorOptions_mask */
        /** @docid_ignore dxDropDownEditorOptions_maskChar */
        /** @docid_ignore dxDropDownEditorOptions_maskRules */
        /** @docid_ignore dxDropDownEditorOptions_maskInvalidMessage */
        /** @docid_ignore dxDropDownEditorOptions_useMaskedValue */
        /** @docid_ignore dxDropDownEditorOptions_mode */

        /** @docid dxDropDownEditorOptions_value */
        value?: any;

        /** @docid dxDropDownEditorOptions_onClosed */
        onClosed?: Function;

        /** @docid dxDropDownEditorOptions_onOpened */
        onOpened?: Function;

        /** @docid dxDropDownEditorOptions_opened */
        opened?: boolean;

        /** @docid dxDropDownEditorOptions_fieldEditEnabled */
        fieldEditEnabled?: boolean;

        /** @docid dxDropDownEditorOptions_acceptCustomValue */
        acceptCustomValue?: boolean;

        /** @docid dxDropDownEditorOptions_applyValueMode */
        applyValueMode?: string;

        /** @docid dxDropDownEditorOptions_deferRendering */
        deferRendering?: boolean;

        /** @docid dxDropDownEditorOptions_activeStateEnabled */
        activeStateEnabled?: boolean;
    }

    /** @docid dxDropDownEditor */
    export class dxDropDownEditor extends dxTextBox {
        constructor(element: JQuery, options?: dxDropDownEditorOptions);
        constructor(element: Element, options?: dxDropDownEditorOptions);

        /** @docid dxDropDownEditorMethods_close */
        close(): void;

        /** @docid dxDropDownEditorMethods_open */
        open(): void;

        /** @docid dxDropDownEditorMethods_reset */
        reset(): void;

        /** @docid dxDropDownEditorMethods_field */
        field(): JQuery;

        /** @docid dxDropDownEditorMethods_content */
        content(): JQuery;
    }

    export interface dxDateBoxOptions extends dxTextEditorOptions {
        /** @docid dxDateBoxOptions_formatString */
        formatString?: any;

        /** @docid dxDateBoxOptions_displayFormat */
        displayFormat?: any;

        /** @docid dxDateBoxOptions_format */
        format?: string;

        /** @docid dxDateBoxOptions_type */
        type?: string;

        /** @docid dxDateBoxOptions_max */
        max?: any;

        /** @docid dxDateBoxOptions_min */
        min?: any;

        /** @docid dxDateBoxOptions_placeholder */
        placeholder?: string;

        /** @docid dxDateBoxOptions_useCalendar */
        useCalendar?: boolean;

        /** @docid dxDateBoxOptions_dateSerializationFormat */
        dateSerializationFormat?: string;

        /** @docid dxDateBoxOptions_value */
        value?: any;

        /** @docid dxDateBoxOptions_useNative */
        useNative?: boolean;

        /** @docid dxDateBoxOptions_interval */
        interval?: number;

        /** @docid dxDateBoxOptions_maxZoomLevel */
        maxZoomLevel?: string;

        /** @docid dxDateBoxOptions_minZoomLevel */
        minZoomLevel?: string;

        /** @docid dxDateBoxOptions_pickerType */
        pickerType?: string;

        /** @docid dxDateBoxOptions_invalidDateMessage */
        invalidDateMessage?: string;

        /** @docid dxDateBoxOptions_dateOutOfRangeMessage */
        dateOutOfRangeMessage?: string;

        /** @docid dxDateBoxOptions_applyButtonText */
        applyButtonText?: string;

        /** @docid dxDateBoxOptions_adaptivityEnabled */
        adaptivityEnabled?: boolean;

        /** @docid dxDateBoxOptions_onContentReady */
        onContentReady?: Function;

        /** @docid dxDateBoxOptions_cancelButtonText */
        cancelButtonText?: string;
    }

    /** @docid dxDateBox */
    export class dxDateBox extends dxDropDownEditor {
        /** @docid_ignore dxDateBoxMethods_open */
        /** @docid_ignore dxDateBoxMethods_close */

        constructor(element: JQuery, options?: dxDateBoxOptions);
        constructor(element: Element, options?: dxDateBoxOptions);
    }

    export interface dxCheckBoxOptions extends EditorOptions {
        /** @docid_ignore dxCheckBoxOptions_hoverStateEnabled */
        /** @docid_ignore dxCheckBoxOptions_focusStateEnabled */

        /** @docid dxCheckBoxOptions_activeStateEnabled */
        activeStateEnabled?: boolean;

        /** @docid dxCheckBoxOptions_value */
        value?: boolean;

        /** @docid dxCheckBoxOptions_text */
        text?: string;

        /** @docid dxCheckBoxOptions_name */
        name?: string;
    }

    /** @docid dxcheckbox */
    export class dxCheckBox extends Editor {
        constructor(element: JQuery, options?: dxCheckBoxOptions);
        constructor(element: Element, options?: dxCheckBoxOptions);
    }

    export interface dxCalendarOptions extends EditorOptions {
        /** @docid_ignore dxCalendarOptions_hoverStateEnabled */
        /** @docid_ignore dxCalendarOptions_focusStateEnabled */
        /** @docid_ignore dxCalendarCellTemplate_text */
        /** @docid_ignore dxCalendarCellTemplate_date */
        /** @docid_ignore dxCalendarCellTemplate_view */

        /** @docid dxCalendarOptions_activeStateEnabled */
        activeStateEnabled?: boolean;

        /** @docid dxCalendarOptions_currentDate */
        currentDate?: Date;

        /** @docid dxCalendarOptions_firstDayOfWeek */
        firstDayOfWeek?: number;

        /** @docid dxCalendarOptions_dateSerializationFormat */
        dateSerializationFormat?: string;

        /** @docid dxCalendarOptions_value */
        value?: any;

        /** @docid dxCalendarOptions_max */
        max?: any;

        /** @docid dxCalendarOptions_min */
        min?: any;

        /** @docid dxCalendarOptions_showTodayButton */
        showTodayButton?: boolean;

        /** @docid dxCalendarOptions_zoomLevel */
        zoomLevel?: string;

        /** @docid dxCalendarOptions_maxZoomLevel */
        maxZoomLevel?: string;

        /** @docid dxCalendarOptions_minZoomLevel */
        minZoomLevel?: string;

        /** @docid dxCalendarOptions_cellTemplate */
        cellTemplate?: any;

        /** @docid dxCalendarOptions_name */
        name?: string;
    }

    /** @docid dxCalendar */
    export class dxCalendar extends Editor {
        constructor(element: JQuery, options?: dxCalendarOptions);
        constructor(element: Element, options?: dxCalendarOptions);
    }

    export interface dxButtonOptions extends WidgetOptions {
        /** @docid_ignore dxButtonDefaultTemplate_text */
        /** @docid_ignore dxButtonDefaultTemplate_icon */
        /** @docid_ignore dxButtonOptions_hoverStateEnabled */
        /** @docid_ignore dxButtonOptions_focusStateEnabled  */

        /** @docid dxButtonOptions_activeStateEnabled */
        activeStateEnabled?: boolean;

        /** @docid dxButtonOptions_onClick */
        onClick?: any;

        /** @docid dxButtonOptions_icon */
        icon?: string;

        /** @docid dxbuttonoptions_iconSrc */
        iconSrc?: string;

        /** @docid dxButtonOptions_template */
        template?: any;

        /** @docid dxButtonOptions_text */
        text?: string;

        /** @docid dxButtonOptions_type */
        type?: string;

        /** @docid dxButtonOptions_validationgroup */
        validationGroup?: string;

        /** @docid dxButtonOptions_useSubmitBehavior */
        useSubmitBehavior?: boolean;
    }

    /** @docid dxbutton */
    export class dxButton extends Widget {
        constructor(element: JQuery, options?: dxButtonOptions);
        constructor(element: Element, options?: dxButtonOptions);
    }

    export interface dxBoxOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxBoxOptions_focusStateEnabled */
        /** @docid_ignore dxBoxOptions_activeStateEnabled */
        /** @docid_ignore dxBoxOptions_hint */
        /** @docid_ignore dxBoxOptions_noDataText */
        /** @docid_ignore dxBoxOptions_onSelectionChanged */
        /** @docid_ignore dxBoxOptions_selectedIndex */
        /** @docid_ignore dxBoxOptions_selectedItem */
        /** @docid_ignore dxBoxOptions_selectedItems */
        /** @docid_ignore dxBoxOptions_selectedItemKeys */
        /** @docid_ignore dxBoxOptions_keyExpr */
        /** @docid_ignore dxBoxOptions_tabIndex */
        /** @docid_ignore dxBoxOptions_accessKey */

        /** @docid dxBoxOptions_align */
        align?: string;

        /** @docid dxBoxOptions_direction */
        direction?: string;

        /** @docid dxBoxOptions_crossAlign */
        crossAlign?: string;

        /** @docid_ignore dxBoxItemTemplate_ratio */
        /** @docid_ignore dxBoxItemTemplate_baseSize */
        /** @docid_ignore dxBoxItemTemplate_box */
    }

    /** @docid dxBox */
    export class dxBox extends CollectionWidget {
        constructor(element: JQuery, options?: dxBoxOptions);
        constructor(element: Element, options?: dxBoxOptions);

        /** @docid_ignore dxBoxMethods_registerKeyHandler */
        /** @docid_ignore dxBoxMethods_focus */
    }

    export interface dxResponsiveBoxOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxResponsiveBoxOptions_activeStateEnabled */
        /** @docid_ignore dxResponsiveBoxOptions_focusStateEnabled */
        /** @docid_ignore dxResponsiveBoxOptions_hint */
        /** @docid_ignore dxResponsiveBoxOptions_noDataText */
        /** @docid_ignore dxResponsiveBoxOptions_onSelectionChanged */
        /** @docid_ignore dxResponsiveBoxOptions_selectedIndex */
        /** @docid_ignore dxResponsiveBoxOptions_selectedItem */
        /** @docid_ignore dxResponsiveBoxOptions_selectedItems */
        /** @docid_ignore dxResponsiveBoxOptions_selectedItemKeys */
        /** @docid_ignore dxResponsiveBoxOptions_keyExpr */
        /** @docid_ignore dxResponsiveBoxOptions_tabIndex */
        /** @docid_ignore dxResponsiveBoxOptions_width */
        /** @docid_ignore dxResponsiveBoxOptions_height */
        /** @docid_ignore dxResponsiveBoxOptions_accessKey */

        /** @docid dxResponsiveBoxOptions_rows */
        rows?: Array<Object>;

        /** @docid dxResponsiveBoxOptions_cols */
        cols?: Array<Object>;

        /** @docid dxResponsiveBoxOptions_screenByWidth */
        screenByWidth?: (width: number) => string;

        /** @docid dxResponsiveBoxOptions_singleColumnScreen */
        singleColumnScreen?: string;

        /** @docid_ignore dxResponsiveBoxItemTemplate_location */
        /** @docid_ignore dxResponsiveBoxItemTemplate_location_colspan */
        /** @docid_ignore dxResponsiveBoxItemTemplate_location_row */
        /** @docid_ignore dxResponsiveBoxItemTemplate_location_col */
        /** @docid_ignore dxResponsiveBoxItemTemplate_location_rowspan */
        /** @docid_ignore dxResponsiveBoxItemTemplate_location_screen */
        /** @docid_ignore dxResponsiveBoxOptions_cols_baseSize */
        /** @docid_ignore dxResponsiveBoxOptions_cols_ratio */
        /** @docid_ignore dxResponsiveBoxOptions_cols_screen */
        /** @docid_ignore dxResponsiveBoxOptions_rows_baseSize */
        /** @docid_ignore dxResponsiveBoxOptions_rows_ratio */
        /** @docid_ignore dxResponsiveBoxOptions_rows_screen */
    }

    /** @docid dxResponsiveBox */
    export class dxResponsiveBox extends CollectionWidget {
        constructor(element: JQuery, options?: dxBoxOptions);
        constructor(element: Element, options?: dxBoxOptions);

        /** @docid_ignore dxResponsiveBoxMethods_registerKeyHandler */
        /** @docid_ignore dxResponsiveBoxMethods_focus */
    }

    export interface dxAutocompleteOptions extends dxDropDownListOptions {
        /** @docid_ignore dxAutocompleteOptions_searchEnabled */
        /** @docid_ignore dxAutocompleteOptions_fieldEditEnabled */
        /** @docid_ignore dxAutocompleteOptions_acceptCustomValue */
        /** @docid_ignore dxAutocompleteOptions_noDataText */
        /** @docid_ignore dxAutocompleteOptions_showDataBeforeSearch */
        /** @docid_ignore dxAutocompleteOptions_displayExpr */

        /** @docid dxAutocompleteOptions_value */
        value?: string;

        /** @docid dxAutocompleteOptions_minSearchLength */
        minSearchLength?: number;

        /** @docid dxAutocompleteOptions_maxItemCount */
        maxItemCount?: number;

        /** @docid dxDropDownListOptions_selectedItem */
        selectedItem?: any;
    }

    /** @docid dxAutocomplete */
    export class dxAutocomplete extends dxDropDownList {
        constructor(element: JQuery, options?: dxAutocompleteOptions);
        constructor(element: Element, options?: dxAutocompleteOptions);

        /** @docid_ignore dxAutocompleteOptions_pagingEnabled */

        /** @docid dxAutocompletemethods_open */
        open(): void;

        /** @docid dxAutocompletemethods_close */
        close(): void;
    }

    export interface dxAccordionOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxAccordionItemTemplate_title */
        /** @docid_ignore dxAccordionOptions_hoverStateEnabled */
        /** @docid_ignore dxAccordionOptions_focusStateEnabled */

        /** @docid dxAccordionOptions_animationDuration */
        animationDuration?: number;

        /** @docid dxAccordionOptions_height */
        height?: any;

        /** @docid dxAccordionOptions_collapsible */
        collapsible?: boolean;

        /** @docid dxAccordionOptions_multiple */
        multiple?: boolean;

        /** @docid dxAccordionOptions_itemTemplate */
        itemTemplate?: any;

        /** @docid dxAccordionOptions_onItemTitleClick */
        onItemTitleClick?: any;

        /** @docid dxAccordionOptions_itemTitleTemplate */
        itemTitleTemplate?: any;

        /** @docid dxAccordionOptions_selectedIndex */
        selectedIndex?: number;

        /** @docid dxAccordionOptions_deferRendering */
        deferRendering?: boolean;

    }

    /** @docid dxAccordion */
    export class dxAccordion extends CollectionWidget {
        constructor(element: JQuery, options?: dxAccordionOptions);
        constructor(element: Element, options?: dxAccordionOptions);

        /** @docid_ignore dxAccordionItemTemplate_icon */
        /** @docid_ignore dxAccordionItemTemplate_iconSrc */
        /** @docid_ignore dxAccordionEvents_ItemTitleClick */

        /** @docid dxAccordionMethods_collapseItem */
        collapseItem(index: number): JQueryPromise<dxAccordion>;

        /** @docid dxAccordionMethods_expandItem */
        expandItem(index: number): JQueryPromise<dxAccordion>;

        /** @docid dxAccordionMethods_updateDimensions */
        updateDimensions(): JQueryPromise<dxAccordion>;
    }

    export interface dxFileUploaderOptions extends EditorOptions {
        /** @docid_ignore dxFileUploaderOptions_focusStateEnabled */
        /** @docid_ignore dxFileUploaderOptions_validationMessageMode */
        /** @docid_ignore dxFileUploaderOptions_extendSelection */

        /** @docid dxFileUploaderOptions_value */
        value?: Array<File>;

        /** @docid dxFileUploaderOptions_values */
        values?: Array<File>;

        /** @docid dxFileUploaderOptions_buttonText */
        buttonText?: string;

        /** @docid dxFileUploaderOptions_selectButtonText */
        selectButtonText?: string;

        /** @docid dxFileUploaderOptions_uploadButtonText */
        uploadButtonText?: string;

        /** @docid dxFileUploaderOptions_labelText */
        labelText?: string;

        /** @docid dxFileUploaderOptions_name */
        name?: string;

        /** @docid dxFileUploaderOptions_multiple */
        multiple?: boolean;

        /** @docid dxFileUploaderOptions_accept */
        accept?: string;

        /** @docid dxFileUploaderOptions_uploadUrl */
        uploadUrl?: string;

        /** @docid dxFileUploaderOptions_allowCanceling */
        allowCanceling?: boolean;

        /** @docid dxFileUploaderOptions_showFileList */
        showFileList?: boolean;

        /** @docid dxFileUploaderOptions_progress */
        progress?: number;

        /** @docid dxFileUploaderOptions_readyToUploadMessage */
        readyToUploadMessage?: string;

        /** @docid dxFileUploaderOptions_uploadedMessage */
        uploadedMessage?: string;

        /** @docid dxFileUploaderOptions_uploadFailedMessage */
        uploadFailedMessage?: string;

        /** @docid dxFileUploaderOptions_uploadMode */
        uploadMode?: string;

        /** @docid dxFileUploaderOptions_uploadMethod */
        uploadMethod?: string;

        /** @docid dxFileUploaderOptions_uploadHeaders */
        uploadHeaders?: Object;

        /** @docid dxFileUploaderOptions_onUploadStarted */
        onUploadStarted?: Function;

        /** @docid dxFileUploaderOptions_onUploaded */
        onUploaded?: Function;

        /** @docid dxFileUploaderOptions_onProgress */
        onProgress?: Function;

        /** @docid dxFileUploaderOptions_onUploadError */
        onUploadError?: Function;

        /** @docid dxFileUploaderOptions_onUploadAborted */
        onUploadAborted?: Function;

        /** @docid dxFileUploaderOptions_onValueChanged */
        onValueChanged?: Function;
    }

    /** @docid dxFileUploader */
    export class dxFileUploader extends Editor {
        constructor(element: JQuery, options?: dxFileUploaderOptions);
        constructor(element: Element, options?: dxFileUploaderOptions);
    }

    export interface dxTrackBarOptions extends EditorOptions {
        /** @docid dxTrackBarOptions_min */
        min?: number;

        /** @docid dxTrackBarOptions_max */
        max?: number;
    }

    /** @docid dxTrackBar */
    export class dxTrackBar extends Editor {
        constructor(element: JQuery, options?: dxTrackBarOptions);
        constructor(element: Element, options?: dxTrackBarOptions);
    }

    export interface dxProgressBarOptions extends dxTrackBarOptions {
        /** @docid_ignore dxProgressBarOptions_activeStateEnabled */
        /** @docid_ignore dxProgressBarOptions_focusStateEnabled */
        /** @docid_ignore dxProgressBarOptions_accessKey */
        /** @docid_ignore dxProgressBarOptions_tabIndex */

        /** @docid dxProgressBarOptions_statusFormat */
        statusFormat?: any;

        /** @docid dxProgressBarOptions_showStatus */
        showStatus?: boolean;

        /** @docid dxProgressBarOptions_onComplete */
        onComplete?: Function;

        /** @docid dxProgressBarOptions_value */
        value?: number;
    }

    /** @docid dxProgressBar */
    export class dxProgressBar extends dxTrackBar {
        constructor(element: JQuery, options?: dxProgressBarOptions);
        constructor(element: Element, options?: dxProgressBarOptions);

        /** @docid_ignore dxProgressBarMethods_registerKeyHandler */
        /** @docid_ignore dxProgressBarMethods_focus */
    }

    export interface dxSliderBaseOptions extends dxTrackBarOptions {
        /** @docid_ignore dxSliderOptions_hoverStateEnabled */
        /** @docid_ignore dxSliderOptions_focusStateEnabled */

        /** @docid dxSliderOptions_activeStateEnabled */
        activeStateEnabled?: boolean;

        /** @docid dxSliderOptions_step */
        step?: number;

        /** @docid dxSliderOptions_showRange */
        showRange?: boolean;

        /** @docid dxSliderOptions_keyStep */
        keyStep?: number;

        /** @docid dxSliderOptions_tooltip */
        tooltip?: {
            /** @docid dxSliderOptions_tooltip_enabled */
            enabled?: boolean;

            /** @docid dxSliderOptions_tooltip_format */
            format?: any;

            /** @docid dxSliderOptions_tooltip_position */
            position?: string;

            /** @docid dxSliderOptions_tooltip_showMode */
            showMode?: string;
        };

        /** @docid dxSliderOptions_label */
        label?: {
            /** @docid dxSliderOptions_label_visible */
            visible?: boolean;

            /** @docid dxSliderOptions_label_position */
            position?: string;

            /** @docid dxSliderOptions_label_format */
            format?: any;
        };

        /** @docid dxSliderOptions_name */
        name?: string;
    }

    export interface dxSliderOptions extends dxSliderBaseOptions {
        /** @docid dxSliderOptions_value */
        value?: number;
    }

    /** @docid dxSlider */
    export class dxSlider extends dxTrackBar {
        constructor(element: JQuery, options?: dxSliderOptions);
        constructor(element: Element, options?: dxSliderOptions);
    }

    export interface dxRangeSliderOptions extends dxSliderBaseOptions {
        /** @docid_ignore dxRangeSliderOptions_onValueChanged */
        /** @docid_ignore dxRangeSliderOptions_name */

        /** @docid dxRangeSliderOptions_start */
        start?: number;

        /** @docid dxRangeSliderOptions_end */
        end?: number;

        /** @docid dxRangeSliderOptions_startName */
        startName?: string;

        /** @docid dxRangeSliderOptions_endName */
        endName?: string;

        /** @docid dxRangeSliderOptions_value */
        value?: Array<number>;
    }

    /** @docid dxRangeSlider */
    export class dxRangeSlider extends dxSlider {
        constructor(element: JQuery, options?: dxRangeSliderOptions);
        constructor(element: Element, options?: dxRangeSliderOptions);
    }

    export interface dxFormItemLabel {
        /** @docid dxFormSimpleItemOptions_label_text */
        text?: string;

        /** @docid dxFormSimpleItemOptions_label_visible */
        visible?: boolean;

        /** @docid dxFormSimpleItemOptions_label_showColon */
        showColon?: boolean;

        /** @docid dxFormSimpleItemOptions_label_location */
        location?: string;

        /** @docid dxFormSimpleItemOptions_label_alignment */
        alignment?: string;
    }

    export interface dxFormItem {
        /**
         * @docid dxFormEmptyItemOptions_itemType
         * @docid dxFormGroupItemOptions_itemType
         * @docid dxFormTabbedItemOptions_itemType
         * @docid dxFormSimpleItemOptions_itemType
        */
        itemType?: string;

        /**
         * @docid dxFormEmptyItemOptions_visible
         * @docid dxFormGroupItemOptions_visible
         * @docid dxFormTabbedItemOptions_visible
         * @docid dxFormSimpleItemOptions_visible
        */
        visible?: boolean;

        /**
         * @docid dxFormEmptyItemOptions_visibleIndex
         * @docid dxFormGroupItemOptions_visibleIndex
         * @docid dxFormTabbedItemOptions_visibleIndex
         * @docid dxFormSimpleItemOptions_visibleIndex
        */
        visibleIndex?: number;

        /**
         * @docid dxFormEmptyItemOptions_cssClass
         * @docid dxFormGroupItemOptions_cssClass
         * @docid dxFormTabbedItemOptions_cssClass
         * @docid dxFormSimpleItemOptions_cssClass
        */
        cssClass?: string;

        /**
         * @docid dxFormEmptyItemOptions_colSpan
         * @docid dxFormSimpleItemOptions_colSpan
         * @docid dxFormGroupItemOptions_colSpan
         * @docid dxFormTabbedItemOptions_colSpan
         */
        colSpan?: number;
    }

    /** @docid dxFormEmptyItem */
    export interface dxFormEmptyItem extends dxFormItem {
        /** @docid dxFormEmptyItemOptions_name */
        name?: string;
    }

    /** @docid dxFormSimpleItem */
    export interface dxFormSimpleItem extends dxFormItem {
        /** @docid dxFormSimpleItemOptions_dataField */
        dataField?: string;

        /** @docid dxFormSimpleItemOptions_name */
        name?: string;

        /** @docid dxFormSimpleItemOptions_editorType */
        editorType?: string;

        /** @docid dxFormSimpleItemOptions_editorOptions */
        editorOptions?: Object;

        /** @docid dxFormSimpleItemOptions_template */
        template?: any;

        /** @docid dxFormSimpleItemOptions_helpText */
        helpText?: string;

        /** @docid dxFormSimpleItemOptions_isRequired */
        isRequired?: boolean;

        /** @docid dxFormSimpleItemOptions_label */
        label?: dxFormItemLabel;

        /** @docid dxFormSimpleItemOptions_validationRules */
        validationRules?: Array<any>;
    }

    /** @docid ColCountResponsible */
    export interface ColCountResponsible {
        /** @docid ColCountResponsible_xs */
        xs?: number;

        /** @docid ColCountResponsible_sm */
        sm?: number;

        /** @docid ColCountResponsible_md */
        md?: number;

        /** @docid ColCountResponsible_lg */
        lg?: number;
    }

    /** @docid dxFormGroupItem */
    export interface dxFormGroupItem extends dxFormItem {
        /** @docid dxFormGroupItemOptions_caption */
        caption?: string;

        /** @docid dxFormGroupItemOptions_template */
        template?: any;

        /** @docid dxFormGroupItemOptions_colCount */
        colCount?: number;

        /** @docid dxFormTabbedItemOptions_tabs_colCountByScreen */
        colCountByScreen?: ColCountResponsible;

        /** @docid dxFormGroupItemOptions_alignItemLabels */
        alignItemLabels?: boolean;

        /** @docid dxFormGroupItemOptions_items */
        items?: Array<dxFormItem>;
    }

    export interface dxFormTab {
        /** @docid dxFormTabbedItemOptions_tabs_title */
        title?: string;

        /** @docid dxFormTabbedItemOptions_tabs_colCount */
        colCount?: number;

        /** @docid dxFormGroupItemOptions_colCountByScreen */
        colCountByScreen?: ColCountResponsible;

        /** @docid dxFormTabbedItemOptions_tabs_alignItemLabels */
        alignItemLabels?: boolean;

        /** @docid dxFormTabbedItemOptions_tabs_items */
        items?: Array<dxFormItem>;

        /** @docid dxFormTabbedItemOptions_tabs_badge */
        badge?: string;

        /** @docid dxFormTabbedItemOptions_tabs_disabled */
        disabled?: boolean;

        /** @docid dxFormTabbedItemOptions_tabs_icon */
        icon?: string;

        /** @docid dxFormTabbedItemOptions_tabs_tabTemplate */
        tabTemplate?: any;

        /** @docid dxFormTabbedItemOptions_tabs_template */
        template?: any;
    }

    /** @docid dxFormTabbedItem */
    export interface dxFormTabbedItem extends dxFormItem {
        /** @docid dxFormTabbedItemOptions_tabPanelOptions */
        tabPanelOptions?: DevExpress.ui.dxTabPanelOptions;

        /** @docid dxFormTabbedItemOptions_tabs */
        tabs?: Array<dxFormTab>;
    }

    export interface dxFormOptions extends WidgetOptions {
        /** @docid dxFormOptions_formData */
        formData?: Object;

        /** @docid dxFormOptions_colCount */
        colCount?: any;

        /** @docid dxFormOptions_colCountByScreen */
        colCountByScreen?: ColCountResponsible;

        /** @docid dxFormOptions_screenByWidth */
        screenByWidth?: (width: number) => string;

        /** @docid dxFormOptions_labelLocation */
        labelLocation?: string;

        /** @docid dxFormOptions_readOnly */
        readOnly?: boolean;

        /** @docid dxFormOptions_onFieldDataChanged */
        onFieldDataChanged?: (e: Object) => void;

        /** @docid dxFormOptions_onEditorEnterKey */
        onEditorEnterKey?: (e: Object) => void;

        /** @docid dxFormOptions_customizeItem */
        customizeItem?: Function;

        /** @docid dxFormOptions_minColWidth */
        minColWidth?: number;

        /** @docid dxFormOptions_alignItemLabels */
        alignItemLabels?: boolean;

        /** @docid dxFormOptions_alignItemLabelsInAllGroups */
        alignItemLabelsInAllGroups?: boolean;

        /** @docid dxFormOptions_showColonAfterLabel */
        showColonAfterLabel?: boolean;

        /** @docid dxFormOptions_showRequiredMark */
        showRequiredMark?: boolean;

        /** @docid dxFormOptions_showOptionalMark */
        showOptionalMark?: boolean;

        /** @docid dxFormOptions_requiredMark */
        requiredMark?: string;

        /** @docid dxFormOptions_optionalMark */
        optionalMark?: string;

        /** @docid dxFormOptions_requiredMessage */
        requiredMessage?: string;

        /** @docid dxFormOptions_showValidationSummary */
        showValidationSummary?: boolean;

        /** @docid dxFormOptions_items */
        items?: Array<dxFormItem>;

        /** @docid dxFormOptions_scrollingEnabled */
        scrollingEnabled?: boolean;

        /** @docid dxFormOptions_validationGroup */
        validationGroup?: string;

        /** @docid dxFormOptions_onContentReady */
        onContentReady?: Function;
    }

    /** @docid dxForm */
    export class dxForm extends Widget {
        constructor(element: JQuery, options?: dxFormOptions);
        constructor(element: Element, options?: dxFormOptions);

        /** @docid dxFormMethods_updateData#updateData(dataField,value) */
        updateData(dataField: string, value: any): void;

        /** @docid dxFormMethods_updateData#updateData(data) */
        updateData(data: Object): void;

        /** @docid dxFormMethods_itemOption#itemOption(field,option,value) */
        itemOption(field: string, option: string, value: any): void;

        /** @docid dxFormMethods_itemOption#itemOption(field,options) */
        itemOption(field: string, options: Object): void;

        /** @docid dxFormMethods_itemOption#itemOption(field) */
        itemOption(field: string): any;

        /** @docid dxFormMethods_getEditor */
        getEditor(field: string): Object;

        /** @docid dxFormMethods_updateDimensions */
        updateDimensions(): JQueryPromise<void>;

        /** @docid dxFormMethods_validate */
        validate(): Object;

        /** @docid dxFormMethods_resetValues */
        resetValues(): void;
    }

    export interface dxDeferRenderingOptions extends WidgetOptions {
        /** @docid dxDeferRenderingOptions_showLoadIndicator */
        showLoadIndicator?: boolean;

        /** @docid dxDeferRenderingOptions_renderWhen */
        renderWhen?: any;

        /** @docid dxDeferRenderingOptions_animation */
        animation?: fx.AnimationOptions;

        /** @docid dxDeferRenderingOptions_staggerItemSelector */
        staggerItemSelector?: string;

        /** @docid dxDeferRenderingOptions_onRendered */
        onRendered?: Function;

        /** @docid dxDeferRenderingOptions_onShown */
        onShown?: Function;
    }

    /** @docid dxDeferRendering */
    export class dxDeferRendering extends Widget {
        constructor(element: JQuery, options?: dxDeferRenderingOptions);
        constructor(element: Element, options?: dxDeferRenderingOptions);
    }
}

/* Private plugins. To be removed */
interface JQuery {
    dxDropDownList(): JQuery;
    dxDropDownList(options: "instance"): DevExpress.ui.dxDropDownList;
    dxDropDownList(options: string): any;
    dxDropDownList(options: string, ...params: any[]): any;
    dxDropDownList(options: DevExpress.ui.dxDropDownListOptions): JQuery;

    dxTextEditor(): JQuery;
    dxTextEditor(options: "instance"): DevExpress.ui.dxTextEditor;
    dxTextEditor(options: string): any;
    dxTextEditor(options: string, ...params: any[]): any;
    dxTextEditor(options: DevExpress.ui.dxTextEditorOptions): JQuery;

    dxScrollable(): JQuery;
    dxScrollable(options: "instance"): DevExpress.ui.dxScrollable;
    dxScrollable(options: string): any;
    dxScrollable(options: string, ...params: any[]): any;
    dxScrollable(options: DevExpress.ui.dxScrollableOptions): JQuery;

    dxOverlay(): JQuery;
    dxOverlay(options: "instance"): DevExpress.ui.dxOverlay;
    dxOverlay(options: string): any;
    dxOverlay(options: string, ...params: any[]): any;
    dxOverlay(options: DevExpress.ui.dxOverlayOptions): JQuery;

    dxDropDownEditor(): JQuery;
    dxDropDownEditor(options: "instance"): DevExpress.ui.dxDropDownEditor;
    dxDropDownEditor(options: string): any;
    dxDropDownEditor(options: string, ...params: any[]): any;
    dxDropDownEditor(options: DevExpress.ui.dxDropDownEditorOptions): JQuery;
}
