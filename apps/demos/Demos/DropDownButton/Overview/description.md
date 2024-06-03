DropDownButton is a button that opens a drop-down menu. The button displays a [text](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#text) and an [icon](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#icon).

To get started with the DevExtreme DropDownButton component, refer to the following tutorial for step-by-step instructions: [Getting Started with DropDownButton](/Documentation/Guide/UI_Components/DropDownButton/Getting_Started_with_DropDownButton/).
<!--split-->

Menu items can be specified in the [items](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#items) or [dataSource](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#dataSource) properties. Use **dataSource** if data is remote or should be processed.

DropDownButton stores the most recent selected menu item if you set the [useSelectMode](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#useSelectMode) property to `true`. In this case, the button uses the selected item's text and icon.

To customize DropDownButton, specify the the following options:

- [itemTemplate](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#itemTemplate)    
Customizes menu items.

- [template](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#template)    
Customizes a base button.

- [dropDownContentTemplate](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#dropDownContentTemplate)    
Replaces the drop-down menu with custom content.

To track and handle events, use the [onButtonClick](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#onButtonClick), [onItemClick](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#onItemClick), and [onSelectionChanged](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#onSelectionChanged) event handlers.

