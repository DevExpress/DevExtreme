The DropDownButton is&nbsp;a&nbsp;button that opens a&nbsp;drop-down menu. The button displays&nbsp;a [text](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#text) and&nbsp;an [icon](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#icon).

Menu items can be&nbsp;specified in&nbsp;the [items](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#items) or&nbsp;[dataSource](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#dataSource) properties. Use **dataSource** if&nbsp;data is&nbsp;remote or&nbsp;should be&nbsp;processed. To&nbsp;customize menu items, implement&nbsp;an [itemTemplate](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#itemTemplate).

The DropDownButton stores the most recent selected menu item if&nbsp;you set the [useSelectMode](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#useSelectMode) property to&nbsp;**true**. In&nbsp;this case, the button uses the selected item&rsquo;s text and icon.

You can implement&nbsp;a [dropDownContentTemplate](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#dropDownContentTemplate) to replace the drop-down menu with custom content.

To&nbsp;track and handle events, use the [onButtonClick](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#onButtonClick), [onItemClick](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#onItemClick), and [onSelectionChanged](/Documentation/ApiReference/UI_Components/dxDropDownButton/Configuration/#onSelectionChanged) event handlers.

To get started with the DevExtreme DropDownButton component, refer to the following tutorial for step-by-step instructions: [Getting Started with DropDownButton](/Documentation/Guide/UI_Components/DropDownButton/Getting_Started_with_DropDownButton/).