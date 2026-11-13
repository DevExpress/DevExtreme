Multiple data points within a data set can be attributed to the same category. DevExtreme Chart can [aggregate](/Documentation/Guide/UI_Components/Chart/Data_Aggregation/) such points and display one value per category in each series.

This demo displays monthly crude oil production in six US states. The Chart creates a series for each year, so every series contains twelve values per state. Without aggregation, the Chart draws these values as twelve overlapping bars in the same position. Aggregation replaces them with a single bar.

<!--split-->

Use the options below the Chart to modify aggregation settings as follows:

- **Aggregation enabled**    
Clear this checkbox to display source data. All twelve monthly bars overlap and look like a single bar as tall as the highest monthly value. The tooltip displays the month for the bar under the mouse pointer, and this month changes as you move the pointer along the bar.

- **Method**    
Select the aggregation method used to display bars: average, sum, or minimum. Gray bars in the background display the monthly maximum for comparison when average or minimum is selected.

You can apply common aggregation settings to all series. Activate [aggregation](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/).[enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/#enabled) in [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) and specify an aggregation [method](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/#method). Individual [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/aggregation/) settings override these common settings. In this demo, the gray series always use the *"max"* aggregation method.
