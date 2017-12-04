/// <reference path="core.d.ts" />

declare module DevExpress.ui {
    
    export interface dxValidatorValidationAdapter {
        /** A function that returns the value to be validated. */
        getValue?: Function;

        /** The jQuery.Callbacks() object that is fired when the specified value should be validated. */
        validationRequestsCallbacks?: JQueryCallback;

        /** A function that the Validator widget calls after validating a specified value. */
        applyValidationResults?: (params: validationEngine.ValidatorValidationResult) => void;

        /** A function that resets the validated values. */
        reset?: Function;

        /** A function that sets focus to a validated editor when the corresponding ValidationSummary item is focused. */
        focus?: Function;

        /** A function that returns a Boolean value specifying whether or not to bypass validation. */
        bypass?: Function;
    }

    export interface dxValidatorOptions extends DOMComponentOptions {
        /** An array of validation rules to be checked for the editor with which the dxValidator object is associated. */
        validationRules?: Array<any>;

        /** Specifies the editor name to be used in the validation default messages. */
        name?: string;

        /** An object that specifies what and when to validate, and how to apply the validation result. */
        adapter?: dxValidatorValidationAdapter;

        /** Specifies the validation group the editor will be related to. */
        validationGroup?: string;

        /** A handler for the validated event. */
        onValidated?: (params: validationEngine.ValidatorValidationResult) => void;
    }


    /** A widget that is used to validate the associated DevExtreme editors against the defined validation rules. */
    export class dxValidator extends DOMComponent implements validationEngine.IValidator {
        constructor(element: JQuery, options?: dxValidatorOptions);
        constructor(element: Element, options?: dxValidatorOptions);

        
        /** Validates the value of the editor that is controlled by the current Validator object against the list of the specified validation rules. */
        validate(): validationEngine.ValidatorValidationResult;
        /** Resets the value and validation result of the editor associated with the current Validator object. */
        reset(): void;
        /** Sets focus to the editor associated with the current Validator object. */
        focus(): void;
    }

    export interface dxValidationGroupOptions extends DOMComponentOptions { }

    /** The widget that is used in the Knockout and AngularJS approaches to combine the editors to be validated. */
    export class dxValidationGroup extends DOMComponent {
        constructor(element: JQuery, options?: dxValidationGroupOptions);
        constructor(element: Element, options?: dxValidationGroupOptions);

        
        /** Validates rules of the validators that belong to the current validation group. */
        validate(): validationEngine.ValidationGroupValidationResult;
        /** Resets the value and validation result of the editors that are included to the current validation group. */
        reset(): void;
    }

    export interface dxValidationSummaryOptions extends CollectionWidgetOptions {
        
        /** Specifies the validation group for which summary should be generated. */
        validationGroup?: string;
    }

    /** A widget for displaying the result of checking validation rules for editors. */
    export class dxValidationSummary extends CollectionWidget {
        constructor(element: JQuery, options?: dxValidationSummaryOptions);
        constructor(element: Element, options?: dxValidationSummaryOptions);
       
    }

    export interface dxResizableOptions extends DOMComponentOptions {
        
        /** Specifies which borders of the widget element are used as a handle. */
        handles?: string;

        /** Specifies the lower width boundary for resizing. */
        minWidth?: number;

        /** Specifies the upper width boundary for resizing. */
        maxWidth?: number;

        /** Specifies the lower height boundary for resizing. */
        minHeight?: number;

        /** Specifies the upper height boundary for resizing. */
        maxHeight?: number;

        /** A handler for the resizeStart event. */
        onResizeStart?: Function;

        /** A handler for the resize event. */
        onResize?: Function;

        /** A handler for the resizeEnd event. */
        onResizeEnd?: Function;
    }

    /** The Resizable widget enables its content to be resizable in the UI. */
    export class dxResizable extends DOMComponent {
        constructor(element: JQuery, options?: dxResizableOptions);
        constructor(element: Element, options?: dxResizableOptions);
    }

    export interface dxTooltipOptions extends dxPopoverOptions {
    }

    /** The Tooltip widget displays a tooltip for a specified element on the page. */
    export class dxTooltip extends dxPopover {
        constructor(element: JQuery, options?: dxTooltipOptions);
        constructor(element: Element, options?: dxTooltipOptions);
    }

    export interface dxDropDownListOptions extends dxDropDownEditorOptions, DataExpressionMixinOptions {
        
        /** Returns the value currently displayed by the widget. */
        displayValue?: string;

        /** The minimum number of characters that must be entered into the text box to begin a search. Applies only if searchEnabled is true. */
        minSearchLength?: number;

        /** Specifies whether or not the widget displays unfiltered values until a user types a number of characters exceeding the minSearchLength option value. */
        showDataBeforeSearch?: boolean;

        /** Specifies the name of a data source item field or an expression whose value is compared to the search criterion. */
        searchExpr?: any;

        /** Specifies the binary operation used to filter data. */
        searchMode?: string;

        /** Specifies the time delay, in milliseconds, after the last character has been typed in, before a search is executed. */
        searchTimeout?: number;

        /** A handler for the valueChanged event. */
        onValueChanged?: Function;

        /** Specifies DOM event names that update a widget's value. */
        valueChangeEvent?: string;

        /** Specifies whether or not the widget supports searching. */
        searchEnabled?: boolean;

        /**
         * Specifies whether or not the widget displays items by pages.
         * @deprecated Use the DataSource paging opportunities instead.
         */
        pagingEnabled?: boolean;

        /** The text or HTML markup displayed by the widget if the item collection is empty. */
        noDataText?: string;

        /** A handler for the selectionChanged event. */
        onSelectionChanged?: Function;

        /** A handler for the itemClick event. */
        onItemClick?: Function;

        /** Specifies whether data items should be grouped. */
        grouped?: boolean;

        /** Specifies a custom template for group captions. */
        groupTemplate?: any;

    }

    /** A base class for drop-down list widgets. */
    export class dxDropDownList extends dxDropDownEditor implements DataHelperMixin  {
        constructor(element: JQuery, options?: dxDropDownListOptions);
        constructor(element: Element, options?: dxDropDownListOptions);

        getDataSource(): DevExpress.data.DataSource;
    }

    export interface dxToolbarOptions extends CollectionWidgetOptions {
        
        /** The template used to render menu items.
            Specifies a custom template for a menu item. */
        menuItemTemplate?: any;

        /** Informs the widget about its location in a view HTML markup. */
        renderAs?: string;
    }

    /** The Toolbar is a widget containing items that usually manage screen content. Those items can be plain text or widgets. */
    export class dxToolbar extends CollectionWidget {
        constructor(element: JQuery, options?: dxToolbarOptions);
        constructor(element: Element, options?: dxToolbarOptions);

        
    }

    export interface dxToastOptions extends dxOverlayOptions {
               
        animation?: {
            /** An object that defines the animation options used when the widget is being shown. */
            show?: fx.AnimationOptions;

            /** An object that defines the animation options used when the widget is being hidden. */
            hide?: fx.AnimationOptions;
        };

        /** The time span in milliseconds during which the Toast widget is visible. */
        displayTime?: number;
       
        height?: any;

        /** The Toast message text. */
        message?: string;
       
        position?: PositionOptions;
     
        shading?: boolean;

        /** Specifies the Toast widget type. */
        type?: string;
       
        width?: any;
        
        closeOnBackButton?: boolean;

        /** A Boolean value specifying whether or not the toast is closed if a user swipes it out of the screen boundaries. */
        closeOnSwipe?: boolean;

        /** A Boolean value specifying whether or not the toast is closed if a user clicks it. */
        closeOnClick?: boolean;
    }

    /** The Toast is a widget that provides pop-up notifications. */
    export class dxToast extends dxOverlay {
        constructor(element: JQuery, options?: dxToastOptions);
        constructor(element: Element, options?: dxToastOptions);
    }

    export interface dxTextEditorOptions extends EditorOptions {
        /** A handler for the change event. */
        onChange?: Function;

        /** A handler for the copy event. */
        onCopy?: Function;

        /** A handler for the cut event. */
        onCut?: Function;

        /** A handler for the enterKey event. */
        onEnterKey?: Function;

        /** A handler for the focusIn event. */
        onFocusIn?: Function;

        /** A handler for the focusOut event. */
        onFocusOut?: Function;

        /** A handler for the input event. */
        onInput?: Function;

        /** A handler for the keyDown event. */
        onKeyDown?: Function;

        /** A handler for the keyPress event. */
        onKeyPress?: Function;

        /** A handler for the keyUp event. */
        onKeyUp?: Function;

        /** A handler for the paste event. */
        onPaste?: Function;

        /** The text displayed by the widget when the widget value is empty. */
        placeholder?: string;

        /** Specifies whether to display the Clear button in the widget. */
        showClearButton?: boolean;

        /** Specifies the current value displayed by the widget. */
        value?: any;

        /** Specifies DOM event names that update a widget's value. */
        valueChangeEvent?: string;

        /** Specifies whether or not the widget checks the inner text for spelling mistakes. */
        spellcheck?: boolean;

        
        attr?: Object;

        /** Specifies the attributes to be passed on to the underlying HTML element. */
        inputAttr?: Object;

        /** The read-only option that holds the text displayed by the widget input element. */
        text?: string;
      
        focusStateEnabled?: boolean;
        
        hoverStateEnabled?: boolean;

        /** The editor mask that specifies the format of the entered string. */
        mask?: string;

        /** Specifies a mask placeholder character. */
        maskChar?: string;

        /** Specifies custom mask rules. */
        maskRules?: Object;

        /** A message displayed when the entered text does not match the specified pattern. */
        maskInvalidMessage?: string;

        /** Specifies whether the value should contain mask characters or not. */
        useMaskedValue?: boolean;

        
        name?: string;
    }

    /** A base class for text editing widgets. */
    export class dxTextEditor extends Editor {
        constructor(element: JQuery, options?: dxTextEditorOptions);
        constructor(element: Element, options?: dxTextEditorOptions);

        /** Removes focus from the input element. */
        blur(): void;

        /** Sets focus to the input element representing the widget. */
        focus(): void;
    }

    export interface dxTextBoxOptions extends dxTextEditorOptions {
        /** Specifies the maximum number of characters you can enter into the textbox. */
        maxLength?: any;

        /** The "mode" attribute value of the actual HTML input element representing the text box. */
        mode?: string;
    }

    /** The TextBox is a widget that enables a user to enter and edit a single line of text. */
    export class dxTextBox extends dxTextEditor {
        constructor(element: JQuery, options?: dxTextBoxOptions);
        constructor(element: Element, options?: dxTextBoxOptions);
    }

    export interface dxTextAreaOptions extends dxTextBoxOptions {
        
        /** Specifies whether or not the widget checks the inner text for spelling mistakes. */
        spellcheck?: boolean;

        /** Specifies the minimum height of the widget. */
        minHeight?: any;

        /** Specifies the maximum height of the widget. */
        maxHeight?: any;

        /** A Boolean value specifying whether or not the auto resizing mode is enabled. */
        autoResizeEnabled?: boolean;
    }

    /** The TextArea is a widget that enables a user to enter and edit a multi-line text. */
    export class dxTextArea extends dxTextBox {
        constructor(element: JQuery, options?: dxTextAreaOptions);
        constructor(element: Element, options?: dxTextAreaOptions);
    }

    export interface dxTabsOptions extends CollectionWidgetOptions {
        
        /** Specifies whether the widget enables an end-user to select only a single item or multiple items. */
        selectionMode?: string;

        /** Specifies whether or not an end-user can scroll tabs by swiping. */
        scrollByContent?: boolean;

        /** Specifies whether or not an end-user can scroll tabs. */
        scrollingEnabled?: boolean;

        /** A Boolean value that specifies the availability of navigation buttons. */
        showNavButtons?: boolean;
    }

    /** The Tabs is a tab strip used to switch between pages or views. This widget is included in the TabPanel widget, but you can use the Tabs separately as well. */
    export class dxTabs extends CollectionWidget {
        constructor(element: JQuery, options?: dxTabsOptions);
        constructor(element: Element, options?: dxTabsOptions);

    }

    export interface dxTabPanelOptions extends dxMultiViewOptions {
        
        /** A handler for the titleClick event. */
        onTitleClick?: any;

        /** A handler for the titleHold event. */
        onTitleHold?: Function;

        /** A handler for the titleRendered event. */
        onTitleRendered?: Function;

        /** Specifies a custom template for an item title. */
        itemTitleTemplate?: any;

        /** A Boolean value specifying if tabs in the title are scrolled by content. */
        scrollByContent?: boolean;

        /** A Boolean indicating whether or not to add scrolling support for tabs in the title. */
        scrollingEnabled?: boolean;

        /** A Boolean value that specifies the availability of navigation buttons. */
        showNavButtons?: boolean;
    }

    /** The TabPanel is a widget consisting of the Tabs and MultiView widgets. It automatically synchronizes the selected tab with the currently displayed view and vice versa. */
    export class dxTabPanel extends dxMultiView {
        constructor(element: JQuery, options?: dxTabPanelOptions);
        constructor(element: Element, options?: dxTabPanelOptions);

    }

    export interface dxSelectBoxOptions extends dxDropDownListOptions {

        /** Specifies DOM event names that update a widget's value. */
        valueChangeEvent?: string;

        /** The template to be used for rendering the widget text field. Must contain the TextBox widget. */
        fieldTemplate?: any;

        /** The text that is provided as a hint in the select box editor. */
        placeholder?: string;

        /** Specifies whether the widget allows a user to enter a custom value. Requires the onCustomItemCreating handler implementation. */
        acceptCustomValue?: boolean;

        /** Specifies whether or not to display selection controls. */
        showSelectionControls?: boolean;

        /** A handler for the customItemCreating event. Executed when a user adds a custom item. Requires acceptCustomValue to be set to true. */
        onCustomItemCreating?: Function;
    }

    /** The SelectBox widget is an editor that allows an end user to select an item from a drop-down list. */
    export class dxSelectBox extends dxDropDownList {
        constructor(element: JQuery, options?: dxSelectBoxOptions);
        constructor(element: Element, options?: dxSelectBoxOptions);
    }

    export interface dxTagBoxOptions extends dxSelectBoxOptions {

        values?: Array<any>;

        /** Specifies the selected items. */
        value?: Array<any>;

        /** Gets the currently selected items. */
        selectedItems?: Array<any>;

        /** Specifies how the widget applies values. */
        applyValueMode?: string;

        /** A Boolean value specifying whether or not to hide selected items. */
        hideSelectedItems?: boolean;

        /** Specifies the mode in which all items are selected. */
        selectAllMode?: string;

        /** A handler for the selectAllValueChanged event. */
        onSelectAllValueChanged?: Function;

        /** A Boolean value specifying whether or not the widget is multiline. */
        multiline?: boolean;

        /** A handler for the selectionChanged event. */
        onSelectionChanged?: Function;

        /** Specifies a custom template for a tag. */
        tagTemplate?: any;
    }

    /** The TagBox widget is an editor that allows an end user to select multiple items from a drop-down list. */
    export class dxTagBox extends dxSelectBox {
        constructor(element: JQuery, options?: dxTagBoxOptions);
        constructor(element: Element, options?: dxTagBoxOptions);
    }

    export interface dxScrollViewOptions extends dxScrollableOptions {
        /** A handler for the pullDown event. */
        onPullDown?: Function;

        /** Specifies the text shown in the pullDown panel when pulling the content down lowers the refresh threshold. */
        pulledDownText?: string;

        /** Specifies the text shown in the pullDown panel while pulling the content down to the refresh threshold. */
        pullingDownText?: string;

        /** A handler for the reachBottom event. */
        onReachBottom?: Function;

        /** Specifies the text shown in the pullDown panel displayed when content is scrolled to the bottom. */
        reachBottomText?: string;

        /** Specifies the text shown in the pullDown panel displayed when the content is being refreshed. */
        refreshingText?: string;
    }

    /** The ScrollView is a widget that enables a user to scroll its content. */
    export class dxScrollView extends dxScrollable {
        constructor(element: JQuery, options?: dxScrollViewOptions);
        constructor(element: Element, options?: dxScrollViewOptions);

        /** Returns a value indicating if the scrollView content is larger then the widget container. */
        isFull(): boolean;

        /** Locks the widget until the release(preventScrollBottom) method is called and executes the function passed to the onPullDown option and the handler assigned to the pullDown event. */
        refresh(): void;

        /** Notifies the scroll view that data loading is finished. */
        release(preventScrollBottom: boolean): JQueryPromise<void>;

        /** Toggles the loading state of the widget. */
        toggleLoading(showOrHide: boolean): void;
    }

    export interface dxScrollableLocation {
        top?: number;
        left?: number;
    }

    export interface dxScrollableOptions extends DOMComponentOptions {
        /** A string value specifying the available scrolling directions. */
        direction?: string;

        /** A Boolean value specifying whether or not the widget can respond to user interaction. */
        disabled?: boolean;

        /** A handler for the scroll event. */
        onScroll?: Function;

        /** Specifies when the widget shows the scrollbar. */
        showScrollbar?: string;

        /** A handler for the update event. */
        onUpdated?: Function;

        /** Indicates whether to use native or simulated scrolling. */
        useNative?: boolean;

        /** A Boolean value specifying whether to enable or disable the bounce-back effect. */
        bounceEnabled?: boolean;

        /** A Boolean value specifying whether or not an end-user can scroll the widget content swiping it up or down. Applies only if useNative is false */
        scrollByContent?: boolean;

        /** A Boolean value specifying whether or not an end-user can scroll the widget content using the scrollbar. */
        scrollByThumb?: boolean;
    }

    /** A widget used to display scrollable content. */
    export class dxScrollable extends DOMComponent {
        constructor(element: JQuery, options?: dxScrollableOptions);
        constructor(element: Element, options?: dxScrollableOptions);

        /** Returns the height of the scrollable widget in pixels. */
        clientHeight(): number;

        /** Returns the width of the scrollable widget in pixels. */
        clientWidth(): number;

        /** Returns an HTML element of the widget. */
        content(): JQuery;

        /** Scrolls the widget content by the specified number of pixels. */
        scrollBy(distance: number): void;

        /** Scrolls widget content by the specified number of pixels in horizontal and vertical directions. */
        scrollBy(distanceObject: dxScrollableLocation): void;

        /** Returns the height of the scrollable content in pixels. */
        scrollHeight(): number;

        /** Returns the current scroll position against the leftmost position. */
        scrollLeft(): number;

        /** Returns how far the scrollable content is scrolled from the top and from the left. */
        scrollOffset(): dxScrollableLocation;

        /** Scrolls widget content to the specified position. */
        scrollTo(targetLocation: number): void;

        /** Scrolls widget content to a specified position. */
        scrollTo(targetLocation: dxScrollableLocation): void;

        /** Scrolls widget content to the specified element. */
        scrollToElement(element: Element): void;

        /** Returns the current scroll position against the topmost position. */
        scrollTop(): number;

        /** Returns the width of the scrollable content in pixels. */
        scrollWidth(): number;

        /** Updates the dimensions of the scrollable contents. */
        update(): JQueryPromise<void>;
    }

    export interface dxRadioGroupOptions extends EditorOptions, DataExpressionMixinOptions {

        activeStateEnabled?: boolean;

        /** Specifies the radio group layout. */
        layout?: string;

        name?: string;
    }

    
    /** The RadioGroup is a widget that contains a set of radio buttons and allows an end user to make a single selection from the set. */
    export class dxRadioGroup extends CollectionWidget {
        constructor(element: JQuery, options?: dxRadioGroupOptions);
        constructor(element: Element, options?: dxRadioGroupOptions);
    }

    export interface dxPopupToolbarItemOptions {
        /** Specifies whether or not a toolbar item must be displayed disabled. */
        disabled?: boolean;

        /** Specifies html code inserted into the toolbar item element. */
        html?: string;

        /** Specifies a location for the item on the toolbar. */
        location?: string;

        /** Specifies a configuration object for the widget that presents a toolbar item. */
        options?: Object;

        /** Specifies an item template that should be used to render this item only. */
        template?: any;

        /** Specifies text displayed for the toolbar item. */
        text?: string;

        /** Specifies whether the item is displayed on a top or bottom toolbar. */
        toolbar?: string;

        /** Specifies whether or not a widget item must be displayed. */
        visible?: boolean;

        /** A widget that presents a toolbar item. */
        widget?: string;
    }

    export interface dxPopupOptions extends dxOverlayOptions {

        /** Specifies whether or not to allow a user to drag the popup window. */
        dragEnabled?: boolean;

        /** Specifies whether or not an end user can resize the widget. */
        resizeEnabled?: boolean;

        /** A handler for the resizeStart event. */
        onResizeStart?: Function;

        /** A handler for the resize event. */
        onResize?: Function;

        /** A handler for the resizeEnd event. */
        onResizeEnd?: Function;

        /** A Boolean value specifying whether or not to display the widget in full-screen mode. */
        fullScreen?: boolean;

        
        position?: PositionOptions;

        /** A Boolean value specifying whether or not to display the title in the popup window. */
        showTitle?: boolean;

        /** The title in the overlay window. */
        title?: string;

        /** A template to be used for rendering the widget title. */
        titleTemplate?: any;

        
        width?: any;

        

        /** Specifies items displayed on the top or bottom toolbar of the popup window. */
        toolbarItems?: Array<dxPopupToolbarItemOptions>;

        /** Specifies whether or not the widget displays the Close button. */
        showCloseButton?: boolean;

        /** A handler for the titleRendered event. */
        onTitleRendered?: Function;
    }

    /** The Popup widget is a pop-up window overlaying the current view. */
    export class dxPopup extends dxOverlay {
        constructor(element: JQuery, options?: dxPopupOptions);
        constructor(element: Element, options?: dxPopupOptions);
    }

    export interface dxPopoverOptions extends dxPopupOptions {

        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: {
            /** An object that defines the animation options used when the widget is being shown. */
            show?: fx.AnimationOptions;

            /** An object that defines the animation options used when the widget is being hidden. */
            hide?: fx.AnimationOptions;
        };

        /** Specifies the widget's height. */
        height?: any;

        /** An object defining widget positioning options. */
        position?: PositionOptions;

        shading?: boolean;

        /** A Boolean value specifying whether or not to display the title in the overlay window. */
        showTitle?: boolean;

        /** The target element associated with a popover. */
        target?: any;

        /** Specifies the widget's width. */
        width?: any;

        /** Specifies options for displaying the widget. */
        showEvent?: {
        /** Specifies the event names on which the widget is shown. */
            name?: String;

            /** The delay in milliseconds after which the widget is displayed. */
            delay?: Number;
        };

        /** Specifies options of popover hiding. */
        hideEvent?: {
        /** Specifies the event names on which the widget is hidden. */
            name?: String;

            /** The delay in milliseconds after which the widget is hidden. */
            delay?: Number;
        };
    }

    /** The Popover is a widget that shows notifications within a box with an arrow pointing to a specified UI element. */
    export class dxPopover extends dxPopup {
        constructor(element: JQuery, options?: dxPopoverOptions);
        constructor(element: Element, options?: dxPopoverOptions);

        /** Displays the widget for the specified target element. */
        show(target?: any): JQueryPromise<void>;

    }

    export interface dxOverlayOptions extends WidgetOptions {

        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: {
            /** An object that defines the animation options used when the widget is being shown. */
            show?: fx.AnimationOptions;

            /** An object that defines the animation options used when the widget is being hidden. */
            hide?: fx.AnimationOptions;
        };

        /** A Boolean value specifying whether or not the widget is closed if a user presses the Back hardware button. */
        closeOnBackButton?: boolean;

        /** A Boolean value specifying whether or not the widget is closed if a user clicks outside of the overlapping window. */
        closeOnOutsideClick?: any;

        /** A template to be used for rendering widget content. */
        contentTemplate?: any;

        /** Specifies whether widget content is rendered when the widget is shown or when rendering the widget. */
        deferRendering?: boolean;

        /** Specifies whether or not an end-user can drag the widget. */
        dragEnabled?: boolean;

        /** The height of the widget in pixels. */
        height?: any;

        /** Specifies the maximum height the widget can reach while resizing. */
        maxHeight?: any;

        /** Specifies the maximum width the widget can reach while resizing. */
        maxWidth?: any;

        /** Specifies the minimum height the widget can reach while resizing. */
        minHeight?: any;

        /** Specifies the minimum width the widget can reach while resizing. */
        minWidth?: any;

        /** A handler for the hidden event. */
        onHidden?: Function;

        /** A handler for the hiding event. */
        onHiding?: Function;

        /** An object defining widget positioning options. */
        position?: PositionOptions;

        /** A Boolean value specifying whether or not the main screen is inactive while the widget is active. */
        shading?: boolean;

        /** Specifies the shading color. */
        shadingColor?: string;

        /** A handler for the showing event. */
        onShowing?: Function;

        /** A handler for the shown event. */
        onShown?: Function;

        /** A Boolean value specifying whether or not the widget is visible. */
        visible?: boolean;

        /** The widget width in pixels. */
        width?: any;
    }

    /** A widget displaying the required content in an overlay window. */
    export class dxOverlay extends Widget {
        constructor(element: JQuery, options?: dxOverlayOptions);
        constructor(element: Element, options?: dxOverlayOptions);

        /** An HTML element of the widget. */
        content(): JQuery;

        /** Hides the widget. */
        hide(): JQueryPromise<void>;

        /** Recalculates the overlay's size and position. */
        repaint(): void;

        /** Shows the widget. */
        show(): JQueryPromise<void>;

        /** Toggles the visibility of the widget. */
        toggle(showing: boolean): JQueryPromise<void>;

        /** An object that serves as a namespace for static methods that affect overlay widgets. */
        /** A static method that specifies the base z-index for all overlay widgets. */
        static baseZIndex(zIndex: number): void;
    }

    export interface dxNumberBoxOptions extends dxTextEditorOptions {

        /** The maximum value accepted by the number box. */
        max?: number;

        /** The minimum value accepted by the number box. */
        min?: number;

        /** Specifies whether to show the buttons that change the value by a step. */
        showSpinButtons?: boolean;

        /** Specifies whether to use touch friendly spin buttons. Applies only if showSpinButtons is true. */
        useLargeSpinButtons?: boolean;

        /** Specifies by which value the widget value changes when a spin button is clicked. */
        step?: number;

        /** The current number box value. */
        value?: number;

        /** Specifies the value to be passed to the type attribute of the underlying `<input>` element. */
        mode?: string;

        /** Specifies the text of the message displayed if the specified value is not a number. */
        invalidValueMessage?: string;
    }

    /** The NumberBox is a widget that displays a numeric value and allows a user to modify it by typing in a value, and incrementing or decrementing it using the keyboard or mouse. */
    export class dxNumberBox extends dxTextEditor {
        constructor(element: JQuery, options?: dxNumberBoxOptions);
        constructor(element: Element, options?: dxNumberBoxOptions);
    }

    export interface dxNavBarOptions extends dxTabsOptions {
        
        scrollingEnabled?: boolean;

        
        
    }

    /** The NavBar is a widget that navigates the application views. */
    export class dxNavBar extends dxTabs {
        constructor(element: JQuery, options?: dxNavBarOptions);
        constructor(element: Element, options?: dxNavBarOptions);

        
    }

    export interface dxMultiViewOptions extends CollectionWidgetOptions {

        /** Specifies whether or not to animate the displayed item change. */
        animationEnabled?: boolean;

        /** A Boolean value specifying whether or not to scroll back to the first item after the last item is swiped. */
        loop?: boolean;

        /** The index of the currently displayed item. */
        selectedIndex?: number;

        /** A Boolean value specifying whether or not to allow users to change the selected index by swiping. */
        swipeEnabled?: boolean;

        /** Specifies whether widget content is rendered when the widget is shown or when rendering the widget. */
        deferRendering?: boolean;
    }

    /** The MultiView is a widget that contains several views. An end user navigates through the views by swiping them in the horizontal direction. */
    export class dxMultiView extends CollectionWidget {
        constructor(element: JQuery, options?: dxMultiViewOptions);
        constructor(element: Element, options?: dxMultiViewOptions);

        
    }

    
    export interface dxMapLocation {
        /** The latitude location of the widget. */
        lat?: number;

        /** The longitude location of the widget. */
        lng?: number;
    }

    export interface dxMapMarker {
        /** A URL pointing to the custom icon to be used for the marker. */
        iconSrc?: string;

        /** Specifies the marker location. */
        location?: dxMapLocation;

        /** A callback function performed when the marker is clicked. */
        onClick?: Function;

        /** A tooltip to be used for the marker. */
        tooltip?: {
            /** Specifies whether a tooltip is visible by default or not. */
            isShown?: boolean;

            /** Specifies the tooltip text. */
            text?: string;
        }
    }

    export interface dxMapRoute {
        /** Specifies the color of the line displaying the route. */
        color?: string;

        /** Specifies a transportation mode to be used in the displayed route. */
        mode?: string;

        /** Specifies the opacity of the line displaying the route. */
        opacity?: number;

        /** Contains an array of objects making up the route. */
        locations?: Array<dxMapLocation>;

        /** Specifies the thickness of the line displaying the route in pixels. */
        weight?: number;
    }

    export interface dxMapOptions extends WidgetOptions {
        /** Specifies whether or not the widget automatically adjusts center and zoom option values when adding a new marker or route, or when creating a widget if it initially contains markers or routes. */
        autoAdjust?: boolean;

        center?: dxMapLocation;

        /** A handler for the click event. */
        onClick?: any;

        /** Specifies whether or not map widget controls are available. */
        controls?: boolean;

        /** Specifies the widget's height. */
        height?: any;

        /** A key used to authenticate the application within the required map provider. */
        key?: {
            /** A key used to authenticate the application within the "Bing" map provider. */
            bing?: string;

            /** A key used to authenticate the application within the "Google" map provider. */
            google?: string;

            /** A key used to authenticate the application within the "Google Static" map provider. */
            googleStatic?: string;
        }

        /** A handler for the markerAdded event. */
        onMarkerAdded?: Function;

        /** A URL pointing to the custom icon to be used for map markers. */
        markerIconSrc?: string;

        /** A handler for the markerRemoved event. */
        onMarkerRemoved?: Function;

        /** An array of markers displayed on a map. */
        markers?: Array<dxMapMarker>;

        /** The name of the current map data provider. */
        provider?: string;

        /** A handler for the ready event. */
        onReady?: Function;

        /** A handler for the routeAdded event. */
        onRouteAdded?: Function;

        /** A handler for the routeRemoved event. */
        onRouteRemoved?: Function;

        /** An array of routes shown on the map. */
        routes?: Array<dxMapRoute>;

        /** The type of a map to display. */
        type?: string;

        /** Specifies the widget's width. */
        width?: any;

        /** The zoom level of the map. */
        zoom?: number;
    }

    /** The Map is an interactive widget that displays a geographic map with markers and routes. */
    export class dxMap extends Widget {
        constructor(element: JQuery, options?: dxMapOptions);
        constructor(element: Element, options?: dxMapOptions);

        /** Adds a marker to the map. */
        addMarker(markerOptions: Object): JQueryPromise<Object>;

        /** Adds a route to the map. */
        addRoute(routeOptions: Object): JQueryPromise<Object>;

        /** Removes a marker from the map. */
        removeMarker(marker: Object): JQueryPromise<void>;

        /** Removes a route from the map. */
        removeRoute(route: any): JQueryPromise<void>;
    }

    export interface dxLookupOptions extends dxDropDownListOptions {

        applyValueMode?: string;

        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: {
            /** An object that defines the animation options used when the widget is being shown. */
            show?: fx.AnimationOptions;
            /** An object that defines the animation options used when the widget is being hidden. */
            hide?: fx.AnimationOptions;
        };

        /** The text displayed on the Cancel button. */
        cancelButtonText?: string;

        /** The text displayed on the Clear button. */
        clearButtonText?: string;

        /** Specifies whether or not the widget cleans the search box when the popup window is displayed. */
        cleanSearchOnOpening?: boolean;

        /** A Boolean value specifying whether or not a widget is closed if a user clicks outside of the overlaying window. */
        closeOnOutsideClick?: any;

        /** The text displayed on the Apply button. */
        applyButtonText?: string;

        /** A Boolean value specifying whether or not to display the lookup in full-screen mode. */
        fullScreen?: boolean;

        
        focusStateEnabled?: boolean;

        /** A Boolean value specifying whether or not to group widget items. */
        grouped?: boolean;

        /** Specifies a custom template for a group caption. */
        groupTemplate?: any;

        /** The text displayed on the button used to load the next page from the data source. */
        nextButtonText?: string;

        /** A handler for the pageLoading event. */
        onPageLoading?: Function;

        /** Specifies whether the next page is loaded when a user scrolls the widget to the bottom or when the "next" button is clicked. */
        pageLoadMode?: string;

        /** Specifies the text shown in the pullDown panel, which is displayed when the widget is scrolled to the bottom. */
        pageLoadingText?: string;

        /** The text displayed by the widget when nothing is selected. */
        placeholder?: string;

        /** The height of the widget popup element. */
        popupHeight?: any;

        /** The width of the widget popup element. */
        popupWidth?: any;

        /** An object defining widget positioning options. */
        position?: PositionOptions;

        /** Specifies the text displayed in the pullDown panel when the widget is pulled below the refresh threshold. */
        pulledDownText?: string;

        /** Specifies the text shown in the pullDown panel while the list is being pulled down to the refresh threshold. */
        pullingDownText?: string;

        /** A handler for the pullRefresh event. */
        onPullRefresh?: Function;

        /** A Boolean value specifying whether or not the widget supports the "pull down to refresh" gesture. */
        pullRefreshEnabled?: boolean;

        /** Specifies the text displayed in the pullDown panel while the widget is being refreshed. */
        refreshingText?: string;

        /** A handler for the scroll event. */
        onScroll?: Function;

        /** A Boolean value specifying whether or not the search bar is visible. */
        searchEnabled?: boolean;

        /** The text that is provided as a hint in the lookup's search bar. */
        searchPlaceholder?: string;

        /** A Boolean value specifying whether or not the main screen is inactive while the lookup is active. */
        shading?: boolean;

        /** Specifies whether to display the Cancel button in the lookup window. */
        showCancelButton?: boolean;

        /**
         * A Boolean value specifying whether the widget loads the next page automatically when you reach the bottom of the list or when a button is clicked.
         * @deprecated Use the pageLoadMode option instead.
         */
        showNextButton?: boolean;

        /** The title of the lookup window. */
        title?: string;

        /** A template to be used for rendering the widget title. */
        titleTemplate?: any;

        /** Specifies whether or not the widget uses native scrolling. */
        useNativeScrolling?: boolean;

        /** Specifies whether or not to show lookup contents in a Popover widget. */
        usePopover?: boolean;

        /** A handler for the valueChanged event. */
        onValueChanged?: Function;

        /** A handler for the titleRendered event. */
        onTitleRendered?: Function;

        /** A Boolean value specifying whether or not to display the title in the popup window. */
        showPopupTitle?: boolean;

        /** The template to be used for rendering the widget text field. */
        fieldTemplate?: any;
    }

    /** The Lookup is a widget that allows an end user to search for an item in a collection shown in a drop-down menu. */
    export class dxLookup extends dxDropDownList {
        constructor(element: JQuery, options?: dxLookupOptions);
        constructor(element: Element, options?: dxLookupOptions);
    }

    export interface dxLoadPanelOptions extends dxOverlayOptions {

        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: {
            
            show?: fx.AnimationOptions;

            
            hide?: fx.AnimationOptions;
        };

        /** The delay in milliseconds after which the load panel is displayed. */
        delay?: number;

        /** The height of the widget. */
        height?: number;

        /** A URL pointing to an image to be used as a load indicator. */
        indicatorSrc?: string;

        /** The text displayed in the load panel. */
        message?: string;

        /** A Boolean value specifying whether or not to show a load indicator. */
        showIndicator?: boolean;

        /** A Boolean value specifying whether or not to show the pane behind the load indicator. */
        showPane?: boolean;

        /** Specifies the widget's width. */
        width?: number;

        /** Specifies whether or not the widget can be focused. */
        focusStateEnabled?: boolean;
    }

    /** The LoadPanel is an overlay widget notifying the viewer that loading is in progress. */
    export class dxLoadPanel extends dxOverlay {
        constructor(element: JQuery, options?: dxLoadPanelOptions);
        constructor(element: Element, options?: dxLoadPanelOptions);

    }

    export interface dxLoadIndicatorOptions extends WidgetOptions {

        /** Specifies the path to an image used as the indicator. */
        indicatorSrc?: string;
    }

    /** The LoadIndicator is a UI element notifying the viewer that a process is in progress. */
    export class dxLoadIndicator extends Widget {
        constructor(element: JQuery, options?: dxLoadIndicatorOptions);
        constructor(element: Element, options?: dxLoadIndicatorOptions);

    }

    export interface ListOptionsMenuItem {
        /** Specifies the menu item text. */
        text?: string;

        /** Holds on a function called when the item is clicked. */
        action?: (itemElement: Element, itemData: any) => void;
    }

    export interface dxListOptions extends CollectionWidgetOptions {

        /** Specifies whether data items should be grouped. */
        grouped?: boolean;

        /** The template to be used for rendering item groups.
            Specifies a custom template for a group caption. */
        groupTemplate?: any;

        
        onItemDeleting?: Function;

        /** A handler for the itemDeleted event. */
        onItemDeleted?: Function;

        /** A handler for the groupRendered event. */
        onGroupRendered?: Function;

        /** A handler for the itemReordered event. */
        onItemReordered?: Function;

        /** A handler for the itemClick event. */
        onItemClick?: any;

        /** A handler for the itemSwipe event. */
        onItemSwipe?: Function;

        /** The text displayed on the button used to load the next page from the data source. */
        nextButtonText?: string;

        /** A handler for the pageLoading event. */
        onPageLoading?: Function;

        /** Specifies the text shown in the pullDown panel, which is displayed when the list is scrolled to the bottom. */
        pageLoadingText?: string;

        /** Specifies the text displayed in the pullDown panel when the list is pulled below the refresh threshold. */
        pulledDownText?: string;

        /** Specifies the text shown in the pullDown panel while the list is being pulled down to the refresh threshold. */
        pullingDownText?: string;

        /** A handler for the pullRefresh event. */
        onPullRefresh?: Function;

        /** A Boolean value specifying whether or not the widget supports the "pull down to refresh" gesture. */
        pullRefreshEnabled?: boolean;

        /** Specifies the text displayed in the pullDown panel while the list is being refreshed. */
        refreshingText?: string;

        /** A handler for the scroll event. */
        onScroll?: Function;

        /** A Boolean value specifying whether to enable or disable list scrolling. */
        scrollingEnabled?: boolean;

        /** Specifies when the widget shows the scrollbar. */
        showScrollbar?: string;

        /** Specifies whether or not the widget uses native scrolling. */
        useNativeScrolling?: boolean;

        /** A Boolean value specifying whether to enable or disable the bounce-back effect. */
        bounceEnabled?: boolean;

        /** A Boolean value specifying if the list is scrolled by content. */
        scrollByContent?: boolean;

        /** A Boolean value specifying if the list is scrolled using the scrollbar. */
        scrollByThumb?: boolean;

        
        onItemContextMenu?: Function;

        
        onItemHold?: Function;

        /** Specifies whether or not an end-user can collapse groups. */
        collapsibleGroups?: boolean;

        /** Specifies whether the next page is loaded when a user scrolls the widget to the bottom or when the "next" button is clicked. */
        pageLoadMode?: string;

        /** Specifies whether or not to display controls used to select list items. */
        showSelectionControls?: boolean;

        /** Specifies item selection mode. */
        selectionMode?: string;

        /** Specifies the mode in which all items are selected. */
        selectAllMode?: string;

        
        selectAllText?: string;

        /** A handler for the selectAllValueChanged event. */
        onSelectAllValueChanged?: Function;

        /** Specifies the array of items for a context menu called for a list item. */
        menuItems?: Array<ListOptionsMenuItem>;

        /** Specifies whether an item context menu is shown when a user holds or swipes an item. */
        menuMode?: string;

        /** Specifies whether or not an end user can delete list items. */
        allowItemDeleting?: boolean;

        /** Specifies the way a user can delete items from the list. */
        itemDeleteMode?: string;

        /** Specifies whether or not an end user can reorder list items. */
        allowItemReordering?: boolean;

        /** Specifies whether or not to show the loading panel when the DataSource bound to the widget is loading data. */
        indicateLoading?: boolean;

        
        activeStateEnabled?: boolean;
    }

    /** The List is a widget that represents a collection of items in a scrollable list. */
    export class dxList extends CollectionWidget {
        constructor(element: JQuery, options?: dxListOptions);
        constructor(element: Element, options?: dxListOptions);

        /** Returns the height of the widget in pixels. */
        clientHeight(): number;

        /** Removes the specified item from the list. */
        deleteItem(itemIndex: any): JQueryPromise<void>;

        /** Removes the specified item from the list. */
        deleteItem(itemElement: Element): JQueryPromise<void>;

        /** Returns a Boolean value that indicates whether or not the specified item is selected. */
        isItemSelected(itemIndex: any): boolean;

        /** Returns a Boolean value that indicates whether or not the specified item is selected. */
        isItemSelected(itemElement: Element): boolean;

        /** Reloads list data. */
        reload(): void;

        /** Moves the specified item to the specified position in the list. */
        reorderItem(itemElement: Element, toItemElement: Element): JQueryPromise<void>;

        /** Moves the specified item to the specified position in the list. */
        reorderItem(itemIndex: any, toItemIndex: any): JQueryPromise<void>;

        /** Scrolls the list content by the specified number of pixels. */
        scrollBy(distance: number): void;

        /** Returns the height of the list content in pixels. */
        scrollHeight(): number;

        /** Scrolls list content to the specified position. */
        scrollTo(location: number): void;

        /** Scrolls the list to the specified item. */
        scrollToItem(itemElement: Element): void;

        /** Scrolls the list to the specified item. */
        scrollToItem(itemIndex: any): void;

        /** Returns how far the list content is scrolled from the top. */
        scrollTop(): number;

        /** Selects all items. */
        selectAll(): void;

        /** Clears selection of all items. */
        unselectAll(): void;

        /** Selects the specified item. */
        selectItem(itemElement: Element): void;

        /** Selects the specified item from the list. */
        selectItem(itemIndex: any): void;

        /** Clears selection of the specified item. */
        unselectItem(itemElement: Element): void;

        /** Clears selection of the specified item from the list. */
        unselectItem(itemIndex: any): void;

        /** Updates the widget scrollbar according to widget content size. */
        updateDimensions(): JQueryPromise<void>;

        /** Expands the specified group. */
        expandGroup(groupIndex: number): JQueryPromise<void>;

        /** Collapses the specified group. */
        collapseGroup(groupIndex: number): JQueryPromise<void>;
    }

    export interface dxGalleryOptions extends CollectionWidgetOptions {

        /** The time, in milliseconds, spent on slide animation. */
        animationDuration?: number;

        /** Specifies whether or not to animate the displayed item change. */
        animationEnabled?: boolean;

        /** A Boolean value specifying whether or not to allow users to switch between items by clicking an indicator. */
        indicatorEnabled?: boolean;

        /** A Boolean value specifying whether or not to scroll back to the first item after the last item is swiped. */
        loop?: boolean;

        /** The index of the currently active gallery item. */
        selectedIndex?: number;

        /** A Boolean value specifying whether or not to display an indicator that points to the selected gallery item. */
        showIndicator?: boolean;

        /** A Boolean value that specifies the availability of the "Forward" and "Back" navigation buttons. */
        showNavButtons?: boolean;

        /** The time interval in milliseconds, after which the gallery switches to the next item. */
        slideshowDelay?: number;

        /** A Boolean value specifying whether or not to allow users to switch between items by swiping. */
        swipeEnabled?: boolean;

        /** Specifies whether or not to display parts of previous and next images along the sides of the current image. */
        wrapAround?: boolean;

        /** Specifies if the widget stretches images to fit the total gallery width. */
        stretchImages?: boolean;

        /** Specifies the width of an area used to display a single image. */
        initialItemWidth?: number;
    }

    /** The Gallery is a widget that displays a collection of images in a carousel. The widget is supplied with various navigation controls that allow a user to switch between images. */
    export class dxGallery extends CollectionWidget {
        constructor(element: JQuery, options?: dxGalleryOptions);
        constructor(element: Element, options?: dxGalleryOptions);

        /** Shows the specified gallery item. */
        goToItem(itemIndex: number, animation: boolean): JQueryPromise<any>;

        /** Shows the next gallery item. */
        nextItem(animation: boolean): JQueryPromise<any>;

        /** Shows the previous gallery item. */
        prevItem(animation: boolean): JQueryPromise<any>;
    }

    export interface dxDropDownEditorOptions extends dxTextBoxOptions {

        /** Specifies the currently selected value. */
        value?: any;

        /** A handler for the closed event. */
        onClosed?: Function;

        /** A handler for the opened event. */
        onOpened?: Function;

        /** Specifies whether or not the drop-down editor is displayed. */
        opened?: boolean;

        
        fieldEditEnabled?: boolean;

        /** Specifies whether or not the widget allows an end-user to enter a custom value. */
        acceptCustomValue?: boolean;

        /** Specifies the way an end-user applies the selected value. */
        applyValueMode?: string;

        /** Specifies whether widget content is rendered when the widget is shown or when rendering the widget. */
        deferRendering?: boolean;

        
        activeStateEnabled?: boolean;

        /** Specifies a custom template for the drop-down button. */
        dropDownButtonTemplate?: any;
    }

    /** A drop-down editor widget. */
    export class dxDropDownEditor extends dxTextBox {
        constructor(element: JQuery, options?: dxDropDownEditorOptions);
        constructor(element: Element, options?: dxDropDownEditorOptions);

        /** Closes the drop-down editor. */
        close(): void;

        /** Opens the drop-down editor. */
        open(): void;

        /** Resets the widget's value to null. */
        reset(): void;

        /** Returns an &lt;input&gt; element of the widget. */
        field(): JQuery;

        /** Returns an HTML element of the popup window content. */
        content(): JQuery;
    }

    export interface dxDropDownBoxOptions extends dxDropDownEditorOptions, DataExpressionMixinOptions {

        /** Specifies a custom template for the drop-down content. */
        contentTemplate?: any;

        /** Specifies whether the widget allows a user to enter a custom value. */
        acceptCustomValue?: boolean;

        /** Configures the drop-down field which holds the content. */
        dropDownOptions?: DevExpress.ui.dxPopupOptions;

        /** Specifies after which DOM events the widget updates the value. */
        valueChangeEvent?: string;
    }

    /** The DropDownBox widget consists of a text field, which displays the current value, and a drop-down field, which can contain any UI element. */
    export class dxDropDownBox extends dxDropDownEditor {
        constructor(element: JQuery, options?: dxDropDownBoxOptions);
        constructor(element: Element, options?: dxDropDownBoxOptions);
    }

    export interface dxDateBoxOptions extends dxDropDownEditorOptions {
        
        formatString?: any;

        /** Specifies the date display format. Ignored if the pickerType option is 'native' */
        displayFormat?: any;

        
        format?: string;

        /** A format used to display date/time information. */
        type?: string;

        /** The last date that can be selected within the widget. */
        max?: any;

        /** The minimum date that can be selected within the widget. */
        min?: any;

        /** The text displayed by the widget when the widget value is not yet specified. This text is also used as a title of the date picker. */
        placeholder?: string;

        /**
        * Specifies whether or not a user can pick out a date using the drop-down calendar.
        * @deprecated Use the pickerType option instead.
        */
        useCalendar?: boolean;

        /** Specifies the date-time value serialization format. Use it only if you do not specify the value at design time. */
        dateSerializationFormat?: string;

        /** An object or a value specifying the date and time currently selected using the date box. */
        value?: any;

        /**
         * Specifies whether or not the widget uses the native HTML input element.
         * @deprecated Use the pickerType option instead.
         */
        useNative?: boolean;

        /** Specifies the interval between neighboring values in the popup list in minutes. */
        interval?: number;

        /** Specifies the maximum zoom level of a calendar, which is used to pick the date. */
        maxZoomLevel?: string;

        /** Specifies the minimal zoom level of a calendar, which is used to pick the date. */
        minZoomLevel?: string;

        /** Specifies the type of the date/time picker. */
        pickerType?: string;

        /** Specifies the message displayed if the typed value is not a valid date or time. */
        invalidDateMessage?: string;

        /** Specifies the message displayed if the specified date is later than the max value or earlier than the min value. */
        dateOutOfRangeMessage?: string;

        /** The text displayed on the Apply button. */
        applyButtonText?: string;

        /** Specifies whether or not adaptive widget rendering is enabled on a small screen. */
        adaptivityEnabled?: boolean;

        /** The text displayed on the Cancel button. */
        cancelButtonText?: string;
    }

    /** The DateBox is a widget that displays date and time in a specified format, and enables a user to pick or type in the required date/time value. */
    export class dxDateBox extends dxDropDownEditor {

        constructor(element: JQuery, options?: dxDateBoxOptions);
        constructor(element: Element, options?: dxDateBoxOptions);
    }

    export interface dxCheckBoxOptions extends EditorOptions {

        activeStateEnabled?: boolean;

        /** Specifies the widget state. */
        value?: boolean;

        /** Specifies the text displayed by the check box. */
        text?: string;

        
        name?: string;
    }

    /** The CheckBox is a small box, which when selected by the end user, shows that a particular feature has been enabled or a specific option has been chosen. */
    export class dxCheckBox extends Editor {
        constructor(element: JQuery, options?: dxCheckBoxOptions);
        constructor(element: Element, options?: dxCheckBoxOptions);
    }

    export interface dxCalendarOptions extends EditorOptions {

        activeStateEnabled?: boolean;

        /** Specifies a date displayed on the current calendar page. */
        currentDate?: Date;

        /** Specifies the first day of a week. */
        firstDayOfWeek?: number;

        /** Specifies the date-time value serialization format. Use it only if you do not specify the value at design time. */
        dateSerializationFormat?: string;

        /** An object or a value specifying the date and time currently selected in the calendar. */
        value?: any;

        /** The latest date the widget allows to select. */
        max?: any;

        /** The earliest date the widget allows to select. */
        min?: any;

        /** Specifies whether or not the widget displays a button that selects the current date. */
        showTodayButton?: boolean;

        /** Specifies the current calendar zoom level. */
        zoomLevel?: string;

        /** Specifies the maximum zoom level of the calendar. */
        maxZoomLevel?: string;

        /** Specifies the minimum zoom level of the calendar. */
        minZoomLevel?: string;

        /** The template to be used for rendering calendar cells. */
        cellTemplate?: any;

        
        name?: string;
    }

    /** The Calendar is a widget that displays a calendar and allows an end user to select the required date within a specified date range. */
    export class dxCalendar extends Editor {
        constructor(element: JQuery, options?: dxCalendarOptions);
        constructor(element: Element, options?: dxCalendarOptions);
    }

    export interface dxButtonOptions extends WidgetOptions {

        /** A Boolean value specifying whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;

        /** A handler for the click event. */
        onClick?: any;

        /** Specifies the icon to be displayed on the button. */
        icon?: string;

        
        iconSrc?: string;

        /** A template to be used for rendering the Button widget. */
        template?: any;

        /** The text displayed on the button. */
        text?: string;

        /** Specifies the button type. */
        type?: string;

        /** Specifies the name of the validation group to be accessed in the click event handler. */
        validationGroup?: string;

        /** Specifies whether or not the button must submit an HTML form. */
        useSubmitBehavior?: boolean;
    }

    /** The Button widget is a simple button that performs specified commands when a user clicks it. */
    export class dxButton extends Widget {
        constructor(element: JQuery, options?: dxButtonOptions);
        constructor(element: Element, options?: dxButtonOptions);
    }

    export interface dxBoxOptions extends CollectionWidgetOptions {
        /** Specifies how widget items are aligned along the main direction. */
        align?: string;

        /** Specifies the direction of item positioning in the widget. */
        direction?: string;

        /** Specifies how widget items are aligned cross-wise. */
        crossAlign?: string;

    }

    /** The Box widget allows you to arrange various elements within it. Separate and adaptive, the Box widget acts as a building block for the layout. */
    export class dxBox extends CollectionWidget {
        constructor(element: JQuery, options?: dxBoxOptions);
        constructor(element: Element, options?: dxBoxOptions);

    }

    export interface dxResponsiveBoxOptions extends CollectionWidgetOptions {

        /** Specifies the collection of rows for the grid used to position layout elements. */
        rows?: Array<Object>;

        /** Specifies the collection of columns for the grid used to position layout elements. */
        cols?: Array<Object>;

        /** Specifies the function returning the size qualifier depending on the screen's width. */
        screenByWidth?: (width: number) => string;

        /** Decides on which screens all layout elements should be arranged in a single column. */
        singleColumnScreen?: string;

    }

    /** The ResponsiveBox widget allows you to create an application or a website with a layout adapted to different screen sizes. */
    export class dxResponsiveBox extends CollectionWidget {
        constructor(element: JQuery, options?: dxBoxOptions);
        constructor(element: Element, options?: dxBoxOptions);
    }

    export interface dxAutocompleteOptions extends dxDropDownListOptions {

        /** Specifies the current value displayed by the widget. */
        value?: string;

        /** The minimum number of characters that must be entered into the text box to begin a search. */
        minSearchLength?: number;

        /** Specifies the maximum count of items displayed by the widget. */
        maxItemCount?: number;

        /** Gets the currently selected item. */
        selectedItem?: any;
    }

    /** The Autocomplete widget is a textbox that provides suggestions while a user types into it. */
    export class dxAutocomplete extends dxDropDownList {
        constructor(element: JQuery, options?: dxAutocompleteOptions);
        constructor(element: Element, options?: dxAutocompleteOptions);

        /** Opens the drop-down editor. */
        open(): void;

        /** Closes the drop-down editor. */
        close(): void;
    }

    export interface dxAccordionOptions extends CollectionWidgetOptions {

        /** A number specifying the time in milliseconds spent on the animation of the expanding or collapsing of a panel. */
        animationDuration?: number;

        /** Specifies the widget's height. */
        height?: any;

        /** Specifies whether all items can be collapsed or whether at least one item must always be expanded. */
        collapsible?: boolean;

        /** Specifies whether the widget can expand several items or only a single item at once. */
        multiple?: boolean;

        /** Specifies a custom template for an item. */
        itemTemplate?: any;

        /** A handler for the itemTitleClick event. */
        onItemTitleClick?: any;

        /** Specifies a custom template for an item title. */
        itemTitleTemplate?: any;

        /** The index number of the currently selected item. */
        selectedIndex?: number;

        /** Specifies whether widget content is rendered when the widget is shown or when rendering the widget. */
        deferRendering?: boolean;

    }

    /** The Accordion widget contains several panels displayed one under another. These panels can be collapsed or expanded by an end user, which makes this widget very useful for presenting information in a limited amount of space. */
    export class dxAccordion extends CollectionWidget {
        constructor(element: JQuery, options?: dxAccordionOptions);
        constructor(element: Element, options?: dxAccordionOptions);

        
        

        /** Collapses the specified item. */
        collapseItem(index: number): JQueryPromise<dxAccordion>;

        /** Expands the specified item. */
        expandItem(index: number): JQueryPromise<dxAccordion>;

        /** Updates the dimensions of the widget contents. */
        updateDimensions(): JQueryPromise<dxAccordion>;
    }

    export interface dxFileUploaderOptions extends EditorOptions {

        /** Specifies a File instance representing the selected file. Read-only when uploadMode is "useForm". */
        value?: Array<File>;

        values?: Array<File>;

        buttonText?: string;

        /** The text displayed on the button that opens the file browser. */
        selectButtonText?: string;

        /** The text displayed on the button that starts uploading. */
        uploadButtonText?: string;

        /** Specifies the text displayed on the area to which an end-user can drop a file. */
        labelText?: string;

        /** Specifies the value passed to the name attribute of the underlying input element. */
        name?: string;

        /** Specifies whether the widget enables an end-user to select a single file or multiple files. */
        multiple?: boolean;

        /** Specifies a file type or several types accepted by the widget. */
        accept?: string;

        /** Specifies a target Url for the upload request. */
        uploadUrl?: string;

        /** Specifies if an end user can remove a file from the selection and interrupt uploading. */
        allowCanceling?: boolean;

        /** Specifies whether or not the widget displays the list of selected files. */
        showFileList?: boolean;

        /** Gets the current progress in percentages. */
        progress?: number;

        /** The message displayed by the widget when it is ready to upload the specified files. */
        readyToUploadMessage?: string;

        /** The message displayed by the widget when uploading is finished. */
        uploadedMessage?: string;

        /** The message displayed by the widget on uploading failure. */
        uploadFailedMessage?: string;

        /** Specifies how the widget uploads files. */
        uploadMode?: string;

        /** Specifies the method for the upload request. */
        uploadMethod?: string;

        /** Specifies headers for the upload request. */
        uploadHeaders?: Object;

        /** A handler for the uploadStarted event. */
        onUploadStarted?: Function;

        /** A handler for the uploaded event. */
        onUploaded?: Function;

        /** A handler for the uploaded event. */
        onProgress?: Function;

        /** A handler for the uploadError event. */
        onUploadError?: Function;

        /** A handler for the uploadAborted event. */
        onUploadAborted?: Function;

        /** A handler for the valueChanged event. */
        onValueChanged?: Function;
    }

    /** The FileUploader widget enables an end user to upload files to the server. An end user can select files in the file explorer or drag and drop files to the FileUploader area on the page. */
    export class dxFileUploader extends Editor {
        constructor(element: JQuery, options?: dxFileUploaderOptions);
        constructor(element: Element, options?: dxFileUploaderOptions);
    }

    export interface dxTrackBarOptions extends EditorOptions {
        /** The minimum value the widget can accept. */
        min?: number;

        /** The maximum value the widget can accept. */
        max?: number;
    }

    /** A base class for track bar widgets. */
    export class dxTrackBar extends Editor {
        constructor(element: JQuery, options?: dxTrackBarOptions);
        constructor(element: Element, options?: dxTrackBarOptions);
    }

    export interface dxProgressBarOptions extends dxTrackBarOptions {

        /** Specifies a format for the progress status. */
        statusFormat?: any;

        /** Specifies whether or not the widget displays a progress status. */
        showStatus?: boolean;

        /** A handler for the complete event. */
        onComplete?: Function;

        /** The current widget value. */
        value?: number;
    }

    /** The ProgressBar is a widget that shows current progress. */
    export class dxProgressBar extends dxTrackBar {
        constructor(element: JQuery, options?: dxProgressBarOptions);
        constructor(element: Element, options?: dxProgressBarOptions);
    }

    export interface dxSliderBaseOptions extends dxTrackBarOptions {

        activeStateEnabled?: boolean;

        /** The slider step size. */
        step?: number;

        /** Specifies whether or not to highlight a range selected within the widget. */
        showRange?: boolean;

        /** Specifies the size of a step by which a slider handle is moved when a user uses the Page up or Page down keyboard shortcuts. */
        keyStep?: number;

        /** Specifies options for the slider tooltip. */
        tooltip?: {
            /** Specifies whether or not the tooltip is enabled. */
            enabled?: boolean;

            /** Specifies format for the tooltip. */
            format?: any;

            /** Specifies whether the tooltip is located over or under the slider. */
            position?: string;

            /** Specifies whether the widget always shows a tooltip or only when a pointer is over the slider. */
            showMode?: string;
        };

        /** Specifies options for labels displayed at the min and max values. */
        label?: {
            /** Specifies whether or not slider labels are visible. */
            visible?: boolean;

            /** Specifies whether labels are located over or under the scale. */
            position?: string;

            /** Specifies a format for labels. */
            format?: any;
        };

        
        name?: string;
    }

    export interface dxSliderOptions extends dxSliderBaseOptions {
        /** The current slider value. */
        value?: number;
    }

    /** The Slider is a widget that allows an end user to set a numeric value on a continuous range of possible values. */
    export class dxSlider extends dxTrackBar {
        constructor(element: JQuery, options?: dxSliderOptions);
        constructor(element: Element, options?: dxSliderOptions);
    }

    export interface dxRangeSliderOptions extends dxSliderBaseOptions {

        /** The left edge of the interval currently selected using the range slider. */
        start?: number;

        /** The right edge of the interval currently selected using the range slider. */
        end?: number;

        /** The value to be assigned to the name attribute of the underlying `<input>` element. */
        startName?: string;

        /** The value to be assigned to the name attribute of the underlying `<input>` element. */
        endName?: string;

        
        value?: Array<number>;
    }

    /** The RangeSlider is a widget that allows an end user to choose a range of numeric values. */
    export class dxRangeSlider extends dxSlider {
        constructor(element: JQuery, options?: dxRangeSliderOptions);
        constructor(element: Element, options?: dxRangeSliderOptions);
    }

    export interface dxFormItemLabel {
        /** Specifies the label text. */
        text?: string;

        /** Specifies whether or not the label is visible. */
        visible?: boolean;

        /** Specifies whether or not a colon is displayed at the end of the current label. */
        showColon?: boolean;

        /** Specifies the location of a label against the editor. */
        location?: string;

        /** Specifies the label's horizontal alignment. */
        alignment?: string;
    }

    export interface dxFormItem {
        /** Specifies the type of the current item. */
        itemType?: string;

        /** Specifies whether or not the current form item is visible. */
        visible?: boolean;

        /** Specifies the sequence number of the item in a form, group or tab. */
        visibleIndex?: number;

        /** Specifies a CSS class to be applied to the form item. */
        cssClass?: string;

        /** Specifies the number of columns spanned by the item. */
        colSpan?: number;
    }

    /** This article describes configuration options of an empty form item. */
    export interface dxFormEmptyItem extends dxFormItem {
        /** Specifies the form item name. */
        name?: string;
    }

    /** This article describes configuration options of a simple form item. */
    export interface dxFormSimpleItem extends dxFormItem {
        /** Specifies the path to the formData object field bound to the current form item. */
        dataField?: string;

        /** Specifies the form item name. */
        name?: string;

        /** Specifies which editor widget is used to display and edit the form item value. */
        editorType?: string;

        /** Specifies configuration options for the editor widget of the current form item. */
        editorOptions?: Object;

        /** A template to be used for rendering the form item. */
        template?: any;

        /** Specifies the help text displayed for the current form item. */
        helpText?: string;

        /** Specifies whether the current form item is required. */
        isRequired?: boolean;

        /** Specifies options for the form item label. */
        label?: dxFormItemLabel;

        /** An array of validation rules to be checked for the form item editor. */
        validationRules?: Array<any>;
    }

    /** Specifies dependency between the screen factor and the count of columns. */
    export interface ColCountResponsible {
        /** The count of columns for an extra small-sized screen. */
        xs?: number;

        /** The count of columns for a small-sized screen. */
        sm?: number;

        /** The count of columns for a middle-sized screen. */
        md?: number;

        /** The count of columns for a large screen size. */
        lg?: number;
    }

    /** This article describes configuration options of a group form item. */
    export interface dxFormGroupItem extends dxFormItem {
        /** Specifies the group caption. */
        caption?: string;

        /** A template to be used for rendering a group item. */
        template?: any;

        /** The count of columns in the group layout. */
        colCount?: number;

        /** Specifies dependency between the screen factor and the count of columns in the tab layout. */
        colCountByScreen?: ColCountResponsible;

        /** Specifies whether or not all group item labels are aligned. */
        alignItemLabels?: boolean;

        /** Holds an array of form items displayed within the group. */
        items?: Array<dxFormItem>;
    }

    export interface dxFormTab {
        /** Specifies the tab title. */
        title?: string;

        /** The count of columns in the tab layout. */
        colCount?: number;

        /** Specifies dependency between the screen factor and the count of columns in the group layout. */
        colCountByScreen?: ColCountResponsible;

        /** Specifies whether or not labels of items displayed within the current tab are aligned. */
        alignItemLabels?: boolean;

        /** Holds an array of form items displayed within the tab. */
        items?: Array<dxFormItem>;

        /** Specifies a badge text for the tab. */
        badge?: string;

        /** A Boolean value specifying whether or not the tab can respond to user interaction. */
        disabled?: boolean;

        /** Specifies the icon to be displayed on the tab. */
        icon?: string;

        /** The template to be used for rendering the tab. */
        tabTemplate?: any;

        /** The template to be used for rendering the tab content. */
        template?: any;
    }

    /** This article describes configuration options of a tabbed form item. */
    export interface dxFormTabbedItem extends dxFormItem {
        /** Holds a configuration object for the TabPanel widget used to display the current form item. */
        tabPanelOptions?: DevExpress.ui.dxTabPanelOptions;

        /** An array of tab configuration objects. */
        tabs?: Array<dxFormTab>;
    }

    export interface dxFormOptions extends WidgetOptions {
        /** An object providing data for the form. */
        formData?: Object;

        /** The count of columns in the form layout. */
        colCount?: any;

        /** Specifies dependency between the screen factor and the count of columns in the form layout. */
        colCountByScreen?: ColCountResponsible;

        /** Specifies the function returning the screen factor depending on the screen width. */
        screenByWidth?: (width: number) => string;

        /** Specifies the location of a label against the editor. */
        labelLocation?: string;

        /** Specifies whether all editors on the form are read-only. Applies only to non-templated items. */
        readOnly?: boolean;

        /** A handler for the fieldDataChanged event. */
        onFieldDataChanged?: (e: Object) => void;

        /** A handler for the editorEnterKey event. */
        onEditorEnterKey?: (e: Object) => void;

        /** Specifies a function that customizes a form item after it has been created. */
        customizeItem?: Function;

        /** The minimum column width used for calculating column count in the form layout. */
        minColWidth?: number;

        /** Specifies whether or not all root item labels are aligned. */
        alignItemLabels?: boolean;

        /** Specifies whether or not item labels in all groups are aligned. */
        alignItemLabelsInAllGroups?: boolean;

        /** Specifies whether or not a colon is displayed at the end of form labels. */
        showColonAfterLabel?: boolean;

        /** Specifies whether or not the required mark is displayed for required fields. */
        showRequiredMark?: boolean;

        /** Specifies whether or not the optional mark is displayed for optional fields. */
        showOptionalMark?: boolean;

        /** The text displayed for required fields. */
        requiredMark?: string;

        /** The text displayed for optional fields. */
        optionalMark?: string;

        /** Specifies the message that is shown for end-users if a required field value is not specified. */
        requiredMessage?: string;

        /** Specifies whether or not the total validation summary is displayed on the form. */
        showValidationSummary?: boolean;

        /** Holds an array of form items. */
        items?: Array<dxFormItem>;

        /** A Boolean value specifying whether to enable or disable form scrolling. */
        scrollingEnabled?: boolean;

        /** Gives a name to the internal validation group. */
        validationGroup?: string;
    }

    /** The Form widget represents fields of a data object as a collection of label-editor pairs. These pairs can be arranged in several groups, tabs and columns. */
    export class dxForm extends Widget {
        constructor(element: JQuery, options?: dxFormOptions);
        constructor(element: Element, options?: dxFormOptions);

        /** Updates the specified field of the formData object and the corresponding editor on the form. */
        updateData(dataField: string, value: any): void;

        /** Updates the specified fields of the formData object and the corresponding editors on the form. */
        updateData(data: Object): void;

        /** Updates the value of a form item option. */
        itemOption(field: string, option: string, value: any): void;

        /** Updates the values of form item options. */
        itemOption(field: string, options: Object): void;

        /** Gets the value of the form item option. */
        itemOption(field: string): any;

        /** Returns an editor instance associated with the specified formData field or name of the form item. */
        getEditor(field: string): any;

        /** Updates the dimensions of the widget contents. */
        updateDimensions(): JQueryPromise<void>;

        /** Validates the values of all editors on the form against the list of the validation rules specified for each form item. */
        validate(): Object;

        /** Resets the editor's value to undefined. */
        resetValues(): void;
    }

    export interface dxDeferRenderingOptions extends WidgetOptions {
        /** Indicates if a load indicator should be shown until the widget's content is rendered. */
        showLoadIndicator?: boolean;

        /** Specifies the jQuery.Promise or boolean value, which when resolved, forces widget content to render. */
        renderWhen?: any;

        /** Specifies the animation to be used to show the rendered content. */
        animation?: fx.AnimationOptions;

        /** Specifies a jQuery selector of items that should be rendered using a staggered animation. */
        staggerItemSelector?: string;

        /** Specifies a callback function that is called when the widget's content has finished rendering but is not yet shown. */
        onRendered?: Function;

        /** Specifies a callback function that is called when widget content is shown and animation has completed. */
        onShown?: Function;
    }

    /** The DeferRendering is a widget that waits for its content to be ready before rendering it. While the content is getting ready, the DeferRendering displays a loading indicator. */
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
