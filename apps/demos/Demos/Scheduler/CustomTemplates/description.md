The Scheduler contains the following properties used to specify custom templates globally and for individual views:

* Appointment rectangle: [appointmentTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#appointmentTemplate) / **views[]**.[appointmentTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#appointmentTemplate)

* Tooltip: [appointmentTooltipTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#appointmentTooltipTemplate) / **views[]**.[appointmentTooltipTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#appointmentTooltipTemplate).

To customize the appointment details form, implement the [onAppointmentFormOpening](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentFormOpening) handler. In this demo, this handler adds custom fields to the appointment details form.
