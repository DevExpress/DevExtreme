You can use the [createChildren](/Documentation/ApiReference/UI_Components/dxTreeView/Configuration/#createChildren) function to specify custom logic to load data. This function is called each time a user expands a node that was not expanded before. The node's identifier is passed to the function as an argument. Send this identifier to the data service that should return data for child nodes.

As an alternative, you can enable [virtual mode](/Demos/WidgetsGallery/Demo/TreeView/VirtualMode/) to use the default load logic.
