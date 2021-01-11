This demo shows how to disable specific days, dates, and times when a user cannot schedule an appointment. In the demo, appointments are disabled for weekends, certain individual dates (e.g., May 25th), and the time period from 12:00pm to 1:00pm.

To implement this functionality in your application, follow the steps below:

1. **Implement date/time validation functions**         
These functions should check whether a date or time is available. This demo includes the following date/time validation functions:

    - `isValidAppointment`          
    Prepares data and begins validation.
    - `isValidAppointmentInterval`      
    Validates a date/time interval.
    - `isValidAppointmentDate`      
    Calls the `isHoliday`, `isWeekend`, and `isDinner` functions.
    - `isHoliday` / `isWeekend` / `isDinner`        
    Check whether a date/time interval is a holiday, a weekend, or dinner time.

1. **Validate appointments before they are created or updated**         
Before an appointment is created or updated, the **Scheduler** executes the [onAppointmentAdding][0] and [onAppointmentUpdating][1] functions. Use them to start validation. If a date or time is invalid, `cancel` the creation or update. Implement the same logic in the [onAppointmentFormOpening][2] function so that users cannot open the appointment details form for a disabled date or time.

1. **Customize the appointment details form**           
The appointment details form includes two calendars that allow users to select an appointment's start and end date/time. You should also disable dates in these calendars. Review the `applyDisableDatesToDateEditors` function to see how this is done. Call this function from **onAppointmentFormOpening**.

1. **Customize the timetable appearance**       
Use templates to customize the appearance of data cells ([dataCellTemplate][3]), time cells ([timeCellTemplate][4]), and date cells ([dateCellTemplate][5]). In this demo, date cell customization is visible only in the Month view. To switch to this view, use the view switcher in the UI component's upper right corner.

[0]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/#onAppointmentAdding
[1]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/#onAppointmentUpdating
[2]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/#onAppointmentFormOpening
[3]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/#dataCellTemplate
[4]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/#timeCellTemplate
[5]: /Documentation/ApiReference/UI_Widgets/dxScheduler/Configuration/#dateCellTemplate
