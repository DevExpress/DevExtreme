This demo shows how to use additional properties to customize your Calendar. You can toggle the checkboxes on the right to change the Calendar in real time.
<!--split-->

When you add a Calendar to an application, you need to specify its [value](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#value) in one of the following formats: 

- Date    
Specifies the date directly.

- Number    
Specifies the date with a timestamp (total milliseconds since 1970/01/01).

- String    
Specifies the date with a string value. The UI component supports the following formats of a date string:

    - "yyyy-MM-dd" (for example, "2017-03-06")
    - "yyyy-MM-ddTHH:mm:ss" (for example, "2017-03-27T16:54:48")
    - "yyyy-MM-ddTHH:mm:ssZ" (for example, "2017-03-27T13:55:41Z")
    - "yyyy-MM-ddTHH:mm:ssx" (for example, "2017-03-27T16:54:10+03")

- Array of the formats mentioned before    
Available only for *'multiple'* and *'range'* [selection modes](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#selectionMode). The array includes all selected dates. 

## Specify First Day of Week and Display Week Numbers

To specify the first day of the week, assign its index (0 - for Sunday, 1 - for Monday, and so on) to the [firstDayOfWeek](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#firstDayOfWeek) property. You can also display a column with week numbers. For this, enable the [showWeekNumbers](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#showWeekNumbers) property.

The start of the first week of the year depends on the locale. If you want to apply a specific rule, use the [weekNumberRule](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#weekNumberRule) property.

## Handle Value Change

Set the [onValueChanged](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#onValueChanged) property to handle the **value** change. In this demo, the [DateBox](/Documentation/Guide/UI_Components/DateBox/Getting_Started_with_DateBox/) and the Calendar both use this property to pass values between each other, and you can use one of these components to change the date.

## Customize Cell Appearance

Use the [cellTemplate](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#cellTemplate) property to customize cell appearance. In this demo, the following customizations are applied when you toggle the "Use custom cell template" checkbox:

- All the weekends on the Calendar become blue.

- All the holidays become red.

- If a column with week numbers is shown, week numbers are italicized. 

You can set your own function that changes the class of the span element that contains cell text.

## Other Customizations

Set the [disabled](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#disabled) property to disable the Calendar.

To specify the initial calendar view (month, year, decade, or century), set the [zoomLevel](/Documentation/ApiReference/UI_Components/dxCalendar/Configuration/#zoomLevel) property.