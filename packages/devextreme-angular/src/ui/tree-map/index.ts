/* tslint:disable:max-line-length */


import { TransferState } from '@angular/platform-browser';

import {
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    EventEmitter,
    OnChanges,
    DoCheck,
    SimpleChanges
} from '@angular/core';


import { UserDefinedElement } from 'devextreme/core/element';
import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { Format } from 'devextreme/localization';
import { Font } from 'devextreme/viz/core/base_widget';
import { ClickEvent, DisposingEvent, DrawnEvent, DrillEvent, ExportedEvent, ExportingEvent, FileSavingEvent, HoverChangedEvent, IncidentOccurredEvent, InitializedEvent, NodesInitializedEvent, NodesRenderingEvent, OptionChangedEvent, SelectionChangedEvent } from 'devextreme/viz/tree_map';

import DxTreeMap from 'devextreme/viz/tree_map';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoColorizerModule } from 'devextreme-angular/ui/nested';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { DxoGroupModule } from 'devextreme-angular/ui/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/nested';
import { DxoHoverStyleModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxoFontModule } from 'devextreme-angular/ui/nested';
import { DxoSelectionStyleModule } from 'devextreme-angular/ui/nested';
import { DxoLoadingIndicatorModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoTileModule } from 'devextreme-angular/ui/nested';
import { DxoTitleModule } from 'devextreme-angular/ui/nested';
import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoSubtitleModule } from 'devextreme-angular/ui/nested';
import { DxoTooltipModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoShadowModule } from 'devextreme-angular/ui/nested';




/**
 * [descr:dxTreeMap]

 */
@Component({
    selector: 'dx-tree-map',
    template: '',
    styles: [ ' :host {  display: block; }'],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxTreeMapComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxTreeMap;

    /**
     * [descr:dxTreeMapOptions.childrenField]
    
     */
    @Input()
    get childrenField(): string {
        return this._getOption('childrenField');
    }
    set childrenField(value: string) {
        this._setOption('childrenField', value);
    }


    /**
     * [descr:dxTreeMapOptions.colorField]
    
     */
    @Input()
    get colorField(): string {
        return this._getOption('colorField');
    }
    set colorField(value: string) {
        this._setOption('colorField', value);
    }


    /**
     * [descr:dxTreeMapOptions.colorizer]
    
     */
    @Input()
    get colorizer(): { colorCodeField?: string | undefined, colorizeGroups?: boolean, palette?: string | Array<string>, paletteExtensionMode?: string, range?: Array<number>, type?: string | undefined } {
        return this._getOption('colorizer');
    }
    set colorizer(value: { colorCodeField?: string | undefined, colorizeGroups?: boolean, palette?: string | Array<string>, paletteExtensionMode?: string, range?: Array<number>, type?: string | undefined }) {
        this._setOption('colorizer', value);
    }


    /**
     * [descr:dxTreeMapOptions.dataSource]
    
     */
    @Input()
    get dataSource(): DataSource | DataSourceOptions | Store | null | string | Array<any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: DataSource | DataSourceOptions | Store | null | string | Array<any>) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:BaseWidgetOptions.disabled]
    
     */
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:BaseWidgetOptions.export]
    
     */
    @Input()
    get export(): { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<string>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined } {
        return this._getOption('export');
    }
    set export(value: { backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<string>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined }) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxTreeMapOptions.group]
    
     */
    @Input()
    get group(): { border?: { color?: string, width?: number }, color?: string, headerHeight?: number | undefined, hoverEnabled?: boolean | undefined, hoverStyle?: { border?: { color?: string | undefined, width?: number | undefined }, color?: string | undefined }, label?: { font?: Font, textOverflow?: string, visible?: boolean }, padding?: number, selectionStyle?: { border?: { color?: string, width?: number | undefined }, color?: string | undefined } } {
        return this._getOption('group');
    }
    set group(value: { border?: { color?: string, width?: number }, color?: string, headerHeight?: number | undefined, hoverEnabled?: boolean | undefined, hoverStyle?: { border?: { color?: string | undefined, width?: number | undefined }, color?: string | undefined }, label?: { font?: Font, textOverflow?: string, visible?: boolean }, padding?: number, selectionStyle?: { border?: { color?: string, width?: number | undefined }, color?: string | undefined } }) {
        this._setOption('group', value);
    }


    /**
     * [descr:dxTreeMapOptions.hoverEnabled]
    
     */
    @Input()
    get hoverEnabled(): boolean | undefined {
        return this._getOption('hoverEnabled');
    }
    set hoverEnabled(value: boolean | undefined) {
        this._setOption('hoverEnabled', value);
    }


    /**
     * [descr:dxTreeMapOptions.idField]
    
     */
    @Input()
    get idField(): string | undefined {
        return this._getOption('idField');
    }
    set idField(value: string | undefined) {
        this._setOption('idField', value);
    }


    /**
     * [descr:dxTreeMapOptions.interactWithGroup]
    
     */
    @Input()
    get interactWithGroup(): boolean {
        return this._getOption('interactWithGroup');
    }
    set interactWithGroup(value: boolean) {
        this._setOption('interactWithGroup', value);
    }


    /**
     * [descr:dxTreeMapOptions.labelField]
    
     */
    @Input()
    get labelField(): string {
        return this._getOption('labelField');
    }
    set labelField(value: string) {
        this._setOption('labelField', value);
    }


    /**
     * [descr:dxTreeMapOptions.layoutAlgorithm]
    
     */
    @Input()
    get layoutAlgorithm(): Function | string {
        return this._getOption('layoutAlgorithm');
    }
    set layoutAlgorithm(value: Function | string) {
        this._setOption('layoutAlgorithm', value);
    }


    /**
     * [descr:dxTreeMapOptions.layoutDirection]
    
     */
    @Input()
    get layoutDirection(): string {
        return this._getOption('layoutDirection');
    }
    set layoutDirection(value: string) {
        this._setOption('layoutDirection', value);
    }


    /**
     * [descr:BaseWidgetOptions.loadingIndicator]
    
     */
    @Input()
    get loadingIndicator(): { backgroundColor?: string, enabled?: boolean, font?: Font, show?: boolean, text?: string } {
        return this._getOption('loadingIndicator');
    }
    set loadingIndicator(value: { backgroundColor?: string, enabled?: boolean, font?: Font, show?: boolean, text?: string }) {
        this._setOption('loadingIndicator', value);
    }


    /**
     * [descr:dxTreeMapOptions.maxDepth]
    
     */
    @Input()
    get maxDepth(): number | undefined {
        return this._getOption('maxDepth');
    }
    set maxDepth(value: number | undefined) {
        this._setOption('maxDepth', value);
    }


    /**
     * [descr:dxTreeMapOptions.parentField]
    
     */
    @Input()
    get parentField(): string | undefined {
        return this._getOption('parentField');
    }
    set parentField(value: string | undefined) {
        this._setOption('parentField', value);
    }


    /**
     * [descr:BaseWidgetOptions.pathModified]
    
     */
    @Input()
    get pathModified(): boolean {
        return this._getOption('pathModified');
    }
    set pathModified(value: boolean) {
        this._setOption('pathModified', value);
    }


    /**
     * [descr:BaseWidgetOptions.redrawOnResize]
    
     */
    @Input()
    get redrawOnResize(): boolean {
        return this._getOption('redrawOnResize');
    }
    set redrawOnResize(value: boolean) {
        this._setOption('redrawOnResize', value);
    }


    /**
     * [descr:BaseWidgetOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:dxTreeMapOptions.selectionMode]
    
     */
    @Input()
    get selectionMode(): string | undefined {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: string | undefined) {
        this._setOption('selectionMode', value);
    }


    /**
     * [descr:BaseWidgetOptions.size]
    
     */
    @Input()
    get size(): { height?: number | undefined, width?: number | undefined } {
        return this._getOption('size');
    }
    set size(value: { height?: number | undefined, width?: number | undefined }) {
        this._setOption('size', value);
    }


    /**
     * [descr:BaseWidgetOptions.theme]
    
     */
    @Input()
    get theme(): string {
        return this._getOption('theme');
    }
    set theme(value: string) {
        this._setOption('theme', value);
    }


    /**
     * [descr:dxTreeMapOptions.tile]
    
     */
    @Input()
    get tile(): { border?: { color?: string, width?: number }, color?: string, hoverStyle?: { border?: { color?: string | undefined, width?: number | undefined }, color?: string | undefined }, label?: { font?: Font, textOverflow?: string, visible?: boolean, wordWrap?: string }, selectionStyle?: { border?: { color?: string, width?: number | undefined }, color?: string | undefined } } {
        return this._getOption('tile');
    }
    set tile(value: { border?: { color?: string, width?: number }, color?: string, hoverStyle?: { border?: { color?: string | undefined, width?: number | undefined }, color?: string | undefined }, label?: { font?: Font, textOverflow?: string, visible?: boolean, wordWrap?: string }, selectionStyle?: { border?: { color?: string, width?: number | undefined }, color?: string | undefined } }) {
        this._setOption('tile', value);
    }


    /**
     * [descr:BaseWidgetOptions.title]
    
     */
    @Input()
    get title(): string | { font?: Font, horizontalAlignment?: string, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: string, wordWrap?: string }, text?: string, textOverflow?: string, verticalAlignment?: string, wordWrap?: string } {
        return this._getOption('title');
    }
    set title(value: string | { font?: Font, horizontalAlignment?: string, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: string, wordWrap?: string }, text?: string, textOverflow?: string, verticalAlignment?: string, wordWrap?: string }) {
        this._setOption('title', value);
    }


    /**
     * [descr:dxTreeMapOptions.tooltip]
    
     */
    @Input()
    get tooltip(): { arrowLength?: number, border?: { color?: string, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: string | UserDefinedElement | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined } {
        return this._getOption('tooltip');
    }
    set tooltip(value: { arrowLength?: number, border?: { color?: string, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: string | UserDefinedElement | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined }) {
        this._setOption('tooltip', value);
    }


    /**
     * [descr:dxTreeMapOptions.valueField]
    
     */
    @Input()
    get valueField(): string {
        return this._getOption('valueField');
    }
    set valueField(value: string) {
        this._setOption('valueField', value);
    }

    /**
    
     * [descr:dxTreeMapOptions.onClick]
    
    
     */
    @Output() onClick: EventEmitter<ClickEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onDrill]
    
    
     */
    @Output() onDrill: EventEmitter<DrillEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onHoverChanged]
    
    
     */
    @Output() onHoverChanged: EventEmitter<HoverChangedEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onNodesInitialized]
    
    
     */
    @Output() onNodesInitialized: EventEmitter<NodesInitializedEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onNodesRendering]
    
    
     */
    @Output() onNodesRendering: EventEmitter<NodesRenderingEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxTreeMapOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() childrenFieldChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() colorFieldChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() colorizerChange: EventEmitter<{ colorCodeField?: string | undefined, colorizeGroups?: boolean, palette?: string | Array<string>, paletteExtensionMode?: string, range?: Array<number>, type?: string | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<DataSource | DataSourceOptions | Store | null | string | Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() exportChange: EventEmitter<{ backgroundColor?: string, enabled?: boolean, fileName?: string, formats?: Array<string>, margin?: number, printingEnabled?: boolean, svgToCanvas?: Function | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupChange: EventEmitter<{ border?: { color?: string, width?: number }, color?: string, headerHeight?: number | undefined, hoverEnabled?: boolean | undefined, hoverStyle?: { border?: { color?: string | undefined, width?: number | undefined }, color?: string | undefined }, label?: { font?: Font, textOverflow?: string, visible?: boolean }, padding?: number, selectionStyle?: { border?: { color?: string, width?: number | undefined }, color?: string | undefined } }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverEnabledChange: EventEmitter<boolean | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() idFieldChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() interactWithGroupChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() labelFieldChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() layoutAlgorithmChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() layoutDirectionChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadingIndicatorChange: EventEmitter<{ backgroundColor?: string, enabled?: boolean, font?: Font, show?: boolean, text?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() maxDepthChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() parentFieldChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pathModifiedChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() redrawOnResizeChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionModeChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sizeChange: EventEmitter<{ height?: number | undefined, width?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() themeChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tileChange: EventEmitter<{ border?: { color?: string, width?: number }, color?: string, hoverStyle?: { border?: { color?: string | undefined, width?: number | undefined }, color?: string | undefined }, label?: { font?: Font, textOverflow?: string, visible?: boolean, wordWrap?: string }, selectionStyle?: { border?: { color?: string, width?: number | undefined }, color?: string | undefined } }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() titleChange: EventEmitter<string | { font?: Font, horizontalAlignment?: string, margin?: number | { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number | undefined, subtitle?: string | { font?: Font, offset?: number, text?: string, textOverflow?: string, wordWrap?: string }, text?: string, textOverflow?: string, verticalAlignment?: string, wordWrap?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tooltipChange: EventEmitter<{ arrowLength?: number, border?: { color?: string, dashStyle?: string, opacity?: number | undefined, visible?: boolean, width?: number }, color?: string, container?: string | UserDefinedElement | undefined, contentTemplate?: any | undefined, cornerRadius?: number, customizeTooltip?: Function | undefined, enabled?: boolean, font?: Font, format?: Format | string | undefined, opacity?: number | undefined, paddingLeftRight?: number, paddingTopBottom?: number, shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, zIndex?: number | undefined }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueFieldChange: EventEmitter<string>;







    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'click', emit: 'onClick' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'drawn', emit: 'onDrawn' },
            { subscribe: 'drill', emit: 'onDrill' },
            { subscribe: 'exported', emit: 'onExported' },
            { subscribe: 'exporting', emit: 'onExporting' },
            { subscribe: 'fileSaving', emit: 'onFileSaving' },
            { subscribe: 'hoverChanged', emit: 'onHoverChanged' },
            { subscribe: 'incidentOccurred', emit: 'onIncidentOccurred' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'nodesInitialized', emit: 'onNodesInitialized' },
            { subscribe: 'nodesRendering', emit: 'onNodesRendering' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { emit: 'childrenFieldChange' },
            { emit: 'colorFieldChange' },
            { emit: 'colorizerChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'exportChange' },
            { emit: 'groupChange' },
            { emit: 'hoverEnabledChange' },
            { emit: 'idFieldChange' },
            { emit: 'interactWithGroupChange' },
            { emit: 'labelFieldChange' },
            { emit: 'layoutAlgorithmChange' },
            { emit: 'layoutDirectionChange' },
            { emit: 'loadingIndicatorChange' },
            { emit: 'maxDepthChange' },
            { emit: 'parentFieldChange' },
            { emit: 'pathModifiedChange' },
            { emit: 'redrawOnResizeChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'selectionModeChange' },
            { emit: 'sizeChange' },
            { emit: 'themeChange' },
            { emit: 'tileChange' },
            { emit: 'titleChange' },
            { emit: 'tooltipChange' },
            { emit: 'valueFieldChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxTreeMap(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
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

    _setOption(name: string, value: any) {
        let isSetup = this._idh.setupSingle(name, value);
        let isChanged = this._idh.getChanges(name, value) !== null;

        if (isSetup || isChanged) {
            super._setOption(name, value);
        }
    }
}

@NgModule({
  imports: [
    DxoColorizerModule,
    DxoExportModule,
    DxoGroupModule,
    DxoBorderModule,
    DxoHoverStyleModule,
    DxoLabelModule,
    DxoFontModule,
    DxoSelectionStyleModule,
    DxoLoadingIndicatorModule,
    DxoSizeModule,
    DxoTileModule,
    DxoTitleModule,
    DxoMarginModule,
    DxoSubtitleModule,
    DxoTooltipModule,
    DxoFormatModule,
    DxoShadowModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxTreeMapComponent
  ],
  exports: [
    DxTreeMapComponent,
    DxoColorizerModule,
    DxoExportModule,
    DxoGroupModule,
    DxoBorderModule,
    DxoHoverStyleModule,
    DxoLabelModule,
    DxoFontModule,
    DxoSelectionStyleModule,
    DxoLoadingIndicatorModule,
    DxoSizeModule,
    DxoTileModule,
    DxoTitleModule,
    DxoMarginModule,
    DxoSubtitleModule,
    DxoTooltipModule,
    DxoFormatModule,
    DxoShadowModule,
    DxTemplateModule
  ]
})
export class DxTreeMapModule { }

import type * as DxTreeMapTypes from "devextreme/viz/tree_map_types";
export { DxTreeMapTypes };


