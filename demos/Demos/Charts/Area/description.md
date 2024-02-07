This demo shows different Area [series types](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#type). Use the drop-down editor below the Chart to select the type.

- *area*    
The Area series draws the line between neighboring data points and fills the area under that line. If the Chart contains multiple area series, they overlap each other.

- *stackedarea*    
The Chart displays areas stacked on top of each other without overlapping. This type of Chart is useful if you need to compare contributions of each series to the overall value.

- *fullstackedarea*    
The Chart stacks the areas. For each argument, it displays values as percentages of the total, as opposed to absolute values. The topmost series points are always plotted at 100%, and the graph fully covers the Chart's pane. 

To create multiple area series, use the [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/) array to declare each series and the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/) object to specify the common series type.