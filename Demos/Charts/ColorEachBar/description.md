The Chart assigns one color to one series. To color bars differently, create a separate series for each bar.

Assign the `age` field to the [argumentField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#argumentField) property of the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object to specify a common argument for the series. Then specify the [valueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#valueField) property.

Choose a data field and assign it to the [seriesTemplate](/Documentation/ApiReference/UI_Components/dxChart/Configuration/seriesTemplate/).[nameField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/seriesTemplate/#nameField) property. Each value from this data field generates a separate series.

To learn more about this type of data binding, refer to the following demo: [Dynamic Series from the DataSource](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Charts/SeriesTemplates/).