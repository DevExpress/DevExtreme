DevExtreme Chart supports configurable hover modes for series and points. This demo specifies properties that set common **hoverMode** for all series/points and a custom mode for the component legend.
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
Points in a specific series.
- **commonSeriesSettings**.[point](/Documentation/ApiReference/UI_Components/dxChart/Configuration/commonSeriesSettings/point/#hoverMode) (or other Series Type objects)    
All points.
- **commonSeriesSettings**.**spline**.**point**    
All points in series of a specific type.
- [argumentAxis](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/#hoverMode)    
All points at common argument values.

To further customize Chart behavior, define the [stickyHovering](/Documentation/ApiReference/UI_Components/dxChart/Configuration/#stickyHovering) property. When enabled (default), points remain in the hover state until users hover the mouse pointer over other points or move it outside the component.