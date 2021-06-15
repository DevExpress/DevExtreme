Use the following properties to bind the TreeView to hierarchical data:

* [items[]](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/)        
Assigns a local array as done in this demo.

* [dataSource](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#dataSource)            
Assigns a DataSource object that allows you to perform data shaping operations and use a remote source. 

Each object in the TreeView's hierarchical data structure should include the following fields:

* [id](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#id)        
Unique item identifier.

* [text](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#text)        
Text displayed by the item.

* [items](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#items)         
Nested objects (optional).

You can respectively use the [keyExpr](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#keyExpr), [displayExpr](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#displayExpr), and [itemsExpr](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#itemsExpr) properties to specify custom names for the above-mentioned fields. Node objects can also include developer-defined fields and properties from this help section: [items[]](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/).

In this demo, nodes use the [expanded](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#expanded) property, which specifies whether a node is collapsed or expanded. They also include the developer-defined `price` and `image` fields.
