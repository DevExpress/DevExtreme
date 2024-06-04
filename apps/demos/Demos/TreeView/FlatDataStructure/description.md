The TreeView's plain (one-dimensional) array contains items each of which references its parent item. Use either of the following properties to bind the component to plain data:

* [items[]](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/)        
Assigns a local array as shown in this demo.

* [dataSource](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#dataSource)            
Assigns a DataSource object that allows you to perform data shaping operations and use a remote source.

Each object in the TreeView's plain data structure should include the following fields:

* [id](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#id)             
Unique item identifier.

* [parentId](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#parentId)           
Identifier of the parent item.

* [text](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#text)         
Text displayed by the item.

You can respectively use the [keyExpr](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#keyExpr), [parentIdExpr](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#parentIdExpr), and [displayExpr](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#displayExpr) properties to specify custom names for the above-mentioned fields. Node objects can also include developer-defined fields and properties from this help section: [items[]](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/).

In this demo, nodes use the [icon](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#icon) and [expanded](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#expanded)  properties. These properties specify the icon and whether a node is collapsed or expanded. Some nodes also include the developer-defined `price` field.
