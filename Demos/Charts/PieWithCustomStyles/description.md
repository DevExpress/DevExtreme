This demo uses custom patterns and gradients for PieChart slices.

## Gradient

Call the [registerGradient()](/Documentation/ApiReference/Common/Utils/viz/#registerGradienttype_options) method to obtain a gradient ID. Specify method arguments as follows:

- `type`    
This method supports two gradient types: *'linear'* and *'radial'*.

- `options`    
An object for gradient options.

    - `colors`    
    An array of gradient colors. Each color is an object that includes `color` and `offset` fields. The `offset` field specifies the starting point for each color.

    - `rotationAngle` (linear gradients only)    
    You can use this option to rotate linear gradients.

## Pattern

To obtain a pattern ID, call the [registerPattern()](/Documentation/ApiReference/Common/Utils/viz/#registerPatternoptions) method. Specify method arguments as follows:

- `options`    
An object with pattern options.

    - `height`    
    Template height.

    - `width`    
    Template width.

    - `template`    
    A repeating SVG-based template that creates the required pattern.

## Fill the PieChart

To fill all slices with the same pattern or gradient, assign a pattern ID to [series](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/).[color](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/series/#color).`fillId`. If you want to customize each slice individually, implement the [customizePoint](/Documentation/ApiReference/UI_Components/dxPieChart/Configuration/#customizePoint) function (review this demo for more information).

Custom patterns and gradients are not limited to the PieChart. The following DevExtreme components support the use of patterns/gradients:

- [Chart](/Documentation/Guide/UI_Components/Chart/Series/Customize_Appearance/)

- [PolarChart](/Documentation/Guide/UI_Components/PolarChart/Customize_Appearance/)

- [CircularGauge](/Documentation/Guide/UI_Components/CircularGauge/Customize_Appearance/)

- [LinearGauge](/Documentation/Guide/UI_Components/LinearGauge/Customize_Appearance/)
