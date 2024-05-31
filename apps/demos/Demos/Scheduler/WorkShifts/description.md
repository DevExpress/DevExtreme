This demo uses the Scheduler component’s [offset](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#offset) property to indicate the starting point of a day. The Scheduler’s offset can be set in multiples of 5 and can range from -1440 minutes (-24 hours) to 1440 minutes (24 hours).
<!--split-->

For instance, if you set the offset to -120, like the **First shift** in this demo, the day begins at 10:00 PM on the previous day instead of 00:00. If you set the offset to 360, like the **Second shift**, the day begins at 6:00 AM.

You can also combine this property with [startDayHour](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#startDayHour), [endDayHour](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#endDayHour), and [cellDuration](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#cellDuration) to obtain desired display results.