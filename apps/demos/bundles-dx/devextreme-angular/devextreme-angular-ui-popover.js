System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/popover', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxPopover, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiToolbarItemComponent, DxoAnimationModule, DxoHideModule, DxoFromModule, DxoPositionModule, DxoAtModule, DxoBoundaryOffsetModule, DxoCollisionModule, DxoMyModule, DxoOffsetModule, DxoToModule, DxoShowModule, DxoHideEventModule, DxoShowEventModule, DxiToolbarItemModule;
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
            DxPopover = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiToolbarItemComponent = module.DxiToolbarItemComponent;
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
             * The Popover is a UI component that shows notifications within a box with an arrow pointing to a specified UI element.

             */
            class DxPopoverComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Configures UI component visibility animations. This object contains two fields: show and hide.
                
                 */
                get animation() {
                    return this._getOption('animation');
                }
                set animation(value) {
                    this._setOption('animation', value);
                }
                /**
                 * Specifies whether to close the UI component if a user clicks outside the popover window or outside the target element.
                
                 * @deprecated Use the hideOnOutsideClick option instead.
                
                 */
                get closeOnOutsideClick() {
                    return this._getOption('closeOnOutsideClick');
                }
                set closeOnOutsideClick(value) {
                    this._setOption('closeOnOutsideClick', value);
                }
                /**
                 * Specifies the container in which to render the UI component.
                
                 */
                get container() {
                    return this._getOption('container');
                }
                set container(value) {
                    this._setOption('container', value);
                }
                /**
                 * Specifies a custom template for the UI component content.
                
                 */
                get contentTemplate() {
                    return this._getOption('contentTemplate');
                }
                set contentTemplate(value) {
                    this._setOption('contentTemplate', value);
                }
                /**
                 * Specifies whether to render the UI component&apos;s content when it is displayed. If false, the content is rendered immediately.
                
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
                 * Specifies whether to enable page scrolling when the UI component is visible.
                
                 */
                get enableBodyScroll() {
                    return this._getOption('enableBodyScroll');
                }
                set enableBodyScroll(value) {
                    this._setOption('enableBodyScroll', value);
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
                 * Specifies properties of popover hiding. Ignored if the shading property is set to true.
                
                 */
                get hideEvent() {
                    return this._getOption('hideEvent');
                }
                set hideEvent(value) {
                    this._setOption('hideEvent', value);
                }
                /**
                 * Specifies whether to hide the UI component if a user clicks outside the popover window or outside the target element.
                
                 */
                get hideOnOutsideClick() {
                    return this._getOption('hideOnOutsideClick');
                }
                set hideOnOutsideClick(value) {
                    this._setOption('hideOnOutsideClick', value);
                }
                /**
                 * Specifies whether to hide the widget when users scroll one of its parent elements.
                
                 */
                get hideOnParentScroll() {
                    return this._getOption('hideOnParentScroll');
                }
                set hideOnParentScroll(value) {
                    this._setOption('hideOnParentScroll', value);
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
                 * Specifies the maximum height the UI component can reach while resizing.
                
                 */
                get maxHeight() {
                    return this._getOption('maxHeight');
                }
                set maxHeight(value) {
                    this._setOption('maxHeight', value);
                }
                /**
                 * Specifies the maximum width the UI component can reach while resizing.
                
                 */
                get maxWidth() {
                    return this._getOption('maxWidth');
                }
                set maxWidth(value) {
                    this._setOption('maxWidth', value);
                }
                /**
                 * Specifies the minimum height the UI component can reach while resizing.
                
                 */
                get minHeight() {
                    return this._getOption('minHeight');
                }
                set minHeight(value) {
                    this._setOption('minHeight', value);
                }
                /**
                 * Specifies the minimum width the UI component can reach while resizing.
                
                 */
                get minWidth() {
                    return this._getOption('minWidth');
                }
                set minWidth(value) {
                    this._setOption('minWidth', value);
                }
                /**
                 * An object defining UI component positioning properties.
                
                 */
                get position() {
                    return this._getOption('position');
                }
                set position(value) {
                    this._setOption('position', value);
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
                 * Specifies whether to shade the background when the UI component is active.
                
                 */
                get shading() {
                    return this._getOption('shading');
                }
                set shading(value) {
                    this._setOption('shading', value);
                }
                /**
                 * Specifies the shading color. Applies only if shading is enabled.
                
                 */
                get shadingColor() {
                    return this._getOption('shadingColor');
                }
                set shadingColor(value) {
                    this._setOption('shadingColor', value);
                }
                /**
                 * Specifies whether or not the UI component displays the Close button.
                
                 */
                get showCloseButton() {
                    return this._getOption('showCloseButton');
                }
                set showCloseButton(value) {
                    this._setOption('showCloseButton', value);
                }
                /**
                 * Specifies properties for displaying the UI component.
                
                 */
                get showEvent() {
                    return this._getOption('showEvent');
                }
                set showEvent(value) {
                    this._setOption('showEvent', value);
                }
                /**
                 * A Boolean value specifying whether or not to display the title in the overlay window.
                
                 */
                get showTitle() {
                    return this._getOption('showTitle');
                }
                set showTitle(value) {
                    this._setOption('showTitle', value);
                }
                /**
                 * Specifies the element against which to position the widget.
                
                 */
                get target() {
                    return this._getOption('target');
                }
                set target(value) {
                    this._setOption('target', value);
                }
                /**
                 * The title in the overlay window.
                
                 */
                get title() {
                    return this._getOption('title');
                }
                set title(value) {
                    this._setOption('title', value);
                }
                /**
                 * Specifies a custom template for the UI component title. Does not apply if the title is defined.
                
                 */
                get titleTemplate() {
                    return this._getOption('titleTemplate');
                }
                set titleTemplate(value) {
                    this._setOption('titleTemplate', value);
                }
                /**
                 * Configures toolbar items.
                
                 */
                get toolbarItems() {
                    return this._getOption('toolbarItems');
                }
                set toolbarItems(value) {
                    this._setOption('toolbarItems', value);
                }
                /**
                 * A Boolean value specifying whether or not the UI component is visible.
                
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
                 * Specifies the global attributes for the UI component&apos;s wrapper element.
                
                 */
                get wrapperAttr() {
                    return this._getOption('wrapperAttr');
                }
                set wrapperAttr(value) {
                    this._setOption('wrapperAttr', value);
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
                
                 * A function that is executed after the UI component is hidden.
                
                
                 */
                onHidden;
                /**
                
                 * A function that is executed before the UI component is hidden.
                
                
                 */
                onHiding;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed before the UI component is displayed.
                
                
                 */
                onShowing;
                /**
                
                 * A function that is executed after the UI component is displayed.
                
                
                 */
                onShown;
                /**
                
                 * A function that is executed when the UI component&apos;s title is rendered.
                
                
                 */
                onTitleRendered;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                animationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                closeOnOutsideClickChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                containerChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                contentTemplateChange;
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
                enableBodyScrollChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hideEventChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hideOnOutsideClickChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hideOnParentScrollChange;
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
                maxHeightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minHeightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                positionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                shadingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                shadingColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showCloseButtonChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showEventChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showTitleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                targetChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                titleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                titleTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                toolbarItemsChange;
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
                wrapperAttrChange;
                get toolbarItemsChildren() {
                    return this._getOption('toolbarItems');
                }
                set toolbarItemsChildren(value) {
                    this.setChildren('toolbarItems', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'hidden', emit: 'onHidden' },
                        { subscribe: 'hiding', emit: 'onHiding' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'showing', emit: 'onShowing' },
                        { subscribe: 'shown', emit: 'onShown' },
                        { subscribe: 'titleRendered', emit: 'onTitleRendered' },
                        { emit: 'animationChange' },
                        { emit: 'closeOnOutsideClickChange' },
                        { emit: 'containerChange' },
                        { emit: 'contentTemplateChange' },
                        { emit: 'deferRenderingChange' },
                        { emit: 'disabledChange' },
                        { emit: 'enableBodyScrollChange' },
                        { emit: 'heightChange' },
                        { emit: 'hideEventChange' },
                        { emit: 'hideOnOutsideClickChange' },
                        { emit: 'hideOnParentScrollChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'maxHeightChange' },
                        { emit: 'maxWidthChange' },
                        { emit: 'minHeightChange' },
                        { emit: 'minWidthChange' },
                        { emit: 'positionChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'shadingChange' },
                        { emit: 'shadingColorChange' },
                        { emit: 'showCloseButtonChange' },
                        { emit: 'showEventChange' },
                        { emit: 'showTitleChange' },
                        { emit: 'targetChange' },
                        { emit: 'titleChange' },
                        { emit: 'titleTemplateChange' },
                        { emit: 'toolbarItemsChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'wrapperAttrChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxPopover(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('toolbarItems', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('toolbarItems');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPopoverComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxPopoverComponent, selector: "dx-popover", inputs: { animation: "animation", closeOnOutsideClick: "closeOnOutsideClick", container: "container", contentTemplate: "contentTemplate", deferRendering: "deferRendering", disabled: "disabled", enableBodyScroll: "enableBodyScroll", height: "height", hideEvent: "hideEvent", hideOnOutsideClick: "hideOnOutsideClick", hideOnParentScroll: "hideOnParentScroll", hint: "hint", hoverStateEnabled: "hoverStateEnabled", maxHeight: "maxHeight", maxWidth: "maxWidth", minHeight: "minHeight", minWidth: "minWidth", position: "position", rtlEnabled: "rtlEnabled", shading: "shading", shadingColor: "shadingColor", showCloseButton: "showCloseButton", showEvent: "showEvent", showTitle: "showTitle", target: "target", title: "title", titleTemplate: "titleTemplate", toolbarItems: "toolbarItems", visible: "visible", width: "width", wrapperAttr: "wrapperAttr" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onHidden: "onHidden", onHiding: "onHiding", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onShowing: "onShowing", onShown: "onShown", onTitleRendered: "onTitleRendered", animationChange: "animationChange", closeOnOutsideClickChange: "closeOnOutsideClickChange", containerChange: "containerChange", contentTemplateChange: "contentTemplateChange", deferRenderingChange: "deferRenderingChange", disabledChange: "disabledChange", enableBodyScrollChange: "enableBodyScrollChange", heightChange: "heightChange", hideEventChange: "hideEventChange", hideOnOutsideClickChange: "hideOnOutsideClickChange", hideOnParentScrollChange: "hideOnParentScrollChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", maxHeightChange: "maxHeightChange", maxWidthChange: "maxWidthChange", minHeightChange: "minHeightChange", minWidthChange: "minWidthChange", positionChange: "positionChange", rtlEnabledChange: "rtlEnabledChange", shadingChange: "shadingChange", shadingColorChange: "shadingColorChange", showCloseButtonChange: "showCloseButtonChange", showEventChange: "showEventChange", showTitleChange: "showTitleChange", targetChange: "targetChange", titleChange: "titleChange", titleTemplateChange: "titleTemplateChange", toolbarItemsChange: "toolbarItemsChange", visibleChange: "visibleChange", widthChange: "widthChange", wrapperAttrChange: "wrapperAttrChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "toolbarItemsChildren", predicate: DxiToolbarItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
            } exports("DxPopoverComponent", DxPopoverComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPopoverComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-popover',
                                template: '<ng-content></ng-content>',
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
                            }] }], propDecorators: { animation: [{
                            type: Input
                        }], closeOnOutsideClick: [{
                            type: Input
                        }], container: [{
                            type: Input
                        }], contentTemplate: [{
                            type: Input
                        }], deferRendering: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], enableBodyScroll: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hideEvent: [{
                            type: Input
                        }], hideOnOutsideClick: [{
                            type: Input
                        }], hideOnParentScroll: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], maxHeight: [{
                            type: Input
                        }], maxWidth: [{
                            type: Input
                        }], minHeight: [{
                            type: Input
                        }], minWidth: [{
                            type: Input
                        }], position: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], shading: [{
                            type: Input
                        }], shadingColor: [{
                            type: Input
                        }], showCloseButton: [{
                            type: Input
                        }], showEvent: [{
                            type: Input
                        }], showTitle: [{
                            type: Input
                        }], target: [{
                            type: Input
                        }], title: [{
                            type: Input
                        }], titleTemplate: [{
                            type: Input
                        }], toolbarItems: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], wrapperAttr: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onHidden: [{
                            type: Output
                        }], onHiding: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onShowing: [{
                            type: Output
                        }], onShown: [{
                            type: Output
                        }], onTitleRendered: [{
                            type: Output
                        }], animationChange: [{
                            type: Output
                        }], closeOnOutsideClickChange: [{
                            type: Output
                        }], containerChange: [{
                            type: Output
                        }], contentTemplateChange: [{
                            type: Output
                        }], deferRenderingChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], enableBodyScrollChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hideEventChange: [{
                            type: Output
                        }], hideOnOutsideClickChange: [{
                            type: Output
                        }], hideOnParentScrollChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], maxHeightChange: [{
                            type: Output
                        }], maxWidthChange: [{
                            type: Output
                        }], minHeightChange: [{
                            type: Output
                        }], minWidthChange: [{
                            type: Output
                        }], positionChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], shadingChange: [{
                            type: Output
                        }], shadingColorChange: [{
                            type: Output
                        }], showCloseButtonChange: [{
                            type: Output
                        }], showEventChange: [{
                            type: Output
                        }], showTitleChange: [{
                            type: Output
                        }], targetChange: [{
                            type: Output
                        }], titleChange: [{
                            type: Output
                        }], titleTemplateChange: [{
                            type: Output
                        }], toolbarItemsChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], wrapperAttrChange: [{
                            type: Output
                        }], toolbarItemsChildren: [{
                            type: ContentChildren,
                            args: [DxiToolbarItemComponent]
                        }] } });
            class DxPopoverModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPopoverModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxPopoverModule, declarations: [DxPopoverComponent], imports: [DxoAnimationModule,
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
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxPopoverComponent, DxoAnimationModule,
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
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPopoverModule, imports: [DxoAnimationModule,
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
                        DxIntegrationModule,
                        DxTemplateModule, DxoAnimationModule,
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
                        DxTemplateModule] });
            } exports("DxPopoverModule", DxPopoverModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPopoverModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
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
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxPopoverComponent
                                ],
                                exports: [
                                    DxPopoverComponent,
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
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
