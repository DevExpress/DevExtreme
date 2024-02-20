This demo enables multiple selection [mode](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/selection/#mode). This mode allows users to press keyboard shortcuts or click checkboxes to select multiple rows.

The checkbox in the leftmost column header selects all rows. You can set the [allowSelectAll](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/selection/#allowSelectAll) property to **false** to disable the checkbox.

Multiple selection mode is non-recursive (when a row is selected, nested rows remain unselected). If users should select rows recursively, set the **selection**.[recursive](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/selection/#recursive) property to **true**. In this demo, you can use the checkbox under the TreeList component to toggle this property.

TreeList includes an API to select multiple rows. For details, refer to the following article: [Selection API](/Documentation/Guide/UI_Components/TreeList/Selection/#API).
