Splitter is a component designed to split a page layout into multiple panes.

[note] To get started with DevExtreme Splitter, refer to the following tutorial for step-by-step instructions: [Getting Started with Splitter](/Documentation/Guide/UI_Components/Splitter/Getting_Started_with_Splitter/).

Splitter panes can be specified in the [items](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/#items) or [dataSource](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/#dataSource) properties. Use **dataSource** if data is remote or should be processed.

The following base options are available for a pane:

- [resizable](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/items/#resizable) (default: `true`)    
If true, a handle appears at the side of the pane. Drag the handle to adjust the pane size.

- [collapsible](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/items/#collapsible) (default: `false`)    
If true, an arrow appears on the handle. Click the arrow to close the pane.

- [collapsed](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/items/#collapsed) (default: `false`)    
Specifies whether the pane is initially collapsed.

To configure the layout of the Splitter component, you can specify its [orientation](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/#orientation) as *'vertical'* or *'horizontal'* (default). All Splitter "size" properties depend on the orientation. If it is *'horizontal'*, the "size" means width. Otherwise, it is height. The following "size" properties can be specified:

- [size](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/items/#size)    
Initial pane width/height.

- [minSize](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/items/#minSize)    
The minimum width/height to which a pane can be resized.

- [maxSize](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/items/#maxSize)    
The maximum width/height to which a pane can be resized.

You can also place one Splitter inside another to create advanced layouts. For this, use the [splitter](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/items/#splitter) property.

Each Splitter pane can contain various content, from simple HTML markup to components. Use the following properties to declare pane content:

- [itemTemplate](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/#itemTemplate)    
Specifies a custom template for all panes.

- [template](/Documentation/ApiReference/UI_Components/dxSplitter/Configuration/items/#template)    
Specifies a custom template for an individual pane.