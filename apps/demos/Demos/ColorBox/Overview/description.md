The ColorBox allows users to enter a color or select it in the drop-down editor. When you create a ColorBox, specify its [value](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#value) property to set the initial color. Users can change the value after they pick a shade, or after they click the **OK** button. To specify the mode, use the [applyValueMode](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#applyValueMode) property. 
<!--split-->

You can hide the editor's drop-down button to allow users to only type in a color code. To do this, disable the [showDropDownButton](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#showDropDownButton) property. Users can also edit the transparency of the selected shade if the [editAlphaChannel](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#editAlphaChannel) property is set to **true**.

## Configure the ColorBox

Use the following properties to specify the component's interactivity:

- [readOnly](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#readOnly)    
Specifies whether the ColorBox is read-only.

- [disabled](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#disabled)    
Specifies whether the ColorBox responds to user interaction.

You can specify the following properties to add custom buttons into the input field, or configure the drop-down editor's buttons:

- [buttons](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/buttons/)    
Allows you to add custom buttons to the input text field.

- [showClearButton](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#showClearButton)    
Specifies whether to display the Clear button in the ColorBox.

- [applyButtonText](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#applyButtonText)    
Specifies the text for the button that applies changes and closes the drop-down editor.

- [cancelButtonText](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#cancelButtonText)    
Specifies the text for the button that cancels changes and closes the drop-down editor.

## Handle Value Change

Implement the [onValueChanged](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#onValueChanged) function to handle the value change when users select a color in the drop-down editor. To handle the input value change, use the [onInput](/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/#onInput) function.