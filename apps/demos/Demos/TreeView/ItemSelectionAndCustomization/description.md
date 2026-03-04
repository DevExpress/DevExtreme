The DevExtreme [TreeView](/Documentation/Guide/UI_Components/TreeView/Overview/) allows users to select individual tree nodes (on click or using checkboxes). In this demo, selected items appear as a flat (non-hierarchical) [List](/Documentation/Guide/UI_Components/List/Overview/).
<!--split-->

Use the options pane below the TreeView to modify selection behavior as follows:

- Specify [selection mode](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectionMode) for enabled and [disabled nodes](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#disabledNodeSelectionMode).
- Toggle visibility of [selection checkboxes](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#showCheckBoxesMode) (including the Select All option).
- Allow [selection on click](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectByClick).
- Disable [recursive selection](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectNodesRecursive).

The TreeView allows you to update node selection states programmatically. You can select/deselect items by [node keys](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectItemkey), [data objects](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectItemitemData), or [DOM elements](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectItemitemElement). To initially select nodes, configure [selection fields](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectedExpr) within item objects (default: **selected**).

You can use data fields to customize items as your requirements dictate. This demo implements [itemTemplate](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#itemTemplate) to merge text from multiple fields: you do not need to specify the [text](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#text) field for your TreeView data source.