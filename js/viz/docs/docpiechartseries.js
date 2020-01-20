/**
 * @name PieChartSeries
 * @type object
 * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
 * @hidden
 */
const pieChartSeries = {
    name: undefined,
    tag: undefined
};

/**
* @name dxPieChartSeriesTypes
* @type object
*/
const commonPieChartSeries = {
    color: undefined,
    minSegmentSize: undefined,
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
    valueField: 'val',
    argumentField: 'arg',
    argumentType: undefined,
    tagField: 'tag',
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
    hoverMode: 'onlyPoint',
    selectionMode: 'onlyPoint',
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
    maxLabelCount: undefined,
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
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.position
        * @type Enums.PieChartLabelPosition
        * @default 'outside'
        */
        position: 'outside',
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.font
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
        },
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.textOverflow
        * @default 'ellipsis'
        * @type Enums.VizTextOverflow
        */
        textOverflow: 'ellipsis',
        /**
        * @name dxPieChartSeriesTypes.CommonPieChartSeries.label.wordWrap
        * @default 'normal'
        * @type Enums.VizWordWrap
        */
        wordWrap: 'normal'
    }
};

const doughnutSeries = {

};

const pieSeries = {

};

