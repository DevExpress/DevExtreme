Scheduler allows users to add, update, resize, drag, and delete appointments. To manage these operations, use the [editing](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/) object. In this demo, checkboxes below the Scheduler enable/disable each edit operation.
<!--split-->

Each operation raises corresponding events:

* [onAppointmentAdding](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdding) / [onAppointmentAdded](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdded)

* [onAppointmentDeleting](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleting) / [onAppointmentDeleted](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleted)

* [onAppointmentUpdating](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdating) / [onAppointmentUpdated](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdated)

This demo handles events to display a toast message after each edit operation.

Double-click an appointment to open an edit form. You can customize the form, specify popup settings, and rearrange form items as needed. For additional information, review [Appointment Edit Form](/Documentation/Guide/UI_Components/Scheduler/Appointment/Appointment_Edit_Form/).