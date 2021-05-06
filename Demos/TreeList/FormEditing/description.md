The TreeList can use the [Form](/Documentation/ApiReference/UI_Components/dxForm/) component to arrange cell editors when users modify a row. The Form allows users to edit values from [visible and hidden](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#visible) columns.

To use the Form as the row editor UI, specify the following properties:
- **editing**.[mode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#mode) to *"form"*
- **editing**.[allowUpdating](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#allowUpdating) to **true**

A column's default editor is defined automatically based on this column's [dataType](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#dataType). To customize this editor or replace it with another editor, use the column's [formItem](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#formItem) object. For information on settings that you can define in the **formItem** object, refer to the [SimpleItem](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/SimpleItem/) help topic.

You can also set up the edit Form from scratch. The component's [configuration section](/Documentation/ApiReference/UI_Components/dxForm/) lists available settings. Specify these settings in the **editing**.[form](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#form) object. Refer to this object's description for information about form edit mode limitations.

This demo also illustrates the following event handlers:

- [onInitNewRow](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onInitNewRow)        
Populates form editors of a new row with default values. In this demo, **onInitNewRow** sets *"John Heart"* as the initial `Head` for new rows.

- [onEditorPreparing](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onEditorPreparing)         
Customizes form editors. In this demo, this handler forbids users to edit the `Head` value of John Heart.

Refer to the following help topic to see the full list of the events that edit operations raise: [Editing Events](/Documentation/Guide/UI_Components/TreeList/Editing/#Events).
