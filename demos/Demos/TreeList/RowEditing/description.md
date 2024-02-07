The TreeList allows users to edit data in multiple modes. This demo shows the *"row"* edit mode. To edit a row, click its "Edit" button. Only one row can be in the edit state at a time.

To enable row edit mode, set the [mode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#mode) property to *"row"* and enable the [editing](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#mode) object's [allowUpdating](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#allowUpdating), [allowAdding](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#allowAdding), and [allowDeleting](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/editing/#allowDeleting) properties to allow edit operations.

Buttons for allowed edit operations are displayed in an edit column. To customize it programmatically, declare a column of the `buttons` [type](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#type) and specify the available buttons. In this demo, the `buttons` column is used to hide the "Add" button in each row. See the following help topic for more details on edit column customization: [Customize the Edit Column](/Documentation/Guide/UI_Components/TreeList/Columns/Column_Types/Command_Columns/#Customize_the_Edit_Column).


This demo also illustrates the following event handlers:

- [onInitNewRow](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onInitNewRow)        
Populates cells of a new row with default values. In this demo, **onInitNewRow** sets John Heart as the initial Head for new rows.

- [onEditorPreparing](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/#onEditorPreparing)         
Customizes cell editors. In this demo, this handler disallows users to edit the Head value of John Heart.

Refer to the following help topic to see the full list of the events that edit operations raise: [Editing Events](/Documentation/Guide/UI_Components/TreeList/Editing/#Events).
