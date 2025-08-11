DevExtreme Chart supports configurable series and point hover modes. This demo configures **hoverMode** for all series, series points, and the component legend.
<!--split-->

You can specify **hoverMode** for the following Chart elements:

- [series](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/#hoverMode)    
A specific series.
- [commonSeriesSettings](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#hoverMode)    
All series.
- **commonSeriesSettings**.[spline](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/#spline) (or other [Series Type](/Documentation/ApiReference/UI_Components/dxChart/Series_Types/) objects)    
All series of a specific type.
- [legend](/Documentation/ApiReference/UI_Components/dxChart/Configuration/legend/#hoverMode)    
Series hovered in the Chart legend.
- **series**.[point](/Documentation/ApiReference/UI_Components/dxChart/Configuration/series/point/#hoverMode)    
Specific series points.
- **commonSeriesSettings**.[point](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/point/#hoverMode) (or other Series Type objects)    
All series points.
- **commonSeriesSettings**.**spline**.**point**    
All points in series of a specific type.
- [argumentAxis](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/#hoverMode)    
All points at common argument values.

To further customize Chart hovering behavior, define the [stickyHovering](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#stickyHovering) property. When enabled (default), points remain in the hover state until users hover over other points or move the mouse cursor outside the component.