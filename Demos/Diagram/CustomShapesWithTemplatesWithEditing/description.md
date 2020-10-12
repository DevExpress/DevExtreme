In this demo, the [customShapeTemplate](/Documentation/ApiReference/UI_Widgets/dxDiagram/Configuration/#customShapeTemplate) option defines a common shape template and adds the **Edit** and **Delete** links to a shape. These links allow users to modify and remove employee data in the data source. The **Diagram** widget reloads the modified diagram data every time the data source changes.


The [onRequestLayoutUpdate](/Documentation/ApiReference/UI_Widgets/dxDiagram/Configuration/#onRequestLayoutUpdate) function specifies whether the widget should reapply the auto layout after the diagram is reloaded.

The [customDataExpr](/Documentation/ApiReference/UI_Widgets/dxDiagram/Configuration/nodes/#customDataExpr) option links custom employee information from the data source to diagram nodes. Changes made to the data are reflected in the diagram history. The undo and redo actions in the UI allow users to revert these changes.


The [CustomShapeToolboxTemplate](/Documentation/ApiReference/UI_Widgets/dxDiagram/Configuration/#customShapeToolboxTemplate) option specifies a template for a shape in the toolbox.
