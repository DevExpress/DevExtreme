/// <reference path="core.d.ts" />

declare module DevExpress.ui {

    export interface dxTileViewOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxTileViewOptions_selectedIndex */
        /** @docid_ignore dxTileViewOptions_selectedItem */
        /** @docid_ignore dxTileViewOptions_selectedItems */
        /** @docid_ignore dxTileViewOptions_selectedItemKeys */
        /** @docid_ignore dxTileViewOptions_keyExpr */
        /** @docid_ignore dxTileViewOptions_onSelectionChanged */
        /** @docid_ignore dxTileViewOptions_hoverStateEnabled */
        /** @docid_ignore dxTileViewOptions_focusStateEnabled */

        /** @docid dxTileViewOptions_activeStateEnabled */
        activeStateEnabled?: boolean;

        /** @docid dxTileViewOptions_baseItemHeight */
        baseItemHeight?: number;

        /** @docid dxTileViewOptions_baseItemwidth */
        baseItemWidth?: number;

        /** @docid dxTileViewOptions_direction */
        direction?: string;

        /** @docid dxTileViewOptions_height */
        height?: any;

        /** @docid dxTileViewOptions_itemMargin */
        itemMargin?: number;

        /** @docid dxTileViewOptions_showScrollbar */
        showScrollbar?: boolean;
    }

    /** @docid dxtileview */
    export class dxTileView extends CollectionWidget {
        constructor(element: JQuery, options?: dxTileViewOptions);
        constructor(element: Element, options?: dxTileViewOptions);

        /** @docid_ignore dxTileViewItemTemplate_heightRatio */
        /** @docid_ignore dxTileViewItemTemplate_widthRatio */

        /** @docid dxtileviewmethods_scrollPosition */
        scrollPosition(): number;
    }

    export interface dxSwitchOptions extends EditorOptions {
        /** @docid_ignore dxSwitchOptions_hoverStateEnabled */
        /** @docid_ignore dxSwitchOptions_focusStateEnabled */

	    /** @docid dxSwitchOptions_activeStateEnabled */
	    activeStateEnabled?: boolean;

        /** @docid dxSwitchOptions_offText */
        offText?: string;

        /** @docid dxSwitchOptions_onText */
        onText?: string;

        /** @docid dxSwitchOptions_value */
        value?: boolean;

        /** @docid dxSwitchOptions_name */
        name?: string;
    }

    /** @docid dxSwitch */
    export class dxSwitch extends Editor {
        constructor(element: JQuery, options?: dxSwitchOptions);
        constructor(element: Element, options?: dxSwitchOptions);
    }

    export interface dxSlideOutViewOptions extends WidgetOptions {
        /** @docid_ignore dxSlideOutViewOptions_contentOffset */
        /** @docid_ignore dxSlideOutViewOptions_focusStateEnabled */
        /** @docid_ignore dxSlideOutViewOptions_accessKey */
        /** @docid_ignore dxSlideOutViewOptions_tabIndex */

        /** @docid dxSlideOutViewOptions_menuPosition */
        menuPosition?: string;

        /** @docid dxSlideOutViewOptions_menuVisible */
        menuVisible?: boolean;

        /** @docid dxSlideOutViewOptions_swipeEnabled */
        swipeEnabled?: boolean;

        /** @docid dxSlideOutViewOptions_menuTemplate */
        menuTemplate?: any;

        /** @docid dxSlideOutViewOptions_contentTemplate */
        contentTemplate?: any;
    }

    /** @docid dxSlideOutView */
    export class dxSlideOutView extends Widget {
        constructor(element: JQuery, options?: dxSlideOutViewOptions);
        constructor(element: Element, options?: dxSlideOutViewOptions);

        /** @docid_ignore dxSlideOutViewMethods_registerKeyHandler */
        /** @docid_ignore dxSlideOutViewMethods_focus */

        /** @docid dxSlideOutViewMethods_menuContent */
        menuContent(): JQuery;

        /** @docid dxSlideOutViewMethods_content */
        content(): JQuery;

        /** @docid dxSlideOutViewMethods_showMenu */
        showMenu(): JQueryPromise<void>;

        /** @docid dxSlideOutViewMethods_hideMenu */
        hideMenu(): JQueryPromise<void>;

        /** @docid dxSlideOutViewMethods_toggleMenuVisibility */
        toggleMenuVisibility(): JQueryPromise<void>;
    }

    export interface dxSlideOutOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxSlideOutOptions_selectedItems */
        /** @docid_ignore dxSlideOutOptions_selectedItemKeys */
        /** @docid_ignore dxSlideOutOptions_keyExpr */
        /** @docid_ignore dxSlideOutOptions_focusStateEnabled */
        /** @docid_ignore dxSlideOutOptions_accessKey */
        /** @docid_ignore dxSlideOutOptions_tabIndex */

        /** @docid dxSlideOutOptions_activeStateEnabled */
        activeStateEnabled?: boolean;

        /** @docid dxSlideOutOptions_menuGrouped */
        menuGrouped?: boolean;

        /** @docid dxSlideOutOptions_menuPosition */
        menuPosition?: string;

        /** @docid dxSlideOutOptions_menuGroupTemplate */
        menuGroupTemplate?: any;

        /** @docid dxSlideOutOptions_menuItemTemplate */
        menuItemTemplate?: any;

        /** @docid dxSlideOutOptions_onMenuGroupRendered */
        onMenuGroupRendered?: Function;

        /** @docid dxSlideOutOptions_onMenuItemRendered */
        onMenuItemRendered?: Function;

        /** @docid dxSlideOutOptions_menuVisible */
        menuVisible?: boolean;

        /** @docid dxSlideOutOptions_swipeEnabled */
        swipeEnabled?: boolean;

        /** @docid dxSlideOutOptions_contentTemplate */
        contentTemplate?: any;

        /** @docid dxSlideOutOptions_selectedIndex */
        selectedIndex?: number;
    }

    /** @docid dxSlideout */
    export class dxSlideOut extends CollectionWidget {
        constructor(element: JQuery, options?: dxSlideOutOptions);
        constructor(element: Element, options?: dxSlideOutOptions);

        /** @docid_ignore dxSlideOutItemTemplate_menutemplate */

        /** @docid_ignore dxslideoutmethods_registerKeyHandler */
        /** @docid_ignore dxslideoutmethods_focus */

        /** @docid dxslideoutmethods_hide */
        hideMenu(): JQueryPromise<void>;

        /** @docid dxslideoutmethods_show */
        showMenu(): JQueryPromise<void>;

        /** @docid dxslideoutmethods_toggleMenuVisibility */
        toggleMenuVisibility(showing: boolean): JQueryPromise<void>;
    }

    export interface dxPivotOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxPivotOptions_noDataText */
        /** @docid_ignore dxPivotOptions_selectedItems */
        /** @docid_ignore dxPivotOptions_selectedItemKeys */
        /** @docid_ignore dxPivotOptions_keyExpr */
        /** @docid_ignore dxPivotOptions_focusStateEnabled */
        /** @docid_ignore dxPivotOptions_accessKey */
        /** @docid_ignore dxPivotOptions_tabIndex */

        /** @docid dxPivotOptions_selectedIndex */
        selectedIndex?: number;

        /** @docid dxPivotOptions_swipeEnabled */
        swipeEnabled?: boolean;

        /** @docid dxPivotOptions_contentTemplate */
        contentTemplate?: any;

        /** @docid dxPivotOptions_itemTitleTemplate */
        itemTitleTemplate?: any;
    }

    /** @docid dxPivot */
    export class dxPivot extends CollectionWidget {
        constructor(element: JQuery, options?: dxPivotOptions);
        constructor(element: Element, options?: dxPivotOptions);

        /** @docid_ignore dxPivotItemTemplate_title */
        /** @docid_ignore dxPivotItemTemplate_visible */
        /** @docid_ignore dxPivotItemTemplate_titleTemplate */

        /** @docid_ignore dxPivotMethods_registerKeyHandler */
        /** @docid_ignore dxPivotMethods_focus */
    }

    export interface dxPanoramaOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxPanoramaOptions_noDataText */
        /** @docid_ignore dxPanoramaOptions_selectedItems */
        /** @docid_ignore dxPanoramaOptions_selectedItemKeys */
        /** @docid_ignore dxPanoramaOptions_keyExpr */
        /** @docid_ignore dxPanoramaOptions_focusStateEnabled */
        /** @docid_ignore dxPanoramaOptions_accessKey */
        /** @docid_ignore dxPanoramaOptions_tabIndex */

        /** @docid dxPanoramaOptions_backgroundImage */
        backgroundImage?: {
            /** @docid dxPanoramaOptions_backgroundImage_height */
            height?: number;

            /** @docid dxPanoramaOptions_backgroundImage_url */
            url?: string;

            /** @docid dxPanoramaOptions_backgroundImage_width */
            width?: number;
        };

        /** @docid dxPanoramaOptions_selectedIndex */
        selectedIndex?: number;

        /** @docid dxPanoramaOptions_title */
        title?: string;
    }

    /** @docid dxPanorama */
    export class dxPanorama extends CollectionWidget {
        constructor(element: JQuery, options?: dxDropDownEditorOptions);
        constructor(element: Element, options?: dxDropDownEditorOptions);

        /** @docid_ignore dxPanoramaItemTemplate_title */
        /** @docid_ignore dxPanoramaItemTemplate_visible */

        /** @docid_ignore dxPanoramaMethods_registerKeyHandler */
        /** @docid_ignore dxPanoramaMethods_focus */
    }

    export interface dxDropDownMenuOptions extends WidgetOptions {
        /** @docid_ignore dxDropDownMenuOptions_onContentReady */

        /** @docid dxDropDownMenuOptions_onButtonClick */
        onButtonClick?: any;

        /** @docid dxDropDownMenuOptions_buttonIcon */
        buttonIcon?: string;

        /** @docid dxDropDownMenuOptions_buttontext */
        buttonText?: string;

        /** @docid dxDropDownMenuOptions_buttonIconSrc */
        buttonIconSrc?: string;

        /** @docid dxDropDownMenuOptions_dataSource */
        dataSource?: any;

        /** @docid dxDropDownMenuOptions_onItemClick */
        onItemClick?: any;

        /** @docid dxDropDownMenuOptions_items */
        items?: Array<any>;

        /** @docid dxDropDownMenuOptions_itemTemplate */
        itemTemplate?: any;

        /** @docid dxDropDownMenuOptions_usePopover */
        usePopover?: boolean;

        /** @docid dxDropDownMenuOptions_popupWidth */
        popupWidth?: any;

        /** @docid dxDropDownMenuOptions_popupHeight */
        popupHeight?: any;

        /** @docid dxDropDownMenuOptions_opened */
        opened?: boolean;

        /** @docid dxDropDownMenuOptions_hoverStateEnabled */
        hoverStateEnabled?: boolean;

        /** @docid dxDropDownMenuOptions_activeStateEnabled */
        activeStateEnabled?: boolean;
    }

    /** @docid dxdropdownmenu */
    export class dxDropDownMenu extends Widget {
        constructor(element: JQuery, options?: dxDropDownEditorOptions);
        constructor(element: Element, options?: dxDropDownEditorOptions);

        /** @docid dxDropDownMenuMethods_open */
        open(): void;

        /** @docid dxDropDownMenuMethods_close */
        close(): void;
    }

    export interface dxActionSheetOptions extends CollectionWidgetOptions {
        /** @docid_ignore dxActionSheetOptions_activeStateEnabled */
        /** @docid_ignore dxActionSheetOptions_selectedIndex */
        /** @docid_ignore dxActionSheetOptions_selectedItem */
        /** @docid_ignore dxActionSheetOptions_selectedItems */
        /** @docid_ignore dxActionSheetOptions_selectedItemKeys */
        /** @docid_ignore dxActionSheetOptions_keyExpr */
        /** @docid_ignore dxActionSheetOptions_noDataText */
        /** @docid_ignore dxActionSheetOptions_onSelectionChanged */
        /** @docid_ignore dxActionSheetOptions_focusStateEnabled */
        /** @docid_ignore dxActionSheetOptions_accessKey */
        /** @docid_ignore dxActionSheetOptions_tabIndex */

        /** @docid dxActionSheetOptions_onCancelClick */
        onCancelClick?: any;

        /** @docid dxActionSheetOptions_cancelText */
        cancelText?: string;

        /** @docid dxActionSheetOptions_showCancelButton */
        showCancelButton?: boolean;

        /** @docid dxActionSheetOptions_showTitle */
        showTitle?: boolean;

        /** @docid dxActionSheetOptions_target */
        target?: any;

        /** @docid dxActionSheetOptions_title */
        title?: string;

        /** @docid dxActionSheetOptions_usePopover */
        usePopover?: boolean;

        /** @docid dxActionSheetOptions_visible */
        visible?: boolean;
    }

    /** @docid dxactionsheet */
    export class dxActionSheet extends CollectionWidget {
        constructor(element: JQuery, options?: dxActionSheetOptions);
        constructor(element: Element, options?: dxActionSheetOptions);

        /** @docid_ignore dxActionSheetItemTemplate_html */
        /** @docid_ignore dxActionSheetItemtemplate_type */
        /** @docid_ignore dxActionSheetItemTemplate_visible */
        /** @docid_ignore dxActionSheetItemTemplate_onClick */
        /** @docid_ignore dxActionSheetItemTemplate_icon */

        /** @docid_ignore dxactionsheetmethods_registerKeyHandler */
        /** @docid_ignore dxactionsheetmethods_focus */

        /** @docid dxactionsheetmethods_hide */
        hide(): JQueryPromise<dxActionSheet>;

        /** @docid dxactionsheetmethods_show */
        show(): JQueryPromise<dxActionSheet>;

        /** @docid dxactionsheetmethods_toggle */
        toggle(showing: boolean): JQueryPromise<dxActionSheet>;
    }
}
