System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/scroll_view', './devextreme-angular-core.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxScrollView, DxComponent, DxTemplateHost, WatcherHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule;
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
            DxScrollView = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
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
             * The ScrollView is a UI component that enables a user to scroll its content.

             */
            class DxScrollViewComponent extends DxComponent {
                instance = null;
                /**
                 * A Boolean value specifying whether to enable or disable the bounce-back effect.
                
                 */
                get bounceEnabled() {
                    return this._getOption('bounceEnabled');
                }
                set bounceEnabled(value) {
                    this._setOption('bounceEnabled', value);
                }
                /**
                 * A string value specifying the available scrolling directions.
                
                 */
                get direction() {
                    return this._getOption('direction');
                }
                set direction(value) {
                    this._setOption('direction', value);
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
                 * Specifies the UI component&apos;s height.
                
                 */
                get height() {
                    return this._getOption('height');
                }
                set height(value) {
                    this._setOption('height', value);
                }
                /**
                 * Specifies the text shown in the pullDown panel when pulling the content down lowers the refresh threshold.
                
                 */
                get pulledDownText() {
                    return this._getOption('pulledDownText');
                }
                set pulledDownText(value) {
                    this._setOption('pulledDownText', value);
                }
                /**
                 * Specifies the text shown in the pullDown panel while pulling the content down to the refresh threshold.
                
                 */
                get pullingDownText() {
                    return this._getOption('pullingDownText');
                }
                set pullingDownText(value) {
                    this._setOption('pullingDownText', value);
                }
                /**
                 * Specifies the text shown in the pullDown panel displayed when content is scrolled to the bottom.
                
                 */
                get reachBottomText() {
                    return this._getOption('reachBottomText');
                }
                set reachBottomText(value) {
                    this._setOption('reachBottomText', value);
                }
                /**
                 * Specifies the text shown in the pullDown panel displayed when the content is being refreshed.
                
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
                 * A Boolean value specifying whether or not an end user can scroll the UI component content swiping it up or down. Applies only if useNative is false
                
                 */
                get scrollByContent() {
                    return this._getOption('scrollByContent');
                }
                set scrollByContent(value) {
                    this._setOption('scrollByContent', value);
                }
                /**
                 * Specifies whether a user can scroll the content with the scrollbar. Applies only if useNative is false.
                
                 */
                get scrollByThumb() {
                    return this._getOption('scrollByThumb');
                }
                set scrollByThumb(value) {
                    this._setOption('scrollByThumb', value);
                }
                /**
                 * Specifies when the UI component shows the scrollbar.
                
                 */
                get showScrollbar() {
                    return this._getOption('showScrollbar');
                }
                set showScrollbar(value) {
                    this._setOption('showScrollbar', value);
                }
                /**
                 * Indicates whether to use native or simulated scrolling.
                
                 */
                get useNative() {
                    return this._getOption('useNative');
                }
                set useNative(value) {
                    this._setOption('useNative', value);
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
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when the &apos;pull to refresh&apos; gesture is performed. Supported on mobile devices only.
                
                
                 */
                onPullDown;
                /**
                
                 * A function that is executed when the content is scrolled down to the bottom.
                
                
                 */
                onReachBottom;
                /**
                
                 * A function that is executed on each scroll gesture.
                
                
                 */
                onScroll;
                /**
                
                 * A function that is executed each time the UI component is updated.
                
                
                 */
                onUpdated;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                bounceEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                directionChange;
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
                heightChange;
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
                reachBottomTextChange;
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
                scrollByContentChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollByThumbChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showScrollbarChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                useNativeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                constructor(elementRef, ngZone, templateHost, _watcherHelper, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._createEventEmitters([
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'pullDown', emit: 'onPullDown' },
                        { subscribe: 'reachBottom', emit: 'onReachBottom' },
                        { subscribe: 'scroll', emit: 'onScroll' },
                        { subscribe: 'updated', emit: 'onUpdated' },
                        { emit: 'bounceEnabledChange' },
                        { emit: 'directionChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'heightChange' },
                        { emit: 'pulledDownTextChange' },
                        { emit: 'pullingDownTextChange' },
                        { emit: 'reachBottomTextChange' },
                        { emit: 'refreshingTextChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scrollByContentChange' },
                        { emit: 'scrollByThumbChange' },
                        { emit: 'showScrollbarChange' },
                        { emit: 'useNativeChange' },
                        { emit: 'widthChange' }
                    ]);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxScrollView(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxScrollViewComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxScrollViewComponent, selector: "dx-scroll-view", inputs: { bounceEnabled: "bounceEnabled", direction: "direction", disabled: "disabled", elementAttr: "elementAttr", height: "height", pulledDownText: "pulledDownText", pullingDownText: "pullingDownText", reachBottomText: "reachBottomText", refreshingText: "refreshingText", rtlEnabled: "rtlEnabled", scrollByContent: "scrollByContent", scrollByThumb: "scrollByThumb", showScrollbar: "showScrollbar", useNative: "useNative", width: "width" }, outputs: { onDisposing: "onDisposing", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onPullDown: "onPullDown", onReachBottom: "onReachBottom", onScroll: "onScroll", onUpdated: "onUpdated", bounceEnabledChange: "bounceEnabledChange", directionChange: "directionChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", heightChange: "heightChange", pulledDownTextChange: "pulledDownTextChange", pullingDownTextChange: "pullingDownTextChange", reachBottomTextChange: "reachBottomTextChange", refreshingTextChange: "refreshingTextChange", rtlEnabledChange: "rtlEnabledChange", scrollByContentChange: "scrollByContentChange", scrollByThumbChange: "scrollByThumbChange", showScrollbarChange: "showScrollbarChange", useNativeChange: "useNativeChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost
                    ], usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
            } exports("DxScrollViewComponent", DxScrollViewComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxScrollViewComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-scroll-view',
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
                            }] }], propDecorators: { bounceEnabled: [{
                            type: Input
                        }], direction: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], pulledDownText: [{
                            type: Input
                        }], pullingDownText: [{
                            type: Input
                        }], reachBottomText: [{
                            type: Input
                        }], refreshingText: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scrollByContent: [{
                            type: Input
                        }], scrollByThumb: [{
                            type: Input
                        }], showScrollbar: [{
                            type: Input
                        }], useNative: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onPullDown: [{
                            type: Output
                        }], onReachBottom: [{
                            type: Output
                        }], onScroll: [{
                            type: Output
                        }], onUpdated: [{
                            type: Output
                        }], bounceEnabledChange: [{
                            type: Output
                        }], directionChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], pulledDownTextChange: [{
                            type: Output
                        }], pullingDownTextChange: [{
                            type: Output
                        }], reachBottomTextChange: [{
                            type: Output
                        }], refreshingTextChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scrollByContentChange: [{
                            type: Output
                        }], scrollByThumbChange: [{
                            type: Output
                        }], showScrollbarChange: [{
                            type: Output
                        }], useNativeChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }] } });
            class DxScrollViewModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxScrollViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxScrollViewModule, declarations: [DxScrollViewComponent], imports: [DxIntegrationModule,
                        DxTemplateModule], exports: [DxScrollViewComponent, DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxScrollViewModule, imports: [DxIntegrationModule,
                        DxTemplateModule, DxTemplateModule] });
            } exports("DxScrollViewModule", DxScrollViewModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxScrollViewModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxScrollViewComponent
                                ],
                                exports: [
                                    DxScrollViewComponent,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
