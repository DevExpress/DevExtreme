If you bind a TreeMap to a data source with a hierarchical structure, you can enable drill-down and drill-up functionality:  

- *"Drill down"* means navigate to a more detailed view. 
- *"Drill up"* means navigate back up a level.

In this demo, you can click/tap a group of TreeMap tiles to drill down. Once you go down a level, navigation links appear at the top of the TreeMap. Use them to drill back up. To implement this technique, follow the steps below:

1. Set the [interactWithGroup](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#interactWithGroup) property to `true` to force the control to hot-track entire groups instead of individual items.

2. Call the [node](/Documentation/ApiReference/UI_Components/dxTreeMap/Node/).[drillDown](/Documentation/ApiReference/UI_Components/dxTreeMap/Node/Methods/#drillDown) method in the TreeMap [onClick](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#onClick) handler.

3. To enable drill-up functionality, generate links in the [onDrill](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#onDrill) handler. Call the [node](/Documentation/ApiReference/UI_Components/dxTreeMap/Node/).[drillDown](/Documentation/ApiReference/UI_Components/dxTreeMap/Node/Methods/#drillDown) method on link clicks. Inspect the code below for implementation details.