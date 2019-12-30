/**
 * @name PolarChartSeries
 * @type object
 * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
 */
const polarChartSeries = {
    /**
    * @name PolarChartSeries.name
    * @type string
    * @default undefined
    */
    name: undefined,
    /**
    * @name PolarChartSeries.tag
    * @type any
    * @default undefined
    */
    tag: undefined,
    /**
    * @name PolarChartSeries.type
    * @type Enums.PolarChartSeriesType
    * @default 'scatter'
    */
    type: 'scatter'
};

/**
* @name dxPolarChartSeriesTypes
* @type object
*/
/**
* @name dxPolarChartSeriesTypes.CommonPolarChartSeries
* @type object
* @hidden
*/
const CommonPolarChartSeries = {
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.color
    * @type string
    * @default undefined
    */
    color: undefined,
    /**
     * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.closed
     * @type boolean
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.linepolarseries
     */
    closed: true,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.visible
    * @type boolean
    * @default true
    */
    visible: true,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.opacity
    * @type number
    * @default 0.5
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries
    */
    opacity: 0.5,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.width
    * @type number
    * @default 2
    * @propertyOf dxPolarChartSeriesTypes.linepolarseries
    */
    width: 2,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.dashStyle
    * @type Enums.DashStyle
    * @default 'solid'
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries
    */
    dashStyle: 'solid',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.stack
    * @type string
    * @default 'default'
    * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    stack: 'default',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.axis
    * @type string
    * @default undefined
    * @hidden
    */
    axis: undefined,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueField
    * @type string
    * @default 'val'
    * @notUsedInTheme
    */
    valueField: 'val',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.argumentField
    * @type string
    * @default 'arg'
    * @notUsedInTheme
    */
    argumentField: 'arg',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.tagField
    * @type string
    * @default 'tag'
    * @notUsedInTheme
    */
    tagField: 'tag',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border
    * @type object
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    border: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border.visible
        * @type boolean
        * @default false
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        visible: false,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border.width
        * @type number
        * @default 2
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        width: 2,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border.color
        * @type string
        * @default undefined
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        color: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border.dashStyle
        * @type Enums.DashStyle
        * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        dashStyle: undefined
    },
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverMode
    * @type Enums.ChartSeriesHoverMode
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
        */
    hoverMode: 'nearestPoint',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionMode
    * @type Enums.ChartSeriesSelectionMode
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
        */
    selectionMode: 'includePoints',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
    * @type object
    */
    hoverStyle: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.width
        * @type number
        * @default 3
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries
        */
        width: 3,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries
        */
        dashStyle: 'solid',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        hatching: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.direction
            * @type Enums.HatchingDirection
            * @default 'none'
            */
            direction: 'right',
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.step
            * @type number
            * @default 6
            */
            step: 6,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.opacity
            * @type number
            * @default 0.75
            */
            opacity: 0.75
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        border: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
                    */
            dashStyle: 'solid'
        }
    },
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
    * @type object
    */
    selectionStyle: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.width
        * @type number
        * @default 3
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries
        */
        width: 3,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries
        */
        dashStyle: 'solid',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        hatching: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.direction
            * @type Enums.HatchingDirection
            * @default 'none'
            */
            direction: 'right',
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.step
            * @type number
            * @default 6
            */
            step: 6,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        border: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
                    */
            dashStyle: 'solid'
        }
    },
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point
    * @type object
    * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
    */
    point: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverMode
        * @type Enums.ChartPointInteractionMode
                * @default 'onlyPoint'
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        hoverMode: 'onlyPoint',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionMode
        * @type Enums.ChartPointInteractionMode
                * @default 'onlyPoint'
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        selectionMode: 'onlyPoint',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.color
        * @type string
        * @default undefined
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        color: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.visible
        * @type boolean
        * @default true
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        visible: true,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.symbol
        * @type Enums.VizPointSymbol
        * @default 'circle'
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        symbol: 'circle',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image
        * @type string|object
        * @default undefined
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        image: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.url
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            url: undefined,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.width
            * @type number
            * @default 30
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            width: 30,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.height
            * @type number
            * @default 30
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            height: 30,
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        border: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.visible
            * @type boolean
            * @default false
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.width
            * @type number
            * @default 1
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            width: 1,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.color
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            color: undefined
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.size
        * @type number
        * @default 12
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        size: 12,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        hoverStyle: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.color
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            color: undefined,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border
            * @type object
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            border: {
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.visible
                * @type boolean
                * @default true
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                visible: true,
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.width
                * @type number
                * @default 4
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                width: 4,
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.color
                * @type string
                * @default undefined
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                color: undefined
            },
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.size
            * @type number
            * @default 12
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            size: 12
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        selectionStyle: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.color
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            color: undefined,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border
            * @type object
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            border: {
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.visible
                * @type boolean
                * @default true
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                visible: true,
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.width
                * @type number
                * @default 4
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                width: 4,
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.color
                * @type string
                * @default undefined
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                color: undefined
            },
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.size
            * @type number
            * @default 12
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            size: 12
        }
    },
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.showInLegend
    * @type boolean
    * @default true
    */
    showInLegend: true,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.maxLabelCount
    * @type number
    * @default undefined
    */
    maxLabelCount: undefined,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.minBarSize
    * @type number
    * @default undefined
    * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.barpolarseries
        */
    minBarSize: undefined,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreEmptyPoints
    * @type boolean
    * @default false
        */
    ignoreEmptyPoints: false,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.barPadding
    * @type number
    * @default undefined
    * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    barPadding: undefined,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.barWidth
    * @type number
    * @default undefined
    * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    barWidth: undefined,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.showForZeroValues
        * @type boolean
        * @default true
        * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        showForZeroValues: true,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.rotationAngle
        * @type number
        * @default 0
        */
        rotationAngle: 0,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.format
        * @extends CommonVizFormat
        */
        format: '',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.position
        * @type Enums.RelativePosition
        * @default 'outside'
        * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        position: 'outside',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font
        * @type Font
        * @default '#FFFFFF' @prop color
        * @default 14 @prop size
        */
        font: {
            family: undefined,
            weight: 400,
            color: '#FFFFFF',
            size: 14,
            opacity: undefined
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border
        * @type object
        */
        border: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        connector: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.visible
            * @type boolean
            * @default false
            * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.width
            * @type number
            * @default 1
            * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
            */
            width: 1,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.color
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
            */
            color: undefined
        }
    },
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar
    * @type object
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries
    */
    valueErrorBar: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.displayMode
        * @type Enums.ValueErrorBarDisplayMode
        * @default 'auto'
        */
        displayMode: 'auto',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.lowValueField
        * @type string
        * @default undefined
        */
        lowValueField: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.highValueField
        * @type string
        * @default undefined
        */
        highValueField: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.type
        * @type Enums.ValueErrorBarType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.value
        * @type number
        * @default 1
        */
        value: 1,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.color
        * @type string
        * @default black
        */
        color: 'black',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.lineWidth
        * @type number
        * @default 2
        */
        lineWidth: 2,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.edgeLength
        * @type number
        * @default 8
        */
        edgeLength: 8,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.opacity
        * @type number
        * @default undefined
        */
        opacity: undefined
    }
};

/**
* @name dxPolarChartSeriesTypes.areapolarseries
* @publicName AreaSeries
* @type object
* @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
*/
const areaPolarSeries = {
    /**
    * @name dxPolarChartSeriesTypes.areapolarseries.point
    * @type object
    */
    point: {
        /**
        * @name dxPolarChartSeriesTypes.areapolarseries.point.visible
        * @type boolean
        * @default false
        */
        visible: false
    },
    /**
    * @name dxPolarChartSeriesTypes.areapolarseries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxPolarChartSeriesTypes.areapolarseries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints'
};

/**
* @name dxPolarChartSeriesTypes.barpolarseries
* @publicName BarSeries
* @type object
* @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
*/
const barPolarSeries = {
    /**
    * @name dxPolarChartSeriesTypes.barpolarseries.hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxPolarChartSeriesTypes.barpolarseries.selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint'
};
/**
* @name dxPolarChartSeriesTypes.linepolarseries
* @publicName LineSeries
* @type object
* @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
*/
const linePolarSeries = {
    /**
    * @name dxPolarChartSeriesTypes.linepolarseries.hoverMode
    * @type string
    * @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
    * @default 'excludePoints'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxPolarChartSeriesTypes.linepolarseries.selectionMode
    * @type string
    * @acceptValues 'includePoints' | 'excludePoints' | 'none'
    * @default 'includePoints'
    */
    selectionMode: 'includePoints'
};

/**
* @name dxPolarChartSeriesTypes.scatterpolarseries
* @publicName ScatterSeries
* @type object
* @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
*/
const scatterPolarSeries = {};
/**
* @name dxPolarChartSeriesTypes.stackedbarpolarseries
* @publicName StackedBarSeries
* @type object
* @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
*/
const stackedbarPolarSeries = {
    /**
    * @name dxPolarChartSeriesTypes.stackedbarpolarseries.label
    * @type object
    */
    /**
    * @name dxPolarChartSeriesTypes.stackedbarpolarseries.label.position
    * @type Enums.RelativePosition
    * @default 'inside'
    */
    /**
    * @name dxPolarChartSeriesTypes.stackedbarpolarseries.hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxPolarChartSeriesTypes.stackedbarpolarseries.selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint'
};
