The [TextBox](/Documentation/ApiReference/UI_Widgets/dxTextBox/) is a UI component that allows users to enter and edit a single line of text. This demo illustrates the following  **TextBox** properties:

- [value](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#value)     
A value the **TextBox** displays.

- [placeholder](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#placeholder)       
An input prompt the **TextBox** displays when the **value** is not defined.

- [showClearButton](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#showClearButton)        
Specifies whether to display the button that clears the **TextBox** **value**.

- [mode](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#mode)        
Affects a set of keyboard characters displayed on a mobile device when the **TextBox** gets focus and modifies the UI component's display style. In this example, the **mode** is set to *"password"* so that entered characters are obscured, and the password cannot be read.

- [mask](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#mask)        
An input mask.

- [maskRules](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#maskRules)        
Custom mask rules.

- [disabled](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#disabled)        
Specifies whether the TextBox responds to user interaction.

- [onValueChanged](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#onValueChanged) event handler      
Use this function to perform an action when a user enters a new value. In this demo, this function uses the entered value to construct a dummy email address and assign it to another **TextBox**.

- [valueChangeEvent](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#valueChangeEvent)     
One or several DOM events that trigger the **onValueChanged** event handler.

- [readOnly](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#readOnly)     
Prevents users from changing the editor's value.

- [hoverStateEnabled](/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#hoverStateEnabled)        
Specifies whether the **TextBox** responds when users long press or hover the mouse pointer over it.
