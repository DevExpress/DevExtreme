/**
 * @name PolarChartSeries
 * @type object
 * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
 */
var polarChartSeries = {
    name: undefined,
    tag: undefined,
    type: 'scatter'
};

/**
* @name dxPolarChartSeriesTypes
* @type object
*/
var CommonPolarChartSeries = {
    color: undefined,
    closed: true,
    visible: true,
    opacity: 0.5,
    width: 2,
    dashStyle: 'solid',
    stack: 'default',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.axis
    * @type string
    * @default undefined
    * @hidden
    */
    axis: undefined,
    valueField: 'val',
    argumentField: 'arg',
    tagField: 'tag',
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
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints',
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
    point: {
        hoverMode: 'onlyPoint',
        selectionMode: 'onlyPoint',
        color: undefined,
        visible: true,
        symbol: 'circle',
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
        size: 12,
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
    showInLegend: true,
    maxLabelCount: undefined,
    minBarSize: undefined,
    ignoreEmptyPoints: false,
    barPadding: undefined,
    barWidth: undefined,
    label: {
        customizeText: undefined,
        visible: false,
        showForZeroValues: true,
        rotationAngle: 0,
        format: '',
        argumentFormat: '',
        position: 'outside',
        font: {
            family: undefined,
            weight: 400,
            color: '#FFFFFF',
            size: 14,
            opacity: undefined
        },
        backgroundColor: undefined,
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

var areaPolarSeries = {
    point: {
        visible: false
    },
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints'
};

var barPolarSeries = {
    hoverMode: 'onlyPoint',
    selectionMode: 'onlyPoint'
};
var linePolarSeries = {
    hoverMode: 'nearestPoint',
    selectionMode: 'includePoints'
};

var scatterPolarSeries = {};
var stackedbarPolarSeries = {
    hoverMode: 'onlyPoint',
    selectionMode: 'onlyPoint'
};
