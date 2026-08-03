Resources can be arranged in a hierarchy. This demo groups meetings by rooms that belong to floors, which in turn belong to buildings. Refer to the following demo for information about grouping by plain resources: [Grouping by Resources](/Demos/WidgetsGallery/Demo/Scheduler/GroupingByResources/).

To declare a hierarchy, list all resource items in a single resource [dataSource](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#dataSource) as a flat array and specify **resources**.**parentIdExpr**&mdash;the data field that refers to the parent item. Items without a parent form the top level of the hierarchy.
<!--split-->

Only leaf resources&mdash;items that have no children&mdash;can own appointments and produce group bands. Parent resources are rendered as headers that span all their children. Use the **views**.[groupOrientation](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#groupOrientation) property to arrange group headers vertically or horizontally. This demo declares two Work Week views with different group orientations.

Since parent resources cannot own appointments, this demo handles the [onAppointmentFormOpening](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentFormOpening) function to fill the room editor in the appointment form with leaf resources only and to display the full path to each room.
