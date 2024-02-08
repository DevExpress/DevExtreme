ButtonGroup displays a set of two-state buttons and allows users to select one or multiple buttons. This demo illustrates how to configure the ButtonGroup in the following steps:

- Bind ButtonGroup to data.

- Enable or disable multiple selection.

- Customize the ButtonGroup appearance.

## Bind ButtonGroup to Data

Use the [items](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/items/) array to populate ButtonGroup with data. You can specify the following fields in data objects: 

- [hint](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/items/#hint)

- [icon](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/items/#icon)

- [text](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/items/#text)

- [type](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/items/#type)

## Process Button Selection

Set the [keyExpr](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/#keyExpr) property to the data field that supplies keys used to distinguish the selected buttons. In this demo, the [selectedItemKeys](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/#selectedItemKeys) property contains the keys of the selected buttons. This property allows you to predefine selected buttons. To enable multiple selection, set the [selectionMode](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/#selectionMode) property to `multiple`.

Use the [onItemClick](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/#onItemClick) function to process clicks on buttons.

## Customize the Buttongroup Appearance

Specify the [stylingMode](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/#stylingMode) property and select one of the three predefined styles. In this demo, the button groups in the first row have the `outlined` style, while others have the `text` style. You can specify the [buttonTemplate](/Documentation/ApiReference/UI_Components/dxButtonGroup/Configuration/#buttonTemplate) property to customize the apperance of each button.

To get started with the DevExtreme ButtonGroup component, refer to the following tutorial for step-by-step instructions: [Getting Started with ButtonGroup](/Documentation/Guide/UI_Components/ButtonGroup/Getting_Started_with_ButtonGroup/).