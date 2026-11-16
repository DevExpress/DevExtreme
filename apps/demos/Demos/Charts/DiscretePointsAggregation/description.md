Multiple data points within a data set can be attributed to the same category. DevExtreme Chart can [aggregate](/Documentation/Guide/UI_Components/Chart/Data_Aggregation/) such points and display one value per category in each series.

This demo binds a DevExtreme Chart to monthly crude oil production data from six US states. The Chart creates a series for each year and draws twelve bars (one for each month) in the same position. When you activate aggregation, the component replaces these twelve bars with a single bar.

<!--split-->

Use the options below the Chart to modify aggregation settings as follows:

- **Aggregation enabled**    
Uncheck this checkbox to display original (source) data.

- **Method**    
Select the aggregation method used to display bars: average, sum, or minimum. Gray bars in the background display the monthly maximum for comparison when average or minimum is selected.

You can apply common aggregation settings to all series. Activate the [aggregation](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/).[enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/#enabled) option in [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) and specify an aggregation [method](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/#method). Individual [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/aggregation/) settings override these common settings.
