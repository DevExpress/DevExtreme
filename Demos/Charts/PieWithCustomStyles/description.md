This demo enables custom patterns and gradients in PieChart slices.

## Gradient

Call the [registerGradient()](/Documentation/ApiReference/Common/Utils/viz/#registerGradienttype_options) method to obtain the gradient ID. Specify method arguments:

- `type`    
This method supports two gradient types: *'linear'* and *'radial'*.

- `options`    
An object with gradient options.

    - `colors`    
    An array of gradient colors. Each color is an object that includes `color` and `offset` fields. The `offset` field specifies the starting point for each color.

    - `rotationAngle` (linear gradients only)
    You can use this option to rotate linear gradients.

## Pattern

This demo uses patterns for two pie slices: Grid and Stripes. 

To get the pattern ID, call the [registerPattern()](/Documentation/ApiReference/Common/Utils/viz/#registerPatternoptions) method. Specify method arguments:

- `options`    
An object with pattern options.

    - `height`    
    Template height.

    - `width`    
    Template width.

    - `template`    
    An SVG-based template that repeats and thus creates the required pattern.

## Fill the PieChart

If you want to fill all slices with the same pattern or gradient, assign the pattern ID to [series](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/).[color](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/#color).`fillId`. If you want to customize each slice individually, implement the [customizePoint](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/#customizePoint) function as shown in this demo.

Custom patterns and gradients are not exclusive to PieChart only. The following components also support this functionality:

- [Chart](/Documentation/Guide/UI_Components/Chart/Series/Customize_Appearance/)

- [PolarChart](/Documentation/Guide/UI_Components/PolarChart/Customize_Appearance/)

- [CircularGauge](/Documentation/Guide/UI_Components/CircularGauge/Customize_Appearance/)

- [LinearGauge](/Documentation/Guide/UI_Components/LinearGauge/Customize_Appearance/)
