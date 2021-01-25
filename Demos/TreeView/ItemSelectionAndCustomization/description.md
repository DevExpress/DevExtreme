To select a node, users can click a checkbox next to it. Set the [showCheckBoxesMode](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#showCheckBoxesMode) to *"normal"* or *"selectAll"* to display node checkboxes. The *"selectAll"* mode also enables a checkbox that selects all nodes simultaneously. If [selectByClick](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectByClick) is enabled, users can click nodes to select them. 

Use the following **TreeView** properties to adjust selection:
 
- [selectionMode](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectionMode)             
Specifies whether multiple node selection is allowed.

- [selectNodesRecursive](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectNodesRecursive)      
Specifies whether nested nodes are selected together with their parent.

- [selectedExpr](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectedExpr)      
A data field that allows you to pre-select a node. In this demo, the data field is called **selected**, and it is set to **true** for the "Victor Norris" node (see the data source).

- [onSelectionChanged](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#onSelectionChanged)        
A function that allows you to handle selection changes. In this demo, it is used to synchronize the **List** with the **TreeView**.
 
The **TreeView** also provides the following methods to manage selection programmatically:

- **selectItem** / **unselectItem**     
Selects or unselects a single node. Accepts the [node key](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectItemkey), [data object](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectItemitemData), or [DOM node](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectItemitemElement). 

- [selectAll()](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectAll) / [unselectAll()](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#unselectAll)         
Selects or unselects all nodes.

- [getSelectedNodes()](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#getSelectedNodes) / [getSelectedNodeKeys()](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#getSelectedNodeKeys)        
Gets the selected nodes or their keys. In this demo, **getSelectedNodes()** is used to prepare data for the **List**.

This demo also shows how to specify an [itemTemplate](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#itemTemplate) for node customization. Node data is passed to the template as an argument.