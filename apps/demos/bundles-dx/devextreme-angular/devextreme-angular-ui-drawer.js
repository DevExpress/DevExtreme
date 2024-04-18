System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/drawer', './devextreme-angular-core.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxDrawer, DxComponent, DxTemplateHost, WatcherHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule;
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
            DxDrawer = module.default;
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
             * The Drawer is a dismissible or permanently visible panel used for navigation in responsive web application layouts.

             */
            class DxDrawerComponent extends DxComponent {
                instance = null;
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
                 * Specifies the duration of the drawer&apos;s opening and closing animation (in milliseconds). Applies only if animationEnabled is true.
                
                 */
                get animationDuration() {
                    return this._getOption('animationDuration');
                }
                set animationDuration(value) {
                    this._setOption('animationDuration', value);
                }
                /**
                 * Specifies whether to use an opening and closing animation.
                
                 */
                get animationEnabled() {
                    return this._getOption('animationEnabled');
                }
                set animationEnabled(value) {
                    this._setOption('animationEnabled', value);
                }
                /**
                 * Specifies whether to close the drawer if a user clicks or taps the view area.
                
                 */
                get closeOnOutsideClick() {
                    return this._getOption('closeOnOutsideClick');
                }
                set closeOnOutsideClick(value) {
                    this._setOption('closeOnOutsideClick', value);
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
                 * Specifies the drawer&apos;s width or height (depending on the drawer&apos;s position) in the opened state.
                
                 */
                get maxSize() {
                    return this._getOption('maxSize');
                }
                set maxSize(value) {
                    this._setOption('maxSize', value);
                }
                /**
                 * Specifies the drawer&apos;s width or height (depending on the drawer&apos;s position) in the closed state.
                
                 */
                get minSize() {
                    return this._getOption('minSize');
                }
                set minSize(value) {
                    this._setOption('minSize', value);
                }
                /**
                 * Specifies whether the drawer is opened.
                
                 */
                get opened() {
                    return this._getOption('opened');
                }
                set opened(value) {
                    this._setOption('opened', value);
                }
                /**
                 * Specifies how the drawer interacts with the view in the opened state.
                
                 */
                get openedStateMode() {
                    return this._getOption('openedStateMode');
                }
                set openedStateMode(value) {
                    this._setOption('openedStateMode', value);
                }
                /**
                 * Specifies the drawer&apos;s position in relation to the view.
                
                 */
                get position() {
                    return this._getOption('position');
                }
                set position(value) {
                    this._setOption('position', value);
                }
                /**
                 * Specifies the drawer&apos;s reveal mode.
                
                 */
                get revealMode() {
                    return this._getOption('revealMode');
                }
                set revealMode(value) {
                    this._setOption('revealMode', value);
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
                 * Specifies whether to shade the view when the drawer is opened.
                
                 */
                get shading() {
                    return this._getOption('shading');
                }
                set shading(value) {
                    this._setOption('shading', value);
                }
                /**
                 * Specifies the drawer&apos;s content.
                
                 */
                get template() {
                    return this._getOption('template');
                }
                set template(value) {
                    this._setOption('template', value);
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
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                activeStateEnabledChange;
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
                closeOnOutsideClickChange;
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
                hintChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hoverStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxSizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minSizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                openedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                openedStateModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                positionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                revealModeChange;
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
                templateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
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
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'animationDurationChange' },
                        { emit: 'animationEnabledChange' },
                        { emit: 'closeOnOutsideClickChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'maxSizeChange' },
                        { emit: 'minSizeChange' },
                        { emit: 'openedChange' },
                        { emit: 'openedStateModeChange' },
                        { emit: 'positionChange' },
                        { emit: 'revealModeChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'shadingChange' },
                        { emit: 'templateChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxDrawer(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDrawerComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxDrawerComponent, selector: "dx-drawer", inputs: { activeStateEnabled: "activeStateEnabled", animationDuration: "animationDuration", animationEnabled: "animationEnabled", closeOnOutsideClick: "closeOnOutsideClick", disabled: "disabled", elementAttr: "elementAttr", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", maxSize: "maxSize", minSize: "minSize", opened: "opened", openedStateMode: "openedStateMode", position: "position", revealMode: "revealMode", rtlEnabled: "rtlEnabled", shading: "shading", template: "template", visible: "visible", width: "width" }, outputs: { onDisposing: "onDisposing", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", activeStateEnabledChange: "activeStateEnabledChange", animationDurationChange: "animationDurationChange", animationEnabledChange: "animationEnabledChange", closeOnOutsideClickChange: "closeOnOutsideClickChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", maxSizeChange: "maxSizeChange", minSizeChange: "minSizeChange", openedChange: "openedChange", openedStateModeChange: "openedStateModeChange", positionChange: "positionChange", revealModeChange: "revealModeChange", rtlEnabledChange: "rtlEnabledChange", shadingChange: "shadingChange", templateChange: "templateChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost
                    ], usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
            } exports("DxDrawerComponent", DxDrawerComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDrawerComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-drawer',
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
                            }] }], propDecorators: { activeStateEnabled: [{
                            type: Input
                        }], animationDuration: [{
                            type: Input
                        }], animationEnabled: [{
                            type: Input
                        }], closeOnOutsideClick: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], maxSize: [{
                            type: Input
                        }], minSize: [{
                            type: Input
                        }], opened: [{
                            type: Input
                        }], openedStateMode: [{
                            type: Input
                        }], position: [{
                            type: Input
                        }], revealMode: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], shading: [{
                            type: Input
                        }], template: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], animationDurationChange: [{
                            type: Output
                        }], animationEnabledChange: [{
                            type: Output
                        }], closeOnOutsideClickChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], maxSizeChange: [{
                            type: Output
                        }], minSizeChange: [{
                            type: Output
                        }], openedChange: [{
                            type: Output
                        }], openedStateModeChange: [{
                            type: Output
                        }], positionChange: [{
                            type: Output
                        }], revealModeChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], shadingChange: [{
                            type: Output
                        }], templateChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }] } });
            class DxDrawerModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDrawerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxDrawerModule, declarations: [DxDrawerComponent], imports: [DxIntegrationModule,
                        DxTemplateModule], exports: [DxDrawerComponent, DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDrawerModule, imports: [DxIntegrationModule,
                        DxTemplateModule, DxTemplateModule] });
            } exports("DxDrawerModule", DxDrawerModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDrawerModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxDrawerComponent
                                ],
                                exports: [
                                    DxDrawerComponent,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
