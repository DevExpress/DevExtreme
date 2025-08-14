You can use the DevExtreme Chart component to visualize data as a [Pareto chart](https://en.wikipedia.org/wiki/Pareto_chart). Such charts display individual values along with their cumulative totals. In this demo, individual values are numbers of complaints and cumulative totals are given in percentages.

<!--split-->

Follow the steps below to create a Pareto chart:

1. Configure a [Bar](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/BarSeries/) series object and assign your primary data to this series (specify **series**.[valueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#valueField)).
2. Add a [Line](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/LineSeries/) or [Spline](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/SplineSeries/) series object and assign your cumulative total values to this series.
3. To display the numbers of the [Pareto principle](https://en.wikipedia.org/wiki/Pareto_principle) (80/20) specify **valueAxis**.[constantLines](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/constantLines/).
