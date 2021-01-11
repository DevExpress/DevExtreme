The **Chart** UI component initially displays axes along pane borders. Several other predefined axis layout options are available. In this demo, the [customPosition](/Documentation/ApiReference/Data_Visualization_Widgets/dxChart/Configuration/argumentAxis/#customPosition) option is used to move each axis, so that it is displayed on the specified value of another axis. When you position the [argument axis](/Documentation/ApiReference/Data_Visualization_Widgets/dxChart/Configuration/argumentAxis/), use values from the [value axis](/Documentation/ApiReference/Data_Visualization_Widgets/dxChart/Configuration/valueAxis/) (in the same type and format) and vice versa.

Regardless of which automatic axis layout type you use, the Chart Control allows you to apply manual offsets. Specify the [offset](/Documentation/ApiReference/Data_Visualization_Widgets/dxChart/Configuration/argumentAxis/#offset) option in pixels to keep the axis position unchanged when users scroll or zoom the **Chart** data. The **offset** option shifts the axis from the specified position as follows:

- If the axis is horizontal, a negative offset shifts the axis to the top, a positive offset shifts it to the bottom. 

- If the axis is vertical, a negative offset shifts the axis to the left, a positive offset shifts it to the right.

In this demo, you can use controls under the **Chart** to change the **customPosition** and **offset** options for both axes.
