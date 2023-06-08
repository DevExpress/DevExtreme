To change column visibility at runtime, set the **columnChooser**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnChooser/#enabled) property to **true**. To make certain that a given column(s) always stay visible, set the **columns[]**.[allowHiding](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#allowHiding) property to **false**.

To display the column chooser, click the appropriate toolbar button above the DataGrid. You can specify the column chooser's position via the **columnChooser**.[position](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnChooser/#position) property. The manner in which users can display/hide columns depends on **columnChooser**.[mode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnChooser/#mode):

* *"dragAndDrop"* 
Users can drag and drop column headers to and from the column chooser.

* *"select"*   
Users can select and deselect check boxes with column names.

In *"select"* mode, you can choose whether parent element selection affects child/nested elements. Use the **selection**.[recursive](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnChooser/select/#recursive) property for this purpose.

If the column chooser contains multiple hidden columns, you can enable the DevExtreme Grid’s column search UI. Assign **true** to the **search**.[enabled](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columnChooser/search/#enabled) property for this purpose.

In this demo, use the check boxes below the DataGrid to toggle search and selection features.

To hide a column in code, set the **columns[]**.[visible](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/columns/#visible) property to **false**.
