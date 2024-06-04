The DataGrid supports multiple predefined types of [command columns](/Documentation/Guide/UI_Components/DataGrid/Columns/Column_Types/Command_Columns/). Each column type supports one type of action (edit, select, drag, etc.). This demo shows how to customize the Edit Command Column. This column type contains predefined edit buttons and optional custom buttons.

**Predefined buttons**           
The available selection of predefined buttons depends on the selected [edit mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#mode), and the availability of the update and delete operations. To enable them, set the [allowUpdating](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#allowUpdating) and [allowDeleting](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#allowDeleting) properties to **true**. You can also set any of these properties to a custom function that enables the corresponding operation and displays its button only for certain rows.

This demo has the following configuration:

* Edit mode is set to *"row"*.

* **allowUpdating** is enabled to display Edit buttons in all rows.
  
* **allowDeleting** is set to a function that hides the Delete button based on a custom condition.

The predefined edit buttons are displayed as textual links by default. To use icons instead, set the [useIcons](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/#useIcons) property to **true**.

**Custom buttons**             
If a command column should contain custom buttons, add its configuration to the [columns](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/) array. DataGrid will display this column according to its position in this array. Specify the column's [type](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#type) as *"buttons"* and declare the [buttons](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/buttons/) array. It should contain your custom buttons along with the predefined buttons. If you need to customize a predefined button, add an object with specified [name](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/buttons/#name) and [other button properties](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/buttons/). If customization is not required, add only button names.

In this demo, the edit column contains one custom button (Clone) and two predefined buttons (Edit and Delete) without customization.
