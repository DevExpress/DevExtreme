You can double-click a DevExtreme Scheduler appointment to open an edit form from the UI. Scheduler allows you to customize the form: rearrange items, create custom fields, and specify popup settings.

The form includes two groups: `mainGroup` (general information) and `recurrenceGroup` (recurrence settings). Scheduler displays `mainGroup` first and switches to `recurrenceGroup` when users change the "Repeat" drop-down. Configure **editing**.[form](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/form/) and **editing**.[popup](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/popup/) to customize the form layout.

For more details, refer to the [Appointment Edit Form](/Documentation/Guide/UI_Components/Scheduler/Appointment/Appointment_Edit_Form/) help topic.

[note] Image Source: **Wikimedia Commons**
<!--split-->

Use the following Scheduler properties to specify custom templates (globally and for individual views):

* Appointment rectangle: [appointmentTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#appointmentTemplate) / **views[]**.[appointmentTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#appointmentTemplate)

* Tooltip: [appointmentTooltipTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#appointmentTooltipTemplate) / **views[]**.[appointmentTooltipTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#appointmentTooltipTemplate).
