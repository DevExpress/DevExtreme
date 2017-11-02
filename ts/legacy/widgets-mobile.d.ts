/// <reference path="core.d.ts" />

declare module DevExpress.ui {

    export interface dxTileViewOptions extends CollectionWidgetOptions {
        
        
        
        
        
        
        
        

        /** A Boolean value specifying whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;

        /** Specifies the height of the base tile view item. */
        baseItemHeight?: number;

        /** Specifies the width of the base tile view item. */
        baseItemWidth?: number;

        /** Specifies whether tiles are placed horizontally or vertically. */
        direction?: string;

        /** Specifies the widget's height. */
        height?: any;

        /** Specifies the distance in pixels between adjacent tiles. */
        itemMargin?: number;

        /** A Boolean value specifying whether or not to display a scrollbar. */
        showScrollbar?: boolean;
    }

    /** The TileView widget contains a collection of tiles. Tiles can store much more information than ordinary buttons, that is why they are very popular in apps designed for touch devices. */
    export class dxTileView extends CollectionWidget {
        constructor(element: JQuery, options?: dxTileViewOptions);
        constructor(element: Element, options?: dxTileViewOptions);

        
        

        /** Returns the current scroll position of the widget content. */
        scrollPosition(): number;
    }

    export interface dxSwitchOptions extends EditorOptions {
        
        

	    
	    activeStateEnabled?: boolean;

        /** Text displayed when the widget is in a disabled state. */
        offText?: string;

        /** Text displayed when the widget is in an enabled state. */
        onText?: string;

        /** A Boolean value specifying whether the current switch state is "On" or "Off". */
        value?: boolean;

        
        name?: string;
    }

    /** The Switch is a widget that can be in two states: "On" and "Off". */
    export class dxSwitch extends Editor {
        constructor(element: JQuery, options?: dxSwitchOptions);
        constructor(element: Element, options?: dxSwitchOptions);
    }

    export interface dxSlideOutViewOptions extends WidgetOptions {
        
        
        
        

        /** Specifies the current menu position. */
        menuPosition?: string;

        /** Specifies whether or not the menu panel is visible. */
        menuVisible?: boolean;

        /** Specifies whether or not the menu is shown when a user swipes the widget content. */
        swipeEnabled?: boolean;

        /** A template to be used for rendering menu panel content. */
        menuTemplate?: any;

        /** A template to be used for rendering widget content. */
        contentTemplate?: any;
    }

    /** The SlideOutView widget is a classic slide-out menu paired with a view. */
    export class dxSlideOutView extends Widget {
        constructor(element: JQuery, options?: dxSlideOutViewOptions);
        constructor(element: Element, options?: dxSlideOutViewOptions);

        
        

        /** Returns an HTML element of the widget menu block. */
        menuContent(): JQuery;

        /** Returns an HTML element of the widget content block. */
        content(): JQuery;

        /** Displays the widget's menu block. */
        showMenu(): JQueryPromise<void>;

        /** Hides the widget's menu block. */
        hideMenu(): JQueryPromise<void>;

        /** Toggles the visibility of the widget's menu block. */
        toggleMenuVisibility(): JQueryPromise<void>;
    }

    export interface dxSlideOutOptions extends CollectionWidgetOptions {
        
        
        
        
        
        

        /** A Boolean value specifying whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;

        /** A Boolean value specifying whether or not to display a grouped menu. */
        menuGrouped?: boolean;

        /** Specifies the current menu position. */
        menuPosition?: string;

        /** Specifies a custom template for a group caption. */
        menuGroupTemplate?: any;

        /** The template used to render menu items. */
        menuItemTemplate?: any;

        /** A handler for the menuGroupRendered event. */
        onMenuGroupRendered?: Function;

        /** A handler for the menuItemRendered event. */
        onMenuItemRendered?: Function;

        /** Specifies whether or not the slide-out menu is displayed. */
        menuVisible?: boolean;

        /** Indicates whether the menu can be shown/hidden by swiping the widget's main panel. */
        swipeEnabled?: boolean;

        /** A template to be used for rendering widget content. */
        contentTemplate?: any;

        /** The index number of the currently selected item. */
        selectedIndex?: number;
    }

    /** The SlideOut widget is a classic slide-out menu paired with a view. An end user opens the menu by swiping away the view. */
    export class dxSlideOut extends CollectionWidget {
        constructor(element: JQuery, options?: dxSlideOutOptions);
        constructor(element: Element, options?: dxSlideOutOptions);

        

        
        

        /** Hides the widget's slide-out menu. */
        hideMenu(): JQueryPromise<void>;

        /** Displays the widget's slide-out menu. */
        showMenu(): JQueryPromise<void>;

        /** Toggles the visibility of the widget's slide-out menu. */
        toggleMenuVisibility(showing: boolean): JQueryPromise<void>;
    }

    export interface dxPivotOptions extends CollectionWidgetOptions {
        
        
        
        
        
        
        

        /** The index of the currently active pivot item. */
        selectedIndex?: number;

        /** A Boolean value specifying whether or not to allow users to switch between items by swiping. */
        swipeEnabled?: boolean;

        /** A template to be used for rendering widget content. */
        contentTemplate?: any;

        /** Specifies a custom template for an item title. */
        itemTitleTemplate?: any;
    }

    /** The Pivot provides a quick way to manage multiple views. It includes a collection of views and a navigation header. An end user switches the views by swiping them or by clicking their titles on the navigation header. */
    export class dxPivot extends CollectionWidget {
        constructor(element: JQuery, options?: dxPivotOptions);
        constructor(element: Element, options?: dxPivotOptions);

        
        
        

        
        
    }

    export interface dxPanoramaOptions extends CollectionWidgetOptions {
        
        
        
        
        
        
        

        /** An object exposing options for setting a background image for the panorama. */
        backgroundImage?: {
            /** Specifies the height of the panorama's background image. */
            height?: number;

            /** Specifies the URL of the image that is used as the panorama's background image. */
            url?: string;

            /** Specifies the width of the panorama's background image. */
            width?: number;
        };

        /** The index of the currently active panorama item. */
        selectedIndex?: number;

        /** Specifies the widget content title. */
        title?: string;
    }

    /** The Panorama widget is a full-screen widget that allows you to arrange items on a long horizontal canvas split into several views. Each view contains several items, and an end user navigates the views with the swipe gesture. The Panorama is often used as a navigation map on the first page of an application. */
    export class dxPanorama extends CollectionWidget {
        constructor(element: JQuery, options?: dxDropDownEditorOptions);
        constructor(element: Element, options?: dxDropDownEditorOptions);

        
        

        
        
    }

    export interface dxDropDownMenuOptions extends WidgetOptions {
        

        /** A handler for the buttonClick event. */
        onButtonClick?: any;

        /** The name of the icon to be displayed by the DropDownMenu button. */
        buttonIcon?: string;

        /** The text displayed in the DropDownMenu button. */
        buttonText?: string;

        
        buttonIconSrc?: string;

        /** A data source used to fetch data to be displayed by the widget. */
        dataSource?: any;

        /** A handler for the itemClick event. */
        onItemClick?: any;

        /** An array of items displayed by the widget. */
        items?: Array<any>;

        /** The template to be used for rendering items. */
        itemTemplate?: any;

        /** Specifies whether or not to show the drop down menu within a Popover widget. */
        usePopover?: boolean;

        /** The width of the menu popup in pixels. */
        popupWidth?: any;

        /** The height of the menu popup in pixels. */
        popupHeight?: any;

        /** Specifies whether or not the drop-down menu is displayed. */
        opened?: boolean;

        
        hoverStateEnabled?: boolean;

        
        activeStateEnabled?: boolean;
    }

    /** A drop-down menu widget. */
    export class dxDropDownMenu extends Widget {
        constructor(element: JQuery, options?: dxDropDownEditorOptions);
        constructor(element: Element, options?: dxDropDownEditorOptions);

        /** Opens the drop-down menu. */
        open(): void;

        /** Closes the drop-down menu. */
        close(): void;
    }

    export interface dxActionSheetOptions extends CollectionWidgetOptions {
        
        
        
        
        
        
        
        
        
        
        

        /** A handler for the cancelClick event. */
        onCancelClick?: any;

        /** The text displayed in the button that closes the action sheet. */
        cancelText?: string;

        /** Specifies whether or not to display the Cancel button in action sheet. */
        showCancelButton?: boolean;

        /** A Boolean value specifying whether or not the title of the action sheet is visible. */
        showTitle?: boolean;

        /** Specifies the element the action sheet popover points at. */
        target?: any;

        /** The title of the action sheet. */
        title?: string;

        /** Specifies whether or not to show the action sheet within a Popover widget. */
        usePopover?: boolean;

        /** A Boolean value specifying whether or not the ActionSheet widget is visible. */
        visible?: boolean;
    }

    /** The ActionSheet widget is a sheet containing a set of buttons located one under the other. These buttons usually represent several choices relating to a single task. */
    export class dxActionSheet extends CollectionWidget {
        constructor(element: JQuery, options?: dxActionSheetOptions);
        constructor(element: Element, options?: dxActionSheetOptions);

        
        
        
        
        

        
        

        /** Hides the widget. */
        hide(): JQueryPromise<dxActionSheet>;

        /** Shows the widget. */
        show(): JQueryPromise<dxActionSheet>;

        /** Shows or hides the widget depending on the Boolean value passed as the parameter. */
        toggle(showing: boolean): JQueryPromise<dxActionSheet>;
    }
}
