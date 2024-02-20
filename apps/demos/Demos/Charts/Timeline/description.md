Timeline charts represent events in chronological order.

The exact timeline chart implementation steps depend on the data source. Below are general recommendations on how to create a timeline chart.
 
- **Choose a series type**      
Each event is represented by its name and start/end dates. In this case, the series type should have points with one argument and two values, for example, the **Range Bar**.

- **Bind the series to data**       
You can bind the series to data directly or use a series template (depending on the data source). These approaches and their differences are described in the [Bind Series to Data](/Documentation/Guide/UI_Components/Chart/Data_Binding/Bind_Series_to_Data/) article. In this demo, we use a series template.

- **Line up bars**      
Specify the [barOverlapGroup](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#barOverlapGroup) to arrange bars in a line that displays a combined timeline.

- **Rotate the chart**      
A range bar chart's bars are vertical. To make them horizontal, set the [rotated](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#rotated) property to **true**.

- **Sort the events chronologically**       
Arguments maintain objects' order in the data source. If this order is not chronological, use the axis' [categories](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/#categories) array to specify the order.