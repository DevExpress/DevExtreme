When you add a Calendar to an application, you need to specify its [value](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#value) in one of the following formats: 

- Date objects

- The number of milliseconds since 00:00:00 on January 1, 1970

- Strings that match the following patterns: 
    - 'yyyy-MM-dd'
    - 'yyyy-MM-ddTHH:mm:ss'
    - 'yyyy-MM-ddTHH:mm:ssZ'
    - 'yyyy-MM-ddTHH:mm:ssx' 

This demo shows how to use additional properties to customize your Calendar. You can toggle the checkboxes on the right to change the Calendar in real time.

## Disable Dates

Use the [min](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#min) and [max](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#max) properties to specify the range of available dates. In this demo, these properties limit the range to three days before and after the current date. Enable the "Specified min value" and "Specified max value" checkboxes to apply the properties.

If you need to disable specific dates, use the [disabledDates](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#disabledDates) property. Toggle the "Disable weekend" checkbox to see how this setting affects the component's behavior. You can specify either an array of predefined dates or a function that determines whether a date is available.

## Specify First Day of Week and Display Week Numbers

To specify the first day of the week, assign its index (0 - for Sunday, 1 - for Monday, and so on) to the [firstDayOfWeek](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#firstDayOfWeek) property. You can also display a column with week numbers. For this, enable the [showWeekNumbers](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#showWeekNumbers) property.

## Handle Value Change

To handle value changes, use two-way binding to bind the **value** properties of different components. In this demo, you can use the [DateBox](/Documentation/Guide/UI_Components/DateBox/Getting_Started_with_DateBox/) or Calendar component to change the date because their **value** properties are bound.

## Customize Cell Appearance

Use the [cellTemplate](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#cellTemplate) property to customize cell appearance. In this demo, when you toggle the "Use the Custom Cell Template" checkbox, all the weekends on the Calendar become blue, and all the holidays become red. You can set your own function that changes the class of the span element that contains cell text.

## Other Customizations

Set the [disabled](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#disabled) property to disable the Calendar.

To specify the initial calendar view (month, year, decade, or century), set the [zoomLevel](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#zoomLevel) property.