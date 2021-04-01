import {
    TElement
} from '../core/element';

import {
    TEvent
} from '../events/index';

import {
    format
} from '../ui/widget/ui.widget';

import {
    template
} from '../core/templates/template';

import {
    BaseChart,
    BaseChartLegend,
    BaseChartOptions,
    BaseChartTooltip,
    BaseChartAnnotationConfig
} from './chart_components/base_chart';

import {
    ChartSeries,
    ScaleBreak,
    VizRange,
    ChartSeriesType,
    DashStyleType,
    TimeIntervalType,
    HatchingDirectionType
} from './common';

import {
    Font,
    WordWrapType,
    VizTextOverflowType
} from './core/base_widget';

export type ChartSingleValueSeriesAggregationMethodType = 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';

/**
* @docid
* @publicName Label
* @type object
*/
export interface baseLabelObject {
    /**
     * @docid
     * @publicName getBoundingRect()
     * @return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getBoundingRect(): any;
    /**
     * @docid
     * @publicName hide()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hide(): void;
    /**
     * @docid
     * @publicName hide(holdInvisible)
     * @param1 holdInvisible:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hide(holdInvisible: boolean): void;
    /**
     * @docid
     * @publicName isVisible()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isVisible(): boolean;
    /**
     * @docid
     * @publicName show()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    show(): void;
    /**
     * @docid
     * @publicName show(holdVisible)
     * @param1 holdVisible:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    show(holdVisible: boolean): void;
}

/**
* @docid
* @publicName Point
* @type object
*/
export interface basePointObject {
    /**
     * @docid
     * @publicName clearHover()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearHover(): void;
    /**
     * @docid
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: any;
    /**
     * @docid basePointObject.fullState
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullState?: number;
    /**
     * @docid
     * @publicName getColor()
     * @return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getColor(): string;
    /**
     * @docid
     * @publicName getLabel()
     * @return baseLabelObject|Array<baseLabelObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getLabel(): baseLabelObject & Array<baseLabelObject>;
    /**
     * @docid
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName hover()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hover(): void;
    /**
     * @docid
     * @publicName isHovered()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalArgument?: string | number | Date;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalValue?: string | number | Date;
    /**
     * @docid
     * @publicName select()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    select(): void;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: any;
    /**
     * @docid
     * @publicName showTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showTooltip(): void;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tag?: any;
}

/**
* @docid
* @publicName Series
* @type object
*/
export interface baseSeriesObject {
    /**
     * @docid
     * @publicName clearHover()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearHover(): void;
    /**
     * @docid
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName deselectPoint(point)
     * @param1 point:basePointObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    deselectPoint(point: basePointObject): void;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullState?: number;
    /**
     * @docid
     * @publicName getAllPoints()
     * @return Array<basePointObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllPoints(): Array<basePointObject>;
    /**
     * @docid
     * @publicName getColor()
     * @return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getColor(): string;
    /**
     * @docid
     * @publicName getPointByPos(positionIndex)
     * @param1 positionIndex:number
     * @return basePointObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getPointByPos(positionIndex: number): basePointObject;
    /**
     * @docid
     * @publicName getPointsByArg(pointArg)
     * @param1 pointArg:number|string|date
     * @return Array<basePointObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getPointsByArg(pointArg: number | string | Date): Array<basePointObject>;
    /**
     * @docid
     * @publicName getVisiblePoints()
     * @return Array<basePointObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getVisiblePoints(): Array<basePointObject>;
    /**
     * @docid
     * @publicName hide()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hide(): void;
    /**
     * @docid
     * @publicName hover()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hover(): void;
    /**
     * @docid
     * @publicName isHovered()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @publicName isVisible()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isVisible(): boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: any;
    /**
     * @docid
     * @publicName select()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    select(): void;
    /**
     * @docid
     * @publicName selectPoint(point)
     * @param1 point:basePointObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectPoint(point: basePointObject): void;
    /**
     * @docid
     * @publicName show()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    show(): void;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tag?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: string;
}

/**
* @docid
* @type object
*/
export interface chartAxisObject {
    /**
     * @docid
     * @publicName visualRange()
     * @return VizRange
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRange(): VizRange;
    /**
     * @docid
     * @publicName visualRange(visualRange)
     * @param1 visualRange:Array<number,string,Date> | VizRange
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRange(visualRange: Array<number | string | Date> | VizRange): void;
}

/**
* @docid
* @publicName aggregationInfo
* @type object
*/
export interface chartPointAggregationInfoObject {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationInterval?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: Array<any>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    intervalEnd?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    intervalStart?: any;
}

/**
* @docid
* @publicName Point
* @type object
* @inherits basePointObject
*/
export interface chartPointObject extends basePointObject {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationInfo?: chartPointAggregationInfoObject;
    /**
     * @docid
     * @publicName getBoundingRect()
     * @return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getBoundingRect(): any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalCloseValue?: number | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalHighValue?: number | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalLowValue?: number | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalMinValue?: string | number | Date;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalOpenValue?: number | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number | string;
}
/**
* @docid
* @publicName Series
* @type object
* @inherits baseSeriesObject
*/
export interface chartSeriesObject extends baseSeriesObject {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axis?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barOverlapGroup?: string;
    /**
     * @docid
     * @publicName getArgumentAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getArgumentAxis(): chartAxisObject;
    /**
     * @docid
     * @publicName getValueAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pane?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stack?: string;
}

export interface dxChartOptions extends BaseChartOptions<dxChart> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adjustOnZoom?: boolean;
    /**
     * @docid
     * @inherits dxChartOptions.commonAnnotationSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    annotations?: Array<dxChartAnnotationConfig | any>;
    /**
     * @docid
     * @type object
     * @inherits dxChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentAxis?: dxChartArgumentAxis;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    autoHidePointMarkers?: boolean;
    /**
     * @docid
     * @default 0.3
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupPadding?: number;
    /**
     * @docid
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupWidth?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAnnotationSettings?: dxChartCommonAnnotationConfig;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAxisSettings?: dxChartCommonAxisSettings;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonPaneSettings?: dxChartCommonPaneSettings;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonSeriesSettings?: dxChartCommonSeriesSettings;
    /**
     * @docid
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    crosshair?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default '#f05b41'
      */
      color?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type Enums.DashStyle
      * @default 'solid'
      */
      dashStyle?: DashStyleType,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      enabled?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      horizontalLine?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default "#f05b41"
        */
        color?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @type Enums.DashStyle
        * @default 'solid'
        */
        dashStyle?: DashStyleType,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        */
        label?: {
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default "#f05b41"
          */
          backgroundColor?: string,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @type_function_param1 info:object
          * @type_function_param1_field1 value:Date|Number|string
          * @type_function_param1_field2 valueText:string
          * @type_function_param1_field3 point:chartPointObject
          * @type_function_return string
          * @notUsedInTheme
          */
          customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string),
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default '#FFFFFF' [prop](color)
           */
          font?: Font,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @extends CommonVizFormat
          */
          format?: format,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default false
           */
          visible?: boolean
        },
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        */
        opacity?: number,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default true
        */
        visible?: boolean,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default 1
        */
        width?: number
      } | boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      label?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default "#f05b41"
        */
        backgroundColor?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @type_function_param1 info:object
        * @type_function_param1_field1 value:Date|Number|string
        * @type_function_param1_field2 valueText:string
        * @type_function_param1_field3 point:chartPointObject
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string),
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default '#FFFFFF' [prop](color)
         */
        font?: Font,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @extends CommonVizFormat
         */
        format?: format,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default false
         */
        visible?: boolean
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      verticalLine?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default "#f05b41"
        */
        color?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @type Enums.DashStyle
        * @default 'solid'
        */
        dashStyle?: DashStyleType,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        */
        label?: {
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @default "#f05b41"
          */
          backgroundColor?: string,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @type_function_param1 info:object
          * @type_function_param1_field1 value:Date|Number|string
          * @type_function_param1_field2 valueText:string
          * @type_function_param1_field3 point:chartPointObject
          * @type_function_return string
          * @notUsedInTheme
          */
          customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string),
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default '#FFFFFF' [prop](color)
           */
          font?: Font,
          /**
          * @docid
          * @prevFileNamespace DevExpress.viz
          * @extends CommonVizFormat
          */
          format?: format,
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @default false
           */
          visible?: boolean
        },
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        */
        opacity?: number,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default true
        */
        visible?: boolean,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default 1
        */
        width?: number
      } | boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 1
      */
      width?: number
    };
    /**
     * @docid
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_return dxChartAnnotationConfig
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeAnnotation?: ((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig);
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataPrepareSettings?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      checkTypeForAllData?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      convertToAxisDataType?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type_function_param1 a:object
      * @type_function_param2 b:object
      * @type_function_return Number
      * @default true
      */
      sortingMethod?: boolean | ((a: any, b: any) => number)
    };
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    defaultPane?: string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxChartLegend;
    /**
     * @docid
     * @default 0.2
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxBubbleSize?: number;
    /**
     * @docid
     * @default 12
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minBubbleSize?: number;
    /**
     * @docid
     * @default false
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    negativesAsZeroes?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 argument:Date|Number|string
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onArgumentAxisClick?: ((e: { component?: dxChart, element?: TElement, model?: any, event?: TEvent, argument?: Date | number | string }) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLegendClick?: ((e: { component?: dxChart, element?: TElement, model?: any, event?: TEvent, target?: chartSeriesObject }) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesClick?: ((e: { component?: dxChart, element?: TElement, model?: any, event?: TEvent, target?: chartSeriesObject }) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesHoverChanged?: ((e: { component?: dxChart, element?: TElement, model?: any, target?: chartSeriesObject }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesSelectionChanged?: ((e: { component?: dxChart, element?: TElement, model?: any, target?: chartSeriesObject }) => void);
    /**
     * @docid
     * @default null
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
    onZoomEnd?: ((e: { component?: dxChart, element?: TElement, model?: any, event?: TEvent, rangeStart?: Date | number, rangeEnd?: Date | number, axis?: chartAxisObject, range?: VizRange, previousRange?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan', zoomFactor?: number, shift?: number }) => void);
    /**
     * @docid
     * @default null
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
    onZoomStart?: ((e: { component?: dxChart, element?: TElement, model?: any, event?: TEvent, axis?: chartAxisObject, range?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan' }) => void);
    /**
     * @docid
     * @type Object|Array<Object>
     * @inherits dxChartOptions.commonPaneSettings
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    panes?: dxChartPanes | Array<dxChartPanes>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resizePanesOnZoom?: boolean;
    /**
     * @docid
     * @type Enums.ChartResolveLabelOverlapping
     * @default "none"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'stack';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotated?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scrollBar?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 'gray'
      */
      color?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 5
      */
      offset?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      opacity?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.Position
       * @default 'top'
       */
      position?: 'bottom' | 'left' | 'right' | 'top',
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      visible?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 10
      */
      width?: number
    };
    /**
     * @docid
     * @default undefined
     * @hideDefaults true
     * @notUsedInTheme
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: ChartSeries | Array<ChartSeries>;
    /**
     * @docid
     * @type Enums.ChartElementSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesSelectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesTemplate?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type_function_param1 seriesName:any
      * @type_function_return ChartSeries
      */
      customizeSeries?: ((seriesName: any) => ChartSeries),
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 'series'
      */
      nameField?: string
    };
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stickyHovering?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    synchronizeMultiAxes?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxChartTooltip;
    /**
     * @docid
     * @type Object|Array<Object>
     * @inherits dxChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueAxis?: dxChartValueAxis | Array<dxChartValueAxis>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomAndPan?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      allowMouseWheel?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      allowTouchGestures?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type Enums.ChartZoomAndPanMode
      * @default 'none'
      */
      argumentAxis?: 'both' | 'none' | 'pan' | 'zoom',
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      */
      dragBoxStyle?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        */
        color?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        */
        opacity?: number
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      dragToZoom?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type Enums.EventKeyModifier
      * @default 'shift'
      */
      panKey?: 'alt' | 'ctrl' | 'meta' | 'shift',
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type Enums.ChartZoomAndPanMode
      * @default 'none'
      */
      valueAxis?: 'both' | 'none' | 'pan' | 'zoom'
    };
}
export interface dxChartArgumentAxis extends dxChartCommonAxisSettings {
    /**
     * @docid dxChartOptions.argumentAxis.aggregateByCategory
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregateByCategory?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.aggregationGroupWidth
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationGroupWidth?: number;
    /**
     * @docid dxChartOptions.argumentAxis.aggregationInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationInterval?: number | any | TimeIntervalType;
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
     * @default 70
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxChartOptions.argumentAxis.breaks
     * @default undefined
     * @inherits ScaleBreak
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    breaks?: Array<ScaleBreak>;
    /**
     * @docid dxChartOptions.argumentAxis.categories
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
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.holidays
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid dxChartOptions.argumentAxis.logarithmBase
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxChartOptions.argumentAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minVisualRangeLength?: number | any | TimeIntervalType;
    /**
     * @docid dxChartOptions.argumentAxis.minorTickCount
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxChartOptions.argumentAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | TimeIntervalType;
    /**
     * @docid dxChartOptions.argumentAxis.position
     * @type Enums.Position
     * @default 'bottom'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid dxChartOptions.argumentAxis.customPosition
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customPosition?: number | Date | string;
    /**
     * @docid dxChartOptions.argumentAxis.customPositionAxis
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customPositionAxis?: string;
    /**
     * @docid dxChartOptions.argumentAxis.offset
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offset?: number;
    /**
     * @docid dxChartOptions.argumentAxis.singleWorkdays
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
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | TimeIntervalType;
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid dxChartOptions.argumentAxis.workWeek
     * @default [1, 2, 3, 4, 5]
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    workWeek?: Array<number>;
    /**
     * @docid dxChartOptions.argumentAxis.workdaysOnly
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
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.extendAxis
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.argumentAxis.strips.endValue
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
export interface dxChartArgumentAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxChartOptions.argumentAxis.strips.label.text
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxChartArgumentAxisTitle extends dxChartCommonAxisSettingsTitle {
    /**
     * @docid dxChartOptions.argumentAxis.title.text
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxChartCommonAxisSettings {
    /**
     * @docid dxChartOptions.commonAxisSettings.allowDecimals
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDecimals?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.breakStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    breakStyle?: {
      /**
      * @docid dxChartOptions.commonAxisSettings.breakStyle.color
      * @prevFileNamespace DevExpress.viz
      * @default "#ababab"
      */
      color?: string,
      /**
      * @docid dxChartOptions.commonAxisSettings.breakStyle.line
      * @prevFileNamespace DevExpress.viz
      * @type Enums.ScaleBreakLineStyle
      * @default "waved"
      */
      line?: 'straight' | 'waved',
      /**
      * @docid dxChartOptions.commonAxisSettings.breakStyle.width
      * @prevFileNamespace DevExpress.viz
      * @default 5
      */
      width?: number
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.color
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.grid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    grid?: {
      /**
      * @docid dxChartOptions.commonAxisSettings.grid.color
      * @prevFileNamespace DevExpress.viz
      * @default '#d3d3d3'
      */
      color?: string,
      /**
      * @docid dxChartOptions.commonAxisSettings.grid.opacity
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid dxChartOptions.commonAxisSettings.grid.visible
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      visible?: boolean,
      /**
      * @docid dxChartOptions.commonAxisSettings.grid.width
      * @prevFileNamespace DevExpress.viz
      * @default 1
      */
      width?: number
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.inverted
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxValueMargin?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.minValueMargin
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minValueMargin?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.minorGrid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorGrid?: {
      /**
      * @docid dxChartOptions.commonAxisSettings.minorGrid.color
      * @prevFileNamespace DevExpress.viz
      * @default '#d3d3d3'
      */
      color?: string,
      /**
      * @docid dxChartOptions.commonAxisSettings.minorGrid.opacity
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid dxChartOptions.commonAxisSettings.minorGrid.visible
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      visible?: boolean,
      /**
      * @docid dxChartOptions.commonAxisSettings.minorGrid.width
      * @prevFileNamespace DevExpress.viz
      * @default 1
      */
      width?: number
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.minorTick
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: {
      /**
      * @docid dxChartOptions.commonAxisSettings.minorTick.color
      * @prevFileNamespace DevExpress.viz
      * @default '#767676'
      */
      color?: string,
      /**
      * @docid dxChartOptions.commonAxisSettings.minorTick.length
      * @prevFileNamespace DevExpress.viz
      * @default 7
      */
      length?: number,
      /**
      * @docid dxChartOptions.commonAxisSettings.minorTick.opacity
      * @prevFileNamespace DevExpress.viz
      * @default 0.3
      */
      opacity?: number,
      /**
      * @docid dxChartOptions.commonAxisSettings.minorTick.shift
      * @prevFileNamespace DevExpress.viz
      * @default 3
      */
      shift?: number,
      /**
      * @docid dxChartOptions.commonAxisSettings.minorTick.visible
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      visible?: boolean,
      /**
      * @docid dxChartOptions.commonAxisSettings.minorTick.width
      * @prevFileNamespace DevExpress.viz
      * @default 1
      */
      width?: number
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.opacity
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.placeholderSize
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: {
      /**
      * @docid dxChartOptions.commonAxisSettings.tick.color
      * @prevFileNamespace DevExpress.viz
      * @default '#767676'
      */
      color?: string,
      /**
      * @docid dxChartOptions.commonAxisSettings.tick.length
      * @prevFileNamespace DevExpress.viz
      * @default 7
      */
      length?: number,
      /**
      * @docid dxChartOptions.commonAxisSettings.tick.opacity
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid dxChartOptions.commonAxisSettings.tick.shift
      * @prevFileNamespace DevExpress.viz
      * @default 3
      */
      shift?: number,
      /**
      * @docid dxChartOptions.commonAxisSettings.tick.visible
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      visible?: boolean,
      /**
      * @docid dxChartOptions.commonAxisSettings.tick.width
      * @prevFileNamespace DevExpress.viz
      * @default 1
      */
      width?: number
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.title
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: dxChartCommonAxisSettingsTitle;
    /**
     * @docid dxChartOptions.commonAxisSettings.valueMarginsEnabled
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueMarginsEnabled?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.visible
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.width
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.color
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
    dashStyle?: DashStyleType;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartCommonAxisSettingsConstantLineStyleLabel;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.paddingLeftRight
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.paddingTopBottom
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.width
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label.font
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
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartCommonAxisSettingsLabel {
    /**
     * @docid dxChartOptions.commonAxisSettings.label.template
     * @default undefined
     * @type_function_param1 data:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    template?: template | ((data: object, element: SVGGElement) => string | TElement<SVGElement>);
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
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.indentFromAxis
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
     * @docid dxChartOptions.commonAxisSettings.label.position
     * @type Enums.RelativePosition | Enums.Position
     * @default 'outside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside' | 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid dxChartOptions.commonAxisSettings.label.rotationAngle
     * @default 90
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.staggeringSpacing
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
    textOverflow?: VizTextOverflowType;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.visible
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
    wordWrap?: WordWrapType;
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
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.paddingTopBottom
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
}
export interface dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label.font
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
     * @default '#767676' [prop](color)
     * @default 16 [prop](size)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.title.margin
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
    textOverflow?: VizTextOverflowType;
    /**
     * @docid dxChartOptions.commonAxisSettings.title.wordWrap
     * @type Enums.VizWordWrap
     * @default "normal"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wordWrap?: WordWrapType;
}
export interface dxChartCommonPaneSettings {
    /**
     * @docid dxChartOptions.commonPaneSettings.backgroundColor
     * @default 'none'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxChartOptions.commonPaneSettings.border
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
      * @docid dxChartOptions.commonPaneSettings.border.bottom
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      bottom?: boolean,
      /**
      * @docid dxChartOptions.commonPaneSettings.border.color
      * @prevFileNamespace DevExpress.viz
      * @default '#d3d3d3'
      */
      color?: string,
      /**
      * @docid dxChartOptions.commonPaneSettings.border.dashStyle
      * @prevFileNamespace DevExpress.viz
      * @type Enums.DashStyle
      * @default 'solid'
      */
      dashStyle?: DashStyleType,
      /**
      * @docid dxChartOptions.commonPaneSettings.border.left
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      left?: boolean,
      /**
      * @docid dxChartOptions.commonPaneSettings.border.opacity
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid dxChartOptions.commonPaneSettings.border.right
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      right?: boolean,
      /**
      * @docid dxChartOptions.commonPaneSettings.border.top
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      top?: boolean,
      /**
      * @docid dxChartOptions.commonPaneSettings.border.visible
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      visible?: boolean,
      /**
      * @docid dxChartOptions.commonPaneSettings.border.width
      * @prevFileNamespace DevExpress.viz
      * @default 1
      */
      width?: number
    };
}
export interface dxChartCommonSeriesSettings extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartOptions.commonSeriesSettings.area
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    area?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.bar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.bubble
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bubble?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.candlestick
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    candlestick?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedarea
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedarea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedbar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedbar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedline
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedspline
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedspline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedsplinearea
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedsplinearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.line
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    line?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.rangearea
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.rangebar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangebar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.scatter
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scatter?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.spline
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    spline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.splinearea
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    splinearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedarea
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedarea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedbar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedbar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedline
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedspline
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedspline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedsplinearea
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedsplinearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.steparea
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    steparea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stepline
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stepline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stock
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
    type?: ChartSeriesType;
}
export interface dxChartLegend extends BaseChartLegend {
    /**
     * @docid dxChartOptions.legend.customizeHint
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number | string;
    /**
     * @docid dxChartOptions.panes.name
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
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    autoBreaksEnabled?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.axisDivisionFactor
     * @default 40
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxChartOptions.valueAxis.breaks
     * @inherits ScaleBreak
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    breaks?: Array<ScaleBreak>;
    /**
     * @docid dxChartOptions.valueAxis.categories
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid dxChartOptions.valueAxis.logarithmBase
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxChartOptions.valueAxis.maxAutoBreakCount
     * @default 4
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxAutoBreakCount?: number;
    /**
     * @docid dxChartOptions.valueAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minVisualRangeLength?: number | any | TimeIntervalType;
    /**
     * @docid dxChartOptions.valueAxis.minorTickCount
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxChartOptions.valueAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | TimeIntervalType;
    /**
     * @docid dxChartOptions.valueAxis.multipleAxesSpacing
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    multipleAxesSpacing?: number;
    /**
     * @docid dxChartOptions.valueAxis.name
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid dxChartOptions.valueAxis.pane
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
     * @docid dxChartOptions.valueAxis.customPosition
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customPosition?: number | Date | string;
    /**
     * @docid dxChartOptions.valueAxis.offset
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offset?: number;
    /**
     * @docid dxChartOptions.valueAxis.showZero
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    synchronizedValue?: number;
    /**
     * @docid dxChartOptions.valueAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | TimeIntervalType;
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
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.extendAxis
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.valueAxis.strips.endValue
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
export interface dxChartValueAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxChartOptions.valueAxis.strips.label.text
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxChartValueAxisTitle extends dxChartCommonAxisSettingsTitle {
    /**
     * @docid dxChartOptions.valueAxis.title.text
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
/**
 * @docid
 * @inherits BaseChart
 * @module viz/chart
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxChart extends BaseChart {
    constructor(element: TElement, options?: dxChartOptions)
    /**
     * @docid
     * @publicName getArgumentAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getArgumentAxis(): chartAxisObject;
    /**
     * @docid
     * @publicName getValueAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid
     * @publicName getValueAxis(name)
     * @param1 name:string
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValueAxis(name: string): chartAxisObject;
    /**
     * @docid
     * @publicName resetVisualRange()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resetVisualRange(): void;
    /**
     * @docid
     * @publicName zoomArgument(startValue,endValue)
     * @param1 startValue:Number|Date|string
     * @param2 endValue:Number|Date|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomArgument(startValue: number | Date | string, endValue: number | Date | string): void;
}

/**
* @docid
* @type object
* @inherits dxChartCommonAnnotationConfig
*/
export interface dxChartAnnotationConfig extends dxChartCommonAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
}

/**
* @docid
* @type object
* @inherits BaseChartAnnotationConfig
*/
export interface dxChartCommonAnnotationConfig extends BaseChartAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axis?: string;
    /**
     * @docid
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((annotation: dxChartAnnotationConfig | any) => any);
    /**
     * @docid
     * @default undefined
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    template?: template | ((annotation: dxChartAnnotationConfig | any, element: SVGGElement) => string | TElement<SVGElement>);
    /**
     * @docid
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxChartAnnotationConfig | any, element: TElement) => string | TElement);
}

/**
* @docid
* @type object
*/
export interface dxChartSeriesTypes {
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    AreaSeries?: dxChartSeriesTypesAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    BarSeries?: dxChartSeriesTypesBarSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    BubbleSeries?: dxChartSeriesTypesBubbleSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    CandleStickSeries?: dxChartSeriesTypesCandleStickSeries;
    /**
     * @docid
     * @type object
     * @hidden
     * @prevFileNamespace DevExpress.viz
     */
    CommonSeries?: dxChartSeriesTypesCommonSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedAreaSeries?: dxChartSeriesTypesFullStackedAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedBarSeries?: dxChartSeriesTypesFullStackedBarSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedLineSeries?: dxChartSeriesTypesFullStackedLineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedSplineAreaSeries?: dxChartSeriesTypesFullStackedSplineAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedSplineSeries?: dxChartSeriesTypesFullStackedSplineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    LineSeries?: dxChartSeriesTypesLineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    RangeAreaSeries?: dxChartSeriesTypesRangeAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    RangeBarSeries?: dxChartSeriesTypesRangeBarSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ScatterSeries?: dxChartSeriesTypesScatterSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    SplineAreaSeries?: dxChartSeriesTypesSplineAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    SplineSeries?: dxChartSeriesTypesSplineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedAreaSeries?: dxChartSeriesTypesStackedAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedBarSeries?: dxChartSeriesTypesStackedBarSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedLineSeries?: dxChartSeriesTypesStackedLineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedSplineAreaSeries?: dxChartSeriesTypesStackedSplineAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedSplineSeries?: dxChartSeriesTypesStackedSplineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StepAreaSeries?: dxChartSeriesTypesStepAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StepLineSeries?: dxChartSeriesTypesStepLineSeries;
    /**
     * @docid
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.BarSeries.label.customizeText
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
    direction?: HatchingDirectionType;
}
export interface dxChartSeriesTypesCandleStickSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.label.customizeText
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
    direction?: HatchingDirectionType;
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
     * @default 'arg'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.axis
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axis?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barOverlapGroup
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barOverlapGroup?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barPadding
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barPadding?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barWidth
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
     * @default 'close'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    closeValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.color
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.cornerRadius
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
    dashStyle?: DashStyleType;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.highValueField
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
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ignoreEmptyPoints?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.innerColor
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
     * @default 'low'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    lowValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.maxLabelCount
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxLabelCount?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.minBarSize
     * @default undefined
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minBarSize?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.opacity
     * @default 0.5
     * @propertyOf dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.openValueField
     * @default 'open'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    openValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.pane
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
     * @default 'val1'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeValue1Field?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.rangeValue2Field
     * @default 'val2'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeValue2Field?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.reduction
     * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    reduction?: {
      /**
      * @docid dxChartSeriesTypes.CommonSeries.reduction.color
      * @prevFileNamespace DevExpress.viz
      * @default '#ff0000'
      * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
      */
      color?: string,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.reduction.level
      * @prevFileNamespace DevExpress.viz
      * @type Enums.FinancialChartReductionLevel
      * @default 'close'
      * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
      */
      level?: 'close' | 'high' | 'low' | 'open'
    };
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
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showInLegend?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.sizeField
     * @default 'size'
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sizeField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.stack
     * @default 'default'
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stack?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.tagField
     * @default 'tag'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tagField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueErrorBar?: {
      /**
      * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.color
      * @prevFileNamespace DevExpress.viz
      * @default 'black'
      */
      color?: string,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.displayMode
      * @prevFileNamespace DevExpress.viz
      * @type Enums.ValueErrorBarDisplayMode
      * @default 'auto'
      */
      displayMode?: 'auto' | 'high' | 'low' | 'none',
      /**
      * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.edgeLength
      * @prevFileNamespace DevExpress.viz
      * @default 8
      */
      edgeLength?: number,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.highValueField
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      highValueField?: string,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.lineWidth
      * @prevFileNamespace DevExpress.viz
      * @default 2
      */
      lineWidth?: number,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.lowValueField
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      lowValueField?: string,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.opacity
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.type
      * @prevFileNamespace DevExpress.viz
      * @type Enums.ValueErrorBarType
      * @default undefined
      */
      type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance',
      /**
      * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.value
      * @prevFileNamespace DevExpress.viz
      * @default 1
      */
      value?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.valueField
     * @default 'val'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.visible
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.width
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
    dashStyle?: DashStyleType;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.visible
     * @default false
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.width
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
    dashStyle?: DashStyleType;
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
    dashStyle?: DashStyleType;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.visible
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.width
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
    direction?: HatchingDirectionType;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.opacity
     * @default 0.75
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.step
     * @default 6
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    step?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.width
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.border
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
      * @docid dxChartSeriesTypes.CommonSeries.label.border.color
      * @prevFileNamespace DevExpress.viz
      * @default  '#d3d3d3'
      */
      color?: string,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.label.border.dashStyle
      * @prevFileNamespace DevExpress.viz
      * @type Enums.DashStyle
      * @default 'solid'
      */
      dashStyle?: DashStyleType,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.label.border.visible
      * @prevFileNamespace DevExpress.viz
      * @default false
      */
      visible?: boolean,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.label.border.width
      * @prevFileNamespace DevExpress.viz
      * @default 1
      */
      width?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.connector
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    connector?: {
      /**
      * @docid dxChartSeriesTypes.CommonSeries.label.connector.color
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
      */
      color?: string,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.label.connector.visible
      * @prevFileNamespace DevExpress.viz
      * @default false
      * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
      */
      visible?: boolean,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.label.connector.width
      * @prevFileNamespace DevExpress.viz
      * @default 1
      * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
      */
      width?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.font
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
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.showForZeroValues
     * @default true
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showForZeroValues?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.verticalOffset
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalOffset?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.visible
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.border
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.border.color
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      color?: string,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.border.visible
      * @prevFileNamespace DevExpress.viz
      * @default false
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      visible?: boolean,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.border.width
      * @prevFileNamespace DevExpress.viz
      * @default 1
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      width?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.color
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
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: {
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border
      * @prevFileNamespace DevExpress.viz
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      border?: {
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.color
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        color?: string,
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.visible
        * @prevFileNamespace DevExpress.viz
        * @default true
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        visible?: boolean,
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.width
        * @prevFileNamespace DevExpress.viz
        * @default 4
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        width?: number
      },
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.color
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      color?: string,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.size
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      size?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.image
     * @default undefined
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    image?: string | {
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.image.height
      * @prevFileNamespace DevExpress.viz
      * @default 30
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      height?: number | {
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.image.height.rangeMaxPoint
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMaxPoint?: number,
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.image.height.rangeMinPoint
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMinPoint?: number
      },
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.image.url
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      url?: string | {
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.image.url.rangeMaxPoint
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMaxPoint?: string,
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.image.url.rangeMinPoint
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMinPoint?: string
      },
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.image.width
      * @prevFileNamespace DevExpress.viz
      * @default 30
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      width?: number | {
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.image.width.rangeMaxPoint
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMaxPoint?: number,
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.image.width.rangeMinPoint
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMinPoint?: number
      }
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.selectionMode
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: {
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border
      * @prevFileNamespace DevExpress.viz
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      border?: {
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.color
        * @prevFileNamespace DevExpress.viz
        * @default undefined
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        color?: string,
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.visible
        * @prevFileNamespace DevExpress.viz
        * @default true
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        visible?: boolean,
        /**
        * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.width
        * @prevFileNamespace DevExpress.viz
        * @default 4
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        width?: number
      },
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.color
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      color?: string,
      /**
      * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.size
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      size?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.size
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
    dashStyle?: DashStyleType;
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
    dashStyle?: DashStyleType;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.visible
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.width
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
    direction?: HatchingDirectionType;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.opacity
     * @default 0.5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.step
     * @default 6
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    step?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.width
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesFullStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesFullStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesFullStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesFullStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.LineSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesScatterSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.ScatterSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.SplineSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesStepAreaSeriesBorder extends dxChartSeriesTypesCommonSeriesBorder {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.border.visible
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
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxChartSeriesTypesStepAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.label.customizeText
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
    method?: ChartSingleValueSeriesAggregationMethodType;
}
export interface dxChartSeriesTypesStepLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.label.customizeText
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
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}

export type Options = dxChartOptions;

/** @deprecated use Options instead */
export type IOptions = dxChartOptions;
