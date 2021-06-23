In virtual mode, the TreeView loads a node's children when the node is expanded for the first time. This enhances performance on large datasets.

To enable this feature, set the [virtualModeEnabled](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#virtualModeEnabled) property to **true**. Note that this mode is only available when the TreeView's [dataStructure](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#dataStructure) is plain.

When the data source is remote, the TreeView requests data for each expanded node. To prevent this for nodes that do not nest others, set the [hasItems](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/items/#hasItems) field to **false** for the corresponding data objects.

This demo enables virtual mode with a remote data source and uses the [hasItemsExpr](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#hasItemsExpr) property to specify a custom name for the `hasItems` field.

As an alternative to virtual mode, you can use a custom logic to process requested data. To do this, specify the [createChildren](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#createChildren) function as shown in the [Load Data on Demand](/Demos/WidgetsGallery/Demo/TreeView/LoadDataOnDemand) demo.
