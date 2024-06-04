This demo shows how to specify a CircularGauge title and display custom labels in the component's center. 

A CircularGauge title usually informs users about the nature of gauge data. To customize it, use the properties of the [title](/Documentation/ApiReference/UI_Components/dxCircularGauge/Configuration/title/) configuration object:

- **Location**    
Use the [horizontalAlignment](/Documentation/ApiReference/UI_Components/dxCircularGauge/Configuration/title/#horizontalAlignment) and [verticalAlignment](/Documentation/ApiReference/UI_Components/dxCircularGauge/Configuration/title/#verticalAlignment) properties to place a title on any side of your gauge.

- **Font Settings**    
Use the [font](/Documentation/ApiReference/UI_Components/dxCircularGauge/Configuration/title/font/) configuration object.

You can display a custom label in the center of a CircularGauge. Use the [centerTemplate](/Documentation/ApiReference/UI_Components/dxCircularGauge/Configuration/#centerTemplate) property. Render template content as an [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) element.