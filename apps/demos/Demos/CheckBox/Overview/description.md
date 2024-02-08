When you add the CheckBox component to an application, specify its [value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) property to set its state. The CheckBox can have one of the following states: 

- Checked ([value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) is `true`).
- Unchecked ([value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) is `false`).
- Indeterminate ([value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) is `null` or `undefined`).

The component supports the three state mode. In this demo, the [enableThreeStateBehavior](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#enableThreeStateBehavior) property of the "Three state mode" CheckBox is enabled. You can cycle through the states of this CheckBox in the following order:

*Indeterminate → Checked → Unchecked → Indeterminate →  ...*

Specify the [onValueChanged](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#onValueChanged) property to handle value changes. In this demo, the [value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) of the "Handle value change" CheckBox is passed to the "Disabled" CheckBox. Click the first CheckBox to see how it affects the second one.

You can use the [iconSize](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#iconSize) property to specify custom dimensions for the CheckBox. To add a label to the CheckBox, specify the [text](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#text) property.
