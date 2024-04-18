System.register(['@angular/platform-browser', '@angular/core', 'devextreme/viz/bullet', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxBullet, DxComponent, DxTemplateHost, WatcherHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoMarginModule, DxoSizeModule, DxoTooltipModule, DxoBorderModule, DxoFontModule, DxoFormatModule, DxoShadowModule;
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
            DxBullet = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxoMarginModule = module.DxoMarginModule;
            DxoSizeModule = module.DxoSizeModule;
            DxoTooltipModule = module.DxoTooltipModule;
            DxoBorderModule = module.DxoBorderModule;
            DxoFontModule = module.DxoFontModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoShadowModule = module.DxoShadowModule;
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
             * The Bullet UI component is useful when you need to compare a single measure to a target value. The UI component comprises a horizontal bar indicating the measure and a vertical line indicating the target value.

             */
            class DxBulletComponent extends DxComponent {
                instance = null;
                /**
                 * Specifies a color for the bullet bar.
                
                 */
                get color() {
                    return this._getOption('color');
                }
                set color(value) {
                    this._setOption('color', value);
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
                 * Specifies an end value for the invisible scale.
                
                 */
                get endScaleValue() {
                    return this._getOption('endScaleValue');
                }
                set endScaleValue(value) {
                    this._setOption('endScaleValue', value);
                }
                /**
                 * Generates space around the UI component.
                
                 */
                get margin() {
                    return this._getOption('margin');
                }
                set margin(value) {
                    this._setOption('margin', value);
                }
                /**
                 * Notifies the UI component that it is embedded into an HTML page that uses a tag modifying the path.
                
                 */
                get pathModified() {
                    return this._getOption('pathModified');
                }
                set pathModified(value) {
                    this._setOption('pathModified', value);
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
                 * Specifies whether or not to show the target line.
                
                 */
                get showTarget() {
                    return this._getOption('showTarget');
                }
                set showTarget(value) {
                    this._setOption('showTarget', value);
                }
                /**
                 * Specifies whether or not to show the line indicating zero on the invisible scale.
                
                 */
                get showZeroLevel() {
                    return this._getOption('showZeroLevel');
                }
                set showZeroLevel(value) {
                    this._setOption('showZeroLevel', value);
                }
                /**
                 * Specifies the UI component&apos;s size in pixels.
                
                 */
                get size() {
                    return this._getOption('size');
                }
                set size(value) {
                    this._setOption('size', value);
                }
                /**
                 * Specifies a start value for the invisible scale.
                
                 */
                get startScaleValue() {
                    return this._getOption('startScaleValue');
                }
                set startScaleValue(value) {
                    this._setOption('startScaleValue', value);
                }
                /**
                 * Specifies the value indicated by the target line.
                
                 */
                get target() {
                    return this._getOption('target');
                }
                set target(value) {
                    this._setOption('target', value);
                }
                /**
                 * Specifies a color for both the target and zero level lines.
                
                 */
                get targetColor() {
                    return this._getOption('targetColor');
                }
                set targetColor(value) {
                    this._setOption('targetColor', value);
                }
                /**
                 * Specifies the width of the target line.
                
                 */
                get targetWidth() {
                    return this._getOption('targetWidth');
                }
                set targetWidth(value) {
                    this._setOption('targetWidth', value);
                }
                /**
                 * Sets the name of the theme the UI component uses.
                
                 */
                get theme() {
                    return this._getOption('theme');
                }
                set theme(value) {
                    this._setOption('theme', value);
                }
                /**
                 * Configures the tooltip.
                
                 */
                get tooltip() {
                    return this._getOption('tooltip');
                }
                set tooltip(value) {
                    this._setOption('tooltip', value);
                }
                /**
                 * Specifies the primary value indicated by the bullet bar.
                
                 */
                get value() {
                    return this._getOption('value');
                }
                set value(value) {
                    this._setOption('value', value);
                }
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is executed when the UI component&apos;s rendering has finished.
                
                
                 */
                onDrawn;
                /**
                
                 * A function that is executed after the UI component is exported.
                
                
                 */
                onExported;
                /**
                
                 * A function that is executed before the UI component is exported.
                
                
                 */
                onExporting;
                /**
                
                 * A function that is executed before a file with exported UI component is saved to the user&apos;s local storage.
                
                
                 */
                onFileSaving;
                /**
                
                 * A function that is executed when an error or warning occurs.
                
                
                 */
                onIncidentOccurred;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a tooltip becomes hidden.
                
                
                 */
                onTooltipHidden;
                /**
                
                 * A function that is executed when a tooltip appears.
                
                
                 */
                onTooltipShown;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                colorChange;
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
                endScaleValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                marginChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pathModifiedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showTargetChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showZeroLevelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sizeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startScaleValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                targetChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                targetColorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                targetWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                themeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tooltipChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueChange;
                constructor(elementRef, ngZone, templateHost, _watcherHelper, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._createEventEmitters([
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'drawn', emit: 'onDrawn' },
                        { subscribe: 'exported', emit: 'onExported' },
                        { subscribe: 'exporting', emit: 'onExporting' },
                        { subscribe: 'fileSaving', emit: 'onFileSaving' },
                        { subscribe: 'incidentOccurred', emit: 'onIncidentOccurred' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'tooltipHidden', emit: 'onTooltipHidden' },
                        { subscribe: 'tooltipShown', emit: 'onTooltipShown' },
                        { emit: 'colorChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'endScaleValueChange' },
                        { emit: 'marginChange' },
                        { emit: 'pathModifiedChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'showTargetChange' },
                        { emit: 'showZeroLevelChange' },
                        { emit: 'sizeChange' },
                        { emit: 'startScaleValueChange' },
                        { emit: 'targetChange' },
                        { emit: 'targetColorChange' },
                        { emit: 'targetWidthChange' },
                        { emit: 'themeChange' },
                        { emit: 'tooltipChange' },
                        { emit: 'valueChange' }
                    ]);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxBullet(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxBulletComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxBulletComponent, selector: "dx-bullet", inputs: { color: "color", disabled: "disabled", elementAttr: "elementAttr", endScaleValue: "endScaleValue", margin: "margin", pathModified: "pathModified", rtlEnabled: "rtlEnabled", showTarget: "showTarget", showZeroLevel: "showZeroLevel", size: "size", startScaleValue: "startScaleValue", target: "target", targetColor: "targetColor", targetWidth: "targetWidth", theme: "theme", tooltip: "tooltip", value: "value" }, outputs: { onDisposing: "onDisposing", onDrawn: "onDrawn", onExported: "onExported", onExporting: "onExporting", onFileSaving: "onFileSaving", onIncidentOccurred: "onIncidentOccurred", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onTooltipHidden: "onTooltipHidden", onTooltipShown: "onTooltipShown", colorChange: "colorChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", endScaleValueChange: "endScaleValueChange", marginChange: "marginChange", pathModifiedChange: "pathModifiedChange", rtlEnabledChange: "rtlEnabledChange", showTargetChange: "showTargetChange", showZeroLevelChange: "showZeroLevelChange", sizeChange: "sizeChange", startScaleValueChange: "startScaleValueChange", targetChange: "targetChange", targetColorChange: "targetColorChange", targetWidthChange: "targetWidthChange", themeChange: "themeChange", tooltipChange: "tooltipChange", valueChange: "valueChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost
                    ], usesInheritance: true, ngImport: i0, template: '', isInline: true, styles: [":host{display:block}\n"] });
            } exports("DxBulletComponent", DxBulletComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxBulletComponent, decorators: [{
                        type: Component,
                        args: [{ selector: 'dx-bullet', template: '', providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost
                                ], styles: [":host{display:block}\n"] }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { color: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], endScaleValue: [{
                            type: Input
                        }], margin: [{
                            type: Input
                        }], pathModified: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], showTarget: [{
                            type: Input
                        }], showZeroLevel: [{
                            type: Input
                        }], size: [{
                            type: Input
                        }], startScaleValue: [{
                            type: Input
                        }], target: [{
                            type: Input
                        }], targetColor: [{
                            type: Input
                        }], targetWidth: [{
                            type: Input
                        }], theme: [{
                            type: Input
                        }], tooltip: [{
                            type: Input
                        }], value: [{
                            type: Input
                        }], onDisposing: [{
                            type: Output
                        }], onDrawn: [{
                            type: Output
                        }], onExported: [{
                            type: Output
                        }], onExporting: [{
                            type: Output
                        }], onFileSaving: [{
                            type: Output
                        }], onIncidentOccurred: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onTooltipHidden: [{
                            type: Output
                        }], onTooltipShown: [{
                            type: Output
                        }], colorChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], endScaleValueChange: [{
                            type: Output
                        }], marginChange: [{
                            type: Output
                        }], pathModifiedChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], showTargetChange: [{
                            type: Output
                        }], showZeroLevelChange: [{
                            type: Output
                        }], sizeChange: [{
                            type: Output
                        }], startScaleValueChange: [{
                            type: Output
                        }], targetChange: [{
                            type: Output
                        }], targetColorChange: [{
                            type: Output
                        }], targetWidthChange: [{
                            type: Output
                        }], themeChange: [{
                            type: Output
                        }], tooltipChange: [{
                            type: Output
                        }], valueChange: [{
                            type: Output
                        }] } });
            class DxBulletModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxBulletModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxBulletModule, declarations: [DxBulletComponent], imports: [DxoMarginModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxBulletComponent, DxoMarginModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxBulletModule, imports: [DxoMarginModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoMarginModule,
                        DxoSizeModule,
                        DxoTooltipModule,
                        DxoBorderModule,
                        DxoFontModule,
                        DxoFormatModule,
                        DxoShadowModule,
                        DxTemplateModule] });
            } exports("DxBulletModule", DxBulletModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxBulletModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoMarginModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoFormatModule,
                                    DxoShadowModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxBulletComponent
                                ],
                                exports: [
                                    DxBulletComponent,
                                    DxoMarginModule,
                                    DxoSizeModule,
                                    DxoTooltipModule,
                                    DxoBorderModule,
                                    DxoFontModule,
                                    DxoFormatModule,
                                    DxoShadowModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
