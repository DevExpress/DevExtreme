System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/tooltip', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxTooltip, DxComponent, DxTemplateHost, WatcherHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoAnimationModule, DxoHideModule, DxoFromModule, DxoPositionModule, DxoAtModule, DxoBoundaryOffsetModule, DxoCollisionModule, DxoMyModule, DxoOffsetModule, DxoToModule, DxoShowModule, DxoHideEventModule, DxoShowEventModule;
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
            NgModule = module.NgModule;
        }, function (module) {
            DxTooltip = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
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
             * The Tooltip UI component displays a tooltip for a specified element on the page.

             */
            class DxTooltipComponent extends DxComponent {
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
                 * Specifies properties for displaying the UI component.
                
                 */
                get showEvent() {
                    return this._getOption('showEvent');
                }
                set showEvent(value) {
                    this._setOption('showEvent', value);
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
                showEventChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                targetChange;
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
                constructor(elementRef, ngZone, templateHost, _watcherHelper, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._createEventEmitters([
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'hidden', emit: 'onHidden' },
                        { subscribe: 'hiding', emit: 'onHiding' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'showing', emit: 'onShowing' },
                        { subscribe: 'shown', emit: 'onShown' },
                        { emit: 'animationChange' },
                        { emit: 'closeOnOutsideClickChange' },
                        { emit: 'containerChange' },
                        { emit: 'contentTemplateChange' },
                        { emit: 'deferRenderingChange' },
                        { emit: 'disabledChange' },
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
                        { emit: 'showEventChange' },
                        { emit: 'targetChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'wrapperAttrChange' }
                    ]);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxTooltip(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTooltipComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxTooltipComponent, selector: "dx-tooltip", inputs: { animation: "animation", closeOnOutsideClick: "closeOnOutsideClick", container: "container", contentTemplate: "contentTemplate", deferRendering: "deferRendering", disabled: "disabled", height: "height", hideEvent: "hideEvent", hideOnOutsideClick: "hideOnOutsideClick", hideOnParentScroll: "hideOnParentScroll", hint: "hint", hoverStateEnabled: "hoverStateEnabled", maxHeight: "maxHeight", maxWidth: "maxWidth", minHeight: "minHeight", minWidth: "minWidth", position: "position", rtlEnabled: "rtlEnabled", shading: "shading", shadingColor: "shadingColor", showEvent: "showEvent", target: "target", visible: "visible", width: "width", wrapperAttr: "wrapperAttr" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onHidden: "onHidden", onHiding: "onHiding", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onShowing: "onShowing", onShown: "onShown", animationChange: "animationChange", closeOnOutsideClickChange: "closeOnOutsideClickChange", containerChange: "containerChange", contentTemplateChange: "contentTemplateChange", deferRenderingChange: "deferRenderingChange", disabledChange: "disabledChange", heightChange: "heightChange", hideEventChange: "hideEventChange", hideOnOutsideClickChange: "hideOnOutsideClickChange", hideOnParentScrollChange: "hideOnParentScrollChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", maxHeightChange: "maxHeightChange", maxWidthChange: "maxWidthChange", minHeightChange: "minHeightChange", minWidthChange: "minWidthChange", positionChange: "positionChange", rtlEnabledChange: "rtlEnabledChange", shadingChange: "shadingChange", shadingColorChange: "shadingColorChange", showEventChange: "showEventChange", targetChange: "targetChange", visibleChange: "visibleChange", widthChange: "widthChange", wrapperAttrChange: "wrapperAttrChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost
                    ], usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
            } exports("DxTooltipComponent", DxTooltipComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTooltipComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-tooltip',
                                template: '<ng-content></ng-content>',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
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
                        }], showEvent: [{
                            type: Input
                        }], target: [{
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
                        }], showEventChange: [{
                            type: Output
                        }], targetChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], wrapperAttrChange: [{
                            type: Output
                        }] } });
            class DxTooltipModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxTooltipModule, declarations: [DxTooltipComponent], imports: [DxoAnimationModule,
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
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxTooltipComponent, DxoAnimationModule,
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
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTooltipModule, imports: [DxoAnimationModule,
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
                        DxTemplateModule] });
            } exports("DxTooltipModule", DxTooltipModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTooltipModule, decorators: [{
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
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxTooltipComponent
                                ],
                                exports: [
                                    DxTooltipComponent,
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
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
