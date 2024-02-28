This demo shows options that you can use to colorize TreeMap tiles. To see each option, use the drop-down editor below the component.

To colorize the TreeMap tiles, you can use the [colorizer](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/colorizer/) object. This object allows you to specify the colorization [type](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/colorizer/#type):

- *"discrete"* (default)    
This colorization algorithm paints each tile within a group in a color from the [palette](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/colorizer/#palette). When there are multiple groups, the way in which groups are colorized depends on the [colorizeGroups](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/colorizer/#colorizeGroups) property setting: 

    - If [colorizeGroups](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/colorizer/#colorizeGroups) is set to `false` (**Discrete** mode in the demo):     
    Each group is painted independently - regardless of the colors used in other groups.

    - If [colorizeGroups](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/colorizer/#colorizeGroups) is set to `true` (**Grouped** mode in the demo):     
    Each group is painted with a different color from the palette.

- *"gradient"*    
If you choose this algorithm, the palette should contain only two colors that the component uses to colorize the smallest and the largest tile, respectively. The other tiles will have a tint of either the first or the second color depending on their size. In order to use the *"gradient"* algorithm, you need to set the [range](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/colorizer/#range) property to an array of only two values.

- *"range"*    
This algorithm is similar to *"gradient"*, but the array assigned to the [range](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/colorizer/#range) property should contain more than two values. This array specifies the ranges between each value. The palette of two colors will generate multiple tints - one for each range.

If you use the *"gradient"* or *"range"* colorization algorithm, the color of the tile depends on the value. Normally, the [value field](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#valueField) supplies this value to the component. However, you can use the [colorCodeField](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/colorizer/#colorCodeField) property to assign another field to supply the value.