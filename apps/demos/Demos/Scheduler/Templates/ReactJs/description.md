The Scheduler contains the following properties used to specify custom templates globally and for individual views:

* Appointment rectangle: [appointmentComponent](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#appointmentComponent) / **views[]**.[appointmentComponent](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#appointmentComponent)

* Tooltip: [appointmentTooltipComponent](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#appointmentTooltipComponent) / **views[]**.[appointmentTooltipComponent](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#appointmentTooltipComponent).

To customize the appointment details form, implement the [onAppointmentFormOpening](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentFormOpening) handler. In this demo, this handler adds custom fields to the appointment details form.
