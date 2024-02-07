Scheduler allows users to add, update, resize, drag, and delete appointments. To control these operations, specify properties in the [editing](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/) object. In this demo, you can use the checkboxes below the Scheduler to toggle the edit operations.

These operations raise events that you can handle with the following functions:

* [onAppointmentAdding](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdding) / [onAppointmentAdded](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdded)

* [onAppointmentDeleting](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleting) / [onAppointmentDeleted](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentDeleted)

* [onAppointmentUpdating](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdating) / [onAppointmentUpdated](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdated)

In this demo, we configured the handlers to display a toast message after a user performs an edit operation.

Users can edit appointment data in the appointment details form. To open it, they need to double-click the appointment. You can use the [onAppointmentFormOpening](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentFormOpening) function to customize the form.
