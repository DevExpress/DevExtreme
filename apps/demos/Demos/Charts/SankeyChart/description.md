The Sankey chart visualizes the flow magnitude between value sets. Flow values are nodes, and the connections between nodes are links. The higher the flow magnitude, the wider the link is.
<!--split-->

## Bind Sankey to Data

Each object of your data source should be a link between source and target nodes. For example, the following link connects the Spain and USA nodes and has a weight of 2:

    { source: 'Spain', target: 'USA', weight: 2 }

To bind Sankey to data fields, use the [sourceField](/Documentation/ApiReference/UI_Components/dxSankey/Configuration/#sourceField), [targetField](/Documentation/ApiReference/UI_Components/dxSankey/Configuration/#targetField), and [weightField](/Documentation/ApiReference/UI_Components/dxSankey/Configuration/#weightField) properties.

## Customize Node and Link Appearance

Use the [node](/Documentation/ApiReference/UI_Components/dxSankey/Configuration/node/) and [link](/Documentation/ApiReference/UI_Components/dxSankey/Configuration/link/) objects to configure Sankey appearance. This demo specifies the [width](/Documentation/ApiReference/UI_Components/dxSankey/Configuration/node/#width) and [padding](/Documentation/ApiReference/UI_Components/dxSankey/Configuration/node/#padding) properties for nodes and the [colorMode](/Documentation/ApiReference/UI_Components/dxSankey/Configuration/link/#colorMode) property for links.

## Configure the Tooltip

The tooltip content differs for nodes and links. When you hover over a node, the tooltip shows the node's title, and its incoming and outgoing weights. When you hover over a link, the tooltip shows the link's direction and weight. 

To customize the tooltip content, use the [customizeNodeTooltip](/Documentation/ApiReference/UI_Components/dxSankey/Configuration/tooltip/#customizeNodeTooltip) and [customizeLinkTooltip](/Documentation/ApiReference/UI_Components/dxSankey/Configuration/tooltip/#customizeLinkTooltip) functions. In this demo, you can see an example of the **customizeLinkTooltip** function.