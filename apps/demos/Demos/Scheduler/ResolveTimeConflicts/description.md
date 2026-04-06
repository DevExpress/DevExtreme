This example addresses appointment time conflicts when using the DevExtreme Scheduler. Use the **Allow Overlapping Appointments** select-box to select a desired time conflict resolution mode.
<!--split-->

### Detect Conflicts

Handle the [onAppointmentAdding](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdding) and [onAppointmentUpdating](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdating) events to check if a new or updated appointment creates a time conflict. Set `e.cancel = true` to block the operation when necessary.

Call [getOccurrences](/Documentation/ApiReference/UI_Components/dxScheduler/Methods/#getOccurrences) to expand [recurring appointments](/Documentation/Guide/UI_Components/Scheduler/Appointments/Appointment_Types/#Recurring_Appointments) into individual occurrences within the target range. Check for overlapping time range values.

### Conflict Detection Modes

The demo implements the following detection modes:

- **Different Resources**: appointments assigned to different resources (assignees) can overlap.
- **Never**: overlapping appointments are not allowed, regardless of resource assignment.

To implement resource-aware checks, access appointments and compare their `assigneeId` field values.

### Display Errors

When a conflict is detected, the demo displays the error as follows:

- A message box.
- An inline validation message (if an appointment edit form is active).

To display inline validation, configure a custom form item inside [editing.form](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/form/) and use the `customizeItem` function to attach custom `validationRules` to time editors.