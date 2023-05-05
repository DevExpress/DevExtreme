If you want users to change column visibility at runtime, enable the Column Chooser. Set the **columnChooser**.[enabled](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columnChooser/#enabled) property to **true**.  Note that you can make sure that certain columns always stay visible. To do so, set the **columns[]**.[allowHiding](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#allowHiding) property to **false**. 

To open the column chooser, users should click the button in the toolbar above the TreeList. The way users show and hide columns depends on the **columnChooser**.[mode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columnChooser/#mode):

* *"dragAndDrop"*              
Users drag and drop column headers to and from the column chooser.

* *"select"*         
Users select and deselect check boxes with column names.

In *"select"* mode, you can choose whether parent element selection affects child/nested elements. Use the **selection**.[recursive](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columnChooser/selection/#recursive) property.

If the column chooser contains many hidden columns, you can enable the column search UI. Assign **true** to the **search**.[enabled](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columnChooser/search/#enabled) property.

In this demo, use the check boxes below the TreeList to toggle the selection and search features.

To hide a column in code, set the **columns[]**.[visible](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#visible) property to **false**. 
