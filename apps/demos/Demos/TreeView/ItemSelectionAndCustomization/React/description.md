DevExtreme [TreeView](/Documentation/Guide/UI_Components/TreeView/Overview/) ships with configurable selection functionality. Users can click nodes or item checkboxes to select. This demo allows you to modify selection behavior using controls below the TreeView. A DevExtreme [List](/Documentation/Guide/UI_Components/List/Overview/) on the right of the TreeView displays selected items in a flat (non-hierarchical) list.
<!--split-->

The following TreeView properties adjust the component's selection behavior:
 
- [showCheckBoxesMode](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#showCheckBoxesMode)    
Configures selection checkbox visibility (including the "Select All" checkbox).

- [selectionMode](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectionMode)    
Toggles between multiple and single node selection.

- [disabledNodeSelectionMode](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#disabledNodeSelectionMode)    
Specifies if users can select disabled nodes indirectly.

- [selectNodesRecursive](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectNodesRecursive)    
Configures whether child nodes are selected with parent nodes.

- [selectByClick](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectByClick)    
Allows users to select items with a click or tap. 

- [selectedExpr](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#selectedExpr)    
The data field that specifies each node's selection state. This demo uses the **selected** field (default). The "Victor Norris" item is initialized selected (see the `employees` array).

- [onSelectionChanged](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#onSelectionChanged)    
A function that allows you to handle selection changes. This demo synchronizes the List component in this handler.

TreeView also includes the following selection methods:

- **selectItem** / **unselectItem**     
Selects/unselects a single node. Accepts a node's [key](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectItemkey), [data object](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectItemitemData), or [DOM element](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectItemitemElement). 

- [selectAll()](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#selectAll) / [unselectAll()](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#unselectAll)         
Selects/unselects all nodes.

- [getSelectedNodes()](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#getSelectedNodes) / [getSelectedNodeKeys()](/Documentation/ApiReference/UI_Components/dxTreeView/Methods/#getSelectedNodeKeys)        
Returns selected nodes/keys. This demo implements **getSelectedNodes()** to update the List component.

This demo also implements [itemRender](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#itemRender) to customize nodes and does not include a [text](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#text) field in the TreeView data source.