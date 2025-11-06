DevExtreme Chart supports value error bars. These bars indicate data measurement tolerances and [confidence intervals](https://en.wikipedia.org/wiki/Confidence_interval). Use the **series**.[valueErrorBar](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/valueErrorBar/) object to configure error bar settings and appearance.

<!--split-->

To display error bars, specify one of the following pairs of **valueErrorBar** properties:

- [lowValueField](Documentation/ApiReference/UI_Components/dxChart/Configuration/series/valueErrorBar/#lowValueField) and [highValueField](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/valueErrorBar/#highValueField)    
Bind fields that contain error values for each series point.

- [value](Documentation/ApiReference/UI_Components/dxChart/Configuration/series/valueErrorBar/#value) and [type](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/valueErrorBar/#type)    
Calculate error bar values based on series data points.

This demo implements predefined error bars specified in the Chart data source.