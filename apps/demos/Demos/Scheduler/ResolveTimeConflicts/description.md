This demo shows how to prevent appointment time conflicts in DevExtreme Scheduler. Use the **Overlapping Rule** select-box to see how conflict behavior changes for appointments across resources.
<!--split-->

### Detect Conflicts

Handle the [onAppointmentAdding](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentAdding) and [onAppointmentUpdating](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#onAppointmentUpdating) events to intercept new and updated appointments. Set `e.cancel = true` to block the operation if a conflict is found.

To detect conflicts, call [getOccurrences](/Documentation/ApiReference/UI_Components/dxScheduler/Methods/#getOccurrences) to expand both the new and existing appointments into individual occurrences within the target range (required for [recurring appointments](/Documentation/Guide/UI_Components/Scheduler/Appointments/Appointment_Types/#Recurring_Appointments)), then compare them for time overlaps.

### Overlapping Rules

The demo supports two modes:

- **Allow across resources**: only appointments assigned to the *same* resource (assignee) block each other.
- **Disallow all overlaps**: any time overlap is blocked, regardless of resource assignment.

To implement resource-aware checks, compare the `assigneeId` field values across new and existing appointments.

### Display Errors

When a conflict is detected, the demo displays the error in the following ways:

- If an appointment edit form is open, an inline validation message appears.
- Otherwise, a dialog opens.

To display inline validation, add a custom form item with `customizeItem` inside [editing.form](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/form/) and attach custom `validationRules` to the time editors.