Scheduler allows users to manage CRUD operations as follows:

- **Edit (update) appointments**: Double-click an appointment or click an appointment tooltip to edit. Drag and drop an appointment to edit start and end time values (without changing duration). Drag an appointment's edge to edit start or end time values (and change the appointment's duration). 
- **Delete appointments**: Click the delete button within an appointment tooltip to delete.
- **Create new appointments**: Double-click an empty cell to create a new appointment.

In this demo, checkboxes below the Scheduler enable/disable edit operations. This demo also handles events to display a toast message after each edit.
<!--split-->

To manage editing operations, configure the [editing](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/) object.

Each operation raises corresponding events:

* [onAppointmentAdding](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdding) / [onAppointmentAdded](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdded)

* [onAppointmentDeleting](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleting) / [onAppointmentDeleted](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleted)

* [onAppointmentUpdating](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdating) / [onAppointmentUpdated](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdated)

You can customize the appointment edit form, specify popup settings, and rearrange form items as needed. For additional information, review [Appointment Edit Form](/Documentation/Guide/UI_Components/Scheduler/Appointment/Appointment_Edit_Form/).