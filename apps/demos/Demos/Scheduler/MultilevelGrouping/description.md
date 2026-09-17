The DevExtreme Scheduler supports multilevel resource grouping to organize appointments as a hierarchy. in In this demo, the Scheduler groups employees by room, so you can view each employee's schedule based on their assigned room.
<!--split-->

Follow these steps to configure multilevel grouping:

- Add parent and child records in the resource's [dataSource](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#dataSource). This demo uses rooms as parents and employees as children.
- Assign a field that links each child to its parent to the [parentIdExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#parentIdExpr). In this demo, each employee's `parentId` references a room's `id`.
- Set the resource's [fieldExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#fieldExpr) to the appointment field that stores resource IDs, and add that field to the Scheduler [groups](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#groups) array. This demo uses `assigneeId`.

Switch between **Vertical Grouping** and **Horizontal Grouping** to change the layout. Each view sets the [groupOrientation](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#groupOrientation) property to control the layout.

The demo also customizes the appointment form in the [onAppointmentFormOpening](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentFormOpening) handler. Select a room to filter the employee list, then assign one or more employees to the appointment. The resource [allowMultiple](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#allowMultiple) property enables multiple employee selection.
