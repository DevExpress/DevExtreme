Resources can be arranged in a hierarchy. This demo declares two levels&mdash;rooms and the employees who work in them&mdash;and groups appointments by employees within their rooms. Refer to the following demo for information about grouping by plain resources: [Grouping by Resources](/Demos/WidgetsGallery/Demo/Scheduler/GroupingByResources/).

<!--split-->

To declare a hierarchy, list all resource items in a single resource [dataSource](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#dataSource) as a flat array and specify the [parentIdExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#parentIdExpr) property&mdash;the data field that refers to the parent item. Items without a parent form the top level of the hierarchy.

The [groups[]](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#groups) array contains a single [fieldExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#fieldExpr) value. The Scheduler builds every level from this one entry: leaf items produce group bands, and their parents are rendered as headers that span all child bands.

<!--split-->

Use the **views**.[groupOrientation](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#groupOrientation) property to arrange group headers vertically (in a column) or horizontally (in a row). This demo declares two Work Week views with different group orientations.

This demo also customizes the appointment form in the [onAppointmentFormOpening](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentFormOpening) function: the form includes a Room editor that filters the Employee list to the selected room, and the Employee field is required.
