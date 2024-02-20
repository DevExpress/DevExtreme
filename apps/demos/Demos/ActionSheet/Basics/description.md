The ActionSheet component is a pop-up sheet that contains a set of buttons. These buttons allow users to perform custom actions related to a single task (call, send a message, delete, or edit a selected contact). This demo shows how to create a simple ActionSheet and handle button clicks.

## Specify Buttons and Title

ActionSheet can contain multiple buttons. To specify and configure them, use one of these properties:

- [items[]](/Documentation/ApiReference/UI_Components/dxActionSheet/Configuration/items/)     
Accepts a local data array.

- [dataSource](/Documentation/ApiReference/UI_Components/dxActionSheet/Configuration/#dataSource)     
Accepts a local data array or a [DataSource](/Documentation/ApiReference/Data_Layer/DataSource/) object. This object works with local and remote arrays and allows you to shape data. 

For each button, you can specify a [text](/Documentation/ApiReference/UI_Components/dxActionSheet/Configuration/items/#text), [type](/Documentation/ApiReference/UI_Components/dxActionSheet/Configuration/items/#type), [icon](/Documentation/ApiReference/UI_Components/dxActionSheet/Configuration/items/#icon), [template](/Documentation/ApiReference/UI_Components/dxActionSheet/Configuration/items/#template), and other properties. In this demo, the ActionSheet buttons are configured in a local array assigned to the **dataSource** property. Each button includes the **text** property only.

If you want to display a title, assign the text to the [title](/Documentation/ApiReference/UI_Components/dxActionSheet/Configuration/#title) property.

## Handle Button Clicks

You can assign a function to the [onItemClick](/Documentation/ApiReference/UI_Components/dxActionSheet/Configuration/#onItemClick) property to handle button clicks. Use the `e.itemData` field within the function to determine which button was clicked. You can also use the [onCancelClick](/Documentation/ApiReference/UI_Components/dxActionSheet/Configuration/#onCancelClick) property handle a click on the built-in **Cancel** button. In this demo, the ActionSheet component displays a notification with the button's name when you click a button. 
