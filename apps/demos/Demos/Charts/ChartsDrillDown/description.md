This demo shows a drill-down chart that visualizes data on two hierarchical views. The main view displays the population breakdown by continent. When you click the bar, a detailed view reveals the most populated countries on the selected continent.

## Bind to Data

This demo binds the drill-down chart to an array of objects. To visualize hierarchical data in the drill-down chart, filter the data source by the `parentID` for different drill-down views in the `filterData` function.

## Implement View Navigation

To navigate from the main view to a detailed view, filter the data source by a different `parentID` in the [onPointClick](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#onPointClick) event handler. To navigate back, click the **Back** button. This action resets the data source filter. Use the `isFirstLevel` flag to distinguish views. 

## Customize the Appearance

Use the [customizePoint](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#customizePoint) function to change the individual point properties. This function returns an object with properties that should be changed for a certain point. In this demo, this function changes the [color](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/point/#color) and [hoverStyle](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/point/hoverStyle/) properties. 