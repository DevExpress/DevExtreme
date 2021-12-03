When you add a CheckBox to an application, set its [value](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#value) property. The CheckBox can have the following states: 

- Checked (**value** is **true**).
- Unchecked (**value** is **false**).
- Undetermined (**value** is **undefined**).

To handle value change, use two-way binding to bind the **value** property to a component property. In this demo, the **value** properties of the "Handle value change" and "Disabled" CheckBox components are bound to the same component property. Click the first CheckBox to see how it affects the second one. You can also use the [onValueChanged](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#onValueChanged) property to handle value change, for example, if you need to use the previous value.

You can use the [iconSize](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#iconSize) property to specify a custom width and height for the CheckBox. To add a label to the CheckBox, set the [text](/Documentation/ApiReference/UI_Components/dxCheckBox/Configuration/#text) property.