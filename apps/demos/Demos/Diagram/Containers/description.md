This demo shows the Diagram component's capability to wrap shapes into containers. A container is a special shape with the following features:
<!--split-->

* A container can contain other shapes (including other containers).
* A container is dragged with its content.
* A container can be collapsed with a collapse button.

To wrap a shape, drop it into a container.

If you bind the Diagram to a data source, define the [containerKeyExpr](/Documentation/ApiReference/UI_Components/dxDiagram/Configuration/nodes/#containerKeyExpr) property to store information about the parent container in the data source. Otherwise, this information will be lost. 