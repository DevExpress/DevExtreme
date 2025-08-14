You can use the DevExtreme Chart component to visualize data as a [Pareto chart](https://en.wikipedia.org/wiki/Pareto_chart). Such charts display individual values along with their cumulative totals. In this demo, individual values are numbers of complaints and cumulative totals are given in percentages.

<!--split-->

Follow the steps below to create a Pareto chart:

1. Configure a [Bar](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/BarSeries/) series and assign your primary data to this series (specify **series**.[valueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#valueField) property).
2. Add a [Line](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/LineSeries/) or [Spline](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/SplineSeries/) series and assign your cumulative total values to this series.
3. Specify **valueAxis**.[constantLines](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/constantLines/) to illustrate [Pareto principle](https://en.wikipedia.org/wiki/Pareto_principle) correlation (80/20).
