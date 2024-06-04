If you want to enable live resize operations for a UI element, wrap that element into a Resizable widget. In this demo, you can resize the DataGrid. Try to drag the [handles](/Documentation/ApiReference/UI_Components/dxResizable/Configuration/#handles) on the grid's edges.
<!--split-->

Configure the following properties to specify resize operation constraints:

- [minWidth](/Documentation/ApiReference/UI_Components/dxResizable/Configuration/#minWidth)    

- [maxWidth](/Documentation/ApiReference/UI_Components/dxResizable/Configuration/#maxWidth)    

- [minHeight](/Documentation/ApiReference/UI_Components/dxResizable/Configuration/#minHeight)    

- [maxHeight](/Documentation/ApiReference/UI_Components/dxResizable/Configuration/#maxHeight)    

- [area](/Documentation/ApiReference/UI_Components/dxResizable/Configuration/#area)    

You can display resize handles on edges or corners. Use the following keywords to set up the [handles](/Documentation/ApiReference/UI_Components/dxResizable/Configuration/#handles) property: *top*, *bottom*, *left*, and *right*. If you specify two adjacent sides (for example, "bottom right"), the control displays a handle in the corner.

The [keepAspectRatio](/Documentation/ApiReference/UI_Components/dxResizable/Configuration/#keepAspectRatio) property specifies whether a corner handle resizes content proportionally. Set this property to **false** to allow free-form resize operations.