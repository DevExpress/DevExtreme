The NumberBox is a component that displays a number. Users can change this number (for example, type a new value or use the spin buttons, keyboard arrows, or mouse wheel to increment/decrement it).
<!--split-->

Use the [value](/Documentation/ApiReference/UI_Components/dxNumberBox/Configuration/#value) property to specify the number displayed in the NumberBox. If you do not specify the **value** property, the NumberBox displays 0 (the default value). You can use the [min](/Documentation/ApiReference/UI_Components/dxNumberBox/Configuration/#min) and [max](/Documentation/ApiReference/UI_Components/dxNumberBox/Configuration/#max) properties to set the value range.

Specify the [onValueChanged](/Documentation/ApiReference/UI_Components/dxNumberBox/Configuration/#onValueChanged) function to handle the value change. In this demo, the value of the "Stock" NumberBox depends on the "This month sales" NumberBox. Change the value in the "This month sales" NumberBox to see how it affects the other value.

If users should not interact with a NumberBox, set its [disabled](/Documentation/ApiReference/UI_Components/dxNumberBox/Configuration/#disabled) or [readOnly](/Documentation/ApiReference/UI_Components/dxNumberBox/Configuration/#readOnly) property to **true**. The main difference between these properties is that users can submit a read-only NumberBox in an HTML form, while they cannot submit a disabled NumberBox.

