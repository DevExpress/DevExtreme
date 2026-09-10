The DevExtreme Scheduler supports multilevel resource grouping to organize appointments in a hierarchy. In this demo, employees are grouped by room, so you can view each employee's schedule within their assigned room.
<!--split-->

To configure multilevel grouping:

- Include parent and child records in the resource's [dataSource](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#dataSource). This demo uses rooms as parents and employees as children.
- Set [parentIdExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#parentIdExpr) to the field that links each child to its parent. Each employee's `parentId` references a room's `id`.
- Set the resource's [fieldExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#fieldExpr) to the appointment field that stores resource IDs, and add that field to the Scheduler’s [groups](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#groups) array. This demo uses `assigneeId`.

Switch between **Vertical Grouping** and **Horizontal Grouping** to change the layout. Each view specifies a [groupOrientation](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#groupOrientation).

The demo also customizes the appointment form with [onAppointmentFormOpening](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentFormOpening). Select a room to filter the employee list, then assign one or more employees to the appointment. The resource's [allowMultiple](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/resources/#allowMultiple) property enables multiple employee selection.