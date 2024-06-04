This demo applies different selection modes and date availability options to the Calendar component.

## Selection Modes

The selected value or values are stored in the [value](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#value) property. The following [selection modes](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#selectionMode) are available:

- *'single'*    
A user can select only a single date at any given time.

- *'multiple'*     
A user can select multiple dates simultaneously.

- *'range'*      
A user can select a range of dates. The first and the last date in the range are stored in the [value](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#value) property.

If you enable [selectWeekOnClick](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#selectWeekOnClick) in *'multiple'* or *'range'* modes, users can select a week by clicking on the week number.

## Disable and Clear Dates

Use the [min](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#min) and [max](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#max) properties to specify the range of available dates. In this demo, these properties limit the range to three days before and after the current date. Enable the "Set minimum date" and "Set maximum date" checkboxes to apply the properties.

If you need to disable specific dates, use the [disabledDates](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#disabledDates) property. Toggle the "Disable weekends" checkbox to see how this setting affects component behavior. You can specify either an array of predefined dates or a function that determines whether a date is available.

When using *'multiple'* and *'range'* [selection modes](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#selectionMode), the behavior of disabled dates in the Calendar is as follows:

- If you specify the [value](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#value) property programmatically, disabled dates are selected in the values array.

- If you use the UI to change selection (click on dates or weeks, the Enter key), you cannot select disabled dates in *'multiple'* mode. In *'range'* mode, disabled dates cannot start or end a range, but can be included in the middle.

To clear selected values, call the Calendar [clear()](/Documentation/ApiReference/UI_Components/dxCalendar/Methods/#clear) method.