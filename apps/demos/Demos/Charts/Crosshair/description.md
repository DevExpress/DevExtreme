The DevExtreme Chart component ships with integrated crosshair support (vertical and horizontal lines centered on a data point). When enabled, the crosshair follows the cursor and snaps to the nearest series point. To configure crosshair settings, specify the [crosshair](/Documentation/ApiReference/UI_Components/dxChart/Configuration/crosshair/) object.
<!--split-->

This demo configures the following **crosshair** properties:

- [color](/Documentation/ApiReference/UI_Components/dxChart/Configuration/crosshair/#color)    
Specifies line color.
- [width](/Documentation/ApiReference/UI_Components/dxChart/Configuration/crosshair/#width)    
Configures line width.
- [dashStyle](/Documentation/ApiReference/UI_Components/dxChart/Configuration/crosshair/#dashStyle)    
Specifies line style.
- [label](/Documentation/ApiReference/UI_Components/dxChart/Configuration/crosshair/label/)    
Configures labels (text and appearance).

To override settings for each line individually, configure **crosshair**.[horizontalLine](/Documentation/ApiReference/UI_Components/dxChart/Configuration/crosshair/horizontalLine/) and **crosshair**.[verticalLine](/Documentation/ApiReference/UI_Components/dxChart/Configuration/crosshair/verticalLine/) objects.