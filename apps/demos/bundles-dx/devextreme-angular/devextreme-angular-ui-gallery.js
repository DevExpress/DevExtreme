System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/gallery', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxGallery, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiItemComponent, DxiItemModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            ContentChildren = module.ContentChildren;
            NgModule = module.NgModule;
        }, function (module) {
            DxGallery = module.default;
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
            /**
             * The Gallery is a UI component that displays a collection of images in a carousel. The UI component is supplied with various navigation controls that allow a user to switch between images.

             */
            class DxGalleryComponent extends DxComponent {
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
                 * The time, in milliseconds, spent on slide animation.
                
                 */
                get animationDuration() {
                    return this._getOption('animationDuration');
                }
                set animationDuration(value) {
                    this._setOption('animationDuration', value);
                }
                /**
                 * Specifies whether or not to animate the displayed item change.
                
                 */
                get animationEnabled() {
                    return this._getOption('animationEnabled');
                }
                set animationEnabled(value) {
                    this._setOption('animationEnabled', value);
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
                 * Specifies whether the UI component responds to user interaction.
                
                 */
                get disabled() {
                    return this._getOption('disabled');
                }
                set disabled(value) {
                    this._setOption('disabled', value);
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
                 * Specifies whether the UI component can be focused using keyboard navigation.
                
                 */
                get focusStateEnabled() {
                    return this._getOption('focusStateEnabled');
                }
                set focusStateEnabled(value) {
                    this._setOption('focusStateEnabled', value);
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
                 * A Boolean value specifying whether or not to allow users to switch between items by clicking an indicator.
                
                 */
                get indicatorEnabled() {
                    return this._getOption('indicatorEnabled');
                }
                set indicatorEnabled(value) {
                    this._setOption('indicatorEnabled', value);
                }
                /**
                 * Specifies the width of an area used to display a single image.
                
                 */
                get initialItemWidth() {
                    return this._getOption('initialItemWidth');
                }
                set initialItemWidth(value) {
                    this._setOption('initialItemWidth', value);
                }
                /**
                 * The time period in milliseconds before the onItemHold event is raised.
                
                 */
                get itemHoldTimeout() {
                    return this._getOption('itemHoldTimeout');
                }
                set itemHoldTimeout(value) {
                    this._setOption('itemHoldTimeout', value);
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
                 * A Boolean value specifying whether or not to scroll back to the first item after the last item is swiped.
                
                 */
                get loop() {
                    return this._getOption('loop');
                }
                set loop(value) {
                    this._setOption('loop', value);
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
                 * Switches the UI component to a right-to-left representation.
                
                 */
                get rtlEnabled() {
                    return this._getOption('rtlEnabled');
                }
                set rtlEnabled(value) {
                    this._setOption('rtlEnabled', value);
                }
                /**
                 * The index of the currently active gallery item.
                
                 */
                get selectedIndex() {
                    return this._getOption('selectedIndex');
                }
                set selectedIndex(value) {
                    this._setOption('selectedIndex', value);
                }
                /**
                 * The selected item object.
                
                 */
                get selectedItem() {
                    return this._getOption('selectedItem');
                }
                set selectedItem(value) {
                    this._setOption('selectedItem', value);
                }
                /**
                 * A Boolean value specifying whether or not to display an indicator that points to the selected gallery item.
                
                 */
                get showIndicator() {
                    return this._getOption('showIndicator');
                }
                set showIndicator(value) {
                    this._setOption('showIndicator', value);
                }
                /**
                 * A Boolean value that specifies the availability of the &apos;Forward&apos; and &apos;Back&apos; navigation buttons.
                
                 */
                get showNavButtons() {
                    return this._getOption('showNavButtons');
                }
                set showNavButtons(value) {
                    this._setOption('showNavButtons', value);
                }
                /**
                 * The time interval in milliseconds, after which the gallery switches to the next item.
                
                 */
                get slideshowDelay() {
                    return this._getOption('slideshowDelay');
                }
                set slideshowDelay(value) {
                    this._setOption('slideshowDelay', value);
                }
                /**
                 * Specifies if the UI component stretches images to fit the total gallery width.
                
                 */
                get stretchImages() {
                    return this._getOption('stretchImages');
                }
                set stretchImages(value) {
                    this._setOption('stretchImages', value);
                }
                /**
                 * A Boolean value specifying whether or not to allow users to switch between items by swiping.
                
                 */
                get swipeEnabled() {
                    return this._getOption('swipeEnabled');
                }
                set swipeEnabled(value) {
                    this._setOption('swipeEnabled', value);
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
                 * Specifies whether or not to display parts of previous and next images along the sides of the current image.
                
                 */
                get wrapAround() {
                    return this._getOption('wrapAround');
                }
                set wrapAround(value) {
                    this._setOption('wrapAround', value);
                }
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
                
                 * A function that is executed when a collection item is clicked or tapped.
                
                
                 */
                onItemClick;
                /**
                
                 * A function that is executed when a collection item is right-clicked or pressed.
                
                
                 */
                onItemContextMenu;
                /**
                
                 * A function that is executed when a collection item has been held for a specified period.
                
                
                 */
                onItemHold;
                /**
                
                 * A function that is executed after a collection item is rendered.
                
                
                 */
                onItemRendered;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a collection item is selected or selection is canceled.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                accessKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                animationDurationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                animationEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
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
                indicatorEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                initialItemWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemHoldTimeoutChange;
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
                loopChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                noDataTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showIndicatorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showNavButtonsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                slideshowDelayChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                stretchImagesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                swipeEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
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
                wrapAroundChange;
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
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'itemClick', emit: 'onItemClick' },
                        { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
                        { subscribe: 'itemHold', emit: 'onItemHold' },
                        { subscribe: 'itemRendered', emit: 'onItemRendered' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { emit: 'accessKeyChange' },
                        { emit: 'animationDurationChange' },
                        { emit: 'animationEnabledChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'indicatorEnabledChange' },
                        { emit: 'initialItemWidthChange' },
                        { emit: 'itemHoldTimeoutChange' },
                        { emit: 'itemsChange' },
                        { emit: 'itemTemplateChange' },
                        { emit: 'loopChange' },
                        { emit: 'noDataTextChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'selectedIndexChange' },
                        { emit: 'selectedItemChange' },
                        { emit: 'showIndicatorChange' },
                        { emit: 'showNavButtonsChange' },
                        { emit: 'slideshowDelayChange' },
                        { emit: 'stretchImagesChange' },
                        { emit: 'swipeEnabledChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'wrapAroundChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxGallery(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('items', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('items');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxGalleryComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxGalleryComponent, selector: "dx-gallery", inputs: { accessKey: "accessKey", animationDuration: "animationDuration", animationEnabled: "animationEnabled", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", focusStateEnabled: "focusStateEnabled", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", indicatorEnabled: "indicatorEnabled", initialItemWidth: "initialItemWidth", itemHoldTimeout: "itemHoldTimeout", items: "items", itemTemplate: "itemTemplate", loop: "loop", noDataText: "noDataText", rtlEnabled: "rtlEnabled", selectedIndex: "selectedIndex", selectedItem: "selectedItem", showIndicator: "showIndicator", showNavButtons: "showNavButtons", slideshowDelay: "slideshowDelay", stretchImages: "stretchImages", swipeEnabled: "swipeEnabled", tabIndex: "tabIndex", visible: "visible", width: "width", wrapAround: "wrapAround" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onItemClick: "onItemClick", onItemContextMenu: "onItemContextMenu", onItemHold: "onItemHold", onItemRendered: "onItemRendered", onOptionChanged: "onOptionChanged", onSelectionChanged: "onSelectionChanged", accessKeyChange: "accessKeyChange", animationDurationChange: "animationDurationChange", animationEnabledChange: "animationEnabledChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", focusStateEnabledChange: "focusStateEnabledChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", indicatorEnabledChange: "indicatorEnabledChange", initialItemWidthChange: "initialItemWidthChange", itemHoldTimeoutChange: "itemHoldTimeoutChange", itemsChange: "itemsChange", itemTemplateChange: "itemTemplateChange", loopChange: "loopChange", noDataTextChange: "noDataTextChange", rtlEnabledChange: "rtlEnabledChange", selectedIndexChange: "selectedIndexChange", selectedItemChange: "selectedItemChange", showIndicatorChange: "showIndicatorChange", showNavButtonsChange: "showNavButtonsChange", slideshowDelayChange: "slideshowDelayChange", stretchImagesChange: "stretchImagesChange", swipeEnabledChange: "swipeEnabledChange", tabIndexChange: "tabIndexChange", visibleChange: "visibleChange", widthChange: "widthChange", wrapAroundChange: "wrapAroundChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "itemsChildren", predicate: DxiItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxGalleryComponent", DxGalleryComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxGalleryComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-gallery',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { accessKey: [{
                            type: Input
                        }], animationDuration: [{
                            type: Input
                        }], animationEnabled: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], indicatorEnabled: [{
                            type: Input
                        }], initialItemWidth: [{
                            type: Input
                        }], itemHoldTimeout: [{
                            type: Input
                        }], items: [{
                            type: Input
                        }], itemTemplate: [{
                            type: Input
                        }], loop: [{
                            type: Input
                        }], noDataText: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], selectedIndex: [{
                            type: Input
                        }], selectedItem: [{
                            type: Input
                        }], showIndicator: [{
                            type: Input
                        }], showNavButtons: [{
                            type: Input
                        }], slideshowDelay: [{
                            type: Input
                        }], stretchImages: [{
                            type: Input
                        }], swipeEnabled: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], wrapAround: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onItemClick: [{
                            type: Output
                        }], onItemContextMenu: [{
                            type: Output
                        }], onItemHold: [{
                            type: Output
                        }], onItemRendered: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], animationDurationChange: [{
                            type: Output
                        }], animationEnabledChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], indicatorEnabledChange: [{
                            type: Output
                        }], initialItemWidthChange: [{
                            type: Output
                        }], itemHoldTimeoutChange: [{
                            type: Output
                        }], itemsChange: [{
                            type: Output
                        }], itemTemplateChange: [{
                            type: Output
                        }], loopChange: [{
                            type: Output
                        }], noDataTextChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], selectedIndexChange: [{
                            type: Output
                        }], selectedItemChange: [{
                            type: Output
                        }], showIndicatorChange: [{
                            type: Output
                        }], showNavButtonsChange: [{
                            type: Output
                        }], slideshowDelayChange: [{
                            type: Output
                        }], stretchImagesChange: [{
                            type: Output
                        }], swipeEnabledChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], wrapAroundChange: [{
                            type: Output
                        }], itemsChildren: [{
                            type: ContentChildren,
                            args: [DxiItemComponent]
                        }] } });
            class DxGalleryModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxGalleryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxGalleryModule, declarations: [DxGalleryComponent], imports: [DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxGalleryComponent, DxiItemModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxGalleryModule, imports: [DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxiItemModule,
                        DxTemplateModule] });
            } exports("DxGalleryModule", DxGalleryModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxGalleryModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiItemModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxGalleryComponent
                                ],
                                exports: [
                                    DxGalleryComponent,
                                    DxiItemModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
