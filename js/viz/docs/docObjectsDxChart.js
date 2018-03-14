/**
* @name chartSeriesObject
* @publicName Series
* @type object
* @inherits baseSeriesObject
*/
var chartSeriesObject = {
    /**
    * @name chartSeriesObjectFields_axis
    * @publicName axis
    * @type string
    */
    axis: null,
    /**
    * @name chartSeriesObjectFields_pane
    * @publicName pane
    * @type string
    */
    pane: null
}

/**
* @name chartPointObject
* @publicName Point
* @type object
* @inherits basePointObject
*/
var chartPointObject = {
    /**
    * @name chartPointObjectFields_aggregationInfo
    * @publicName aggregationInfo
    * @type object
    */
    aggregationInfo: {
        /**
        * @name chartPointObjectFields_aggregationInfo_data
        * @publicName data
        * @type Array<any>
        */
        data: null,
        /**
        * @name chartPointObjectFields_aggregationInfo_aggregationInterval
        * @publicName aggregationInterval
        * @type any
        */
        aggregationInterval: null,
        /**
        * @name chartPointObjectFields_aggregationInfo_intervalStart
        * @publicName intervalStart
        * @type any
        */
        intervalStart: null,
        /**
        * @name chartPointObjectFields_aggregationInfo_intervalEnd
        * @publicName intervalEnd
        * @type any
        */
        intervalEnd: null
    },
    /**
    * @name chartPointObjectFields_originalMinValue
    * @publicName originalMinValue
    * @type string|number|date
    */
    originalMinValue: null,
    /**
    * @name chartPointObjectFields_originalOpenValue
    * @publicName originalOpenValue
    * @type number|string
    */
    originalOpenValue: null,
    /**
    * @name chartPointObjectFields_originalCloseValue
    * @publicName originalCloseValue
    * @type number|string
    */
    originalCloseValue: null,
    /**
    * @name chartPointObjectFields_originalLowValue
    * @publicName originalLowValue
    * @type number|string
    */
    originalLowValue: null,
    /**
    * @name chartPointObjectFields_originalHighValue
    * @publicName originalHighValue
    * @type number|string
    */
    originalHighValue: null,
    /**
    * @name chartPointObjectFields_size
    * @publicName size
    * @type number|string
    */
    size: null,
    /**
    * @name chartPointObjectmethods_getboundingrect
    * @publicName getBoundingRect()
    * @return object
    */
    getBoundingRect: function() { }
};
