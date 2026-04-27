This demo illustrates the Scheduler's [hiddenWeekDays](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#hiddenWeekDays) property. The property accepts an array of day indexes and removes the specified days from the timetable. The hidden days are excluded from all Scheduler views.

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

The property works across multiple view types. To hide the days of the week from the specific view, use the [same property](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#hiddenWeekDays) within the view's configuration object.