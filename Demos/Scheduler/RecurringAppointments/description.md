A recurring appointment repeats at a specified interval. A circular arrow glyph denotes such an appointment in the view.

Do the following to create a recurring appointment:

1. Locate or create an appointment object in the [dataSource](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#dataSource). 

2. Specify the [recurrenceRule](/Documentation/ApiReference/Common/Object_Structures/dxSchedulerAppointment/#recurrenceRule) property to configure the appointment frequency. Set this property according to the <a href="http://tools.ietf.org/html/rfc2445#section-4.3.10" target="_blank">iCalendar RFC 2445</a> specification. A single data object with **recurrenceRule** creates an appointment series.

1. Optionally, use the [recurrenceException](/Documentation/ApiReference/Common/Object_Structures/dxSchedulerAppointment/#recurrenceException) property to specify the start date and time of those appointments that you want to exclude from the series.

You can use custom fields that set recurrence. To enable them, specify their names in the Scheduler's [recurrenceRuleExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#recurrenceRuleExpr) and [recurrenceExceptionExpr](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#recurrenceExceptionExpr) properties.

Users can also create recurring appointments. The appointment details form contains a *Repeat* switch. When it is on, the form displays an additional set of fields to specify recurrence rules. Double-click an appointment and select *Edit series* to view the appointment details form with the recurrence fields. You can also select *Edit appointment* to view a single non-recurring appointment from the series.
