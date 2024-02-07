Spline area series display smooth lines that connect data points. This demo shows different spline area [series types](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#type). Use the drop-down editor below the Chart to select the type.

- *splinearea*    
The spline area series draws a line between neighboring data points and fills the area under the line. If the Chart contains multiple area series, they overlap.

- *stackedsplinearea*    
The Chart displays areas stacked on top of each other without overlapping. This type of Chart is useful if you need to compare the contribution of each series to the overall value.

- *fullstackedsplinearea*    
The Chart stacks the areas. Values are displayed as percentages of the total for each argument, as opposed to absolute values. The topmost series points are always plotted at 100%, and the graph completely fills the Chart's pane. 

To create multiple spline area series, use the [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/) array to declare each series and the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object to specify the common series type.