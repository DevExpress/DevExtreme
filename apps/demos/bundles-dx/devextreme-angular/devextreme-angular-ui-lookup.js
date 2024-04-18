System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/lookup', '@angular/forms', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, forwardRef, i0, PLATFORM_ID, Component, Inject, Input, Output, HostListener, ContentChildren, NgModule, DxLookup, NG_VALUE_ACCESSOR, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiItemComponent, DxoDropDownOptionsModule, DxoAnimationModule, DxoHideModule, DxoFromModule, DxoPositionModule, DxoAtModule, DxoBoundaryOffsetModule, DxoCollisionModule, DxoMyModule, DxoOffsetModule, DxoToModule, DxoShowModule, DxoHideEventModule, DxoShowEventModule, DxiToolbarItemModule, DxiItemModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            forwardRef = module.forwardRef;
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            HostListener = module.HostListener;
            ContentChildren = module.ContentChildren;
            NgModule = module.NgModule;
        }, function (module) {
            DxLookup = module.default;
        }, function (module) {
            NG_VALUE_ACCESSOR = module.NG_VALUE_ACCESSOR;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiItemComponent = module.DxiItemComponent;
            DxoDropDownOptionsModule = module.DxoDropDownOptionsModule;
            DxoAnimationModule = module.DxoAnimationModule;
            DxoHideModule = module.DxoHideModule;
            DxoFromModule = module.DxoFromModule;
            DxoPositionModule = module.DxoPositionModule;
            DxoAtModule = module.DxoAtModule;
            DxoBoundaryOffsetModule = module.DxoBoundaryOffsetModule;
            DxoCollisionModule = module.DxoCollisionModule;
            DxoMyModule = module.DxoMyModule;
            DxoOffsetModule = module.DxoOffsetModule;
            DxoToModule = module.DxoToModule;
            DxoShowModule = module.DxoShowModule;
            DxoHideEventModule = module.DxoHideEventModule;
            DxoShowEventModule = module.DxoShowEventModule;
            DxiToolbarItemModule = module.DxiToolbarItemModule;
            DxiItemModule = module.DxiItemModule;
        }, null, null, null, null, null, null, null, null, null, null],
        execute: (function () {

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            /* tslint:disable:max-line-length */
            const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DxLookupComponent),
                multi: true
            };
            /**
             * The Lookup is a UI component that allows an end user to search for an item in a collection shown in a drop-down menu.

             */
            class DxLookupComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the shortcut key that sets focus on the UI component.
                
                 */
                get accessKey() {
                    return this._getOption('accessKey');
                }
                set accessKey(value) {
                    this._setOption('accessKey', value);
                }
                /**
                 * Specifies whether the UI component changes its visual state as a result of user interaction.
                
                 */
                get activeStateEnabled() {
                    return this._getOption('activeStateEnabled');
                }
                set activeStateEnabled(value) {
                    this._setOption('activeStateEnabled', value);
                }
                /**
                 * The text displayed on the Apply button.
                
                 */
                get applyButtonText() {
                    return this._getOption('applyButtonText');
                }
                set applyButtonText(value) {
                    this._setOption('applyButtonText', value);
                }
                /**
                 * Specifies the way an end user applies the selected value.
                
                 */
                get applyValueMode() {
                    return this._getOption('applyValueMode');
                }
                set applyValueMode(value) {
                    this._setOption('applyValueMode', value);
                }
                /**
                 * The text displayed on the Cancel button.
                
                 */
                get cancelButtonText() {
                    return this._getOption('cancelButtonText');
                }
                set cancelButtonText(value) {
                    this._setOption('cancelButtonText', value);
                }
                /**
                 * Specifies whether or not the UI component cleans the search box when the popup window is displayed.
                
                 */
                get cleanSearchOnOpening() {
                    return this._getOption('cleanSearchOnOpening');
                }
                set cleanSearchOnOpening(value) {
                    this._setOption('cleanSearchOnOpening', value);
                }
                /**
                 * The text displayed on the Clear button.
                
                 */
                get clearButtonText() {
                    return this._getOption('clearButtonText');
                }
                set clearButtonText(value) {
                    this._setOption('clearButtonText', value);
                }
                /**
                 * Binds the UI component to data.
                
                 */
                get dataSource() {
                    return this._getOption('dataSource');
                }
                set dataSource(value) {
                    this._setOption('dataSource', value);
                }
                /**
                 * Specifies whether to render the drop-down field&apos;s content when it is displayed. If false, the content is rendered immediately.
                
                 */
                get deferRendering() {
                    return this._getOption('deferRendering');
                }
                set deferRendering(value) {
                    this._setOption('deferRendering', value);
                }
                /**
                 * Specifies whether the UI component responds to user interaction.
                
                 */
                get disabled() {
                    return this._getOption('disabled');
                }
                set disabled(value) {
                    this._setOption('disabled', value);
                }
                /**
                 * Specifies the data field whose values should be displayed.
                
                 */
                get displayExpr() {
                    return this._getOption('displayExpr');
                }
                set displayExpr(value) {
                    this._setOption('displayExpr', value);
                }
                /**
                 * Returns the value currently displayed by the UI component.
                
                 */
                get displayValue() {
                    return this._getOption('displayValue');
                }
                set displayValue(value) {
                    this._setOption('displayValue', value);
                }
                /**
                 * Specifies whether to vertically align the drop-down menu so that the selected item is in its center. Applies only in Material Design themes.
                
                 */
                get dropDownCentered() {
                    return this._getOption('dropDownCentered');
                }
                set dropDownCentered(value) {
                    this._setOption('dropDownCentered', value);
                }
                /**
                 * Configures the drop-down field.
                
                 */
                get dropDownOptions() {
                    return this._getOption('dropDownOptions');
                }
                set dropDownOptions(value) {
                    this._setOption('dropDownOptions', value);
                }
                /**
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Specifies a custom template for the input field.
                
                 */
                get fieldTemplate() {
                    return this._getOption('fieldTemplate');
                }
                set fieldTemplate(value) {
                    this._setOption('fieldTemplate', value);
                }
                /**
                 * Specifies whether the UI component can be focused using keyboard navigation.
                
                 */
                get focusStateEnabled() {
                    return this._getOption('focusStateEnabled');
                }
                set focusStateEnabled(value) {
                    this._setOption('focusStateEnabled', value);
                }
                /**
                 * A Boolean value specifying whether or not to display the lookup in full-screen mode.
                
                 * @deprecated Use the dropDownOptions option instead.
                
                 */
                get fullScreen() {
                    return this._getOption('fullScreen');
                }
                set fullScreen(value) {
                    this._setOption('fullScreen', value);
                }
                /**
                 * Specifies whether data items should be grouped.
                
                 */
                get grouped() {
                    return this._getOption('grouped');
                }
                set grouped(value) {
                    this._setOption('grouped', value);
                }
                /**
                 * Specifies a custom template for group captions.
                
                 */
                get groupTemplate() {
                    return this._getOption('groupTemplate');
                }
                set groupTemplate(value) {
                    this._setOption('groupTemplate', value);
                }
                /**
                 * Specifies the UI component&apos;s height.
                
                 */
                get height() {
                    return this._getOption('height');
                }
                set height(value) {
                    this._setOption('height', value);
                }
                /**
                 * Specifies text for a hint that appears when a user pauses on the UI component.
                
                 */
                get hint() {
                    return this._getOption('hint');
                }
                set hint(value) {
                    this._setOption('hint', value);
                }
                /**
                 * Specifies whether the UI component changes its state when a user pauses on it.
                
                 */
                get hoverStateEnabled() {
                    return this._getOption('hoverStateEnabled');
                }
                set hoverStateEnabled(value) {
                    this._setOption('hoverStateEnabled', value);
                }
                /**
                 * Specifies the attributes to be passed on to the underlying HTML element.
                
                 */
                get inputAttr() {
                    return this._getOption('inputAttr');
                }
                set inputAttr(value) {
                    this._setOption('inputAttr', value);
                }
                /**
                 * Specifies whether the component&apos;s current value differs from the initial value.
                
                 */
                get isDirty() {
                    return this._getOption('isDirty');
                }
                set isDirty(value) {
                    this._setOption('isDirty', value);
                }
                /**
                 * Specifies or indicates whether the editor&apos;s value is valid.
                
                 */
                get isValid() {
                    return this._getOption('isValid');
                }
                set isValid(value) {
                    this._setOption('isValid', value);
                }
                /**
                 * An array of items displayed by the UI component.
                
                 */
                get items() {
                    return this._getOption('items');
                }
                set items(value) {
                    this._setOption('items', value);
                }
                /**
                 * Specifies a custom template for items.
                
                 */
                get itemTemplate() {
                    return this._getOption('itemTemplate');
                }
                set itemTemplate(value) {
                    this._setOption('itemTemplate', value);
                }
                /**
                 * Specifies a text string used to annotate the editor&apos;s value.
                
                 */
                get label() {
                    return this._getOption('label');
                }
                set label(value) {
                    this._setOption('label', value);
                }
                /**
                 * Specifies the label&apos;s display mode.
                
                 */
                get labelMode() {
                    return this._getOption('labelMode');
                }
                set labelMode(value) {
                    this._setOption('labelMode', value);
                }
                /**
                 * The minimum number of characters that must be entered into the text box to begin a search. Applies only if searchEnabled is true.
                
                 */
                get minSearchLength() {
                    return this._getOption('minSearchLength');
                }
                set minSearchLength(value) {
                    this._setOption('minSearchLength', value);
                }
                /**
                 * The value to be assigned to the `name` attribute of the underlying HTML element.
                
                 */
                get name() {
                    return this._getOption('name');
                }
                set name(value) {
                    this._setOption('name', value);
                }
                /**
                 * The text displayed on the button used to load the next page from the data source.
                
                 */
                get nextButtonText() {
                    return this._getOption('nextButtonText');
                }
                set nextButtonText(value) {
                    this._setOption('nextButtonText', value);
                }
                /**
                 * Specifies the text or HTML markup displayed by the UI component if the item collection is empty.
                
                 */
                get noDataText() {
                    return this._getOption('noDataText');
                }
                set noDataText(value) {
                    this._setOption('noDataText', value);
                }
                /**
                 * Specifies whether or not the drop-down editor is displayed.
                
                 */
                get opened() {
                    return this._getOption('opened');
                }
                set opened(value) {
                    this._setOption('opened', value);
                }
                /**
                 * Specifies the text shown in the pullDown panel, which is displayed when the UI component is scrolled to the bottom.
                
                 */
                get pageLoadingText() {
                    return this._getOption('pageLoadingText');
                }
                set pageLoadingText(value) {
                    this._setOption('pageLoadingText', value);
                }
                /**
                 * Specifies whether the next page is loaded when a user scrolls the UI component to the bottom or when the &apos;next&apos; button is clicked.
                
                 */
                get pageLoadMode() {
                    return this._getOption('pageLoadMode');
                }
                set pageLoadMode(value) {
                    this._setOption('pageLoadMode', value);
                }
                /**
                 * The text displayed by the UI component when nothing is selected.
                
                 */
                get placeholder() {
                    return this._getOption('placeholder');
                }
                set placeholder(value) {
                    this._setOption('placeholder', value);
                }
                /**
                 * Specifies the text displayed in the pullDown panel when the UI component is pulled below the refresh threshold.
                
                 */
                get pulledDownText() {
                    return this._getOption('pulledDownText');
                }
                set pulledDownText(value) {
                    this._setOption('pulledDownText', value);
                }
                /**
                 * Specifies the text shown in the pullDown panel while the list is being pulled down to the refresh threshold.
                
                 */
                get pullingDownText() {
                    return this._getOption('pullingDownText');
                }
                set pullingDownText(value) {
                    this._setOption('pullingDownText', value);
                }
                /**
                 * A Boolean value specifying whether or not the UI component supports the &apos;pull down to refresh&apos; gesture.
                
                 */
                get pullRefreshEnabled() {
                    return this._getOption('pullRefreshEnabled');
                }
                set pullRefreshEnabled(value) {
                    this._setOption('pullRefreshEnabled', value);
                }
                /**
                 * Specifies the text displayed in the pullDown panel while the UI component is being refreshed.
                
                 */
                get refreshingText() {
                    return this._getOption('refreshingText');
                }
                set refreshingText(value) {
                    this._setOption('refreshingText', value);
                }
                /**
                 * Switches the UI component to a right-to-left representation.
                
                 */
                get rtlEnabled() {
                    return this._getOption('rtlEnabled');
                }
                set rtlEnabled(value) {
                    this._setOption('rtlEnabled', value);
                }
                /**
                 * Specifies whether the search box is visible.
                
                 */
                get searchEnabled() {
                    return this._getOption('searchEnabled');
                }
                set searchEnabled(value) {
                    this._setOption('searchEnabled', value);
                }
                /**
                 * Specifies the name of a data source item field or an expression whose value is compared to the search criterion.
                
                 */
                get searchExpr() {
                    return this._getOption('searchExpr');
                }
                set searchExpr(value) {
                    this._setOption('searchExpr', value);
                }
                /**
                 * Specifies a comparison operation used to search UI component items.
                
                 */
                get searchMode() {
                    return this._getOption('searchMode');
                }
                set searchMode(value) {
                    this._setOption('searchMode', value);
                }
                /**
                 * The text that is provided as a hint in the lookup&apos;s search bar.
                
                 */
                get searchPlaceholder() {
                    return this._getOption('searchPlaceholder');
                }
                set searchPlaceholder(value) {
                    this._setOption('searchPlaceholder', value);
                }
                /**
                 * Specifies the DOM events after which the UI component&apos;s search results should be updated.
                
                 */
                get searchStartEvent() {
                    return this._getOption('searchStartEvent');
                }
                set searchStartEvent(value) {
                    this._setOption('searchStartEvent', value);
                }
                /**
                 * Specifies the time delay, in milliseconds, after the last character has been typed in, before a search is executed.
                
                 */
                get searchTimeout() {
                    return this._getOption('searchTimeout');
                }
                set searchTimeout(value) {
                    this._setOption('searchTimeout', value);
                }
                /**
                 * Gets the currently selected item.
                
                 */
                get selectedItem() {
                    return this._getOption('selectedItem');
                }
                set selectedItem(value) {
                    this._setOption('selectedItem', value);
                }
                /**
                 * Specifies whether to display the Cancel button in the lookup window.
                
                 */
                get showCancelButton() {
                    return this._getOption('showCancelButton');
                }
                set showCancelButton(value) {
                    this._setOption('showCancelButton', value);
                }
                /**
                 * Specifies whether to display the Clear button in the lookup window.
                
                 */
                get showClearButton() {
                    return this._getOption('showClearButton');
                }
                set showClearButton(value) {
                    this._setOption('showClearButton', value);
                }
                /**
                 * Specifies whether or not the UI component displays unfiltered values until a user types a number of characters exceeding the minSearchLength property value.
                
                 */
                get showDataBeforeSearch() {
                    return this._getOption('showDataBeforeSearch');
                }
                set showDataBeforeSearch(value) {
                    this._setOption('showDataBeforeSearch', value);
                }
                /**
                 * Specifies how the UI component&apos;s text field is styled.
                
                 */
                get stylingMode() {
                    return this._getOption('stylingMode');
                }
                set stylingMode(value) {
                    this._setOption('stylingMode', value);
                }
                /**
                 * Specifies the number of the element when the Tab key is used for navigating.
                
                 */
                get tabIndex() {
                    return this._getOption('tabIndex');
                }
                set tabIndex(value) {
                    this._setOption('tabIndex', value);
                }
                /**
                 * The read-only property that holds the text displayed by the UI component input element.
                
                 */
                get text() {
                    return this._getOption('text');
                }
                set text(value) {
                    this._setOption('text', value);
                }
                /**
                 * Specifies whether the widget uses item&apos;s text a title attribute.
                
                 */
                get useItemTextAsTitle() {
                    return this._getOption('useItemTextAsTitle');
                }
                set useItemTextAsTitle(value) {
                    this._setOption('useItemTextAsTitle', value);
                }
                /**
                 * Specifies whether or not the UI component uses native scrolling.
                
                 */
                get useNativeScrolling() {
                    return this._getOption('useNativeScrolling');
                }
                set useNativeScrolling(value) {
                    this._setOption('useNativeScrolling', value);
                }
                /**
                 * Specifies whether to show lookup contents in the Popover UI component.
                
                 */
                get usePopover() {
                    return this._getOption('usePopover');
                }
                set usePopover(value) {
                    this._setOption('usePopover', value);
                }
                /**
                 * Information on the broken validation rule. Contains the first item from the validationErrors array.
                
                 */
                get validationError() {
                    return this._getOption('validationError');
                }
                set validationError(value) {
                    this._setOption('validationError', value);
                }
                /**
                 * An array of the validation rules that failed.
                
                 */
                get validationErrors() {
                    return this._getOption('validationErrors');
                }
                set validationErrors(value) {
                    this._setOption('validationErrors', value);
                }
                /**
                 * Specifies how the message about the validation rules that are not satisfied by this editor&apos;s value is displayed.
                
                 */
                get validationMessageMode() {
                    return this._getOption('validationMessageMode');
                }
                set validationMessageMode(value) {
                    this._setOption('validationMessageMode', value);
                }
                /**
                 * Specifies the position of a validation message relative to the component. The validation message describes the validation rules that this component&apos;s value does not satisfy.
                
                 */
                get validationMessagePosition() {
                    return this._getOption('validationMessagePosition');
                }
                set validationMessagePosition(value) {
                    this._setOption('validationMessagePosition', value);
                }
                /**
                 * Indicates or specifies the current validation status.
                
                 */
                get validationStatus() {
                    return this._getOption('validationStatus');
                }
                set validationStatus(value) {
                    this._setOption('validationStatus', value);
                }
                /**
                 * Specifies the currently selected value. May be an object if dataSource contains objects, the store key is specified, and valueExpr is not set.
                
                 */
                get value() {
                    return this._getOption('value');
                }
                set value(value) {
                    this._setOption('value', value);
                }
                /**
                 * Specifies the DOM events after which the UI component&apos;s value should be updated.
                
                 * @deprecated 
                
                 */
                get valueChangeEvent() {
                    return this._getOption('valueChangeEvent');
                }
                set valueChangeEvent(value) {
                    this._setOption('valueChangeEvent', value);
                }
                /**
                 * Specifies which data field provides unique values to the UI component&apos;s value.
                
                 */
                get valueExpr() {
                    return this._getOption('valueExpr');
                }
                set valueExpr(value) {
                    this._setOption('valueExpr', value);
                }
                /**
                 * Specifies whether the UI component is visible.
                
                 */
                get visible() {
                    return this._getOption('visible');
                }
                set visible(value) {
                    this._setOption('visible', value);
                }
                /**
                 * Specifies the UI component&apos;s width.
                
                 */
                get width() {
                    return this._getOption('width');
                }
                set width(value) {
                    this._setOption('width', value);
                }
                /**
                 * Specifies whether text that exceeds the drop-down list width should be wrapped.
                
                 */
                get wrapItemText() {
                    return this._getOption('wrapItemText');
                }
                set wrapItemText(value) {
                    this._setOption('wrapItemText', value);
                }
                /**
                
                 * A function that is executed once the drop-down editor is closed.
                
                
                 */
                onClosed;
                /**
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed when a list item is clicked or tapped.
                
                
                 */
                onItemClick;
                /**
                
                 * A function that is executed once the drop-down editor is opened.
                
                
                 */
                onOpened;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed before the next page is loaded.
                
                
                 */
                onPageLoading;
                /**
                
                 * A function that is executed when the &apos;pull to refresh&apos; gesture is performed on the drop-down item list. Supported on mobile devices only.
                
                
                 */
                onPullRefresh;
                /**
                
                 * A function that is executed on each scroll gesture performed on the drop-down item list.
                
                
                 */
                onScroll;
                /**
                
                 * A function that is executed when a list item is selected or selection is canceled.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * A function that is executed after the UI component&apos;s value is changed.
                
                
                 */
                onValueChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                accessKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                activeStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                applyButtonTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                applyValueModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                cancelButtonTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                cleanSearchOnOpeningChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                clearButtonTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                deferRenderingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                displayExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                displayValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dropDownCenteredChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dropDownOptionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                fieldTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                fullScreenChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                groupedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                groupTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hintChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hoverStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                inputAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                isDirtyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                isValidChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                labelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                labelModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minSearchLengthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                nameChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                nextButtonTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                noDataTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                openedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pageLoadingTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pageLoadModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                placeholderChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pulledDownTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pullingDownTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pullRefreshEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                refreshingTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchPlaceholderChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchStartEventChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchTimeoutChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showCancelButtonChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showClearButtonChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showDataBeforeSearchChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                stylingModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                textChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                useItemTextAsTitleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                useNativeScrollingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                usePopoverChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationErrorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationErrorsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationMessageModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationMessagePositionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationStatusChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueChangeEventChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                wrapItemTextChange;
                /**
                
                 * 
                
                
                 */
                onBlur;
                change(_) { }
                touched = (_) => { };
                get itemsChildren() {
                    return this._getOption('items');
                }
                set itemsChildren(value) {
                    this.setChildren('items', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'closed', emit: 'onClosed' },
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'itemClick', emit: 'onItemClick' },
                        { subscribe: 'opened', emit: 'onOpened' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'pageLoading', emit: 'onPageLoading' },
                        { subscribe: 'pullRefresh', emit: 'onPullRefresh' },
                        { subscribe: 'scroll', emit: 'onScroll' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { subscribe: 'valueChanged', emit: 'onValueChanged' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'applyButtonTextChange' },
                        { emit: 'applyValueModeChange' },
                        { emit: 'cancelButtonTextChange' },
                        { emit: 'cleanSearchOnOpeningChange' },
                        { emit: 'clearButtonTextChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'deferRenderingChange' },
                        { emit: 'disabledChange' },
                        { emit: 'displayExprChange' },
                        { emit: 'displayValueChange' },
                        { emit: 'dropDownCenteredChange' },
                        { emit: 'dropDownOptionsChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'fieldTemplateChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'fullScreenChange' },
                        { emit: 'groupedChange' },
                        { emit: 'groupTemplateChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'inputAttrChange' },
                        { emit: 'isDirtyChange' },
                        { emit: 'isValidChange' },
                        { emit: 'itemsChange' },
                        { emit: 'itemTemplateChange' },
                        { emit: 'labelChange' },
                        { emit: 'labelModeChange' },
                        { emit: 'minSearchLengthChange' },
                        { emit: 'nameChange' },
                        { emit: 'nextButtonTextChange' },
                        { emit: 'noDataTextChange' },
                        { emit: 'openedChange' },
                        { emit: 'pageLoadingTextChange' },
                        { emit: 'pageLoadModeChange' },
                        { emit: 'placeholderChange' },
                        { emit: 'pulledDownTextChange' },
                        { emit: 'pullingDownTextChange' },
                        { emit: 'pullRefreshEnabledChange' },
                        { emit: 'refreshingTextChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'searchEnabledChange' },
                        { emit: 'searchExprChange' },
                        { emit: 'searchModeChange' },
                        { emit: 'searchPlaceholderChange' },
                        { emit: 'searchStartEventChange' },
                        { emit: 'searchTimeoutChange' },
                        { emit: 'selectedItemChange' },
                        { emit: 'showCancelButtonChange' },
                        { emit: 'showClearButtonChange' },
                        { emit: 'showDataBeforeSearchChange' },
                        { emit: 'stylingModeChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'textChange' },
                        { emit: 'useItemTextAsTitleChange' },
                        { emit: 'useNativeScrollingChange' },
                        { emit: 'usePopoverChange' },
                        { emit: 'validationErrorChange' },
                        { emit: 'validationErrorsChange' },
                        { emit: 'validationMessageModeChange' },
                        { emit: 'validationMessagePositionChange' },
                        { emit: 'validationStatusChange' },
                        { emit: 'valueChange' },
                        { emit: 'valueChangeEventChange' },
                        { emit: 'valueExprChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'wrapItemTextChange' },
                        { emit: 'onBlur' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxLookup(element, options);
                }
                writeValue(value) {
                    this.eventHelper.lockedValueChangeEvent = true;
                    this.value = value;
                    this.eventHelper.lockedValueChangeEvent = false;
                }
                setDisabledState(isDisabled) {
                    this.disabled = isDisabled;
                }
                registerOnChange(fn) { this.change = fn; }
                registerOnTouched(fn) { this.touched = fn; }
                _createWidget(element) {
                    super._createWidget(element);
                    this.instance.on('focusOut', (e) => {
                        this.eventHelper.fireNgEvent('onBlur', [e]);
                    });
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('items', changes);
                    this.setupChanges('searchExpr', changes);
                    this.setupChanges('validationErrors', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('items');
                    this._idh.doCheck('searchExpr');
                    this._idh.doCheck('validationErrors');
                    this._watcherHelper.checkWatchers();
                    super.ngDoCheck();
                    super.clearChangedOptions();
                }
                _setOption(name, value) {
                    let isSetup = this._idh.setupSingle(name, value);
                    let isChanged = this._idh.getChanges(name, value) !== null;
                    if (isSetup || isChanged) {
                        super._setOption(name, value);
                    }
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxLookupComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxLookupComponent, selector: "dx-lookup", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", applyButtonText: "applyButtonText", applyValueMode: "applyValueMode", cancelButtonText: "cancelButtonText", cleanSearchOnOpening: "cleanSearchOnOpening", clearButtonText: "clearButtonText", dataSource: "dataSource", deferRendering: "deferRendering", disabled: "disabled", displayExpr: "displayExpr", displayValue: "displayValue", dropDownCentered: "dropDownCentered", dropDownOptions: "dropDownOptions", elementAttr: "elementAttr", fieldTemplate: "fieldTemplate", focusStateEnabled: "focusStateEnabled", fullScreen: "fullScreen", grouped: "grouped", groupTemplate: "groupTemplate", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", inputAttr: "inputAttr", isDirty: "isDirty", isValid: "isValid", items: "items", itemTemplate: "itemTemplate", label: "label", labelMode: "labelMode", minSearchLength: "minSearchLength", name: "name", nextButtonText: "nextButtonText", noDataText: "noDataText", opened: "opened", pageLoadingText: "pageLoadingText", pageLoadMode: "pageLoadMode", placeholder: "placeholder", pulledDownText: "pulledDownText", pullingDownText: "pullingDownText", pullRefreshEnabled: "pullRefreshEnabled", refreshingText: "refreshingText", rtlEnabled: "rtlEnabled", searchEnabled: "searchEnabled", searchExpr: "searchExpr", searchMode: "searchMode", searchPlaceholder: "searchPlaceholder", searchStartEvent: "searchStartEvent", searchTimeout: "searchTimeout", selectedItem: "selectedItem", showCancelButton: "showCancelButton", showClearButton: "showClearButton", showDataBeforeSearch: "showDataBeforeSearch", stylingMode: "stylingMode", tabIndex: "tabIndex", text: "text", useItemTextAsTitle: "useItemTextAsTitle", useNativeScrolling: "useNativeScrolling", usePopover: "usePopover", validationError: "validationError", validationErrors: "validationErrors", validationMessageMode: "validationMessageMode", validationMessagePosition: "validationMessagePosition", validationStatus: "validationStatus", value: "value", valueChangeEvent: "valueChangeEvent", valueExpr: "valueExpr", visible: "visible", width: "width", wrapItemText: "wrapItemText" }, outputs: { onClosed: "onClosed", onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onItemClick: "onItemClick", onOpened: "onOpened", onOptionChanged: "onOptionChanged", onPageLoading: "onPageLoading", onPullRefresh: "onPullRefresh", onScroll: "onScroll", onSelectionChanged: "onSelectionChanged", onValueChanged: "onValueChanged", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", applyButtonTextChange: "applyButtonTextChange", applyValueModeChange: "applyValueModeChange", cancelButtonTextChange: "cancelButtonTextChange", cleanSearchOnOpeningChange: "cleanSearchOnOpeningChange", clearButtonTextChange: "clearButtonTextChange", dataSourceChange: "dataSourceChange", deferRenderingChange: "deferRenderingChange", disabledChange: "disabledChange", displayExprChange: "displayExprChange", displayValueChange: "displayValueChange", dropDownCenteredChange: "dropDownCenteredChange", dropDownOptionsChange: "dropDownOptionsChange", elementAttrChange: "elementAttrChange", fieldTemplateChange: "fieldTemplateChange", focusStateEnabledChange: "focusStateEnabledChange", fullScreenChange: "fullScreenChange", groupedChange: "groupedChange", groupTemplateChange: "groupTemplateChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", inputAttrChange: "inputAttrChange", isDirtyChange: "isDirtyChange", isValidChange: "isValidChange", itemsChange: "itemsChange", itemTemplateChange: "itemTemplateChange", labelChange: "labelChange", labelModeChange: "labelModeChange", minSearchLengthChange: "minSearchLengthChange", nameChange: "nameChange", nextButtonTextChange: "nextButtonTextChange", noDataTextChange: "noDataTextChange", openedChange: "openedChange", pageLoadingTextChange: "pageLoadingTextChange", pageLoadModeChange: "pageLoadModeChange", placeholderChange: "placeholderChange", pulledDownTextChange: "pulledDownTextChange", pullingDownTextChange: "pullingDownTextChange", pullRefreshEnabledChange: "pullRefreshEnabledChange", refreshingTextChange: "refreshingTextChange", rtlEnabledChange: "rtlEnabledChange", searchEnabledChange: "searchEnabledChange", searchExprChange: "searchExprChange", searchModeChange: "searchModeChange", searchPlaceholderChange: "searchPlaceholderChange", searchStartEventChange: "searchStartEventChange", searchTimeoutChange: "searchTimeoutChange", selectedItemChange: "selectedItemChange", showCancelButtonChange: "showCancelButtonChange", showClearButtonChange: "showClearButtonChange", showDataBeforeSearchChange: "showDataBeforeSearchChange", stylingModeChange: "stylingModeChange", tabIndexChange: "tabIndexChange", textChange: "textChange", useItemTextAsTitleChange: "useItemTextAsTitleChange", useNativeScrollingChange: "useNativeScrollingChange", usePopoverChange: "usePopoverChange", validationErrorChange: "validationErrorChange", validationErrorsChange: "validationErrorsChange", validationMessageModeChange: "validationMessageModeChange", validationMessagePositionChange: "validationMessagePositionChange", validationStatusChange: "validationStatusChange", valueChange: "valueChange", valueChangeEventChange: "valueChangeEventChange", valueExprChange: "valueExprChange", visibleChange: "visibleChange", widthChange: "widthChange", wrapItemTextChange: "wrapItemTextChange", onBlur: "onBlur" }, host: { listeners: { "valueChange": "change($event)", "onBlur": "touched($event)" } }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        CUSTOM_VALUE_ACCESSOR_PROVIDER,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "itemsChildren", predicate: DxiItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxLookupComponent", DxLookupComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxLookupComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-lookup',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    CUSTOM_VALUE_ACCESSOR_PROVIDER,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { accessKey: [{
                            type: Input
                        }], activeStateEnabled: [{
                            type: Input
                        }], applyButtonText: [{
                            type: Input
                        }], applyValueMode: [{
                            type: Input
                        }], cancelButtonText: [{
                            type: Input
                        }], cleanSearchOnOpening: [{
                            type: Input
                        }], clearButtonText: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], deferRendering: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], displayExpr: [{
                            type: Input
                        }], displayValue: [{
                            type: Input
                        }], dropDownCentered: [{
                            type: Input
                        }], dropDownOptions: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], fieldTemplate: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], fullScreen: [{
                            type: Input
                        }], grouped: [{
                            type: Input
                        }], groupTemplate: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], inputAttr: [{
                            type: Input
                        }], isDirty: [{
                            type: Input
                        }], isValid: [{
                            type: Input
                        }], items: [{
                            type: Input
                        }], itemTemplate: [{
                            type: Input
                        }], label: [{
                            type: Input
                        }], labelMode: [{
                            type: Input
                        }], minSearchLength: [{
                            type: Input
                        }], name: [{
                            type: Input
                        }], nextButtonText: [{
                            type: Input
                        }], noDataText: [{
                            type: Input
                        }], opened: [{
                            type: Input
                        }], pageLoadingText: [{
                            type: Input
                        }], pageLoadMode: [{
                            type: Input
                        }], placeholder: [{
                            type: Input
                        }], pulledDownText: [{
                            type: Input
                        }], pullingDownText: [{
                            type: Input
                        }], pullRefreshEnabled: [{
                            type: Input
                        }], refreshingText: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], searchEnabled: [{
                            type: Input
                        }], searchExpr: [{
                            type: Input
                        }], searchMode: [{
                            type: Input
                        }], searchPlaceholder: [{
                            type: Input
                        }], searchStartEvent: [{
                            type: Input
                        }], searchTimeout: [{
                            type: Input
                        }], selectedItem: [{
                            type: Input
                        }], showCancelButton: [{
                            type: Input
                        }], showClearButton: [{
                            type: Input
                        }], showDataBeforeSearch: [{
                            type: Input
                        }], stylingMode: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], text: [{
                            type: Input
                        }], useItemTextAsTitle: [{
                            type: Input
                        }], useNativeScrolling: [{
                            type: Input
                        }], usePopover: [{
                            type: Input
                        }], validationError: [{
                            type: Input
                        }], validationErrors: [{
                            type: Input
                        }], validationMessageMode: [{
                            type: Input
                        }], validationMessagePosition: [{
                            type: Input
                        }], validationStatus: [{
                            type: Input
                        }], value: [{
                            type: Input
                        }], valueChangeEvent: [{
                            type: Input
                        }], valueExpr: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], wrapItemText: [{
                            type: Input
                        }], onClosed: [{
                            type: Output
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onItemClick: [{
                            type: Output
                        }], onOpened: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onPageLoading: [{
                            type: Output
                        }], onPullRefresh: [{
                            type: Output
                        }], onScroll: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], onValueChanged: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], applyButtonTextChange: [{
                            type: Output
                        }], applyValueModeChange: [{
                            type: Output
                        }], cancelButtonTextChange: [{
                            type: Output
                        }], cleanSearchOnOpeningChange: [{
                            type: Output
                        }], clearButtonTextChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], deferRenderingChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], displayExprChange: [{
                            type: Output
                        }], displayValueChange: [{
                            type: Output
                        }], dropDownCenteredChange: [{
                            type: Output
                        }], dropDownOptionsChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], fieldTemplateChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], fullScreenChange: [{
                            type: Output
                        }], groupedChange: [{
                            type: Output
                        }], groupTemplateChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], inputAttrChange: [{
                            type: Output
                        }], isDirtyChange: [{
                            type: Output
                        }], isValidChange: [{
                            type: Output
                        }], itemsChange: [{
                            type: Output
                        }], itemTemplateChange: [{
                            type: Output
                        }], labelChange: [{
                            type: Output
                        }], labelModeChange: [{
                            type: Output
                        }], minSearchLengthChange: [{
                            type: Output
                        }], nameChange: [{
                            type: Output
                        }], nextButtonTextChange: [{
                            type: Output
                        }], noDataTextChange: [{
                            type: Output
                        }], openedChange: [{
                            type: Output
                        }], pageLoadingTextChange: [{
                            type: Output
                        }], pageLoadModeChange: [{
                            type: Output
                        }], placeholderChange: [{
                            type: Output
                        }], pulledDownTextChange: [{
                            type: Output
                        }], pullingDownTextChange: [{
                            type: Output
                        }], pullRefreshEnabledChange: [{
                            type: Output
                        }], refreshingTextChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], searchEnabledChange: [{
                            type: Output
                        }], searchExprChange: [{
                            type: Output
                        }], searchModeChange: [{
                            type: Output
                        }], searchPlaceholderChange: [{
                            type: Output
                        }], searchStartEventChange: [{
                            type: Output
                        }], searchTimeoutChange: [{
                            type: Output
                        }], selectedItemChange: [{
                            type: Output
                        }], showCancelButtonChange: [{
                            type: Output
                        }], showClearButtonChange: [{
                            type: Output
                        }], showDataBeforeSearchChange: [{
                            type: Output
                        }], stylingModeChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], textChange: [{
                            type: Output
                        }], useItemTextAsTitleChange: [{
                            type: Output
                        }], useNativeScrollingChange: [{
                            type: Output
                        }], usePopoverChange: [{
                            type: Output
                        }], validationErrorChange: [{
                            type: Output
                        }], validationErrorsChange: [{
                            type: Output
                        }], validationMessageModeChange: [{
                            type: Output
                        }], validationMessagePositionChange: [{
                            type: Output
                        }], validationStatusChange: [{
                            type: Output
                        }], valueChange: [{
                            type: Output
                        }], valueChangeEventChange: [{
                            type: Output
                        }], valueExprChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], wrapItemTextChange: [{
                            type: Output
                        }], onBlur: [{
                            type: Output
                        }], change: [{
                            type: HostListener,
                            args: ['valueChange', ['$event']]
                        }], touched: [{
                            type: HostListener,
                            args: ['onBlur', ['$event']]
                        }], itemsChildren: [{
                            type: ContentChildren,
                            args: [DxiItemComponent]
                        }] } });
            class DxLookupModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxLookupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxLookupModule, declarations: [DxLookupComponent], imports: [DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxoHideEventModule,
                        DxoShowEventModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxLookupComponent, DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxoHideEventModule,
                        DxoShowEventModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxLookupModule, imports: [DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxoHideEventModule,
                        DxoShowEventModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxoHideEventModule,
                        DxoShowEventModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxTemplateModule] });
            } exports("DxLookupModule", DxLookupModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxLookupModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoDropDownOptionsModule,
                                    DxoAnimationModule,
                                    DxoHideModule,
                                    DxoFromModule,
                                    DxoPositionModule,
                                    DxoAtModule,
                                    DxoBoundaryOffsetModule,
                                    DxoCollisionModule,
                                    DxoMyModule,
                                    DxoOffsetModule,
                                    DxoToModule,
                                    DxoShowModule,
                                    DxoHideEventModule,
                                    DxoShowEventModule,
                                    DxiToolbarItemModule,
                                    DxiItemModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxLookupComponent
                                ],
                                exports: [
                                    DxLookupComponent,
                                    DxoDropDownOptionsModule,
                                    DxoAnimationModule,
                                    DxoHideModule,
                                    DxoFromModule,
                                    DxoPositionModule,
                                    DxoAtModule,
                                    DxoBoundaryOffsetModule,
                                    DxoCollisionModule,
                                    DxoMyModule,
                                    DxoOffsetModule,
                                    DxoToModule,
                                    DxoShowModule,
                                    DxoHideEventModule,
                                    DxoShowEventModule,
                                    DxiToolbarItemModule,
                                    DxiItemModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
