/**
* @name dxPolarChartSeriesTypes
* @publicName dxPolarChartSeriesTypes
* @type object
*/
/**
* @name dxPolarChartSeriesTypes.CommonPolarChartSeries
* @publicName CommonPolarChartSeries
* @type object
* @hidden
*/
var CommonPolarChartSeries = {
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.color
    * @publicName color
    * @type string
    * @default undefined
    */
    color: undefined,
    /**
     * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.closed
     * @publicName closed
     * @type boolean
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.linepolarseries
     */
    closed: true,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.visible
    * @publicName visible
    * @type boolean
    * @default true
    */
    visible: true,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.opacity
    * @publicName opacity
    * @type number
    * @default 0.5
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries
    */
    opacity: 0.5,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.width
    * @publicName width
    * @type number
    * @default 2
    * @propertyOf dxPolarChartSeriesTypes.linepolarseries
    */
    width: 2,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.dashstyle
    * @publicName dashStyle
    * @type Enums.DashStyle
    * @default 'solid'
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries
    */
    dashStyle: 'solid',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.stack
    * @publicName stack
    * @type string
    * @default 'default'
    * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    stack: 'default',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.axis
    * @publicName axis
    * @type string
    * @default undefined
    * @hidden
    */
    axis: undefined,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valuefield
    * @publicName valueField
    * @type string
    * @default 'val'
    * @notUsedInTheme
    */
    valueField: 'val',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.argumentfield
    * @publicName argumentField
    * @type string
    * @default 'arg'
    * @notUsedInTheme
    */
    argumentField: 'arg',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.tagfield
    * @publicName tagField
    * @type string
    * @default 'tag'
    * @notUsedInTheme
    */
    tagField: 'tag',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border
    * @publicName border
    * @type object
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    border: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        visible: false,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border.width
        * @publicName width
        * @type number
        * @default 2
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        width: 2,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border.color
        * @publicName color
        * @type string
        * @default undefined
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        color: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border.dashstyle
        * @publicName dashStyle
        * @type Enums.DashStyle
        * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        dashStyle: undefined
    },
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hovermode
    * @publicName hoverMode
    * @type Enums.ChartSeriesHoverMode
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
        */
    hoverMode: 'nearestPoint',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionmode
    * @publicName selectionMode
    * @type Enums.ChartSeriesSelectionMode
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
        */
    selectionMode: 'includePoints',
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle
    * @publicName hoverStyle
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
    * @type object
    */
    hoverStyle: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.color
        * @publicName color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.width
        * @publicName width
        * @type number
        * @default 3
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries
        */
        width: 3,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.dashstyle
        * @publicName dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries
        */
        dashStyle: 'solid',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.hatching
        * @publicName hatching
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        hatching: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.hatching.direction
            * @publicName direction
            * @type Enums.HatchingDirection
            * @default 'none'
            */
            direction: 'right',
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.hatching.width
            * @publicName width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.hatching.step
            * @publicName step
            * @type number
            * @default 6
            */
            step: 6,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.hatching.opacity
            * @publicName opacity
            * @type number
            * @default 0.75
            */
            opacity: 0.75
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.border
        * @publicName border
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        border: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.border.width
            * @publicName width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.border.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverstyle.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
                    */
            dashStyle: 'solid'
        }
    },
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle
    * @publicName selectionStyle
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
    * @type object
    */
    selectionStyle: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.color
        * @publicName color
        * @type string
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.width
        * @publicName width
        * @type number
        * @default 3
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries
        */
        width: 3,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.dashstyle
        * @publicName dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries
        */
        dashStyle: 'solid',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.hatching
        * @publicName hatching
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        hatching: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.hatching.direction
            * @publicName direction
            * @type Enums.HatchingDirection
            * @default 'none'
            */
            direction: 'right',
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.hatching.width
            * @publicName width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.hatching.step
            * @publicName step
            * @type number
            * @default 6
            */
            step: 6,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.hatching.opacity
            * @publicName opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.border
        * @publicName border
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        border: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.border.width
            * @publicName width
            * @type number
            * @default 3
            */
            width: 3,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.border.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionstyle.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
                    */
            dashStyle: 'solid'
        }
    },
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point
    * @publicName point
    * @type object
    * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
    */
    point: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hovermode
        * @publicName hoverMode
        * @type Enums.ChartPointInteractionMode
                * @default 'onlyPoint'
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        hoverMode: 'onlyPoint',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionmode
        * @publicName selectionMode
        * @type Enums.ChartPointInteractionMode
                * @default 'onlyPoint'
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        selectionMode: 'onlyPoint',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.color
        * @publicName color
        * @type string
        * @default undefined
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        color: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.visible
        * @publicName visible
        * @type boolean
        * @default true
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        visible: true,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.symbol
        * @publicName symbol
        * @type Enums.VizPointSymbol
        * @default 'circle'
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        symbol: 'circle',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image
        * @publicName image
        * @type string|object
        * @default undefined
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        image: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.url
            * @publicName url
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            url: undefined,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.width
            * @publicName width
            * @type number
            * @default 30
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            width: 30,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.height
            * @publicName height
            * @type number
            * @default 30
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            height: 30,
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border
        * @publicName border
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        border: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.width
            * @publicName width
            * @type number
            * @default 1
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            width: 1,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.color
            * @publicName color
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            color: undefined
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.size
        * @publicName size
        * @type number
        * @default 12
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        size: 12,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverstyle
        * @publicName hoverStyle
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        hoverStyle: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverstyle.color
            * @publicName color
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            color: undefined,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverstyle.border
            * @publicName border
            * @type object
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            border: {
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverstyle.border.visible
                * @publicName visible
                * @type boolean
                * @default true
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                visible: true,
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverstyle.border.width
                * @publicName width
                * @type number
                * @default 4
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                width: 4,
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverstyle.border.color
                * @publicName color
                * @type string
                * @default undefined
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                color: undefined
            },
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverstyle.size
            * @publicName size
            * @type number
            * @default 12
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            size: 12
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionstyle
        * @publicName selectionStyle
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
        */
        selectionStyle: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionstyle.color
            * @publicName color
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            color: undefined,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionstyle.border
            * @publicName border
            * @type object
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            border: {
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionstyle.border.visible
                * @publicName visible
                * @type boolean
                * @default true
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                visible: true,
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionstyle.border.width
                * @publicName width
                * @type number
                * @default 4
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                width: 4,
                /**
                * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionstyle.border.color
                * @publicName color
                * @type string
                * @default undefined
                * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
                */
                color: undefined
            },
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionstyle.size
            * @publicName size
            * @type number
            * @default 12
            * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
            */
            size: 12
        }
    },
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.showinlegend
    * @publicName showInLegend
    * @type boolean
    * @default true
    */
    showInLegend: true,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.maxlabelcount
    * @publicName maxLabelCount
    * @type number
    * @default undefined
    */
    maxLabelCount: undefined,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.minbarsize
    * @publicName minBarSize
    * @type number
    * @default undefined
    * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.barpolarseries
        */
    minBarSize: undefined,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreemptypoints
    * @publicName ignoreEmptyPoints
    * @type boolean
    * @default false
        */
    ignoreEmptyPoints: false,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.barpadding
    * @publicName barPadding
    * @type number
    * @default undefined
    * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    barPadding: undefined,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.barwidth
    * @publicName barWidth
    * @type number
    * @default undefined
    * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
    */
    barWidth: undefined,
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label
    * @publicName label
    * @type object
    */
    label: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.customizetext
        * @publicName customizeText
        * @type function(pointInfo)
        * @type_function_param1 pointInfo:object
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.showforzerovalues
        * @publicName showForZeroValues
        * @type boolean
        * @default true
        * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        showForZeroValues: true,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.rotationangle
        * @publicName rotationAngle
        * @type number
        * @default 0
        */
        rotationAngle: 0,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: '',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: 0,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.argumentFormat
        * @publicName argumentFormat
        * @extends CommonVizFormat
        */
        argumentFormat: '',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.argumentprecision
        * @publicName argumentPrecision
        * @extends CommonVizPrecision
        * @deprecated
        */
        argumentPrecision: 0,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.position
        * @publicName position
        * @type Enums.RelativePosition
        * @default 'outside'
        * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        position: 'outside',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font.family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font.weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font.color
            * @publicName color
            * @type string
            * @default '#FFFFFF'
            */
            color: '#FFFFFF',
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font.size
            * @publicName size
            * @type number|string
            * @default 14
            */
            size: 14,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.color
            * @publicName color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector
        * @publicName connector
        * @type object
        * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
        */
        connector: {
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.visible
            * @publicName visible
            * @type boolean
            * @default false
            * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
            */
            visible: false,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.width
            * @publicName width
            * @type number
            * @default 1
            * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
            */
            width: 1,
            /**
            * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.color
            * @publicName color
            * @type string
            * @default undefined
            * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
            */
            color: undefined
        }
    },
    /**
    * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueerrorbar
    * @publicName valueErrorBar
    * @type object
    * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries
    */
    valueErrorBar: {
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueerrorbar.displaymode
        * @publicName displayMode
        * @type Enums.ValueErrorBarDisplayMode
        * @default 'auto'
        */
        displayMode: 'auto',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueerrorbar.lowvaluefield
        * @publicName lowValueField
        * @type string
        * @default undefined
        */
        lowValueField: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueerrorbar.highvaluefield
        * @publicName highValueField
        * @type string
        * @default undefined
        */
        highValueField: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueerrorbar.type
        * @publicName type
        * @type Enums.ValueErrorBarType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueerrorbar.value
        * @publicName value
        * @type number
        * @default 1
        */
        value: 1,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueerrorbar.color
        * @publicName color
        * @type string
        * @default black
        */
        color: 'black',
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueerrorbar.linewidth
        * @publicName lineWidth
        * @type number
        * @default 2
        */
        lineWidth: 2,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueerrorbar.edgelength
        * @publicName edgeLength
        * @type number
        * @default 8
        */
        edgeLength: 8,
        /**
        * @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueerrorbar.opacity
        * @publicName opacity
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
* @hidePropertyOf
*/
var areaPolarSeries = {
    /**
    * @name dxPolarChartSeriesTypes.areapolarseries.point
    * @publicName point
    * @type object
    * @inheritdoc
    */
    point: {
        /**
        * @name dxPolarChartSeriesTypes.areapolarseries.point.visible
        * @publicName visible
        * @type boolean
        * @default false
        * @inheritdoc
        */
        visible: false
    },
    /**
    * @name dxPolarChartSeriesTypes.areapolarseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
    * @default 'nearestPoint'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxPolarChartSeriesTypes.areapolarseries.selectionmode
    * @publicName selectionMode
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
* @hidePropertyOf
*/
var barPolarSeries = {
    /**
    * @name dxPolarChartSeriesTypes.barpolarseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxPolarChartSeriesTypes.barpolarseries.selectionmode
    * @publicName selectionMode
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
* @hidePropertyOf
*/
var linePolarSeries = {
    /**
    * @name dxPolarChartSeriesTypes.linepolarseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
    * @default 'excludePoints'
    */
    hoverMode: 'nearestPoint',
    /**
    * @name dxPolarChartSeriesTypes.linepolarseries.selectionmode
    * @publicName selectionMode
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
* @hidePropertyOf
*/
var scatterPolarSeries = {};
/**
* @name dxPolarChartSeriesTypes.stackedbarpolarseries
* @publicName StackedBarSeries
* @type object
* @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
* @hidePropertyOf
*/
var stackedbarPolarSeries = {
    /**
    * @name dxPolarChartSeriesTypes.stackedbarpolarseries.label
    * @publicName label
    * @type object
    * @inheritdoc
    */
    /**
    * @name dxPolarChartSeriesTypes.stackedbarpolarseries.label.position
    * @publicName position
    * @type Enums.RelativePosition
    * @default 'inside'
    * @inheritdoc
    */
    /**
    * @name dxPolarChartSeriesTypes.stackedbarpolarseries.hovermode
    * @publicName hoverMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    hoverMode: 'onlyPoint',
    /**
    * @name dxPolarChartSeriesTypes.stackedbarpolarseries.selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
    * @default 'onlyPoint'
    */
    selectionMode: 'onlyPoint'
};
