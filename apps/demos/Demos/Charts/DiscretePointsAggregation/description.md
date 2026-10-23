To [aggregate](/Documentation/Guide/UI_Components/Chart/Data_Aggregation/) points on discrete axes, follow the steps below.
<!--split-->

1. Enable aggregation.    
You can enable data aggregation for the following series:

    - Individual series    
    Assign `true` to the [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/).[aggregation](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/aggregation/).[enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/aggregation/#enabled) property.

    - All series of a specific type  
    Assign `true` to the `aggregaion.enabled` property that belongs to the configuration object of a [specific series type](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/).

    - All series in the Chart   
    Assign `true` to the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/).[aggregation](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/).[enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/#enabled) property.    

Individual series aggregation settings have priority over common aggregation settings in the component. For example, you can enable aggregation for all series and disable it for a specific series.

In this demo, data aggregation is enabled for all series. Use the **Aggregation enabled** checkbox to toggle it.

2. Specify an aggregation [method](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/#method) (optional).    
In this demo, you can choose between the `avg`, `sum`, and `min` methods. The default method is `avg`.

Each year also has a gray max series that always uses the `max` method. These series override the common aggregation settings and use the [barOverlapGroup](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#barOverlapGroup) property to overlap the corresponding colored bars. This allows you to compare the aggregated value with the highest monthly value in each category. Hover over a bar to see its value in a tooltip.

The data keeps each row's `year` unchanged and uses a separate `series` field for series names. The `MAX_SUFFIX` constant identifies max series and is removed to determine the year used by `barOverlapGroup`.
