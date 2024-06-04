The Tabs component allows you to create a tabbed UI to navigate between pages or views. You can create tab items in the [items](/Documentation/ApiReference/UI_Components/dxTabs/Configuration/items/) array, or populate tab items from a [dataSource](/Documentation/ApiReference/UI_Components/dxTabs/Configuration/#dataSource).

## Customize Tab Contents and Appearance

You can initialize a tab’s contents (text, icons and badges) with values from underlying data objects. This example demonstrates this technique.

Use the drop-down editors on the right to change the component's [orientation](/Documentation/ApiReference/UI_Components/dxTabs/Configuration/#orientation), [styling mode](/Documentation/ApiReference/UI_Components/dxTabs/Configuration/#stylingMode), and [icon position](/Documentation/ApiReference/UI_Components/dxTabs/Configuration/#iconPosition).

You can also specify an item template ([itemTemplate](/Documentation/ApiReference/UI_Components/dxTabs/Configuration/#itemTemplate)) to customize tabs.

## Configure Overflow Behavior

The Tabs component stretches to fit its container if you do not specify the component's [width](/Documentation/ApiReference/UI_Components/dxTabs/Configuration/#width). When the total tab width exceeds the component’s width, navigation buttons appear. A user can click these buttons to scroll through the tabs. Use the [showNavButtons](/Documentation/ApiReference/UI_Components/dxTabs/Configuration/#showNavButtons) and [scrollByContent](/Documentation/ApiReference/UI_Components/dxTabs/Configuration/#scrollByContent) properties to control this behavior.

