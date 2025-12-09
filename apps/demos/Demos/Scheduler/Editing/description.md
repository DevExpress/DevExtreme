Scheduler allows users to add, update, resize, drag, and delete appointments. To manage these operations, use the [editing](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/) object. In this demo, checkboxes below Scheduler enable or disable each edit operation.
<!--split-->

Each operation raises related events:

* [onAppointmentAdding](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdding) / [onAppointmentAdded](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdded)

* [onAppointmentDeleting](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleting) / [onAppointmentDeleted](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleted)

* [onAppointmentUpdating](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdating) / [onAppointmentUpdated](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdated)

This demo uses event handlers to display a toast message after each edit operation.

Double-click an appointment to open the edit form. You can customize the form, specify the popup settings, and rearrange form items as needed. For more details, see [Appointment Edit Form]().