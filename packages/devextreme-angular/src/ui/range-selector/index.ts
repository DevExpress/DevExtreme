/* tslint:disable:max-line-length */


import {
    TransferState,
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
    forwardRef,
    HostListener,
    OnChanges,
    DoCheck,
    SimpleChanges
} from '@angular/core';


import DataSource from 'devextreme/data/data_source';
import * as CommonChartTypes from 'devextreme/common/charts';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, OptionChangedEvent, ValueChangedEvent } from 'devextreme/viz/range_selector';

import DxRangeSelector from 'devextreme/viz/range_selector';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoBackgroundModule } from 'devextreme-angular/ui/nested';
import { DxoImageModule } from 'devextreme-angular/ui/nested';
import { DxoBehaviorModule } from 'devextreme-angular/ui/nested';
import { DxoChartModule } from 'devextreme-angular/ui/nested';
import { DxoCommonSeriesSettingsModule } from 'devextreme-angular/ui/nested';
import { DxoAggregationModule } from 'devextreme-angular/ui/nested';
import { DxoAreaModule } from 'devextreme-angular/ui/nested';
import { DxoBorderModule } from 'devextreme-angular/ui/nested';
import { DxoHoverStyleModule } from 'devextreme-angular/ui/nested';
import { DxoHatchingModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxoConnectorModule } from 'devextreme-angular/ui/nested';
import { DxoPointModule } from 'devextreme-angular/ui/nested';
import { DxoHeightModule } from 'devextreme-angular/ui/nested';
import { DxoUrlModule } from 'devextreme-angular/ui/nested';
import { DxoWidthModule } from 'devextreme-angular/ui/nested';
import { DxoSelectionStyleModule } from 'devextreme-angular/ui/nested';
import { DxoReductionModule } from 'devextreme-angular/ui/nested';
import { DxoValueErrorBarModule } from 'devextreme-angular/ui/nested';
import { DxoBarModule } from 'devextreme-angular/ui/nested';
import { DxoBubbleModule } from 'devextreme-angular/ui/nested';
import { DxoCandlestickModule } from 'devextreme-angular/ui/nested';
import { DxoColorModule } from 'devextreme-angular/ui/nested';
import { DxoFullstackedareaModule } from 'devextreme-angular/ui/nested';
import { DxoFullstackedbarModule } from 'devextreme-angular/ui/nested';
import { DxoFullstackedlineModule } from 'devextreme-angular/ui/nested';
import { DxoFullstackedsplineModule } from 'devextreme-angular/ui/nested';
import { DxoFullstackedsplineareaModule } from 'devextreme-angular/ui/nested';
import { DxoArgumentFormatModule } from 'devextreme-angular/ui/nested';
import { DxoFontModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoLineModule } from 'devextreme-angular/ui/nested';
import { DxoRangeareaModule } from 'devextreme-angular/ui/nested';
import { DxoRangebarModule } from 'devextreme-angular/ui/nested';
import { DxoScatterModule } from 'devextreme-angular/ui/nested';
import { DxoSplineModule } from 'devextreme-angular/ui/nested';
import { DxoSplineareaModule } from 'devextreme-angular/ui/nested';
import { DxoStackedareaModule } from 'devextreme-angular/ui/nested';
import { DxoStackedbarModule } from 'devextreme-angular/ui/nested';
import { DxoStackedlineModule } from 'devextreme-angular/ui/nested';
import { DxoStackedsplineModule } from 'devextreme-angular/ui/nested';
import { DxoStackedsplineareaModule } from 'devextreme-angular/ui/nested';
import { DxoStepareaModule } from 'devextreme-angular/ui/nested';
import { DxoSteplineModule } from 'devextreme-angular/ui/nested';
import { DxoStockModule } from 'devextreme-angular/ui/nested';
import { DxoDataPrepareSettingsModule } from 'devextreme-angular/ui/nested';
import { DxiSeriesModule } from 'devextreme-angular/ui/nested';
import { DxoSeriesTemplateModule } from 'devextreme-angular/ui/nested';
import { DxoValueAxisModule } from 'devextreme-angular/ui/nested';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { DxoIndentModule } from 'devextreme-angular/ui/nested';
import { DxoLoadingIndicatorModule } from 'devextreme-angular/ui/nested';
import { DxoMarginModule } from 'devextreme-angular/ui/nested';
import { DxoScaleModule } from 'devextreme-angular/ui/nested';
import { DxoAggregationIntervalModule } from 'devextreme-angular/ui/nested';
import { DxiBreakModule } from 'devextreme-angular/ui/nested';
import { DxoBreakStyleModule } from 'devextreme-angular/ui/nested';
import { DxoMarkerModule } from 'devextreme-angular/ui/nested';
import { DxoMaxRangeModule } from 'devextreme-angular/ui/nested';
import { DxoMinorTickModule } from 'devextreme-angular/ui/nested';
import { DxoMinorTickIntervalModule } from 'devextreme-angular/ui/nested';
import { DxoMinRangeModule } from 'devextreme-angular/ui/nested';
import { DxoTickModule } from 'devextreme-angular/ui/nested';
import { DxoTickIntervalModule } from 'devextreme-angular/ui/nested';
import { DxoShutterModule } from 'devextreme-angular/ui/nested';
import { DxoSizeModule } from 'devextreme-angular/ui/nested';
import { DxoSliderHandleModule } from 'devextreme-angular/ui/nested';
import { DxoSliderMarkerModule } from 'devextreme-angular/ui/nested';
import { DxoTitleModule } from 'devextreme-angular/ui/nested';
import { DxoSubtitleModule } from 'devextreme-angular/ui/nested';

import { DxoRangeSelectorAggregationModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorAggregationIntervalModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorArgumentFormatModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorBackgroundModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorBackgroundImageModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorBehaviorModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorBorderModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxiRangeSelectorBreakModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorBreakStyleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorChartModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorColorModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorCommonSeriesSettingsModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorCommonSeriesSettingsHoverStyleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorCommonSeriesSettingsLabelModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorCommonSeriesSettingsSelectionStyleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorConnectorModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorDataPrepareSettingsModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorExportModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorFontModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorFormatModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorHatchingModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorHeightModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorHoverStyleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorImageModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorIndentModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorLabelModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorLengthModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorLoadingIndicatorModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorMarginModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorMarkerModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorMarkerLabelModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorMaxRangeModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorMinorTickModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorMinorTickIntervalModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorMinRangeModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorPointModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorPointBorderModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorPointHoverStyleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorPointImageModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorPointSelectionStyleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorReductionModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorScaleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorScaleLabelModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorSelectionStyleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxiRangeSelectorSeriesModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorSeriesBorderModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorSeriesTemplateModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorShutterModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorSizeModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorSliderHandleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorSliderMarkerModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorSubtitleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorTickModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorTickIntervalModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorTitleModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorUrlModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorValueModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorValueAxisModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorValueErrorBarModule } from 'devextreme-angular/ui/range-selector/nested';
import { DxoRangeSelectorWidthModule } from 'devextreme-angular/ui/range-selector/nested';





const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DxRangeSelectorComponent),
    multi: true
};
/**
 * [descr:dxRangeSelector]

 */
@Component({
    selector: 'dx-range-selector',
    template: '',
    styles: [ ' :host {  display: block; }'],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        CUSTOM_VALUE_ACCESSOR_PROVIDER,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxRangeSelectorComponent extends DxComponent implements OnDestroy, ControlValueAccessor, OnChanges, DoCheck {
    instance: DxRangeSelector = null;

    /**
     * [descr:dxRangeSelectorOptions.background]
    
     */
    @Input()
    get background(): Record<string, any> {
        return this._getOption('background');
    }
    set background(value: Record<string, any>) {
        this._setOption('background', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.behavior]
    
     */
    @Input()
    get behavior(): Record<string, any> {
        return this._getOption('behavior');
    }
    set behavior(value: Record<string, any>) {
        this._setOption('behavior', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.chart]
    
     */
    @Input()
    get chart(): Record<string, any> {
        return this._getOption('chart');
    }
    set chart(value: Record<string, any>) {
        this._setOption('chart', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.containerBackgroundColor]
    
     */
    @Input()
    get containerBackgroundColor(): string {
        return this._getOption('containerBackgroundColor');
    }
    set containerBackgroundColor(value: string) {
        this._setOption('containerBackgroundColor', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<any> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.dataSourceField]
    
     */
    @Input()
    get dataSourceField(): string {
        return this._getOption('dataSourceField');
    }
    set dataSourceField(value: string) {
        this._setOption('dataSourceField', value);
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
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:BaseWidgetOptions.export]
    
     */
    @Input()
    get export(): Record<string, any> {
        return this._getOption('export');
    }
    set export(value: Record<string, any>) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.indent]
    
     */
    @Input()
    get indent(): Record<string, any> {
        return this._getOption('indent');
    }
    set indent(value: Record<string, any>) {
        this._setOption('indent', value);
    }


    /**
     * [descr:BaseWidgetOptions.loadingIndicator]
    
     */
    @Input()
    get loadingIndicator(): Record<string, any> {
        return this._getOption('loadingIndicator');
    }
    set loadingIndicator(value: Record<string, any>) {
        this._setOption('loadingIndicator', value);
    }


    /**
     * [descr:BaseWidgetOptions.margin]
    
     */
    @Input()
    get margin(): Record<string, any> {
        return this._getOption('margin');
    }
    set margin(value: Record<string, any>) {
        this._setOption('margin', value);
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
     * [descr:dxRangeSelectorOptions.scale]
    
     */
    @Input()
    get scale(): Record<string, any> {
        return this._getOption('scale');
    }
    set scale(value: Record<string, any>) {
        this._setOption('scale', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.selectedRangeColor]
    
     */
    @Input()
    get selectedRangeColor(): string {
        return this._getOption('selectedRangeColor');
    }
    set selectedRangeColor(value: string) {
        this._setOption('selectedRangeColor', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.selectedRangeUpdateMode]
    
     */
    @Input()
    get selectedRangeUpdateMode(): "auto" | "keep" | "reset" | "shift" {
        return this._getOption('selectedRangeUpdateMode');
    }
    set selectedRangeUpdateMode(value: "auto" | "keep" | "reset" | "shift") {
        this._setOption('selectedRangeUpdateMode', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.shutter]
    
     */
    @Input()
    get shutter(): Record<string, any> {
        return this._getOption('shutter');
    }
    set shutter(value: Record<string, any>) {
        this._setOption('shutter', value);
    }


    /**
     * [descr:BaseWidgetOptions.size]
    
     */
    @Input()
    get size(): Record<string, any> {
        return this._getOption('size');
    }
    set size(value: Record<string, any>) {
        this._setOption('size', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.sliderHandle]
    
     */
    @Input()
    get sliderHandle(): Record<string, any> {
        return this._getOption('sliderHandle');
    }
    set sliderHandle(value: Record<string, any>) {
        this._setOption('sliderHandle', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.sliderMarker]
    
     */
    @Input()
    get sliderMarker(): Record<string, any> {
        return this._getOption('sliderMarker');
    }
    set sliderMarker(value: Record<string, any>) {
        this._setOption('sliderMarker', value);
    }


    /**
     * [descr:BaseWidgetOptions.theme]
    
     */
    @Input()
    get theme(): "generic.dark" | "generic.light" | "generic.contrast" | "generic.carmine" | "generic.darkmoon" | "generic.darkviolet" | "generic.greenmist" | "generic.softblue" | "material.blue.light" | "material.lime.light" | "material.orange.light" | "material.purple.light" | "material.teal.light" {
        return this._getOption('theme');
    }
    set theme(value: "generic.dark" | "generic.light" | "generic.contrast" | "generic.carmine" | "generic.darkmoon" | "generic.darkviolet" | "generic.greenmist" | "generic.softblue" | "material.blue.light" | "material.lime.light" | "material.orange.light" | "material.purple.light" | "material.teal.light") {
        this._setOption('theme', value);
    }


    /**
     * [descr:BaseWidgetOptions.title]
    
     */
    @Input()
    get title(): Record<string, any> | string {
        return this._getOption('title');
    }
    set title(value: Record<string, any> | string) {
        this._setOption('title', value);
    }


    /**
     * [descr:dxRangeSelectorOptions.value]
    
     */
    @Input()
    get value(): Array<Date | number | string> | CommonChartTypes.VisualRange {
        return this._getOption('value');
    }
    set value(value: Array<Date | number | string> | CommonChartTypes.VisualRange) {
        this._setOption('value', value);
    }

    /**
    
     * [descr:dxRangeSelectorOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxRangeSelectorOptions.onDrawn]
    
    
     */
    @Output() onDrawn: EventEmitter<DrawnEvent>;

    /**
    
     * [descr:dxRangeSelectorOptions.onExported]
    
    
     */
    @Output() onExported: EventEmitter<ExportedEvent>;

    /**
    
     * [descr:dxRangeSelectorOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxRangeSelectorOptions.onFileSaving]
    
    
     */
    @Output() onFileSaving: EventEmitter<FileSavingEvent>;

    /**
    
     * [descr:dxRangeSelectorOptions.onIncidentOccurred]
    
    
     */
    @Output() onIncidentOccurred: EventEmitter<IncidentOccurredEvent>;

    /**
    
     * [descr:dxRangeSelectorOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxRangeSelectorOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxRangeSelectorOptions.onValueChanged]
    
    
     */
    @Output() onValueChanged: EventEmitter<ValueChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() backgroundChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() behaviorChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() chartChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() containerBackgroundColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<any> | DataSource | DataSourceOptions | null | Store | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceFieldChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() exportChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() indentChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadingIndicatorChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() marginChange: EventEmitter<Record<string, any>>;

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
    @Output() scaleChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedRangeColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedRangeUpdateModeChange: EventEmitter<"auto" | "keep" | "reset" | "shift">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() shutterChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sizeChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sliderHandleChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sliderMarkerChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() themeChange: EventEmitter<"generic.dark" | "generic.light" | "generic.contrast" | "generic.carmine" | "generic.darkmoon" | "generic.darkviolet" | "generic.greenmist" | "generic.softblue" | "material.blue.light" | "material.lime.light" | "material.orange.light" | "material.purple.light" | "material.teal.light">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() titleChange: EventEmitter<Record<string, any> | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<Array<Date | number | string> | CommonChartTypes.VisualRange>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onBlur: EventEmitter<any>;


    @HostListener('valueChange', ['$event']) change(_) { }
    @HostListener('onBlur', ['$event']) touched = (_) => {};






    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

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
            { subscribe: 'valueChanged', emit: 'onValueChanged' },
            { emit: 'backgroundChange' },
            { emit: 'behaviorChange' },
            { emit: 'chartChange' },
            { emit: 'containerBackgroundColorChange' },
            { emit: 'dataSourceChange' },
            { emit: 'dataSourceFieldChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'exportChange' },
            { emit: 'indentChange' },
            { emit: 'loadingIndicatorChange' },
            { emit: 'marginChange' },
            { emit: 'pathModifiedChange' },
            { emit: 'redrawOnResizeChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'scaleChange' },
            { emit: 'selectedRangeColorChange' },
            { emit: 'selectedRangeUpdateModeChange' },
            { emit: 'shutterChange' },
            { emit: 'sizeChange' },
            { emit: 'sliderHandleChange' },
            { emit: 'sliderMarkerChange' },
            { emit: 'themeChange' },
            { emit: 'titleChange' },
            { emit: 'valueChange' },
            { emit: 'onBlur' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxRangeSelector(element, options);
    }


    writeValue(value: any): void {
        this.eventHelper.lockedValueChangeEvent = true;
        this.value = value;
        this.eventHelper.lockedValueChangeEvent = false;
    }

    registerOnChange(fn: (_: any) => void): void { this.change = fn; }
    registerOnTouched(fn: () => void): void { this.touched = fn; }

    _createWidget(element: any) {
        super._createWidget(element);
        this.instance.on('focusOut', (e) => {
            this.eventHelper.fireNgEvent('onBlur', [e]);
        });
    }

    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('value', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('dataSource');
        this._idh.doCheck('value');
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
    DxoBackgroundModule,
    DxoImageModule,
    DxoBehaviorModule,
    DxoChartModule,
    DxoCommonSeriesSettingsModule,
    DxoAggregationModule,
    DxoAreaModule,
    DxoBorderModule,
    DxoHoverStyleModule,
    DxoHatchingModule,
    DxoLabelModule,
    DxoConnectorModule,
    DxoPointModule,
    DxoHeightModule,
    DxoUrlModule,
    DxoWidthModule,
    DxoSelectionStyleModule,
    DxoReductionModule,
    DxoValueErrorBarModule,
    DxoBarModule,
    DxoBubbleModule,
    DxoCandlestickModule,
    DxoColorModule,
    DxoFullstackedareaModule,
    DxoFullstackedbarModule,
    DxoFullstackedlineModule,
    DxoFullstackedsplineModule,
    DxoFullstackedsplineareaModule,
    DxoArgumentFormatModule,
    DxoFontModule,
    DxoFormatModule,
    DxoLineModule,
    DxoRangeareaModule,
    DxoRangebarModule,
    DxoScatterModule,
    DxoSplineModule,
    DxoSplineareaModule,
    DxoStackedareaModule,
    DxoStackedbarModule,
    DxoStackedlineModule,
    DxoStackedsplineModule,
    DxoStackedsplineareaModule,
    DxoStepareaModule,
    DxoSteplineModule,
    DxoStockModule,
    DxoDataPrepareSettingsModule,
    DxiSeriesModule,
    DxoSeriesTemplateModule,
    DxoValueAxisModule,
    DxoExportModule,
    DxoIndentModule,
    DxoLoadingIndicatorModule,
    DxoMarginModule,
    DxoScaleModule,
    DxoAggregationIntervalModule,
    DxiBreakModule,
    DxoBreakStyleModule,
    DxoMarkerModule,
    DxoMaxRangeModule,
    DxoMinorTickModule,
    DxoMinorTickIntervalModule,
    DxoMinRangeModule,
    DxoTickModule,
    DxoTickIntervalModule,
    DxoShutterModule,
    DxoSizeModule,
    DxoSliderHandleModule,
    DxoSliderMarkerModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoRangeSelectorAggregationModule,
    DxoRangeSelectorAggregationIntervalModule,
    DxoRangeSelectorArgumentFormatModule,
    DxoRangeSelectorBackgroundModule,
    DxoRangeSelectorBackgroundImageModule,
    DxoRangeSelectorBehaviorModule,
    DxoRangeSelectorBorderModule,
    DxiRangeSelectorBreakModule,
    DxoRangeSelectorBreakStyleModule,
    DxoRangeSelectorChartModule,
    DxoRangeSelectorColorModule,
    DxoRangeSelectorCommonSeriesSettingsModule,
    DxoRangeSelectorCommonSeriesSettingsHoverStyleModule,
    DxoRangeSelectorCommonSeriesSettingsLabelModule,
    DxoRangeSelectorCommonSeriesSettingsSelectionStyleModule,
    DxoRangeSelectorConnectorModule,
    DxoRangeSelectorDataPrepareSettingsModule,
    DxoRangeSelectorExportModule,
    DxoRangeSelectorFontModule,
    DxoRangeSelectorFormatModule,
    DxoRangeSelectorHatchingModule,
    DxoRangeSelectorHeightModule,
    DxoRangeSelectorHoverStyleModule,
    DxoRangeSelectorImageModule,
    DxoRangeSelectorIndentModule,
    DxoRangeSelectorLabelModule,
    DxoRangeSelectorLengthModule,
    DxoRangeSelectorLoadingIndicatorModule,
    DxoRangeSelectorMarginModule,
    DxoRangeSelectorMarkerModule,
    DxoRangeSelectorMarkerLabelModule,
    DxoRangeSelectorMaxRangeModule,
    DxoRangeSelectorMinorTickModule,
    DxoRangeSelectorMinorTickIntervalModule,
    DxoRangeSelectorMinRangeModule,
    DxoRangeSelectorPointModule,
    DxoRangeSelectorPointBorderModule,
    DxoRangeSelectorPointHoverStyleModule,
    DxoRangeSelectorPointImageModule,
    DxoRangeSelectorPointSelectionStyleModule,
    DxoRangeSelectorReductionModule,
    DxoRangeSelectorScaleModule,
    DxoRangeSelectorScaleLabelModule,
    DxoRangeSelectorSelectionStyleModule,
    DxiRangeSelectorSeriesModule,
    DxoRangeSelectorSeriesBorderModule,
    DxoRangeSelectorSeriesTemplateModule,
    DxoRangeSelectorShutterModule,
    DxoRangeSelectorSizeModule,
    DxoRangeSelectorSliderHandleModule,
    DxoRangeSelectorSliderMarkerModule,
    DxoRangeSelectorSubtitleModule,
    DxoRangeSelectorTickModule,
    DxoRangeSelectorTickIntervalModule,
    DxoRangeSelectorTitleModule,
    DxoRangeSelectorUrlModule,
    DxoRangeSelectorValueModule,
    DxoRangeSelectorValueAxisModule,
    DxoRangeSelectorValueErrorBarModule,
    DxoRangeSelectorWidthModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxRangeSelectorComponent
  ],
  exports: [
    DxRangeSelectorComponent,
    DxoBackgroundModule,
    DxoImageModule,
    DxoBehaviorModule,
    DxoChartModule,
    DxoCommonSeriesSettingsModule,
    DxoAggregationModule,
    DxoAreaModule,
    DxoBorderModule,
    DxoHoverStyleModule,
    DxoHatchingModule,
    DxoLabelModule,
    DxoConnectorModule,
    DxoPointModule,
    DxoHeightModule,
    DxoUrlModule,
    DxoWidthModule,
    DxoSelectionStyleModule,
    DxoReductionModule,
    DxoValueErrorBarModule,
    DxoBarModule,
    DxoBubbleModule,
    DxoCandlestickModule,
    DxoColorModule,
    DxoFullstackedareaModule,
    DxoFullstackedbarModule,
    DxoFullstackedlineModule,
    DxoFullstackedsplineModule,
    DxoFullstackedsplineareaModule,
    DxoArgumentFormatModule,
    DxoFontModule,
    DxoFormatModule,
    DxoLineModule,
    DxoRangeareaModule,
    DxoRangebarModule,
    DxoScatterModule,
    DxoSplineModule,
    DxoSplineareaModule,
    DxoStackedareaModule,
    DxoStackedbarModule,
    DxoStackedlineModule,
    DxoStackedsplineModule,
    DxoStackedsplineareaModule,
    DxoStepareaModule,
    DxoSteplineModule,
    DxoStockModule,
    DxoDataPrepareSettingsModule,
    DxiSeriesModule,
    DxoSeriesTemplateModule,
    DxoValueAxisModule,
    DxoExportModule,
    DxoIndentModule,
    DxoLoadingIndicatorModule,
    DxoMarginModule,
    DxoScaleModule,
    DxoAggregationIntervalModule,
    DxiBreakModule,
    DxoBreakStyleModule,
    DxoMarkerModule,
    DxoMaxRangeModule,
    DxoMinorTickModule,
    DxoMinorTickIntervalModule,
    DxoMinRangeModule,
    DxoTickModule,
    DxoTickIntervalModule,
    DxoShutterModule,
    DxoSizeModule,
    DxoSliderHandleModule,
    DxoSliderMarkerModule,
    DxoTitleModule,
    DxoSubtitleModule,
    DxoRangeSelectorAggregationModule,
    DxoRangeSelectorAggregationIntervalModule,
    DxoRangeSelectorArgumentFormatModule,
    DxoRangeSelectorBackgroundModule,
    DxoRangeSelectorBackgroundImageModule,
    DxoRangeSelectorBehaviorModule,
    DxoRangeSelectorBorderModule,
    DxiRangeSelectorBreakModule,
    DxoRangeSelectorBreakStyleModule,
    DxoRangeSelectorChartModule,
    DxoRangeSelectorColorModule,
    DxoRangeSelectorCommonSeriesSettingsModule,
    DxoRangeSelectorCommonSeriesSettingsHoverStyleModule,
    DxoRangeSelectorCommonSeriesSettingsLabelModule,
    DxoRangeSelectorCommonSeriesSettingsSelectionStyleModule,
    DxoRangeSelectorConnectorModule,
    DxoRangeSelectorDataPrepareSettingsModule,
    DxoRangeSelectorExportModule,
    DxoRangeSelectorFontModule,
    DxoRangeSelectorFormatModule,
    DxoRangeSelectorHatchingModule,
    DxoRangeSelectorHeightModule,
    DxoRangeSelectorHoverStyleModule,
    DxoRangeSelectorImageModule,
    DxoRangeSelectorIndentModule,
    DxoRangeSelectorLabelModule,
    DxoRangeSelectorLengthModule,
    DxoRangeSelectorLoadingIndicatorModule,
    DxoRangeSelectorMarginModule,
    DxoRangeSelectorMarkerModule,
    DxoRangeSelectorMarkerLabelModule,
    DxoRangeSelectorMaxRangeModule,
    DxoRangeSelectorMinorTickModule,
    DxoRangeSelectorMinorTickIntervalModule,
    DxoRangeSelectorMinRangeModule,
    DxoRangeSelectorPointModule,
    DxoRangeSelectorPointBorderModule,
    DxoRangeSelectorPointHoverStyleModule,
    DxoRangeSelectorPointImageModule,
    DxoRangeSelectorPointSelectionStyleModule,
    DxoRangeSelectorReductionModule,
    DxoRangeSelectorScaleModule,
    DxoRangeSelectorScaleLabelModule,
    DxoRangeSelectorSelectionStyleModule,
    DxiRangeSelectorSeriesModule,
    DxoRangeSelectorSeriesBorderModule,
    DxoRangeSelectorSeriesTemplateModule,
    DxoRangeSelectorShutterModule,
    DxoRangeSelectorSizeModule,
    DxoRangeSelectorSliderHandleModule,
    DxoRangeSelectorSliderMarkerModule,
    DxoRangeSelectorSubtitleModule,
    DxoRangeSelectorTickModule,
    DxoRangeSelectorTickIntervalModule,
    DxoRangeSelectorTitleModule,
    DxoRangeSelectorUrlModule,
    DxoRangeSelectorValueModule,
    DxoRangeSelectorValueAxisModule,
    DxoRangeSelectorValueErrorBarModule,
    DxoRangeSelectorWidthModule,
    DxTemplateModule
  ]
})
export class DxRangeSelectorModule { }

import type * as DxRangeSelectorTypes from "devextreme/viz/range_selector_types";
export { DxRangeSelectorTypes };


