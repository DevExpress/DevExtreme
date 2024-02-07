To create a bi-directional bar chart, follow the steps below:

1. Convert half of the data source values from positive to negative. In this demo, the `male` percentages are negative, while the `female` are positive.

2. Implement a rotated [stacked bar chart](/Demos/WidgetsGallery/Demo/Charts/StackedBar/jQuery/Light/). Use the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object to specify the [type](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#type) and the [argumentField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#argumentField) property (`age` in this case). Set the [rotated](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#rotated) property to `true`.

3. Declare two objects in the [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/) array: one for negative values, the other for positive. Specify the [color](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#color), [name](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#name), and [valueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#valueField) for each series.

4. Change the [label](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/label/) text of the [valueAxis](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/) so that the negative values appear as positive. To implement this technique, use the [customizeText](/Documentation/ApiReference/UI_Components/dxChart/Configuration/valueAxis/label/#customizeText) function.

To further customize your bi-directional bar chart, implement [tooltips](/Documentation/ApiReference/UI_Components/dxChart/Configuration/tooltip/) and change the [legend](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/)'s alignment.