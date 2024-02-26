In certain scenarios, you may need to add more series to the data source after you created the Chart. In this case, arrange your data source structure as follows:

    [
        {seriesName: series1, arg: arg11Value, val: value11 }
        {seriesName: series1, arg: arg12Value, val: value12 }
        ...
        {seriesName: seriesM, arg: argM1Value, val: valueM1 }
        {seriesName: seriesM, arg: argM2Value, val: valueM2 }
        ...
    ]

Every object in the data source should correspond to a point in a single series.

This demo uses the structure displayed above to organize data:

    {
        year: 1970,
        country: 'Saudi Arabia',
        oil: 192.2,
    }

To define series, use the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object to specify common settings for all series: the [argumentField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#argumentField), the [valueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#valueField), and the [type](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#type).

Then, use the [seriesTemplate](/Documentation/ApiReference/UI_Components/dxChart/Configuration/seriesTemplate/) configuration object to define a template for the series. Within this object, assign the data source field that specifies the series name to the [nameField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/seriesTemplate/#nameField) property.

If you need to specify individual values for properties of a particular series, assign a callback function to the [customizeSeries](/Documentation/ApiReference/UI_Components/dxChart/Configuration/seriesTemplate/#customizeSeries) property of the [seriesTemplate](/Documentation/ApiReference/UI_Components/dxChart/Configuration/seriesTemplate/) object. This demo uses the [customizeSeries](/Documentation/ApiReference/UI_Components/dxChart/Configuration/seriesTemplate/#customizeSeries) function to display a line instead of a bar for `year: 2009`.