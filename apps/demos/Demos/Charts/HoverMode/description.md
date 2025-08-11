DevExtreme Chart supports configurable series and point hover modes. This demo configures **hoverMode** for all series, series points, and the component legend.
<!--split-->

You can specify the **hoverMode** property in the following configuration objects:

- [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#hoverMode)    
Defines **hoverMode** for a specific series.
- [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#hoverMode)    
Specifies the property for all series.
- **commonSeriesSettings**.[spline](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#spline) (or other [Series Type](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/) objects)    
Configure **hoverMode** for all series of a specific type.
- [legend](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#hoverMode)    
Configures the property for hovered series in the Chart legend.

You can specify Chart point hover modes in the following configuration objects: 

- **series**.[point](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/point/#hoverMode)    
Defines **hoverMode** for specific series points.
- **commonSeriesSettings**.[point](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/point/#hoverMode)    
Configures the property for all series points.
- **commonSeriesSettings**.**spline**.**point**    
Specify **hoverMode** for points in all series of a specific type.
- [argumentAxis](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/#hoverMode)    
Defines the property for all points at common argument values.

To further customize Chart point hovering behavior, define the [stickyHovering](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#stickyHovering) property. When enabled (default), points remain in the hover state until users hover over other points or move the mouse cursor outside the component.