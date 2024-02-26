When you add the CheckBox component to an application, specify its [value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) property to set its state. The CheckBox can have one of the following states:  

- Checked ([value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) is `true`).
- Unchecked ([value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) is `false`).
- Indeterminate ([value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) is `null` or `undefined`).

The component supports the three state mode. In this demo, the [enableThreeStateBehavior](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#enableThreeStateBehavior) property of the "Three state mode" CheckBox is enabled. You can cycle through the states of this CheckBox in the following order:

*Indeterminate → Checked → Unchecked → Indeterminate →  ...*

To handle value changes, use two-way binding to bind the [value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) property to a component property. The value of the component property depends on the value of the CheckBox. In this demo, the [value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) properties of the "Handle value change" and "Disabled" CheckBox components are bound to the same component property. Click the first CheckBox to see how it affects the second one. You can also use the [onValueChanged](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#onValueChanged) property to handle value changes. For example, this technique can be useful if you need to use the previous value.

You can use the [iconSize](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#iconSize) property to specify custom dimensions for the CheckBox. To add a label to the CheckBox, set the [text](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#text) property.