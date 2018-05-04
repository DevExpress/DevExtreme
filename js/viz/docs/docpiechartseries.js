/**
* @name dxPieChartSeriesTypes
* @publicName dxPieChartSeriesTypes
* @type object
*/
/**
* @name dxPieChartSeriesTypes.CommonPieChartSeries
* @publicName CommonPieChartSeries
* @type object
* @hidden
*/
var commonPieChartSeries = {
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.color
    * @publicName color
    * @type string
    * @default undefined
    */
    color: undefined,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.minsegmentsize
    * @publicName minSegmentSize
    * @type number
    * @default undefined
    */
    minSegmentSize: undefined,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.smallvaluesgrouping
    * @publicName smallValuesGrouping
    * @type object
    */
    smallValuesGrouping: {
        /**
         * @name dxPieChartSeriesTypes.CommonPieChartSeries.smallvaluesgrouping.mode
         * @publicName mode
         * @type Enums.SmallValuesGroupingMode
         * @default 'none'
         */
        mode: 'none',
        /**
         * @name dxPieChartSeriesTypes.CommonPieChartSeries.smallvaluesgrouping.topcount
         * @publicName topCount
         * @type number
         * @default undefined
         */
        topCount: undefined,
        /**
         * @name dxPieChartSeriesTypes.CommonPieChartSeries.smallvaluesgrouping.threshold
         * @publicName threshold
         * @type number
         * @default undefined
         */
        threshold: undefined,
        /**
         * @name dxPieChartSeriesTypes.CommonPieChartSeries.smallvaluesgrouping.groupname
         * @publicName groupName
         * @type string
         * @default 'others'
         */
        groupName: 'others',
    },
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.valuefield
    * @publicName valueField
    * @type string
    * @default 'val'
    */
    valueField: 'val',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.argumentfield
    * @publicName argumentField
    * @type string
    * @default 'arg'
    */
    argumentField: 'arg',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.argumentType
    * @publicName argumentType
    * @type Enums.ChartDataType
    * @default undefined
    */
    argumentType: undefined,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.tagfield
    * @publicName tagField
    * @type string
    * @default 'tag'
    */
    tagField: 'tag',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.border
    * @publicName border
    * @type object
    */
    border: {
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.border.visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.border.width
        * @publicName width
        * @type number
        * @default 2
        */
        width: 2,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.border.color
        * @publicName color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
       * @name dxPieChartSeriesTypes.CommonPieChartSeries.border.dashstyle
       * @publicName dashStyle
       * @type Enums.DashStyle
       * @default undefined
       */
        dashStyle: undefined
    },
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.hovermode
    * @publicName hoverMode
    * @type Enums.PieChartSeriesInteractionMode
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionmode
    * @publicName selectionMode
    * @type Enums.PieChartSeriesInteractionMode
        * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle
    * @publicName hoverStyle
    * @type object
    */
    hoverStyle: {
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.color
        * @publicName color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.hatching
        * @publicName hatching
        * @type object
        */
        hatching: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.hatching.direction
            * @publicName direction
            * @type Enums.HatchingDirection
            * @default 'right'
            */
            direction: 'right',
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.hatching.width
            * @publicName width
            * @type number
            * @default 4
            */
            width: 4,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.hatching.step
            * @publicName step
            * @type number
            * @default 10
            */
            step: 10,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.hatching.opacity
            * @publicName opacity
            * @type number
            * @default 0.75
            */
            opacity: 0.75
        },
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.border.width
            * @publicName width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.border.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverstyle.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default undefined
            */
            dashStyle: undefined
        }
    },
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle
    * @publicName selectionStyle
    * @type object
    */
    selectionStyle: {
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.color
        * @publicName color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.hatching
        * @publicName hatching
        * @type object
        */
        hatching: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.hatching.direction
            * @publicName direction
            * @type Enums.HatchingDirection
            * @default 'right'
            */
            direction: 'right',
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.hatching.width
            * @publicName width
            * @type number
            * @default 4
            */
            width: 4,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.hatching.step
            * @publicName step
            * @type number
            * @default 10
            */
            step: 10,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.hatching.opacity
            * @publicName opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.border.width
            * @publicName width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.border.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionstyle.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default undefined
            */
            dashStyle: undefined
        }
    },
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.maxlabelcount
    * @publicName maxLabelCount
    * @type number
    * @default undefined
    */
    maxLabelCount: undefined,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.segmentsdirection
    * @publicName segmentsDirection
    * @type Enums.PieChartSegmentsDirection
    * @default 'clockwise'
        * @deprecated dxpiechartoptions.segmentsdirection
    */
    segmentsDirection: 'clockwise',
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.startangle
    * @publicName startAngle
    * @type number
    * @default 0
    * @deprecated dxpiechartoptions.startangle
    */
    startAngle: 0,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.innerradius
    * @publicName innerRadius
    * @type number
    * @default 0.5
    * @propertyOf dxPieChartSeriesTypes.DoughnutSeries
    * @deprecated dxpiechartoptions.innerradius
    */
    innerRadius: 0.5,
    /**
    * @name dxPieChartSeriesTypes.CommonPieChartSeries.label
    * @publicName label
    * @type object
    */
    label: {
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.rotationangle
        * @publicName rotationAngle
        * @type number
        * @default 0
        */
        rotationAngle: 0,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.radialoffset
        * @publicName radialOffset
        * @type number
        * @default 0
        */
        radialOffset: 0,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: '',
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: 0,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.argumentFormat
        * @publicName argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.argumentprecision
        * @publicName argumentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        argumentPrecision: 0,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.percentprecision
        * @publicName percentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        percentPrecision: 0,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.position
        * @publicName position
        * @type Enums.PieChartLabelPosition
        * @default 'outside'
        */
        position: 'outside',
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font.family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font.weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font.color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font.size
            * @publicName size
            * @type number|string
            * @default 14
            */
            size: 14,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.border.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.border.color
            * @publicName color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.connector
        * @publicName connector
        * @type object
        */
        connector: {
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined
        }
    }
};

/**
* @name dxPieChartSeriesTypes.DoughnutSeries
* @publicName DoughnutSeries
* @type object
* @inherits dxPieChartSeriesTypes.CommonPieChartSeries
* @hidePropertyOf
*/
var doughnutSeries = {

};

/**
* @name dxPieChartSeriesTypes.PieSeries
* @publicName PieSeries
* @type object
* @inherits dxPieChartSeriesTypes.CommonPieChartSeries
* @hidePropertyOf
*/
var pieSeries = {

};


