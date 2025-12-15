You can double-click a DevExtreme Scheduler appointment or an empty cell to open an edit form from the UI. Scheduler allows you to customize the form: rearrange items, create custom fields, and specify popup settings.

The form includes two groups: `mainGroup` (general information) and `recurrenceGroup` (recurrence settings). Scheduler displays `mainGroup` first and switches to `recurrenceGroup` when users change the "Repeat" drop-down. Configure **editing**.[form](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/form/) to customize the form layout and **editing**.[popup](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/popup/) to customize the dialog window. This demo configures these objects to add custom fields (**movieId** and **price**) to the edit form.

For additional information, refer to the following help topic: [Appointment Edit Form](/Documentation/Guide/UI_Components/Scheduler/Appointment/Appointment_Edit_Form/).
<!--split-->

You can customize the following DevExtreme Scheduler elements using custom templates (globally and for individual views):

* Appointment rectangle: [appointmentTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#appointmentTemplate) / **views[]**.[appointmentTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#appointmentTemplate)

* Tooltip: [appointmentTooltipTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#appointmentTooltipTemplate) / **views[]**.[appointmentTooltipTemplate](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#appointmentTooltipTemplate).

[note] Image Source: **Wikimedia Commons**