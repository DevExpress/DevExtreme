The RadioGroup component contains a set of radio buttons and allows users to select one item from it. This demo illustrates how to bind the component to data, change the component layout, define a custom template, and handle the value change event.

## Bind RadioGroup to Data

You can display RadioGroup items from the [items](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/items/) array or a [dataSource](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#dataSource). If your data is an array of objects, use the [displayExpr](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#displayExpr) and [valueExpr](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#valueExpr) properties. [displayExpr](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#displayExpr) specifies a data source field that contains button captions. [valueExpr](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#valueExpr) specifies a data source field that supplies values to the value property when users select a button. Leave [valueExpr](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#valueExpr) unspecified if you need to supply the entire data object to the value property.

## Configure the Layout

The RadioGroup supports horizontal (default for tablets) and vertical (default for other devices) layouts. To change the layout for all device types, specify the [layout](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#layout) property.

## Customize the Item Appearance

Define the [itemTemplate](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#itemTemplate) to customize the item appearance. To customize an individual item, specify its [template](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/items/#template) property.

## Handle the Value Change Event

You can set the [value](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#value) property to one of the data source items to specify a predefined selection. Implement the [onValueChanged](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#onValueChanged) function to handle [value](/Documentation/ApiReference/UI_Components/dxRadioGroup/Configuration/#value) changes.