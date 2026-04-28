The DevExtreme Scheduler allows you to exclude specific days of the week (using the [hiddenWeekDays](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#hiddenWeekDays) property).

Use checkboxes in the options panel to toggle day visibility. A validation message appears if you attempt to hide all seven days, since at least one day must remain visible.
<!--split-->

To hide specific days of the week, assign an array of day indexes to the [hiddenWeekDays](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#hiddenWeekDays) property. The index values follow the JavaScript `date.getDay()` convention:

- `0` - Sunday
- `1` - Monday
- `2` - Tuesday
- `3` - Wednesday
- `4` - Thursday
- `5` - Friday
- `6` - Saturday

The property works across multiple view types. To hide days of the week from a specific view, use the [same property](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/views/#hiddenWeekDays) within the view configuration object.