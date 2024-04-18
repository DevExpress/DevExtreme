System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/pivot_grid/data_source', 'devextreme/ui/pivot_grid_field_chooser', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxPivotGridFieldChooser, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoHeaderFilterModule, DxoSearchModule, DxoTextsModule;
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
        }, null, function (module) {
            DxPivotGridFieldChooser = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxoHeaderFilterModule = module.DxoHeaderFilterModule;
            DxoSearchModule = module.DxoSearchModule;
            DxoTextsModule = module.DxoTextsModule;
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
             * A complementary UI component for the PivotGrid that allows you to manage data displayed in the PivotGrid. The field chooser is already integrated in the PivotGrid and can be invoked using the context menu. If you need to continuously display the field chooser near the PivotGrid UI component, use the PivotGridFieldChooser UI component.

             */
            class DxPivotGridFieldChooserComponent extends DxComponent {
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
                 * Specifies whether the field chooser allows search operations in the &apos;All Fields&apos; section.
                
                 */
                get allowSearch() {
                    return this._getOption('allowSearch');
                }
                set allowSearch(value) {
                    this._setOption('allowSearch', value);
                }
                /**
                 * Specifies when to apply changes made in the UI component to the PivotGrid.
                
                 */
                get applyChangesMode() {
                    return this._getOption('applyChangesMode');
                }
                set applyChangesMode(value) {
                    this._setOption('applyChangesMode', value);
                }
                /**
                 * The data source of a PivotGrid UI component.
                
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
                 * Specifies whether HTML tags are displayed as plain text or applied to the values of the header filter.
                
                 */
                get encodeHtml() {
                    return this._getOption('encodeHtml');
                }
                set encodeHtml(value) {
                    this._setOption('encodeHtml', value);
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
                 * Configures the header filter feature.
                
                 */
                get headerFilter() {
                    return this._getOption('headerFilter');
                }
                set headerFilter(value) {
                    this._setOption('headerFilter', value);
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
                 * Specifies the field chooser layout.
                
                 */
                get layout() {
                    return this._getOption('layout');
                }
                set layout(value) {
                    this._setOption('layout', value);
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
                 * Specifies a delay in milliseconds between when a user finishes typing in the field chooser&apos;s search panel, and when the search is executed.
                
                 */
                get searchTimeout() {
                    return this._getOption('searchTimeout');
                }
                set searchTimeout(value) {
                    this._setOption('searchTimeout', value);
                }
                /**
                 * The UI component&apos;s state.
                
                 */
                get state() {
                    return this._getOption('state');
                }
                set state(value) {
                    this._setOption('state', value);
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
                 * Strings that can be changed or localized in the PivotGridFieldChooser UI component.
                
                 */
                get texts() {
                    return this._getOption('texts');
                }
                set texts(value) {
                    this._setOption('texts', value);
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
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
                /**
                
                 * A function that is executed before the context menu is rendered.
                
                
                 */
                onContextMenuPreparing;
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
                accessKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                activeStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowSearchChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                applyChangesModeChange;
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
                encodeHtmlChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                headerFilterChange;
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
                layoutChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchTimeoutChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                stateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                textsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'contextMenuPreparing', emit: 'onContextMenuPreparing' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'allowSearchChange' },
                        { emit: 'applyChangesModeChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'encodeHtmlChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'headerFilterChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'layoutChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'searchTimeoutChange' },
                        { emit: 'stateChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'textsChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxPivotGridFieldChooser(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridFieldChooserComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxPivotGridFieldChooserComponent, selector: "dx-pivot-grid-field-chooser", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", allowSearch: "allowSearch", applyChangesMode: "applyChangesMode", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", encodeHtml: "encodeHtml", focusStateEnabled: "focusStateEnabled", headerFilter: "headerFilter", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", layout: "layout", rtlEnabled: "rtlEnabled", searchTimeout: "searchTimeout", state: "state", tabIndex: "tabIndex", texts: "texts", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onContextMenuPreparing: "onContextMenuPreparing", onDisposing: "onDisposing", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", allowSearchChange: "allowSearchChange", applyChangesModeChange: "applyChangesModeChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", encodeHtmlChange: "encodeHtmlChange", focusStateEnabledChange: "focusStateEnabledChange", headerFilterChange: "headerFilterChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", layoutChange: "layoutChange", rtlEnabledChange: "rtlEnabledChange", searchTimeoutChange: "searchTimeoutChange", stateChange: "stateChange", tabIndexChange: "tabIndexChange", textsChange: "textsChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxPivotGridFieldChooserComponent", DxPivotGridFieldChooserComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridFieldChooserComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-pivot-grid-field-chooser',
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
                        }], allowSearch: [{
                            type: Input
                        }], applyChangesMode: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], encodeHtml: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], headerFilter: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], layout: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], searchTimeout: [{
                            type: Input
                        }], state: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], texts: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onContextMenuPreparing: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], allowSearchChange: [{
                            type: Output
                        }], applyChangesModeChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], encodeHtmlChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], headerFilterChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], layoutChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], searchTimeoutChange: [{
                            type: Output
                        }], stateChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], textsChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }] } });
            class DxPivotGridFieldChooserModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridFieldChooserModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridFieldChooserModule, declarations: [DxPivotGridFieldChooserComponent], imports: [DxoHeaderFilterModule,
                        DxoSearchModule,
                        DxoTextsModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxPivotGridFieldChooserComponent, DxoHeaderFilterModule,
                        DxoSearchModule,
                        DxoTextsModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridFieldChooserModule, imports: [DxoHeaderFilterModule,
                        DxoSearchModule,
                        DxoTextsModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoHeaderFilterModule,
                        DxoSearchModule,
                        DxoTextsModule,
                        DxTemplateModule] });
            } exports("DxPivotGridFieldChooserModule", DxPivotGridFieldChooserModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridFieldChooserModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoHeaderFilterModule,
                                    DxoSearchModule,
                                    DxoTextsModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxPivotGridFieldChooserComponent
                                ],
                                exports: [
                                    DxPivotGridFieldChooserComponent,
                                    DxoHeaderFilterModule,
                                    DxoSearchModule,
                                    DxoTextsModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
