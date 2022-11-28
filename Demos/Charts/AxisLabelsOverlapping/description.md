In this demo, argument axis labels overlap due to their length. To specify the overlapping behavior, you can use one of the following [label](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/label/).[overlappingBehavior](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/label/#overlappingBehavior) modes:

- `none`    
Leaves axis labels overlapped.

- `hide`    
Hides certain axis labels and leaves more space for the others.

- `rotate`     
Rotates axis labels at the angle specified by the [rotationAngle](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/label/#rotationAngle) property.

- `stagger`      
Arranges axis labels into two staggered rows. Use the [staggeringSpacing](/Documentation/ApiReference/UI_Components/dxChart/Configuration/argumentAxis/label/#staggeringSpacing) property to specify an empty space between rows.

All of the values above can be applied to a horizontal axis, but only `none` and `hide` can be specified for a vertical axis.

