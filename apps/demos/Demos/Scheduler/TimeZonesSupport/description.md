Our DevExtreme Scheduler allows you to specify time zones for the component and its appointments. In this demo, you can change the component time zone using the [SelectBox](/Documentation/Guide/UI_Components/SelectBox/Overview/) above the Scheduler. The [getTimeZones()](/Documentation/ApiReference/Common/Utils/utils/#getTimeZonesdate_timeZones) method call populates the SelectBox with values.

In this demo, you can change the component time zone with the [SelectBox](/Documentation/Guide/UI_Components/SelectBox/Overview/) above the Scheduler. To populate the SelectBox, this demo calls the [getTimeZones()](/Documentation/ApiReference/Common/Utils/utils/#getTimeZonesdate_timeZones) utility method.
<!--split-->

To define the time zone on the component level, assign an <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank">IANA time zone</a> value to the [timeZone](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#timeZone) property. To change time zones for appointments, enable the **editing**.[allowTimeZoneEditing](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/editing/#allowTimeZoneEditing) option. 

Our Scheduler also supports different time zones for appointment start and end dates ([startDateTimeZone](/Documentation/ApiReference/UI_Components/dxScheduler/Interfaces/dxSchedulerAppointment/#startDateTimeZone) and [endDateTimeZone](/Documentation/ApiReference/UI_Components/dxScheduler/Interfaces/dxSchedulerAppointment/#endDateTimeZone) appointment properties).
