This demo illustrates the Scheduler's [hiddenWeekDays](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#hiddenWeekDays) property. The property accepts an array of day indexes (0 for Sunday through 6 for Saturday) and removes the specified days from the timetable. The hidden days are excluded from Scheduler views where this option is supported.

Use the checkboxes in the options panel to toggle day visibility. A validation message appears if you attempt to hide all seven days, since at least one day must remain visible.
<!--split-->

To hide specific days of the week, assign an array of day indexes to the [hiddenWeekDays](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#hiddenWeekDays) property. The index values follow the JavaScript `Date.getDay()` convention:
- `0` - Sunday
- `1` - Monday
- `2` - Tuesday
- `3` - Wednesday
- `4` - Thursday
- `5` - Friday
- `6` - Saturday

The property works across multiple view types. Configure the available views with the [views](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/) array and set the initial view with the [currentView](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#currentView) property.
