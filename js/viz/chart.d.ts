import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    event
} from '../events';

import {
    format
} from '../ui/widget/ui.widget';

import {
    BaseChart,
    BaseChartLegend,
    BaseChartOptions,
    BaseChartTooltip
} from './chart_components/base_chart';

import {
    ChartSeries,
    ScaleBreak,
    VizRange
} from './common';

import {
    Font
} from './core/base_widget';

export interface baseLabelObject {
    /**
     * @docid baseLabelObjectMethods.getBoundingRect
     * @publicName getBoundingRect()
     * @return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getBoundingRect(): any;
    /**
     * @docid baseLabelObjectMethods.hide
     * @publicName hide()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hide(): void;
    /**
     * @docid baseLabelObjectMethods.hide
     * @publicName hide(holdInvisible)
     * @param1 holdInvisible:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hide(holdInvisible: boolean): void;
    /**
     * @docid baseLabelObjectMethods.isVisible
     * @publicName isVisible()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isVisible(): boolean;
    /**
     * @docid baseLabelObjectMethods.show
     * @publicName show()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    show(): void;
    /**
     * @docid baseLabelObjectMethods.show
     * @publicName show(holdVisible)
     * @param1 holdVisible:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    show(holdVisible: boolean): void;
}

export interface basePointObject {
    /**
     * @docid basePointObjectMethods.clearHover
     * @publicName clearHover()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearHover(): void;
    /**
     * @docid basePointObjectMethods.clearSelection
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid basePointObjectFields.data
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: any;
    /**
     * @docid basePointObjectFields.fullState
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullState?: number;
    /**
     * @docid basePointObjectMethods.getColor
     * @publicName getColor()
     * @return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getColor(): string;
    /**
     * @docid basePointObjectMethods.getLabel
     * @publicName getLabel()
     * @return baseLabelObject|Array<baseLabelObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getLabel(): baseLabelObject & Array<baseLabelObject>;
    /**
     * @docid basePointObjectMethods.hideTooltip
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid basePointObjectMethods.hover
     * @publicName hover()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hover(): void;
    /**
     * @docid basePointObjectMethods.isHovered
     * @publicName isHovered()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid basePointObjectMethods.isSelected
     * @publicName isSelected()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid basePointObjectFields.originalArgument
     * @type string|number|date
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalArgument?: string | number | Date;
    /**
     * @docid basePointObjectFields.originalValue
     * @type string|number|date
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalValue?: string | number | Date;
    /**
     * @docid basePointObjectMethods.select
     * @publicName select()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    select(): void;
    /**
     * @docid basePointObjectFields.series
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: any;
    /**
     * @docid basePointObjectMethods.showTooltip
     * @publicName showTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showTooltip(): void;
    /**
     * @docid basePointObjectFields.tag
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tag?: any;
}

export interface baseSeriesObject {
    /**
     * @docid baseSeriesObjectMethods.clearHover
     * @publicName clearHover()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearHover(): void;
    /**
     * @docid baseSeriesObjectMethods.clearSelection
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid baseSeriesObjectMethods.deselectPoint
     * @publicName deselectPoint(point)
     * @param1 point:basePointObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    deselectPoint(point: basePointObject): void;
    /**
     * @docid baseSeriesObjectFields.fullState
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullState?: number;
    /**
     * @docid baseSeriesObjectMethods.getAllPoints
     * @publicName getAllPoints()
     * @return Array<basePointObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllPoints(): Array<basePointObject>;
    /**
     * @docid baseSeriesObjectMethods.getColor
     * @publicName getColor()
     * @return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getColor(): string;
    /**
     * @docid baseSeriesObjectMethods.getPointByPos
     * @publicName getPointByPos(positionIndex)
     * @param1 positionIndex:number
     * @return basePointObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getPointByPos(positionIndex: number): basePointObject;
    /**
     * @docid baseSeriesObjectMethods.getPointsByArg
     * @publicName getPointsByArg(pointArg)
     * @param1 pointArg:number|string|date
     * @return Array<basePointObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getPointsByArg(pointArg: number | string | Date): Array<basePointObject>;
    /**
     * @docid baseSeriesObjectMethods.getVisiblePoints
     * @publicName getVisiblePoints()
     * @return Array<basePointObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getVisiblePoints(): Array<basePointObject>;
    /**
     * @docid baseSeriesObjectMethods.hide
     * @publicName hide()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hide(): void;
    /**
     * @docid baseSeriesObjectMethods.hover
     * @publicName hover()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hover(): void;
    /**
     * @docid baseSeriesObjectMethods.isHovered
     * @publicName isHovered()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid baseSeriesObjectMethods.isSelected
     * @publicName isSelected()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid baseSeriesObjectMethods.isVisible
     * @publicName isVisible()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isVisible(): boolean;
    /**
     * @docid baseSeriesObjectFields.name
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: any;
    /**
     * @docid baseSeriesObjectMethods.select
     * @publicName select()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    select(): void;
    /**
     * @docid baseSeriesObjectMethods.selectPoint
     * @publicName selectPoint(point)
     * @param1 point:basePointObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectPoint(point: basePointObject): void;
    /**
     * @docid baseSeriesObjectMethods.show
     * @publicName show()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    show(): void;
    /**
     * @docid baseSeriesObjectFields.tag
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tag?: any;
    /**
     * @docid baseSeriesObjectFields.type
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: string;
}

export interface chartAxisObject {
    /**
     * @docid chartAxisObjectMethods.visualRange
     * @publicName visualRange()
     * @return VizRange
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRange(): VizRange;
    /**
     * @docid chartAxisObjectMethods.visualRange
     * @publicName visualRange(visualRange)
     * @param1 visualRange:Array<number,string,Date> | VizRange
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRange(visualRange: Array<number | string | Date> | VizRange): void;
}

export interface chartPointAggregationInfoObject {
    /**
     * @docid chartPointAggregationInfoObject.aggregationInterval
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationInterval?: any;
    /**
     * @docid chartPointAggregationInfoObject.data
     * @type Array<any>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: Array<any>;
    /**
     * @docid chartPointAggregationInfoObject.intervalEnd
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    intervalEnd?: any;
    /**
     * @docid chartPointAggregationInfoObject.intervalStart
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    intervalStart?: any;
}

export interface chartPointObject extends basePointObject {
    /**
     * @docid chartPointObjectFields.aggregationInfo
     * @type chartPointAggregationInfoObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationInfo?: chartPointAggregationInfoObject;
    /**
     * @docid chartPointObjectmethods.getBoundingRect
     * @publicName getBoundingRect()
     * @return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getBoundingRect(): any;
    /**
     * @docid chartPointObjectFields.originalCloseValue
     * @type number|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalCloseValue?: number | string;
    /**
     * @docid chartPointObjectFields.originalHighValue
     * @type number|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalHighValue?: number | string;
    /**
     * @docid chartPointObjectFields.originalLowValue
     * @type number|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalLowValue?: number | string;
    /**
     * @docid chartPointObjectFields.originalMinValue
     * @type string|number|date
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalMinValue?: string | number | Date;
    /**
     * @docid chartPointObjectFields.originalOpenValue
     * @type number|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalOpenValue?: number | string;
    /**
     * @docid chartPointObjectFields.size
     * @type number|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number | string;
}

export interface chartSeriesObject extends baseSeriesObject {
    /**
     * @docid chartSeriesObjectFields.axis
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axis?: string;
    /**
     * @docid chartSeriesObjectFields.barOverlapGroup
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barOverlapGroup?: string;
    /**
     * @docid chartSeriesObjectMethods.getArgumentAxis
     * @publicName getArgumentAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getArgumentAxis(): chartAxisObject;
    /**
     * @docid chartSeriesObjectMethods.getValueAxis
     * @publicName getValueAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid chartSeriesObjectFields.pane
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pane?: string;
    /**
     * @docid chartSeriesObjectFields.stack
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stack?: string;
}

export interface dxChartOptions extends BaseChartOptions<dxChart> {
    /**
     * @docid dxChartOptions.adjustOnZoom
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adjustOnZoom?: boolean;
    /**
     * @docid dxChartOptions.annotations
     * @type Array<dxChartAnnotationConfig,object>
     * @inherits dxChartOptions.commonAnnotationSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    annotations?: Array<dxChartAnnotationConfig | any>;
    /**
     * @docid dxChartOptions.argumentAxis
     * @type object
     * @inherits dxChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentAxis?: dxChartArgumentAxis;
    /**
     * @docid dxChartOptions.autoHidePointMarkers
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    autoHidePointMarkers?: boolean;
    /**
     * @docid dxChartOptions.barGroupPadding
     * @type number
     * @default 0.3
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupPadding?: number;
    /**
     * @docid dxChartOptions.barGroupWidth
     * @type number
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupWidth?: number;
    /**
     * @docid dxChartOptions.barWidth
     * @type number
     * @deprecated dxChartSeriesTypes.CommonSeries.barPadding
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barWidth?: number;
    /**
     * @docid dxChartOptions.commonAnnotationSettings
     * @type dxChartCommonAnnotationConfig
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAnnotationSettings?: dxChartCommonAnnotationConfig;
    /**
     * @docid dxChartOptions.commonAxisSettings
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAxisSettings?: dxChartCommonAxisSettings;
    /**
     * @docid dxChartOptions.commonPaneSettings
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonPaneSettings?: dxChartCommonPaneSettings;
    /**
     * @docid dxChartOptions.commonSeriesSettings
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonSeriesSettings?: dxChartCommonSeriesSettings;
    /**
     * @docid dxChartOptions.containerBackgroundColor
     * @type string
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid dxChartOptions.crosshair
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    crosshair?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', enabled?: boolean, horizontalLine?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: format, visible?: boolean }, opacity?: number, visible?: boolean, width?: number } | boolean, label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: format, visible?: boolean }, opacity?: number, verticalLine?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: format, visible?: boolean }, opacity?: number, visible?: boolean, width?: number } | boolean, width?: number };
    /**
     * @docid dxChartOptions.customizeAnnotation
     * @type function(annotation)
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_return dxChartAnnotationConfig
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeAnnotation?: ((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig);
    /**
     * @docid dxChartOptions.dataPrepareSettings
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: any, b: any) => number) };
    /**
     * @docid dxChartOptions.defaultPane
     * @type string
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    defaultPane?: string;
    /**
     * @docid dxChartOptions.equalBarWidth
     * @type boolean
     * @deprecated dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    equalBarWidth?: boolean;
    /**
     * @docid dxChartOptions.legend
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxChartLegend;
    /**
     * @docid dxChartOptions.maxBubbleSize
     * @default 0.2
     * @type number
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxBubbleSize?: number;
    /**
     * @docid dxChartOptions.minBubbleSize
     * @default 12
     * @type number
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minBubbleSize?: number;
    /**
     * @docid dxChartOptions.negativesAsZeroes
     * @type boolean
     * @default false
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    negativesAsZeroes?: boolean;
    /**
     * @docid dxChartOptions.onArgumentAxisClick
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 argument:Date|Number|string
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onArgumentAxisClick?: ((e: { component?: dxChart, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, argument?: Date | number | string }) => any) | string;
    /**
     * @docid dxChartOptions.onLegendClick
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLegendClick?: ((e: { component?: dxChart, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: chartSeriesObject }) => any) | string;
    /**
     * @docid dxChartOptions.onSeriesClick
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesClick?: ((e: { component?: dxChart, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: chartSeriesObject }) => any) | string;
    /**
     * @docid dxChartOptions.onSeriesHoverChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesHoverChanged?: ((e: { component?: dxChart, element?: dxElement, model?: any, target?: chartSeriesObject }) => any);
    /**
     * @docid dxChartOptions.onSeriesSelectionChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesSelectionChanged?: ((e: { component?: dxChart, element?: dxElement, model?: any, target?: chartSeriesObject }) => any);
    /**
     * @docid dxChartOptions.onZoomEnd
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 rangeStart:Date|Number:deprecated(range)
     * @type_function_param1_field6 rangeEnd:Date|Number:deprecated(range)
     * @type_function_param1_field7 axis:chartAxisObject
     * @type_function_param1_field8 range:VizRange
     * @type_function_param1_field9 previousRange:VizRange
     * @type_function_param1_field10 cancel:boolean
     * @type_function_param1_field11 actionType:Enums.ChartZoomPanActionType
     * @type_function_param1_field12 zoomFactor:Number
     * @type_function_param1_field13 shift:Number
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onZoomEnd?: ((e: { component?: dxChart, element?: dxElement, model?: any, event?: event, rangeStart?: Date | number, rangeEnd?: Date | number, axis?: chartAxisObject, range?: VizRange, previousRange?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan', zoomFactor?: number, shift?: number }) => any);
    /**
     * @docid dxChartOptions.onZoomStart
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 axis:chartAxisObject
     * @type_function_param1_field6 range:VizRange
     * @type_function_param1_field7 cancel:boolean
     * @type_function_param1_field8 actionType:Enums.ChartZoomPanActionType
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onZoomStart?: ((e: { component?: dxChart, element?: dxElement, model?: any, event?: event, axis?: chartAxisObject, range?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan' }) => any);
    /**
     * @docid dxChartOptions.panes
     * @type Object|Array<Object>
     * @inherits dxChartOptions.commonPaneSettings
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    panes?: dxChartPanes | Array<dxChartPanes>;
    /**
     * @docid dxChartOptions.resizePanesOnZoom
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resizePanesOnZoom?: boolean;
    /**
     * @docid dxChartOptions.resolveLabelOverlapping
     * @type Enums.ChartResolveLabelOverlapping
     * @default "none"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'stack';
    /**
     * @docid dxChartOptions.rotated
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotated?: boolean;
    /**
     * @docid dxChartOptions.scrollBar
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scrollBar?: { color?: string, offset?: number, opacity?: number, position?: 'bottom' | 'left' | 'right' | 'top', visible?: boolean, width?: number };
    /**
     * @docid dxChartOptions.scrollingMode
     * @type Enums.ChartPointerType
     * @default 'none'
     * @deprecated dxChartOptions.zoomAndPan
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scrollingMode?: 'all' | 'mouse' | 'none' | 'touch';
    /**
     * @docid dxChartOptions.series
     * @type ChartSeries|Array<ChartSeries>
     * @default undefined
     * @hideDefaults true
     * @notUsedInTheme
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: ChartSeries | Array<ChartSeries>;
    /**
     * @docid dxChartOptions.seriesSelectionMode
     * @type Enums.ChartElementSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesSelectionMode?: 'multiple' | 'single';
    /**
     * @docid dxChartOptions.seriesTemplate
     * @type object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesTemplate?: { customizeSeries?: ((seriesName: any) => ChartSeries), nameField?: string };
    /**
     * @docid dxChartOptions.stickyHovering
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stickyHovering?: boolean;
    /**
     * @docid dxChartOptions.synchronizeMultiAxes
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    synchronizeMultiAxes?: boolean;
    /**
     * @docid dxChartOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxChartTooltip;
    /**
     * @docid dxChartOptions.useAggregation
     * @type boolean
     * @deprecated dxChartSeriesTypes.CommonSeries.aggregation.enabled
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    useAggregation?: boolean;
    /**
     * @docid dxChartOptions.valueAxis
     * @type Object|Array<Object>
     * @inherits dxChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueAxis?: dxChartValueAxis | Array<dxChartValueAxis>;
    /**
     * @docid dxChartOptions.zoomAndPan
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomAndPan?: { allowMouseWheel?: boolean, allowTouchGestures?: boolean, argumentAxis?: 'both' | 'none' | 'pan' | 'zoom', dragBoxStyle?: { color?: string, opacity?: number }, dragToZoom?: boolean, panKey?: 'alt' | 'ctrl' | 'meta' | 'shift', valueAxis?: 'both' | 'none' | 'pan' | 'zoom' };
    /**
     * @docid dxChartOptions.zoomingMode
     * @type Enums.ChartPointerType
     * @default 'none'
     * @deprecated dxChartOptions.zoomAndPan
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomingMode?: 'all' | 'mouse' | 'none' | 'touch';
}
export interface dxChartArgumentAxis extends dxChartCommonAxisSettings {
    /**
     * @docid dxChartOptions.argumentAxis.aggregateByCategory
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregateByCategory?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.aggregationGroupWidth
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationGroupWidth?: number;
    /**
     * @docid dxChartOptions.argumentAxis.aggregationInterval
     * @inherits VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid dxChartOptions.argumentAxis.argumentType
     * @type Enums.ChartDataType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid dxChartOptions.argumentAxis.axisDivisionFactor
     * @type number
     * @default 70
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxChartOptions.argumentAxis.breaks
     * @type Array<ScaleBreak>
     * @default undefined
     * @inherits ScaleBreak
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    breaks?: Array<ScaleBreak>;
    /**
     * @docid dxChartOptions.argumentAxis.categories
     * @type Array<number,string,Date>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLineStyle?: dxChartArgumentAxisConstantLineStyle;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines
     * @type Array<Object>
     * @inherits dxChartOptions.commonAxisSettings.constantLineStyle
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLines?: Array<dxChartArgumentAxisConstantLines>;
    /**
     * @docid dxChartOptions.argumentAxis.endOnTick
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.holidays
     * @type Array<Date, string>| Array<number>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    holidays?: Array<Date | string> | Array<number>;
    /**
     * @docid dxChartOptions.argumentAxis.hoverMode
     * @type Enums.ArgumentAxisHoverMode
     * @default 'none'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartOptions.argumentAxis.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartArgumentAxisLabel;
    /**
     * @docid dxChartOptions.argumentAxis.linearThreshold
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid dxChartOptions.argumentAxis.logarithmBase
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxChartOptions.argumentAxis.max
     * @type number | datetime | string
     * @deprecated dxChartOptions.argumentAxis.visualRange
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    max?: number | Date | string;
    /**
     * @docid dxChartOptions.argumentAxis.min
     * @type number | datetime | string
     * @deprecated dxChartOptions.argumentAxis.visualRange
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    min?: number | Date | string;
    /**
     * @docid dxChartOptions.argumentAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid dxChartOptions.argumentAxis.minorTickCount
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxChartOptions.argumentAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid dxChartOptions.argumentAxis.position
     * @type Enums.Position
     * @default 'bottom'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid dxChartOptions.argumentAxis.singleWorkdays
     * @type Array<Date, string>| Array<number>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    singleWorkdays?: Array<Date | string> | Array<number>;
    /**
     * @docid dxChartOptions.argumentAxis.strips
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxChartOptions.commonAxisSettings.stripStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    strips?: Array<dxChartArgumentAxisStrips>;
    /**
     * @docid dxChartOptions.argumentAxis.tickInterval
     * @inherits VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid dxChartOptions.argumentAxis.title
     * @type string|object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: dxChartArgumentAxisTitle;
    /**
     * @docid dxChartOptions.argumentAxis.type
     * @type Enums.AxisScaleType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * @docid dxChartOptions.argumentAxis.visualRange
     * @type VizRange | Array<number,string,Date>
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid dxChartOptions.argumentAxis.visualRangeUpdateMode
     * @type Enums.VisualRangeUpdateMode
     * @default 'auto'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * @docid dxChartOptions.argumentAxis.wholeRange
     * @type VizRange | Array<number,string,Date>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid dxChartOptions.argumentAxis.workWeek
     * @type Array<number>
     * @default [1, 2, 3, 4, 5]
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    workWeek?: Array<number>;
    /**
     * @docid dxChartOptions.argumentAxis.workdaysOnly
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    workdaysOnly?: boolean;
}
export interface dxChartArgumentAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartArgumentAxisConstantLineStyleLabel;
}
export interface dxChartArgumentAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle.label.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle.label.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
export interface dxChartArgumentAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.displayBehindSeries
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.extendAxis
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartArgumentAxisConstantLinesLabel;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.value
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
export interface dxChartArgumentAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
export interface dxChartArgumentAxisLabel extends dxChartCommonAxisSettingsLabel {
    /**
     * @docid dxChartOptions.argumentAxis.label.customizeHint
     * @type function(argument)
     * @type_function_param1 argument:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxChartOptions.argumentAxis.label.customizeText
     * @type function(argument)
     * @type_function_param1 argument:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxChartOptions.argumentAxis.label.format
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
}
export interface dxChartArgumentAxisStrips extends dxChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxChartOptions.argumentAxis.strips.color
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.argumentAxis.strips.endValue
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid dxChartOptions.argumentAxis.strips.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartArgumentAxisStripsLabel;
    /**
     * @docid dxChartOptions.argumentAxis.strips.startValue
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
export interface dxChartArgumentAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxChartOptions.argumentAxis.strips.label.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxChartArgumentAxisTitle extends dxChartCommonAxisSettingsTitle {
    /**
     * @docid dxChartOptions.argumentAxis.title.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxChartCommonAxisSettings {
    /**
     * @docid dxChartOptions.commonAxisSettings.allowDecimals
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDecimals?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.breakStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    breakStyle?: { color?: string, line?: 'straight' | 'waved', width?: number };
    /**
     * @docid dxChartOptions.commonAxisSettings.color
     * @type string
     * @default '#767676'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLineStyle?: dxChartCommonAxisSettingsConstantLineStyle;
    /**
     * @docid dxChartOptions.commonAxisSettings.discreteAxisDivisionMode
     * @type Enums.DiscreteAxisDivisionMode
     * @default 'betweenLabels'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
    /**
     * @docid dxChartOptions.commonAxisSettings.endOnTick
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.grid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    grid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid dxChartOptions.commonAxisSettings.inverted
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    inverted?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartCommonAxisSettingsLabel;
    /**
     * @docid dxChartOptions.commonAxisSettings.maxValueMargin
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxValueMargin?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.minValueMargin
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minValueMargin?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.minorGrid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorGrid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid dxChartOptions.commonAxisSettings.minorTick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number };
    /**
     * @docid dxChartOptions.commonAxisSettings.opacity
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.placeholderSize
     * @type number
     * @default null
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    placeholderSize?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stripStyle?: dxChartCommonAxisSettingsStripStyle;
    /**
     * @docid dxChartOptions.commonAxisSettings.tick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number };
    /**
     * @docid dxChartOptions.commonAxisSettings.title
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: dxChartCommonAxisSettingsTitle;
    /**
     * @docid dxChartOptions.commonAxisSettings.valueMarginsEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueMarginsEnabled?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.width
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.color
     * @type string
     * @default '#000000'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartCommonAxisSettingsConstantLineStyleLabel;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.paddingLeftRight
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.paddingTopBottom
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.width
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label.font
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label.position
     * @type Enums.RelativePosition
     * @default 'inside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartCommonAxisSettingsLabel {
    /**
     * @docid dxChartOptions.commonAxisSettings.label.alignment
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.commonAxisSettings.label.displayMode
     * @type Enums.ChartLabelDisplayMode
     * @default 'standard'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayMode?: 'rotate' | 'stagger' | 'standard';
    /**
     * @docid dxChartOptions.commonAxisSettings.label.font
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.indentFromAxis
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indentFromAxis?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.overlappingBehavior
     * @type Enums.OverlappingBehavior
     * @default 'hide'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    overlappingBehavior?: 'rotate' | 'stagger' | 'none' | 'hide';
    /**
     * @docid dxChartOptions.commonAxisSettings.label.rotationAngle
     * @type number
     * @default 90
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.staggeringSpacing
     * @type number
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    staggeringSpacing?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.textOverflow
     * @type Enums.VizTextOverflow
     * @default "none"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    textOverflow?: 'ellipsis' | 'hide' | 'none';
    /**
     * @docid dxChartOptions.commonAxisSettings.label.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.wordWrap
     * @type Enums.VizWordWrap
     * @default "normal"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wordWrap?: 'normal' | 'breakWord' | 'none';
}
export interface dxChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartCommonAxisSettingsStripStyleLabel;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.paddingLeftRight
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.paddingTopBottom
     * @type number
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
}
export interface dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label.font
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'left'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
export interface dxChartCommonAxisSettingsTitle {
    /**
     * @docid dxChartOptions.commonAxisSettings.title.alignment
     * @type Enums.HorizontalAlignment
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.commonAxisSettings.title.font
     * @type Font
     * @default '#767676' [prop](color)
     * @default 16 [prop](size)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.title.margin
     * @type number
     * @default 6
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.title.textOverflow
     * @type Enums.VizTextOverflow
     * @default "ellipsis"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    textOverflow?: 'ellipsis' | 'hide' | 'none';
    /**
     * @docid dxChartOptions.commonAxisSettings.title.wordWrap
     * @type Enums.VizWordWrap
     * @default "normal"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wordWrap?: 'normal' | 'breakWord' | 'none';
}
export interface dxChartCommonPaneSettings {
    /**
     * @docid dxChartOptions.commonPaneSettings.backgroundColor
     * @type string
     * @default 'none'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxChartOptions.commonPaneSettings.border
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { bottom?: boolean, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', left?: boolean, opacity?: number, right?: boolean, top?: boolean, visible?: boolean, width?: number };
}
export interface dxChartCommonSeriesSettings extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartOptions.commonSeriesSettings.area
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    area?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.bar
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.bubble
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bubble?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.candlestick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    candlestick?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedarea
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedarea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedbar
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedbar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedline
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedspline
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedspline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedsplinearea
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedsplinearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.line
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    line?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.rangearea
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.rangebar
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangebar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.scatter
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scatter?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.spline
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    spline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.splinearea
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    splinearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedarea
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedarea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedbar
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedbar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedline
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedspline
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedspline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedsplinearea
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedsplinearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.steparea
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    steparea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stepline
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stepline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stock
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stock?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.type
     * @type Enums.SeriesType
     * @default 'line'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
}
export interface dxChartLegend extends BaseChartLegend {
    /**
     * @docid dxChartOptions.legend.customizeHint
     * @type function(seriesInfo)
     * @type_function_param1 seriesInfo:object
     * @type_function_param1_field1 seriesName:any
     * @type_function_param1_field2 seriesIndex:Number
     * @type_function_param1_field3 seriesColor:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
    /**
     * @docid dxChartOptions.legend.customizeText
     * @type function(seriesInfo)
     * @type_function_param1 seriesInfo:object
     * @type_function_param1_field1 seriesName:any
     * @type_function_param1_field2 seriesIndex:Number
     * @type_function_param1_field3 seriesColor:string
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
    /**
     * @docid dxChartOptions.legend.hoverMode
     * @type Enums.ChartLegendHoverMode
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'excludePoints' | 'includePoints' | 'none';
    /**
     * @docid dxChartOptions.legend.position
     * @type Enums.RelativePosition
     * @default 'outside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
}
export interface dxChartPanes extends dxChartCommonPaneSettings {
    /**
     * @docid dxChartOptions.panes.height
     * @type number|string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number | string;
    /**
     * @docid dxChartOptions.panes.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
}
export interface dxChartTooltip extends BaseChartTooltip {
    /**
     * @docid dxChartOptions.tooltip.location
     * @type Enums.ChartTooltipLocation
     * @default 'center'
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    location?: 'center' | 'edge';
}
export interface dxChartValueAxis extends dxChartCommonAxisSettings {
    /**
     * @docid dxChartOptions.valueAxis.autoBreaksEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    autoBreaksEnabled?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.axisDivisionFactor
     * @type number
     * @default 40
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxChartOptions.valueAxis.breaks
     * @type Array<ScaleBreak>
     * @inherits ScaleBreak
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    breaks?: Array<ScaleBreak>;
    /**
     * @docid dxChartOptions.valueAxis.categories
     * @type Array<number,string,Date>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLineStyle?: dxChartValueAxisConstantLineStyle;
    /**
     * @docid dxChartOptions.valueAxis.constantLines
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxChartOptions.commonAxisSettings.constantLineStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLines?: Array<dxChartValueAxisConstantLines>;
    /**
     * @docid dxChartOptions.valueAxis.endOnTick
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartValueAxisLabel;
    /**
     * @docid dxChartOptions.valueAxis.linearThreshold
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid dxChartOptions.valueAxis.logarithmBase
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxChartOptions.valueAxis.max
     * @type number | datetime | string
     * @deprecated dxChartOptions.valueAxis.visualRange
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    max?: number | Date | string;
    /**
     * @docid dxChartOptions.valueAxis.maxAutoBreakCount
     * @type numeric
     * @default 4
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxAutoBreakCount?: number;
    /**
     * @docid dxChartOptions.valueAxis.min
     * @type number | datetime | string
     * @deprecated dxChartOptions.valueAxis.visualRange
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    min?: number | Date | string;
    /**
     * @docid dxChartOptions.valueAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid dxChartOptions.valueAxis.minorTickCount
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxChartOptions.valueAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid dxChartOptions.valueAxis.multipleAxesSpacing
     * @type number
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    multipleAxesSpacing?: number;
    /**
     * @docid dxChartOptions.valueAxis.name
     * @type string
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid dxChartOptions.valueAxis.pane
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pane?: string;
    /**
     * @docid dxChartOptions.valueAxis.position
     * @type Enums.Position
     * @default 'left'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid dxChartOptions.valueAxis.showZero
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showZero?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.strips
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxChartOptions.commonAxisSettings.stripStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    strips?: Array<dxChartValueAxisStrips>;
    /**
     * @docid dxChartOptions.valueAxis.synchronizedValue
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    synchronizedValue?: number;
    /**
     * @docid dxChartOptions.valueAxis.tickInterval
     * @inherits VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid dxChartOptions.valueAxis.title
     * @type string|object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: dxChartValueAxisTitle;
    /**
     * @docid dxChartOptions.valueAxis.type
     * @type Enums.AxisScaleType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * @docid dxChartOptions.valueAxis.valueType
     * @type Enums.ChartDataType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid dxChartOptions.valueAxis.visualRange
     * @type VizRange | Array<number,string,Date>
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid dxChartOptions.valueAxis.visualRangeUpdateMode
     * @type Enums.VisualRangeUpdateMode
     * @default 'auto'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * @docid dxChartOptions.valueAxis.wholeRange
     * @type VizRange | Array<number,string,Date>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
}
export interface dxChartValueAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartValueAxisConstantLineStyleLabel;
}
export interface dxChartValueAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle.label.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'left'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle.label.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
export interface dxChartValueAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxChartOptions.valueAxis.constantLines.displayBehindSeries
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.extendAxis
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartValueAxisConstantLinesLabel;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.value
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
export interface dxChartValueAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'left'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
export interface dxChartValueAxisLabel extends dxChartCommonAxisSettingsLabel {
    /**
     * @docid dxChartOptions.valueAxis.label.customizeHint
     * @type function(axisValue)
     * @type_function_param1 axisValue:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxChartOptions.valueAxis.label.customizeText
     * @type function(axisValue)
     * @type_function_param1 axisValue:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxChartOptions.valueAxis.label.format
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
}
export interface dxChartValueAxisStrips extends dxChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxChartOptions.valueAxis.strips.color
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.valueAxis.strips.endValue
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid dxChartOptions.valueAxis.strips.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartValueAxisStripsLabel;
    /**
     * @docid dxChartOptions.valueAxis.strips.startValue
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
export interface dxChartValueAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxChartOptions.valueAxis.strips.label.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxChartValueAxisTitle extends dxChartCommonAxisSettingsTitle {
    /**
     * @docid dxChartOptions.valueAxis.title.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
/**
 * @docid dxChart
 * @inherits BaseChart
 * @module viz/chart
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxChart extends BaseChart {
    constructor(element: Element, options?: dxChartOptions)
    constructor(element: JQuery, options?: dxChartOptions)
    /**
     * @docid dxchartmethods.getArgumentAxis
     * @publicName getArgumentAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getArgumentAxis(): chartAxisObject;
    /**
     * @docid dxchartmethods.getValueAxis
     * @publicName getValueAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid dxchartmethods.getValueAxis(name)
     * @publicName getValueAxis(name)
     * @param1 name:string
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValueAxis(name: string): chartAxisObject;
    /**
     * @docid dxchartmethods.resetVisualRange
     * @publicName resetVisualRange()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resetVisualRange(): void;
    /**
     * @docid dxchartmethods.zoomArgument
     * @publicName zoomArgument(startValue,endValue)
     * @param1 startValue:Number|Date|string
     * @param2 endValue:Number|Date|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomArgument(startValue: number | Date | string, endValue: number | Date | string): void;
}

export interface dxChartAnnotationConfig extends dxChartCommonAnnotationConfig {
    /**
     * @docid dxChartAnnotationConfig.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
}

export interface dxChartCommonAnnotationConfig {
    /**
     * @docid dxChartCommonAnnotationConfig.allowDragging
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDragging?: boolean;
    /**
     * @docid dxChartCommonAnnotationConfig.argument
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: number | Date | string;
    /**
     * @docid dxChartCommonAnnotationConfig.arrowLength
     * @type number
     * @default 14
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowLength?: number;
    /**
     * @docid dxChartCommonAnnotationConfig.arrowWidth
     * @type number
     * @default 14
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowWidth?: number;
    /**
     * @docid dxChartCommonAnnotationConfig.axis
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axis?: string;
    /**
     * @docid dxChartCommonAnnotationConfig.border
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, cornerRadius?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid dxChartCommonAnnotationConfig.color
     * @type string
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartCommonAnnotationConfig.customizeTooltip
     * @type function(annotation)
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((annotation: dxChartAnnotationConfig | any) => any);
    /**
     * @docid dxChartCommonAnnotationConfig.data
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: any;
    /**
     * @docid dxChartCommonAnnotationConfig.description
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    description?: string;
    /**
     * @docid dxChartCommonAnnotationConfig.font
     * @type Font
     * @default '#333333' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartCommonAnnotationConfig.height
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid dxChartCommonAnnotationConfig.image
     * @type string|object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    image?: string | { height?: number, url?: string, width?: number };
    /**
     * @docid dxChartCommonAnnotationConfig.offsetX
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offsetX?: number;
    /**
     * @docid dxChartCommonAnnotationConfig.offsetY
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offsetY?: number;
    /**
     * @docid dxChartCommonAnnotationConfig.opacity
     * @type number
     * @default 0.9
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartCommonAnnotationConfig.paddingLeftRight
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid dxChartCommonAnnotationConfig.paddingTopBottom
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid dxChartCommonAnnotationConfig.series
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: string;
    /**
     * @docid dxChartCommonAnnotationConfig.shadow
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number };
    /**
     * @docid dxChartCommonAnnotationConfig.template
     * @type template|function
     * @default undefined
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    template?: template | ((annotation: dxChartAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
    /**
     * @docid dxChartCommonAnnotationConfig.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid dxChartCommonAnnotationConfig.textOverflow
     * @type Enums.VizTextOverflow
     * @default "ellipsis"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    textOverflow?: 'ellipsis' | 'hide' | 'none';
    /**
     * @docid dxChartCommonAnnotationConfig.tooltipEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipEnabled?: boolean;
    /**
     * @docid dxChartCommonAnnotationConfig.tooltipTemplate
     * @type template|function(annotation, element)
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_param2 element:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxChartAnnotationConfig | any, element: dxElement) => string | Element | JQuery);
    /**
     * @docid dxChartCommonAnnotationConfig.type
     * @type Enums.AnnotationType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'text' | 'image' | 'custom';
    /**
     * @docid dxChartCommonAnnotationConfig.value
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
    /**
     * @docid dxChartCommonAnnotationConfig.width
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
    /**
     * @docid dxChartCommonAnnotationConfig.wordWrap
     * @type Enums.VizWordWrap
     * @default "normal"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wordWrap?: 'normal' | 'breakWord' | 'none';
    /**
     * @docid dxChartCommonAnnotationConfig.x
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    x?: number;
    /**
     * @docid dxChartCommonAnnotationConfig.y
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    y?: number;
}

export interface dxChartSeriesTypes {
    /**
     * @docid dxChartSeriesTypes.AreaSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    AreaSeries?: dxChartSeriesTypesAreaSeries;
    /**
     * @docid dxChartSeriesTypes.BarSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    BarSeries?: dxChartSeriesTypesBarSeries;
    /**
     * @docid dxChartSeriesTypes.BubbleSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    BubbleSeries?: dxChartSeriesTypesBubbleSeries;
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    CandleStickSeries?: dxChartSeriesTypesCandleStickSeries;
    /**
     * @docid dxChartSeriesTypes.CommonSeries
     * @type object
     * @hidden
     * @prevFileNamespace DevExpress.viz
     */
    CommonSeries?: dxChartSeriesTypesCommonSeries;
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedAreaSeries?: dxChartSeriesTypesFullStackedAreaSeries;
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedBarSeries?: dxChartSeriesTypesFullStackedBarSeries;
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedLineSeries?: dxChartSeriesTypesFullStackedLineSeries;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedSplineAreaSeries?: dxChartSeriesTypesFullStackedSplineAreaSeries;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedSplineSeries?: dxChartSeriesTypesFullStackedSplineSeries;
    /**
     * @docid dxChartSeriesTypes.LineSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    LineSeries?: dxChartSeriesTypesLineSeries;
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    RangeAreaSeries?: dxChartSeriesTypesRangeAreaSeries;
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    RangeBarSeries?: dxChartSeriesTypesRangeBarSeries;
    /**
     * @docid dxChartSeriesTypes.ScatterSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ScatterSeries?: dxChartSeriesTypesScatterSeries;
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    SplineAreaSeries?: dxChartSeriesTypesSplineAreaSeries;
    /**
     * @docid dxChartSeriesTypes.SplineSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    SplineSeries?: dxChartSeriesTypesSplineSeries;
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedAreaSeries?: dxChartSeriesTypesStackedAreaSeries;
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedBarSeries?: dxChartSeriesTypesStackedBarSeries;
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedLineSeries?: dxChartSeriesTypesStackedLineSeries;
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedSplineAreaSeries?: dxChartSeriesTypesStackedSplineAreaSeries;
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedSplineSeries?: dxChartSeriesTypesStackedSplineSeries;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StepAreaSeries?: dxChartSeriesTypesStepAreaSeries;
    /**
     * @docid dxChartSeriesTypes.StepLineSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StepLineSeries?: dxChartSeriesTypesStepLineSeries;
    /**
     * @docid dxChartSeriesTypes.StockSeries
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StockSeries?: dxChartSeriesTypesStockSeries;
}
export interface dxChartSeriesTypesAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.AreaSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.AreaSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.AreaSeries.point
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.AreaSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.point.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.BarSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesBarSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.BarSeries.hoverMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.BarSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesBarSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.BarSeries.selectionMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
export interface dxChartSeriesTypesBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.BarSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'sum'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.BarSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesBubbleSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesBubbleSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.hoverMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesBubbleSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.selectionMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
export interface dxChartSeriesTypesBubbleSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.aggregation.method
     * @type Enums.ChartBubbleSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'custom';
}
export interface dxChartSeriesTypesBubbleSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesCandleStickSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesCandleStickSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.argumentField
     * @type string
     * @default 'date'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.hoverMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.hoverStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: dxChartSeriesTypesCandleStickSeriesHoverStyle;
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesCandleStickSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.selectionMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.selectionStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: dxChartSeriesTypesCandleStickSeriesSelectionStyle;
}
export interface dxChartSeriesTypesCandleStickSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.aggregation.method
     * @type Enums.ChartFinancialSeriesAggregationMethod
     * @default 'ohlc'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'ohlc' | 'custom';
}
export interface dxChartSeriesTypesCandleStickSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hatching?: dxChartSeriesTypesCandleStickSeriesHoverStyleHatching;
}
export interface dxChartSeriesTypesCandleStickSeriesHoverStyleHatching extends dxChartSeriesTypesCommonSeriesHoverStyleHatching {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching.direction
     * @default 'none'
     * @type Enums.HatchingDirection
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    direction?: 'left' | 'none' | 'right';
}
export interface dxChartSeriesTypesCandleStickSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesCandleStickSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hatching?: dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching;
}
export interface dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching extends dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching.direction
     * @default 'none'
     * @type Enums.HatchingDirection
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    direction?: 'left' | 'none' | 'right';
}
export interface dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesCommonSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.argumentField
     * @type string
     * @default 'arg'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.axis
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axis?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barOverlapGroup
     * @type string
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barOverlapGroup?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barPadding
     * @type number
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barPadding?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barWidth
     * @type number
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barWidth?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesCommonSeriesBorder;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.closeValueField
     * @type string
     * @default 'close'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    closeValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.color
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.cornerRadius
     * @type number
     * @default 0
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    cornerRadius?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.highValueField
     * @type string
     * @default 'high'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    highValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverMode
     * @type Enums.ChartSeriesHoverMode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: dxChartSeriesTypesCommonSeriesHoverStyle;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ignoreEmptyPoints?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.innerColor
     * @type string
     * @default '#ffffff'
     * @propertyOf dxChartSeriesTypes.CandleStickSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    innerColor?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesCommonSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.lowValueField
     * @type string
     * @default 'low'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    lowValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.maxLabelCount
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxLabelCount?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.minBarSize
     * @type number
     * @default undefined
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minBarSize?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.opacity
     * @type number
     * @default 0.5
     * @propertyOf dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.openValueField
     * @type string
     * @default 'open'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    openValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.pane
     * @type string
     * @default 'default'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pane?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point
     * @type object
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesCommonSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.rangeValue1Field
     * @type string
     * @default 'val1'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeValue1Field?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.rangeValue2Field
     * @type string
     * @default 'val2'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeValue2Field?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.reduction
     * @type object
     * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    reduction?: { color?: string, level?: 'close' | 'high' | 'low' | 'open' };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionMode
     * @type Enums.ChartSeriesSelectionMode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: dxChartSeriesTypesCommonSeriesSelectionStyle;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.showInLegend
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showInLegend?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.sizeField
     * @type string
     * @default 'size'
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sizeField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.stack
     * @type string
     * @default 'default'
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stack?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.tagField
     * @type string
     * @default 'tag'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tagField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueErrorBar?: { color?: string, displayMode?: 'auto' | 'high' | 'low' | 'none', edgeLength?: number, highValueField?: string, lineWidth?: number, lowValueField?: string, opacity?: number, type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance', value?: number };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.valueField
     * @type string
     * @default 'val'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.width
     * @type number
     * @default 2
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.aggregation.calculate
     * @type function(aggregationInfo, series)
     * @type_function_param1 aggregationInfo:chartPointAggregationInfoObject
     * @type_function_param2 series:chartSeriesObject
     * @type_function_return object|Array<object>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => any | Array<any>);
    /**
     * @docid dxChartSeriesTypes.CommonSeries.aggregation.enabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.aggregation.method
     * @type Enums.ChartSeriesAggregationMethod
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'ohlc' | 'range' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesCommonSeriesBorder {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.color
     * @type string
     * @default undefined
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.dashStyle
     * @type Enums.DashStyle
     * @default undefined
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.visible
     * @type boolean
     * @default false
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.width
     * @type number
     * @default 2
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesCommonSeriesHoverStyleBorder;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.color
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hatching?: dxChartSeriesTypesCommonSeriesHoverStyleHatching;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.width
     * @type number
     * @default 3
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartSeriesTypesCommonSeriesHoverStyleBorder {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.color
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.width
     * @type number
     * @default 3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartSeriesTypesCommonSeriesHoverStyleHatching {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.direction
     * @type Enums.HatchingDirection
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    direction?: 'left' | 'none' | 'right';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.opacity
     * @type number
     * @default 0.75
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.step
     * @type number
     * @default 6
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    step?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.width
     * @type number
     * @default 2
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.alignment
     * @type Enums.HorizontalAlignment
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.argumentFormat
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentFormat?: format;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.backgroundColor
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.border
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.connector
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    connector?: { color?: string, visible?: boolean, width?: number };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.font
     * @type Font
     * @default '#FFFFFF' [prop](color)
     * @default 14 [prop](size)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.format
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.horizontalOffset
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalOffset?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.position
     * @type Enums.RelativePosition
     * @default 'outside'
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.rotationAngle
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.showForZeroValues
     * @type boolean
     * @default true
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showForZeroValues?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.verticalOffset
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalOffset?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.border
     * @type object
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, visible?: boolean, width?: number };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.color
     * @type string
     * @default undefined
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.hoverMode
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle
     * @type object
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.image
     * @type string|object
     * @default undefined
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    image?: string | { height?: number | { rangeMaxPoint?: number, rangeMinPoint?: number }, url?: string | { rangeMaxPoint?: string, rangeMinPoint?: string }, width?: number | { rangeMaxPoint?: number, rangeMinPoint?: number } };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.selectionMode
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle
     * @type object
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.size
     * @type number
     * @default 12
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.symbol
     * @type Enums.PointSymbol
     * @default 'circle'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.visible
     * @type boolean
     * @default true
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesCommonSeriesSelectionStyleBorder;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.color
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hatching?: dxChartSeriesTypesCommonSeriesSelectionStyleHatching;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.width
     * @type number
     * @default 3
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.color
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.width
     * @type number
     * @default 3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.direction
     * @type Enums.HatchingDirection
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    direction?: 'left' | 'none' | 'right';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.opacity
     * @type number
     * @default 0.5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.step
     * @type number
     * @default 6
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    step?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.width
     * @type number
     * @default 2
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartSeriesTypesFullStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesFullStackedAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.point
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesFullStackedAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesFullStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesFullStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesFullStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.point.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesFullStackedBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedBarSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.hoverMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesFullStackedBarSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.selectionMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
export interface dxChartSeriesTypesFullStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'sum'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesFullStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.label.position
     * @type Enums.RelativePosition
     * @default 'inside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
}
export interface dxChartSeriesTypesFullStackedLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedLineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesFullStackedLineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesFullStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesFullStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesFullStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesFullStackedSplineAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.point
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesFullStackedSplineAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.point.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesFullStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedSplineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesFullStackedSplineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesFullStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesFullStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.LineSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesLineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.LineSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.LineSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesLineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.LineSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.LineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.LineSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesRangeAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesRangeAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesRangeAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.point
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesRangeAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesRangeAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.aggregation.method
     * @type Enums.ChartRangeSeriesAggregationMethod
     * @default 'range'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'range' | 'custom';
}
export interface dxChartSeriesTypesRangeAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesRangeAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.point.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesRangeBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesRangeBarSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.hoverMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesRangeBarSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.selectionMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
export interface dxChartSeriesTypesRangeBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.aggregation.method
     * @type Enums.ChartRangeSeriesAggregationMethod
     * @default 'range'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'range' | 'custom';
}
export interface dxChartSeriesTypesRangeBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesScatterSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.ScatterSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesScatterSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.ScatterSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesScatterSeriesLabel;
}
export interface dxChartSeriesTypesScatterSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.ScatterSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesScatterSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.ScatterSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesSplineAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesSplineAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.point
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesSplineAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.point.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesSplineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.SplineSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesSplineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.SplineSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.SplineSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesSplineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.SplineSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.SplineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.SplineSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStackedAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.point
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesStackedAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.point.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesStackedBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedBarSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.hoverMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStackedBarSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.selectionMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
export interface dxChartSeriesTypesStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'sum'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.label.position
     * @type Enums.RelativePosition
     * @default 'inside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
}
export interface dxChartSeriesTypesStackedLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedLineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStackedLineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedSplineAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStackedSplineAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.point
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesStackedSplineAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.point.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedSplineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStackedSplineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesStepAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStepAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.border
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesStepAreaSeriesBorder;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.hoverStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: dxChartSeriesTypesStepAreaSeriesHoverStyle;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStepAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.point
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesStepAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.selectionStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: dxChartSeriesTypesStepAreaSeriesSelectionStyle;
}
export interface dxChartSeriesTypesStepAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesStepAreaSeriesBorder extends dxChartSeriesTypesCommonSeriesBorder {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.border.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesStepAreaSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.hoverStyle.border
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesStepAreaSeriesHoverStyleBorder;
}
export interface dxChartSeriesTypesStepAreaSeriesHoverStyleBorder extends dxChartSeriesTypesCommonSeriesHoverStyleBorder {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.hoverStyle.border.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesStepAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesStepAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.point.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesStepAreaSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.selectionStyle.border
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder;
}
export interface dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder extends dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.selectionStyle.border.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesStepLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStepLineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStepLineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxChartSeriesTypesStepLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
}
export interface dxChartSeriesTypesStepLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
export interface dxChartSeriesTypesStockSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StockSeries.aggregation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStockSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StockSeries.argumentField
     * @type string
     * @default 'date'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxChartSeriesTypes.StockSeries.hoverMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StockSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStockSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StockSeries.selectionMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
export interface dxChartSeriesTypesStockSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StockSeries.aggregation.method
     * @type Enums.ChartFinancialSeriesAggregationMethod
     * @default 'ohlc'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'ohlc' | 'custom';
}
export interface dxChartSeriesTypesStockSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StockSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}

declare global {
interface JQuery {
    dxChart(): JQuery;
    dxChart(options: "instance"): dxChart;
    dxChart(options: string): any;
    dxChart(options: string, ...params: any[]): any;
    dxChart(options: dxChartOptions): JQuery;
}
}
export type Options = dxChartOptions;

/** @deprecated use Options instead */
export type IOptions = dxChartOptions;