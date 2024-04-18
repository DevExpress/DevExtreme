System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/map', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxMap, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiCenterComponent, DxiMarkerComponent, DxiRouteComponent, DxoApiKeyModule, DxiCenterModule, DxiMarkerModule, DxiLocationModule, DxoTooltipModule, DxiRouteModule;
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
            DxMap = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiCenterComponent = module.DxiCenterComponent;
            DxiMarkerComponent = module.DxiMarkerComponent;
            DxiRouteComponent = module.DxiRouteComponent;
            DxoApiKeyModule = module.DxoApiKeyModule;
            DxiCenterModule = module.DxiCenterModule;
            DxiMarkerModule = module.DxiMarkerModule;
            DxiLocationModule = module.DxiLocationModule;
            DxoTooltipModule = module.DxoTooltipModule;
            DxiRouteModule = module.DxiRouteModule;
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
             * The Map is an interactive UI component that displays a geographic map with markers and routes.

             */
            class DxMapComponent extends DxComponent {
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
                 * Keys to authenticate the component within map providers.
                
                 */
                get apiKey() {
                    return this._getOption('apiKey');
                }
                set apiKey(value) {
                    this._setOption('apiKey', value);
                }
                /**
                 * Specifies whether the UI component automatically adjusts center and zoom property values when adding a new marker or route, or if a new UI component contains markers or routes by default.
                
                 */
                get autoAdjust() {
                    return this._getOption('autoAdjust');
                }
                set autoAdjust(value) {
                    this._setOption('autoAdjust', value);
                }
                /**
                 * An object, a string, or an array specifying which part of the map is displayed at the UI component&apos;s center using coordinates. The UI component can change this value if autoAdjust is enabled.
                
                 */
                get center() {
                    return this._getOption('center');
                }
                set center(value) {
                    this._setOption('center', value);
                }
                /**
                 * Specifies whether or not map UI component controls are available.
                
                 */
                get controls() {
                    return this._getOption('controls');
                }
                set controls(value) {
                    this._setOption('controls', value);
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
                 * A URL pointing to the custom icon to be used for map markers.
                
                 */
                get markerIconSrc() {
                    return this._getOption('markerIconSrc');
                }
                set markerIconSrc(value) {
                    this._setOption('markerIconSrc', value);
                }
                /**
                 * An array of markers displayed on a map.
                
                 */
                get markers() {
                    return this._getOption('markers');
                }
                set markers(value) {
                    this._setOption('markers', value);
                }
                /**
                 * The name of the current map data provider.
                
                 */
                get provider() {
                    return this._getOption('provider');
                }
                set provider(value) {
                    this._setOption('provider', value);
                }
                /**
                 * An array of routes shown on the map.
                
                 */
                get routes() {
                    return this._getOption('routes');
                }
                set routes(value) {
                    this._setOption('routes', value);
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
                 * Specifies the number of the element when the Tab key is used for navigating.
                
                 */
                get tabIndex() {
                    return this._getOption('tabIndex');
                }
                set tabIndex(value) {
                    this._setOption('tabIndex', value);
                }
                /**
                 * The type of a map to display.
                
                 */
                get type() {
                    return this._getOption('type');
                }
                set type(value) {
                    this._setOption('type', value);
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
                 * The map&apos;s zoom level. The UI component can change this value if autoAdjust is enabled.
                
                 */
                get zoom() {
                    return this._getOption('zoom');
                }
                set zoom(value) {
                    this._setOption('zoom', value);
                }
                /**
                
                 * A function that is executed when any location on the map is clicked or tapped.
                
                
                 */
                onClick;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed when a marker is created on the map.
                
                
                 */
                onMarkerAdded;
                /**
                
                 * A function that is executed when a marker is removed from the map.
                
                
                 */
                onMarkerRemoved;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when the map is ready.
                
                
                 */
                onReady;
                /**
                
                 * A function that is executed when a route is created on the map.
                
                
                 */
                onRouteAdded;
                /**
                
                 * A function that is executed when a route is removed from the map.
                
                
                 */
                onRouteRemoved;
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
                apiKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                autoAdjustChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                centerChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                controlsChange;
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
                markerIconSrcChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                markersChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                providerChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                routesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                typeChange;
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
                zoomChange;
                get centerChildren() {
                    return this._getOption('center');
                }
                set centerChildren(value) {
                    this.setChildren('center', value);
                }
                get markersChildren() {
                    return this._getOption('markers');
                }
                set markersChildren(value) {
                    this.setChildren('markers', value);
                }
                get routesChildren() {
                    return this._getOption('routes');
                }
                set routesChildren(value) {
                    this.setChildren('routes', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'click', emit: 'onClick' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'markerAdded', emit: 'onMarkerAdded' },
                        { subscribe: 'markerRemoved', emit: 'onMarkerRemoved' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'ready', emit: 'onReady' },
                        { subscribe: 'routeAdded', emit: 'onRouteAdded' },
                        { subscribe: 'routeRemoved', emit: 'onRouteRemoved' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'apiKeyChange' },
                        { emit: 'autoAdjustChange' },
                        { emit: 'centerChange' },
                        { emit: 'controlsChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'markerIconSrcChange' },
                        { emit: 'markersChange' },
                        { emit: 'providerChange' },
                        { emit: 'routesChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'typeChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'zoomChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxMap(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('center', changes);
                    this.setupChanges('markers', changes);
                    this.setupChanges('routes', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('center');
                    this._idh.doCheck('markers');
                    this._idh.doCheck('routes');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxMapComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxMapComponent, selector: "dx-map", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", apiKey: "apiKey", autoAdjust: "autoAdjust", center: "center", controls: "controls", disabled: "disabled", elementAttr: "elementAttr", focusStateEnabled: "focusStateEnabled", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", markerIconSrc: "markerIconSrc", markers: "markers", provider: "provider", routes: "routes", rtlEnabled: "rtlEnabled", tabIndex: "tabIndex", type: "type", visible: "visible", width: "width", zoom: "zoom" }, outputs: { onClick: "onClick", onDisposing: "onDisposing", onInitialized: "onInitialized", onMarkerAdded: "onMarkerAdded", onMarkerRemoved: "onMarkerRemoved", onOptionChanged: "onOptionChanged", onReady: "onReady", onRouteAdded: "onRouteAdded", onRouteRemoved: "onRouteRemoved", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", apiKeyChange: "apiKeyChange", autoAdjustChange: "autoAdjustChange", centerChange: "centerChange", controlsChange: "controlsChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", focusStateEnabledChange: "focusStateEnabledChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", markerIconSrcChange: "markerIconSrcChange", markersChange: "markersChange", providerChange: "providerChange", routesChange: "routesChange", rtlEnabledChange: "rtlEnabledChange", tabIndexChange: "tabIndexChange", typeChange: "typeChange", visibleChange: "visibleChange", widthChange: "widthChange", zoomChange: "zoomChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "centerChildren", predicate: DxiCenterComponent }, { propertyName: "markersChildren", predicate: DxiMarkerComponent }, { propertyName: "routesChildren", predicate: DxiRouteComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxMapComponent", DxMapComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxMapComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-map',
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
                        }], activeStateEnabled: [{
                            type: Input
                        }], apiKey: [{
                            type: Input
                        }], autoAdjust: [{
                            type: Input
                        }], center: [{
                            type: Input
                        }], controls: [{
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
                        }], markerIconSrc: [{
                            type: Input
                        }], markers: [{
                            type: Input
                        }], provider: [{
                            type: Input
                        }], routes: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], type: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], zoom: [{
                            type: Input
                        }], onClick: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onMarkerAdded: [{
                            type: Output
                        }], onMarkerRemoved: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onReady: [{
                            type: Output
                        }], onRouteAdded: [{
                            type: Output
                        }], onRouteRemoved: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], apiKeyChange: [{
                            type: Output
                        }], autoAdjustChange: [{
                            type: Output
                        }], centerChange: [{
                            type: Output
                        }], controlsChange: [{
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
                        }], markerIconSrcChange: [{
                            type: Output
                        }], markersChange: [{
                            type: Output
                        }], providerChange: [{
                            type: Output
                        }], routesChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], typeChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], zoomChange: [{
                            type: Output
                        }], centerChildren: [{
                            type: ContentChildren,
                            args: [DxiCenterComponent]
                        }], markersChildren: [{
                            type: ContentChildren,
                            args: [DxiMarkerComponent]
                        }], routesChildren: [{
                            type: ContentChildren,
                            args: [DxiRouteComponent]
                        }] } });
            class DxMapModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxMapModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxMapModule, declarations: [DxMapComponent], imports: [DxoApiKeyModule,
                        DxiCenterModule,
                        DxiMarkerModule,
                        DxiLocationModule,
                        DxoTooltipModule,
                        DxiRouteModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxMapComponent, DxoApiKeyModule,
                        DxiCenterModule,
                        DxiMarkerModule,
                        DxiLocationModule,
                        DxoTooltipModule,
                        DxiRouteModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxMapModule, imports: [DxoApiKeyModule,
                        DxiCenterModule,
                        DxiMarkerModule,
                        DxiLocationModule,
                        DxoTooltipModule,
                        DxiRouteModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoApiKeyModule,
                        DxiCenterModule,
                        DxiMarkerModule,
                        DxiLocationModule,
                        DxoTooltipModule,
                        DxiRouteModule,
                        DxTemplateModule] });
            } exports("DxMapModule", DxMapModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxMapModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoApiKeyModule,
                                    DxiCenterModule,
                                    DxiMarkerModule,
                                    DxiLocationModule,
                                    DxoTooltipModule,
                                    DxiRouteModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxMapComponent
                                ],
                                exports: [
                                    DxMapComponent,
                                    DxoApiKeyModule,
                                    DxiCenterModule,
                                    DxiMarkerModule,
                                    DxiLocationModule,
                                    DxoTooltipModule,
                                    DxiRouteModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
