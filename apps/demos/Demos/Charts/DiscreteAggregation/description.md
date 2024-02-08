To [aggregate](/Documentation/Guide/UI_Components/Chart/Data_Aggregation/) points on discrete axes, follow the steps below:

1. Enable aggregation.    
You can enable data aggregation for the following series:

    - Individual series    
    Assign `true` to the [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/).[aggregation](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/aggregation/).[enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/aggregation/#enabled) property.

    - All series of a specific type  
    Assign `true` to the `aggregaion.enabled` property that belongs to the configuration object of a [specific series type](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/).

    - All series in the Chart   
    Assign `true` to the [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/).[aggregation](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/).[enabled](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/#enabled) property.    

Individual series aggregation settings have priority over common aggregation settings in the component. For example, you can enable aggregation for all series and disable it for a specific series.

In this demo, data aggregation is enabled for all series.

2. Specify an aggregation [method](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/aggregation/#method) (optional).    
In this demo, the `sum` method is used.

