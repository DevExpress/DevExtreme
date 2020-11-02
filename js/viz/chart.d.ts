import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    event
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
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: any;
    /**
     * @docid
     * @type number
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
     * @type string|number|date
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalArgument?: string | number | Date;
    /**
     * @docid
     * @type string|number|date
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
     * @type object
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
     * @type any
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
     * @type number
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
     * @type any
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
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tag?: any;
    /**
     * @docid
     * @type string
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
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationInterval?: any;
    /**
     * @docid
     * @type Array<any>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    data?: Array<any>;
    /**
     * @docid
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    intervalEnd?: any;
    /**
     * @docid
     * @type any
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
     * @type chartPointAggregationInfoObject
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
     * @type number|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalCloseValue?: number | string;
    /**
     * @docid
     * @type number|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalHighValue?: number | string;
    /**
     * @docid
     * @type number|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalLowValue?: number | string;
    /**
     * @docid
     * @type string|number|date
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalMinValue?: string | number | Date;
    /**
     * @docid
     * @type number|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originalOpenValue?: number | string;
    /**
     * @docid
     * @type number|string
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
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axis?: string;
    /**
     * @docid
     * @type string
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
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pane?: string;
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stack?: string;
}

export interface dxChartOptions extends BaseChartOptions<dxChart> {
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adjustOnZoom?: boolean;
    /**
     * @docid
     * @type Array<dxChartAnnotationConfig,object>
     * @inherits dxChartOptions.commonAnnotationSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    annotations?: Array<dxChartAnnotationConfig | any>;
    /**
     * @docid
     * @inherits dxChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentAxis?: dxChartArgumentAxis;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    autoHidePointMarkers?: boolean;
    /**
     * @docid
     * @type number
     * @default 0.3
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupPadding?: number;
    /**
     * @docid
     * @type number
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAxisSettings?: dxChartCommonAxisSettings;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonPaneSettings?: dxChartCommonPaneSettings;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonSeriesSettings?: dxChartCommonSeriesSettings;
    /**
     * @docid
     * @type string
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    crosshair?: {
      /**
      * @docid
      * @default '#f05b41'
      */
      color?: string,
      /**
      * @docid
      * @type Enums.DashStyle
      * @default 'solid'
      */
      dashStyle?: DashStyleType,
      /**
      * @docid
      * @default false
      */
      enabled?: boolean,
      /**
      * @docid
      * @type object | boolean
      */
      horizontalLine?: {
        /**
        * @docid
        * @default "#f05b41"
        */
        color?: string,
        /**
        * @docid
        * @type Enums.DashStyle
        * @default 'solid'
        */
        dashStyle?: DashStyleType,
        /**
        * @docid
        * @type object
        */
        label?: {
          /**
          * @docid
          * @default "#f05b41"
          */
          backgroundColor?: string,
          /**
          * @docid
          * @type function(info)
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
           * @type Font
           * @default '#FFFFFF' [prop](color)
           */
          font?: Font,
          /**
          * @docid
          * @extends CommonVizFormat
          */
          format?: format,
          /**
           * @docid
           * @default false
           */
          visible?: boolean
        },
        /**
        * @docid
        * @default undefined
        */
        opacity?: number,
        /**
        * @docid
        * @default true
        */
        visible?: boolean,
        /**
        * @docid
        * @default 1
        */
        width?: number
      } | boolean,
      /**
      * @docid
      * @type object
      */
      label?: {
        /**
        * @docid
        * @default "#f05b41"
        */
        backgroundColor?: string,
        /**
        * @docid
        * @type function(info)
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
        * @type Font
        * @default '#FFFFFF' [prop](color)
         */
        font?: Font,
        /**
         * @docid
         * @extends CommonVizFormat
         */
        format?: format,
        /**
         * @docid
         * @default false
         */
        visible?: boolean
      },
      /**
      * @docid
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid
      * @type object | boolean
      */
      verticalLine?: {
        /**
        * @docid
        * @default "#f05b41"
        */
        color?: string,
        /**
        * @docid
        * @type Enums.DashStyle
        * @default 'solid'
        */
        dashStyle?: DashStyleType,
        /**
        * @docid
        * @type object
        */
        label?: {
          /**
          * @docid
          * @default "#f05b41"
          */
          backgroundColor?: string,
          /**
          * @docid
          * @type function(info)
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
           * @type Font
           * @default '#FFFFFF' [prop](color)
           */
          font?: Font,
          /**
          * @docid
          * @extends CommonVizFormat
          */
          format?: format,
          /**
           * @docid
           * @default false
           */
          visible?: boolean
        },
        /**
        * @docid
        * @default undefined
        */
        opacity?: number,
        /**
        * @docid
        * @default true
        */
        visible?: boolean,
        /**
        * @docid
        * @default 1
        */
        width?: number
      } | boolean,
      /**
      * @docid
      * @default 1
      */
      width?: number
    };
    /**
     * @docid
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
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataPrepareSettings?: {
      /**
      * @docid
      * @default false
      */
      checkTypeForAllData?: boolean,
      /**
      * @docid
      * @default true
      */
      convertToAxisDataType?: boolean,
      /**
      * @docid
      * @type boolean|function(a,b)
      * @type_function_param1 a:object
      * @type_function_param2 b:object
      * @type_function_return Number
      * @default true
      */
      sortingMethod?: boolean | ((a: any, b: any) => number)
    };
    /**
     * @docid
     * @type string
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    defaultPane?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxChartLegend;
    /**
     * @docid
     * @default 0.2
     * @type number
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxBubbleSize?: number;
    /**
     * @docid
     * @default 12
     * @type number
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minBubbleSize?: number;
    /**
     * @docid
     * @type boolean
     * @default false
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    negativesAsZeroes?: boolean;
    /**
     * @docid
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 argument:Date|Number|string
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onArgumentAxisClick?: ((e: { component?: dxChart, element?: dxElement, model?: any, event?: event, argument?: Date | number | string }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLegendClick?: ((e: { component?: dxChart, element?: dxElement, model?: any, event?: event, target?: chartSeriesObject }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesClick?: ((e: { component?: dxChart, element?: dxElement, model?: any, event?: event, target?: chartSeriesObject }) => any) | string;
    /**
     * @docid
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
     * @docid
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
     * @docid
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
     * @docid
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
     * @docid
     * @inherits dxChartOptions.commonPaneSettings
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    panes?: dxChartPanes | Array<dxChartPanes>;
    /**
     * @docid
     * @type boolean
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
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotated?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scrollBar?: {
      /**
      * @docid
      * @default 'gray'
      */
      color?: string,
      /**
      * @docid
      * @default 5
      */
      offset?: number,
      /**
      * @docid
      * @default undefined
      */
      opacity?: number,
      /**
       * @docid
       * @type Enums.Position
       * @default 'top'
       */
      position?: 'bottom' | 'left' | 'right' | 'top',
      /**
      * @docid
      * @default false
      */
      visible?: boolean,
      /**
      * @docid
      * @default 10
      */
      width?: number
    };
    /**
     * @docid
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
     * @docid
     * @type Enums.ChartElementSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesSelectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @type object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesTemplate?: {
      /**
      * @docid
      * @type function(seriesName)
      * @type_function_param1 seriesName:any
      * @type_function_return ChartSeries
      */
      customizeSeries?: ((seriesName: any) => ChartSeries),
      /**
      * @docid
      * @default 'series'
      */
      nameField?: string
    };
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stickyHovering?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    synchronizeMultiAxes?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxChartTooltip;
    /**
     * @docid
     * @inherits dxChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueAxis?: dxChartValueAxis | Array<dxChartValueAxis>;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    zoomAndPan?: {
      /**
      * @docid
      * @default true
      */
      allowMouseWheel?: boolean,
      /**
      * @docid
      * @default true
      */
      allowTouchGestures?: boolean,
      /**
      * @docid
      * @type Enums.ChartZoomAndPanMode
      * @default 'none'
      */
      argumentAxis?: 'both' | 'none' | 'pan' | 'zoom',
      /**
      * @docid
      * @type object
      */
      dragBoxStyle?: {
        /**
        * @docid
        * @default undefined
        */
        color?: string,
        /**
        * @docid
        * @default undefined
        */
        opacity?: number
      },
      /**
      * @docid
      * @default false
      */
      dragToZoom?: boolean,
      /**
      * @docid
      * @type Enums.EventKeyModifier
      * @default 'shift'
      */
      panKey?: 'alt' | 'ctrl' | 'meta' | 'shift',
      /**
      * @docid
      * @type Enums.ChartZoomAndPanMode
      * @default 'none'
      */
      valueAxis?: 'both' | 'none' | 'pan' | 'zoom'
    };
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettings
 * @type object
 */
export interface dxChartArgumentAxis extends dxChartCommonAxisSettings {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregateByCategory?: boolean;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationGroupWidth?: number;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregationInterval?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type Enums.ChartDataType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid
     * @type number
     * @default 70
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid
     * @default undefined
     * @inherits ScaleBreak
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    breaks?: Array<ScaleBreak>;
    /**
     * @docid
     * @type Array<number,string,Date>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLineStyle?: dxChartArgumentAxisConstantLineStyle;
    /**
     * @docid
     * @inherits dxChartCommonAxisSettings.constantLineStyle
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLines?: Array<dxChartArgumentAxisConstantLines>;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid
     * @type Array<Date, string>| Array<number>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    holidays?: Array<Date | string> | Array<number>;
    /**
     * @docid
     * @type Enums.ArgumentAxisHoverMode
     * @default 'none'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartArgumentAxisLabel;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minVisualRangeLength?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type Enums.Position
     * @default 'bottom'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customPosition?: number | Date | string;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customPositionAxis?: string;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offset?: number;
    /**
     * @docid
     * @type Array<Date, string>| Array<number>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    singleWorkdays?: Array<Date | string> | Array<number>;
    /**
     * @docid
     * @notUsedInTheme
     * @inherits dxChartCommonAxisSettings.stripStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    strips?: Array<dxChartArgumentAxisStrips>;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | TimeIntervalType;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: dxChartArgumentAxisTitle;
    /**
     * @docid
     * @type Enums.AxisScaleType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * @docid
     * @type VizRange | Array<number,string,Date>
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid
     * @type Enums.VisualRangeUpdateMode
     * @default 'auto'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * @docid
     * @type VizRange | Array<number,string,Date>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid
     * @type Array<number>
     * @default [1, 2, 3, 4, 5]
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    workWeek?: Array<number>;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    workdaysOnly?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsConstantLineStyle
 * @type object
 */
export interface dxChartArgumentAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartArgumentAxisConstantLineStyleLabel;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsConstantLineStyleLabel
 * @type object
 */
export interface dxChartArgumentAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsConstantLineStyle
 * @type object
 */
export interface dxChartArgumentAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartArgumentAxisConstantLinesLabel;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsConstantLineStyleLabel
 * @type object
 */
export interface dxChartArgumentAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsLabel
 * @type object
 */
export interface dxChartArgumentAxisLabel extends dxChartCommonAxisSettingsLabel {
    /**
     * @docid
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
     * @docid
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
     * @docid
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsStripStyle
 * @type object
 */
export interface dxChartArgumentAxisStrips extends dxChartCommonAxisSettingsStripStyle {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartArgumentAxisStripsLabel;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsStripStyleLabel
 * @type object
 */
export interface dxChartArgumentAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsTitle
 * @type object
 */
export interface dxChartArgumentAxisTitle extends dxChartCommonAxisSettingsTitle {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartCommonAxisSettings {
    /**
     * @docid
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDecimals?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    breakStyle?: {
      /**
      * @docid
      * @type string
      * @default "#ababab"
      */
      color?: string,
      /**
      * @docid
      * @type Enums.ScaleBreakLineStyle
      * @default "waved"
      */
      line?: 'straight' | 'waved',
      /**
      * @docid
      * @type number
      * @default 5
      */
      width?: number
    };
    /**
     * @docid
     * @type string
     * @default '#767676'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLineStyle?: dxChartCommonAxisSettingsConstantLineStyle;
    /**
     * @docid
     * @type Enums.DiscreteAxisDivisionMode
     * @default 'betweenLabels'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
    /**
     * @docid
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    grid?: {
      /**
      * @docid
      * @type string
      * @default '#d3d3d3'
      */
      color?: string,
      /**
      * @docid
      * @type number
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid
      * @type boolean
      * @default false
      */
      visible?: boolean,
      /**
      * @docid
      * @type number
      * @default 1
      */
      width?: number
    };
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    inverted?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartCommonAxisSettingsLabel;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxValueMargin?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minValueMargin?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorGrid?: {
      /**
      * @docid
      * @type string
      * @default '#d3d3d3'
      */
      color?: string,
      /**
      * @docid
      * @type number
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid
      * @type boolean
      * @default false
      */
      visible?: boolean,
      /**
      * @docid
      * @type number
      * @default 1
      */
      width?: number
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: {
      /**
      * @docid
      * @type string
      * @default '#767676'
      */
      color?: string,
      /**
      * @docid
      * @type number
      * @default 7
      */
      length?: number,
      /**
      * @docid
      * @type number
      * @default 0.3
      */
      opacity?: number,
      /**
      * @docid
      * @type number
      * @default 3
      */
      shift?: number,
      /**
      * @docid
      * @type boolean
      * @default false
      */
      visible?: boolean,
      /**
      * @docid
      * @type number
      * @default 1
      */
      width?: number
    };
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @type number
     * @default null
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    placeholderSize?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stripStyle?: dxChartCommonAxisSettingsStripStyle;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: {
      /**
      * @docid
      * @type string
      * @default '#767676'
      */
      color?: string,
      /**
      * @docid
      * @type number
      * @default 7
      */
      length?: number,
      /**
      * @docid
      * @type number
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid
      * @type number
      * @default 3
      */
      shift?: number,
      /**
      * @docid
      * @type boolean
      * @default true
      */
      visible?: boolean,
      /**
      * @docid
      * @type number
      * @default 1
      */
      width?: number
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: dxChartCommonAxisSettingsTitle;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueMarginsEnabled?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid
     * @type string
     * @default '#000000'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.DashStyle
     * @default 'solid'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartCommonAxisSettingsConstantLineStyleLabel;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @type Enums.RelativePosition
     * @default 'inside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartCommonAxisSettingsLabel {
    /**
     * @docid
     * @type template|function
     * @default undefined
     * @type_function_param1 data:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    template?: template | ((data: object, element: SVGGElement) => string | SVGElement | JQuery);
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type Enums.ChartLabelDisplayMode
     * @default 'standard'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayMode?: 'rotate' | 'stagger' | 'standard';
    /**
     * @docid
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indentFromAxis?: number;
    /**
     * @docid
     * @type Enums.OverlappingBehavior
     * @default 'hide'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    overlappingBehavior?: 'rotate' | 'stagger' | 'none' | 'hide';
    /**
     * @docid
     * @type Enums.RelativePosition | Enums.Position
     * @default 'outside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside' | 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid
     * @type number
     * @default 90
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid
     * @type number
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    staggeringSpacing?: number;
    /**
     * @docid
     * @type Enums.VizTextOverflow
     * @default "none"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    textOverflow?: VizTextOverflowType;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type Enums.VizWordWrap
     * @default "normal"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wordWrap?: WordWrapType;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartCommonAxisSettingsStripStyle {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartCommonAxisSettingsStripStyleLabel;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid
     * @type number
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'left'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type Enums.VerticalAlignment
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartCommonAxisSettingsTitle {
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type Font
     * @default '#767676' [prop](color)
     * @default 16 [prop](size)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @type number
     * @default 6
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number;
    /**
     * @docid
     * @type Enums.VizTextOverflow
     * @default "ellipsis"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    textOverflow?: VizTextOverflowType;
    /**
     * @docid
     * @type Enums.VizWordWrap
     * @default "normal"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wordWrap?: WordWrapType;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartCommonPaneSettings {
    /**
     * @docid
     * @type string
     * @default 'none'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
      * @docid
      * @type boolean
      * @default true
      */
      bottom?: boolean,
      /**
      * @docid
      * @type string
      * @default '#d3d3d3'
      */
      color?: string,
      /**
      * @docid
      * @type Enums.DashStyle
      * @default 'solid'
      */
      dashStyle?: DashStyleType,
      /**
      * @docid
      * @type boolean
      * @default true
      */
      left?: boolean,
      /**
      * @docid
      * @type number
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid
      * @type boolean
      * @default true
      */
      right?: boolean,
      /**
      * @docid
      * @type boolean
      * @default true
      */
      top?: boolean,
      /**
      * @docid
      * @type boolean
      * @default false
      */
      visible?: boolean,
      /**
      * @docid
      * @type number
      * @default 1
      */
      width?: number
    };
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartCommonSeriesSettings extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    area?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bar?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bubble?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    candlestick?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedarea?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedbar?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedline?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedspline?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    fullstackedsplinearea?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    line?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangearea?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangebar?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scatter?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    spline?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    splinearea?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedarea?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedbar?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedline?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedspline?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedsplinearea?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    steparea?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stepline?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stock?: any;
    /**
     * @docid
     * @type Enums.SeriesType
     * @default 'line'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: ChartSeriesType;
}
/**
 * @docid
 * @hidden
 * @inherits BaseChartLegend
 * @type object
 */
export interface dxChartLegend extends BaseChartLegend {
    /**
     * @docid
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
     * @docid
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
     * @docid
     * @type Enums.ChartLegendHoverMode
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'excludePoints' | 'includePoints' | 'none';
    /**
     * @docid
     * @type Enums.RelativePosition
     * @default 'outside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonPaneSettings
 * @type object
 */
export interface dxChartPanes extends dxChartCommonPaneSettings {
    /**
     * @docid
     * @type number|string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number | string;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
}
/**
 * @docid
 * @hidden
 * @inherits BaseChartTooltip
 * @type object
 */
export interface dxChartTooltip extends BaseChartTooltip {
    /**
     * @docid
     * @type Enums.ChartTooltipLocation
     * @default 'center'
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    location?: 'center' | 'edge';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettings
 * @type object
 */
export interface dxChartValueAxis extends dxChartCommonAxisSettings {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    autoBreaksEnabled?: boolean;
    /**
     * @docid
     * @type number
     * @default 40
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid
     * @inherits ScaleBreak
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    breaks?: Array<ScaleBreak>;
    /**
     * @docid
     * @type Array<number,string,Date>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLineStyle?: dxChartValueAxisConstantLineStyle;
    /**
     * @docid
     * @notUsedInTheme
     * @inherits dxChartCommonAxisSettings.constantLineStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLines?: Array<dxChartValueAxisConstantLines>;
    /**
     * @docid
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartValueAxisLabel;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid
     * @type numeric
     * @default 4
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxAutoBreakCount?: number;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minVisualRangeLength?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type number
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    multipleAxesSpacing?: number;
    /**
     * @docid
     * @type string
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pane?: string;
    /**
     * @docid
     * @type Enums.Position
     * @default 'left'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customPosition?: number | Date | string;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offset?: number;
    /**
     * @docid
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showZero?: boolean;
    /**
     * @docid
     * @notUsedInTheme
     * @inherits dxChartCommonAxisSettings.stripStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    strips?: Array<dxChartValueAxisStrips>;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    synchronizedValue?: number;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | TimeIntervalType;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: dxChartValueAxisTitle;
    /**
     * @docid
     * @type Enums.AxisScaleType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * @docid
     * @type Enums.ChartDataType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid
     * @type VizRange | Array<number,string,Date>
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid
     * @type Enums.VisualRangeUpdateMode
     * @default 'auto'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * @docid
     * @type VizRange | Array<number,string,Date>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsConstantLineStyle
 * @type object
 */
export interface dxChartValueAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartValueAxisConstantLineStyleLabel;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsConstantLineStyleLabel
 * @type object
 */
export interface dxChartValueAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'left'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsConstantLineStyle
 * @type object
 */
export interface dxChartValueAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartValueAxisConstantLinesLabel;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsConstantLineStyleLabel
 * @type object
 */
export interface dxChartValueAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'left'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsLabel
 * @type object
 */
export interface dxChartValueAxisLabel extends dxChartCommonAxisSettingsLabel {
    /**
     * @docid
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
     * @docid
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
     * @docid
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsStripStyle
 * @type object
 */
export interface dxChartValueAxisStrips extends dxChartCommonAxisSettingsStripStyle {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartValueAxisStripsLabel;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsStripStyleLabel
 * @type object
 */
export interface dxChartValueAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartCommonAxisSettingsTitle
 * @type object
 */
export interface dxChartValueAxisTitle extends dxChartCommonAxisSettingsTitle {
    /**
     * @docid
     * @type string
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
    constructor(element: Element, options?: dxChartOptions)
    constructor(element: JQuery, options?: dxChartOptions)
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
     * @type string
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
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axis?: string;
    /**
     * @docid
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
     * @docid
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
     * @docid
     * @type template|function(annotation, element)
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxChartAnnotationConfig | any, element: dxElement) => string | Element | JQuery);
}

/**
* @docid
* @type object
*/
export interface dxChartSeriesTypes {
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    AreaSeries?: dxChartSeriesTypesAreaSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    BarSeries?: dxChartSeriesTypesBarSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    BubbleSeries?: dxChartSeriesTypesBubbleSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    CandleStickSeries?: dxChartSeriesTypesCandleStickSeries;
    /**
     * @docid
     * @hidden
     * @prevFileNamespace DevExpress.viz
     */
    CommonSeries?: dxChartSeriesTypesCommonSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedAreaSeries?: dxChartSeriesTypesFullStackedAreaSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedBarSeries?: dxChartSeriesTypesFullStackedBarSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedLineSeries?: dxChartSeriesTypesFullStackedLineSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedSplineAreaSeries?: dxChartSeriesTypesFullStackedSplineAreaSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    FullStackedSplineSeries?: dxChartSeriesTypesFullStackedSplineSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    LineSeries?: dxChartSeriesTypesLineSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    RangeAreaSeries?: dxChartSeriesTypesRangeAreaSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    RangeBarSeries?: dxChartSeriesTypesRangeBarSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ScatterSeries?: dxChartSeriesTypesScatterSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    SplineAreaSeries?: dxChartSeriesTypesSplineAreaSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    SplineSeries?: dxChartSeriesTypesSplineSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedAreaSeries?: dxChartSeriesTypesStackedAreaSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedBarSeries?: dxChartSeriesTypesStackedBarSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedLineSeries?: dxChartSeriesTypesStackedLineSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedSplineAreaSeries?: dxChartSeriesTypesStackedSplineAreaSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StackedSplineSeries?: dxChartSeriesTypesStackedSplineSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StepAreaSeries?: dxChartSeriesTypesStepAreaSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StepLineSeries?: dxChartSeriesTypesStepLineSeries;
    /**
     * @docid
     * @inherits dxChartSeriesTypes.CommonSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    StockSeries?: dxChartSeriesTypesStockSeries;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesAreaSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesAreaSeriesLabel;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesAreaSeriesPoint;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesPoint
 * @type object
 */
export interface dxChartSeriesTypesAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesBarSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesBarSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'sum'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesBubbleSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesBubbleSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesBubbleSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesBubbleSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartBubbleSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'custom';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesBubbleSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesCandleStickSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesCandleStickSeriesAggregation;
    /**
     * @docid
     * @type string
     * @default 'date'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: dxChartSeriesTypesCandleStickSeriesHoverStyle;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesCandleStickSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: dxChartSeriesTypesCandleStickSeriesSelectionStyle;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesCandleStickSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartFinancialSeriesAggregationMethod
     * @default 'ohlc'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'ohlc' | 'custom';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesHoverStyle
 * @type object
 */
export interface dxChartSeriesTypesCandleStickSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hatching?: dxChartSeriesTypesCandleStickSeriesHoverStyleHatching;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesHoverStyleHatching
 * @type object
 */
export interface dxChartSeriesTypesCandleStickSeriesHoverStyleHatching extends dxChartSeriesTypesCommonSeriesHoverStyleHatching {
    /**
     * @docid
     * @default 'none'
     * @type Enums.HatchingDirection
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    direction?: HatchingDirectionType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesCandleStickSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesSelectionStyle
 * @type object
 */
export interface dxChartSeriesTypesCandleStickSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hatching?: dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesSelectionStyleHatching
 * @type object
 */
export interface dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching extends dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
    /**
     * @docid
     * @default 'none'
     * @type Enums.HatchingDirection
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    direction?: HatchingDirectionType;
}
/**
 * @docid
 * @type object
 * @hidden
 */
export interface dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesCommonSeriesAggregation;
    /**
     * @docid
     * @type string
     * @default 'arg'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axis?: string;
    /**
     * @docid
     * @type string
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barOverlapGroup?: string;
    /**
     * @docid
     * @type number
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barPadding?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barWidth?: number;
    /**
     * @docid
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesCommonSeriesBorder;
    /**
     * @docid
     * @type string
     * @default 'close'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    closeValueField?: string;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type number
     * @default 0
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    cornerRadius?: number;
    /**
     * @docid
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid
     * @type string
     * @default 'high'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    highValueField?: string;
    /**
     * @docid
     * @type Enums.ChartSeriesHoverMode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: dxChartSeriesTypesCommonSeriesHoverStyle;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ignoreEmptyPoints?: boolean;
    /**
     * @docid
     * @type string
     * @default '#ffffff'
     * @propertyOf dxChartSeriesTypes.CandleStickSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    innerColor?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesCommonSeriesLabel;
    /**
     * @docid
     * @type string
     * @default 'low'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    lowValueField?: string;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxLabelCount?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minBarSize?: number;
    /**
     * @docid
     * @type number
     * @default 0.5
     * @propertyOf dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @type string
     * @default 'open'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    openValueField?: string;
    /**
     * @docid
     * @type string
     * @default 'default'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pane?: string;
    /**
     * @docid
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesCommonSeriesPoint;
    /**
     * @docid
     * @type string
     * @default 'val1'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeValue1Field?: string;
    /**
     * @docid
     * @type string
     * @default 'val2'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeValue2Field?: string;
    /**
     * @docid
     * @type object
     * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    reduction?: {
      /**
      * @docid
      * @type string
      * @default '#ff0000'
      * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
      */
      color?: string,
      /**
      * @docid
      * @type Enums.FinancialChartReductionLevel
      * @default 'close'
      * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
      */
      level?: 'close' | 'high' | 'low' | 'open'
    };
    /**
     * @docid
     * @type Enums.ChartSeriesSelectionMode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: dxChartSeriesTypesCommonSeriesSelectionStyle;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showInLegend?: boolean;
    /**
     * @docid
     * @type string
     * @default 'size'
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sizeField?: string;
    /**
     * @docid
     * @type string
     * @default 'default'
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stack?: string;
    /**
     * @docid
     * @type string
     * @default 'tag'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tagField?: string;
    /**
     * @docid
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueErrorBar?: {
      /**
      * @docid
      * @type string
      * @default 'black'
      */
      color?: string,
      /**
      * @docid
      * @type Enums.ValueErrorBarDisplayMode
      * @default 'auto'
      */
      displayMode?: 'auto' | 'high' | 'low' | 'none',
      /**
      * @docid
      * @type number
      * @default 8
      */
      edgeLength?: number,
      /**
      * @docid
      * @type string
      * @default undefined
      */
      highValueField?: string,
      /**
      * @docid
      * @type number
      * @default 2
      */
      lineWidth?: number,
      /**
      * @docid
      * @type string
      * @default undefined
      */
      lowValueField?: string,
      /**
      * @docid
      * @type number
      * @default undefined
      */
      opacity?: number,
      /**
      * @docid
      * @type Enums.ValueErrorBarType
      * @default undefined
      */
      type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance',
      /**
      * @docid
      * @type number
      * @default 1
      */
      value?: number
    };
    /**
     * @docid
     * @type string
     * @default 'val'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default 2
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
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
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @type Enums.ChartSeriesAggregationMethod
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'ohlc' | 'range' | 'sum' | 'custom';
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartSeriesTypesCommonSeriesBorder {
    /**
     * @docid
     * @type string
     * @default undefined
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.DashStyle
     * @default undefined
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid
     * @type boolean
     * @default false
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default 2
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * @docid
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesCommonSeriesHoverStyleBorder;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hatching?: dxChartSeriesTypesCommonSeriesHoverStyleHatching;
    /**
     * @docid
     * @type number
     * @default 3
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartSeriesTypesCommonSeriesHoverStyleBorder {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.DashStyle
     * @default 'solid'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default 3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartSeriesTypesCommonSeriesHoverStyleHatching {
    /**
     * @docid
     * @type Enums.HatchingDirection
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    direction?: HatchingDirectionType;
    /**
     * @docid
     * @type number
     * @default 0.75
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @type number
     * @default 6
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    step?: number;
    /**
     * @docid
     * @type number
     * @default 2
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentFormat?: format;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
      * @docid
      * @type string
      * @default  '#d3d3d3'
      */
      color?: string,
      /**
      * @docid
      * @type Enums.DashStyle
      * @default 'solid'
      */
      dashStyle?: DashStyleType,
      /**
      * @docid
      * @type boolean
      * @default false
      */
      visible?: boolean,
      /**
      * @docid
      * @type number
      * @default 1
      */
      width?: number
    };
    /**
     * @docid
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    connector?: {
      /**
      * @docid
      * @type string
      * @default undefined
      * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
      */
      color?: string,
      /**
      * @docid
      * @type boolean
      * @default false
      * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
      */
      visible?: boolean,
      /**
      * @docid
      * @type number
      * @default 1
      * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
      */
      width?: number
    };
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid
     * @type Font
     * @default '#FFFFFF' [prop](color)
     * @default 14 [prop](size)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalOffset?: number;
    /**
     * @docid
     * @type Enums.RelativePosition
     * @default 'outside'
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid
     * @type boolean
     * @default true
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showForZeroValues?: boolean;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalOffset?: number;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid
     * @type object
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
      * @docid
      * @type string
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      color?: string,
      /**
      * @docid
      * @type boolean
      * @default false
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      visible?: boolean,
      /**
      * @docid
      * @type number
      * @default 1
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      width?: number
    };
    /**
     * @docid
     * @type string
     * @default undefined
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid
     * @type object
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: {
      /**
      * @docid
      * @type object
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      border?: {
        /**
        * @docid
        * @type string
        * @default undefined
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        color?: string,
        /**
        * @docid
        * @type boolean
        * @default true
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        visible?: boolean,
        /**
        * @docid
        * @type number
        * @default 4
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        width?: number
      },
      /**
      * @docid
      * @type string
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      color?: string,
      /**
      * @docid
      * @type number
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      size?: number
    };
    /**
     * @docid
     * @type string|object
     * @default undefined
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    image?: string | {
      /**
      * @docid
      * @type number|object
      * @default 30
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      height?: number | {
        /**
        * @docid
        * @type number
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMaxPoint?: number,
        /**
       * @docid
       * @type number
       * @default undefined
       * @propertyOf dxChartSeriesTypes.RangeAreaSeries
       */
        rangeMinPoint?: number
      },
      /**
      * @docid
      * @type string|object
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      url?: string | {
        /**
        * @docid
        * @type string
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMaxPoint?: string,
        /**
        * @docid
        * @type string
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMinPoint?: string
      },
      /**
      * @docid
      * @type number|object
      * @default 30
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      width?: number | {
        /**
        * @docid
        * @type number
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMaxPoint?: number,
        /**
        * @docid
        * @type number
        * @default undefined
        * @propertyOf dxChartSeriesTypes.RangeAreaSeries
        */
        rangeMinPoint?: number
      }
    };
    /**
     * @docid
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid
     * @type object
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: {
      /**
      * @docid
      * @type object
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      border?: {
        /**
        * @docid
        * @type string
        * @default undefined
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        color?: string,
        /**
        * @docid
        * @type boolean
        * @default true
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        visible?: boolean,
        /**
        * @docid
        * @type number
        * @default 4
        * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
        */
        width?: number
      },
      /**
      * @docid
      * @type string
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      color?: string,
      /**
      * @docid
      * @type number
      * @default undefined
      * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
      */
      size?: number
    };
    /**
     * @docid
     * @type number
     * @default 12
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number;
    /**
     * @docid
     * @type Enums.PointSymbol
     * @default 'circle'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';
    /**
     * @docid
     * @type boolean
     * @default true
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * @docid
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesCommonSeriesSelectionStyleBorder;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.BubbleSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hatching?: dxChartSeriesTypesCommonSeriesSelectionStyleHatching;
    /**
     * @docid
     * @type number
     * @default 3
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.DashStyle
     * @default 'solid'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default 3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 * @type object
 */
export interface dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
    /**
     * @docid
     * @type Enums.HatchingDirection
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    direction?: HatchingDirectionType;
    /**
     * @docid
     * @type number
     * @default 0.5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @type number
     * @default 6
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    step?: number;
    /**
     * @docid
     * @type number
     * @default 2
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesFullStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedAreaSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesFullStackedAreaSeriesLabel;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesFullStackedAreaSeriesPoint;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesFullStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesFullStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesPoint
 * @type object
 */
export interface dxChartSeriesTypesFullStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesFullStackedBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedBarSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesFullStackedBarSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesFullStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'sum'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesFullStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid
     * @type Enums.RelativePosition
     * @default 'inside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesFullStackedLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedLineSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesFullStackedLineSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesFullStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesFullStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesFullStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesFullStackedSplineAreaSeriesLabel;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesFullStackedSplineAreaSeriesPoint;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesPoint
 * @type object
 */
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesFullStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedSplineSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesFullStackedSplineSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesFullStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesFullStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesLineSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesLineSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesRangeAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesRangeAreaSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesRangeAreaSeriesLabel;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesRangeAreaSeriesPoint;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesRangeAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartRangeSeriesAggregationMethod
     * @default 'range'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'range' | 'custom';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesRangeAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesPoint
 * @type object
 */
export interface dxChartSeriesTypesRangeAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesRangeBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesRangeBarSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesRangeBarSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesRangeBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartRangeSeriesAggregationMethod
     * @default 'range'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'range' | 'custom';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesRangeBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesScatterSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesScatterSeriesAggregation;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesScatterSeriesLabel;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesScatterSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesScatterSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesSplineAreaSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesSplineAreaSeriesLabel;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesSplineAreaSeriesPoint;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesPoint
 * @type object
 */
export interface dxChartSeriesTypesSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesSplineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesSplineSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesSplineSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedAreaSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStackedAreaSeriesLabel;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesStackedAreaSeriesPoint;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesPoint
 * @type object
 */
export interface dxChartSeriesTypesStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesStackedBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedBarSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStackedBarSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'sum'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid
     * @type Enums.RelativePosition
     * @default 'inside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesStackedLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedLineSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStackedLineSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedSplineAreaSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStackedSplineAreaSeriesLabel;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesStackedSplineAreaSeriesPoint;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesPoint
 * @type object
 */
export interface dxChartSeriesTypesStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedSplineSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStackedSplineSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesStepAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStepAreaSeriesAggregation;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesStepAreaSeriesBorder;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: dxChartSeriesTypesStepAreaSeriesHoverStyle;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStepAreaSeriesLabel;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxChartSeriesTypesStepAreaSeriesPoint;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: dxChartSeriesTypesStepAreaSeriesSelectionStyle;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesStepAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesBorder
 * @type object
 */
export interface dxChartSeriesTypesStepAreaSeriesBorder extends dxChartSeriesTypesCommonSeriesBorder {
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesHoverStyle
 * @type object
 */
export interface dxChartSeriesTypesStepAreaSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesStepAreaSeriesHoverStyleBorder;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesHoverStyleBorder
 * @type object
 */
export interface dxChartSeriesTypesStepAreaSeriesHoverStyleBorder extends dxChartSeriesTypesCommonSeriesHoverStyleBorder {
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesStepAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesPoint
 * @type object
 */
export interface dxChartSeriesTypesStepAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesSelectionStyle
 * @type object
 */
export interface dxChartSeriesTypesStepAreaSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesSelectionStyleBorder
 * @type object
 */
export interface dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder extends dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesStepLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStepLineSeriesAggregation;
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStepLineSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesStepLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesStepLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeries
 * @type object
 */
export interface dxChartSeriesTypesStockSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    aggregation?: dxChartSeriesTypesStockSeriesAggregation;
    /**
     * @docid
     * @type string
     * @default 'date'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxChartSeriesTypesStockSeriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesAggregation
 * @type object
 */
export interface dxChartSeriesTypesStockSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid
     * @type Enums.ChartFinancialSeriesAggregationMethod
     * @default 'ohlc'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    method?: 'ohlc' | 'custom';
}
/**
 * @docid
 * @hidden
 * @inherits dxChartSeriesTypesCommonSeriesLabel
 * @type object
 */
export interface dxChartSeriesTypesStockSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid
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
