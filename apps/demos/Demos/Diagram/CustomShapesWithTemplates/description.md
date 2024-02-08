The Diagram component provides the following properties to create custom shape templates.

* The [customShapeTemplate](/Documentation/ApiReference/UI_Components/dxDiagram/Configuration/#customShapeTemplate) property defines a common template for all shapes in the component.
* The [template](/Documentation/ApiReference/UI_Components/dxDiagram/Configuration/customShapes/#template) property defines a template for an individual shape. 

Template content must be presented as SVG elements. 

In this demo, the [customShapeTemplate](/Documentation/ApiReference/UI_Components/dxDiagram/Configuration/#customShapeTemplate) property adds the 'Show Details' link to a shape. When clicked, it displays a popup window that contains additional information about an employee.