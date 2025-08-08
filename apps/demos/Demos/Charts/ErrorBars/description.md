DevExtreme Chart supports value error bars. Implement these bars to indicate data measurement tolerances and [confidence intervals](https://en.wikipedia.org/wiki/Confidence_interval). Configure error bar settings and appearance in the **series**.[valueErrorBar](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/valueErrorBar/) object.

<!--split-->

To enable error bars, specify one of the following pairs of **valueErrorBar** properties:

- [lowValueField](Documentation/ApiReference/UI_Components/dxChart/Configuration/series/valueErrorBar/#lowValueField) and [highValueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/valueErrorBar/#highValueField)    
Specify predefined error bars for each series point.

- [value](Documentation/ApiReference/UI_Components/dxChart/Configuration/series/valueErrorBar/#value) and [type](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/valueErrorBar/#type)    
Configure dynamically calculated error bars.

This demo implements predefined error bars specified in the Chart data source.