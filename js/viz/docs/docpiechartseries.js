/**
* @name dxPieChartSeriesTypes
* @type object
*/
/**
* @name dxPieChartSeriesTypes.CommonPieChartSeries
* @type object
* @hidden
*/
var commonPieChartSeries = {
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.color
    * @type string
    * @default undefined
    */
    color: undefined,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.minSegmentSize
    * @type number
    * @default undefined
    */
    minSegmentSize: undefined,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping
    * @type object
    */
    smallValuesGrouping: {
        /**
         * @name dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.mode
         * @type Enums.SmallValuesGroupingMode
         * @default 'none'
         */
        mode: 'none',
        /**
         * @name dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.topCount
         * @type number
         * @default undefined
         */
        topCount: undefined,
        /**
         * @name dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.threshold
         * @type number
         * @default undefined
         */
        threshold: undefined,
        /**
         * @name dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.groupName
         * @type string
         * @default 'others'
         */
        groupName: 'others',
    },
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.valueField
    * @type string
    * @default 'val'
    */
    valueField: 'val',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.argumentField
    * @type string
    * @default 'arg'
    */
    argumentField: 'arg',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.argumentType
    * @type Enums.ChartDataType
    * @default undefined
    */
    argumentType: undefined,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.tagField
    * @type string
    * @default 'tag'
    */
    tagField: 'tag',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.border
    * @type object
    */
    border: {
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.border.visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.border.width
        * @type number
        * @default 2
        */
        width: 2,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.border.color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
       * @name dxPieChartSeriesTypes.CommonPieChartSeries.border.dashStyle
       * @type Enums.DashStyle
       * @default undefined
       */
        dashStyle: undefined
    },
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverMode
    * @type Enums.PieChartSeriesInteractionMode
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionMode
    * @type Enums.PieChartSeriesInteractionMode
        * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle
    * @type object
    */
    hoverStyle: {
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching
        * @type object
        */
        hatching: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.direction
            * @type Enums.HatchingDirection
            * @default 'right'
            */
            direction: 'right',
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.width
            * @type number
            * @default 4
            */
            width: 4,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.step
            * @type number
            * @default 10
            */
            step: 10,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.opacity
            * @type number
            * @default 0.75
            */
            opacity: 0.75
        },
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border
        * @type object
        */
        border: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.dashStyle
            * @type Enums.DashStyle
            * @default undefined
            */
            dashStyle: undefined
        }
    },
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle
    * @type object
    */
    selectionStyle: {
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching
        * @type object
        */
        hatching: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.direction
            * @type Enums.HatchingDirection
            * @default 'right'
            */
            direction: 'right',
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.width
            * @type number
            * @default 4
            */
            width: 4,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.step
            * @type number
            * @default 10
            */
            step: 10,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border
        * @type object
        */
        border: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.dashStyle
            * @type Enums.DashStyle
            * @default undefined
            */
            dashStyle: undefined
        }
    },
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.maxLabelCount
    * @type number
    * @default undefined
    */
    maxLabelCount: undefined,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.segmentsDirection
    * @type Enums.PieChartSegmentsDirection
    * @default 'clockwise'
    * @deprecated dxPieChartOptions.segmentsDirection
    */
    segmentsDirection: 'clockwise',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.startAngle
    * @type number
    * @default 0
    * @deprecated dxPieChartOptions.startAngle
    */
    startAngle: 0,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.innerRadius
    * @type number
    * @default 0.5
    * @propertyOf dxPieChartSeriesTypes.DoughnutSeries
    * @deprecated dxPieChartOptions.innerRadius
    */
    innerRadius: 0.5,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.label
    * @type object
    */
    label: {
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.rotationAngle
        * @type number
        * @default 0
        */
        rotationAngle: 0,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.radialOffset
        * @type number
        * @default 0
        */
        radialOffset: 0,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.format
        * @extends CommonVizFormat
        */
        format: '',
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.precision
        * @extends CommonVizPrecision
        */
        precision: 0,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.argumentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        argumentPrecision: 0,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.percentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        percentPrecision: 0,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.position
        * @type Enums.PieChartLabelPosition
        * @default 'outside'
        */
        position: 'outside',
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font
        * @type object
        */
        font: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font.family
            * @extends CommonVizFontFamily
            */
            family: undefined,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font.weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font.color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font.size
            * @type number|string
            * @default 14
            */
            size: 14,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.border
        * @type object
        */
        border: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.border.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.border.color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.connector
        * @type object
        */
        connector: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.color
            * @type string
            * @default undefined
            */
            color: undefined
        }
    }
};

/**
* @name dxPieChartSeriesTypes.DoughnutSeries
* @type object
* @inherits dxPieChartSeriesTypes.CommonPieChartSeries
* @hidePropertyOf
*/
var doughnutSeries = {

};

/**
* @name dxPieChartSeriesTypes.PieSeries
* @type object
* @inherits dxPieChartSeriesTypes.CommonPieChartSeries
* @hidePropertyOf
*/
var pieSeries = {

};

