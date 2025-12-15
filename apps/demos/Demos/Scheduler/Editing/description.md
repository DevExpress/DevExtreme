Scheduler allows users to add, update, resize, drag, and delete appointments. Double click to update an appointment. Open an appointment tooltip to update/delete. Double click an empty cell to add a new appointment.

In this demo, checkboxes below the Scheduler enable/disable edit operations. This demo also handles events to display a toast message after each edit.
<!--split-->

To manage editing operations, configure the [editing](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/) object.

Each operation raises corresponding events:

* [onAppointmentAdding](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdding) / [onAppointmentAdded](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdded)

* [onAppointmentDeleting](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleting) / [onAppointmentDeleted](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleted)

* [onAppointmentUpdating](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdating) / [onAppointmentUpdated](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdated)

You can customize the appointment edit form, specify popup settings, and rearrange form items as needed. For additional information, review [Appointment Edit Form](/Documentation/Guide/UI_Components/Scheduler/Appointment/Appointment_Edit_Form/).