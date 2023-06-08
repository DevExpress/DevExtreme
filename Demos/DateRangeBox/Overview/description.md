The [DateRangeBox](/Documentation/ApiReference/UI_Components/dxDateRangeBox/) component allows users to select a date range with ease. The component includes input boxes for start/end dates and a drop-down date picker. This demo illustrates how to apply the following DateRangeBox settings:

- [value](/Documentation/ApiReference/UI_Components/dxDateRangeBox/Configuration/#value)
An array where you can specify the selected range (start/end dates). The DateRangeBox also allows you to define start/end dates separately. For this purpose, use the [startDate](/Documentation/ApiReference/UI_Components/dxDateRangeBox/Configuration/#startDate) and [endDate](/Documentation/ApiReference/UI_Components/dxDateRangeBox/Configuration/#endDate) properties instead.

- [displayFormat](/Documentation/ApiReference/UI_Components/dxDateRangeBox/Configuration/#displayFormat) 
Date display format. You can use one of our [predefined formats](/Documentation/ApiReference/Common/Object_Structures/format/#type) or specify a [custom format](/Documentation/Guide/Common/Value_Formatting/#Format_Widget_Values/Custom_Format_String) as needs dictate. This demo illustrates the latter.

- [disabled](/Documentation/ApiReference/UI_Components/dxDateRangeBox/Configuration/#disabled)        
Specifies whether the DateRangeBox responds to user interaction.
Expand All
	@@ -16,6 +17,6 @@ Displays the button that clears DateRangeBox **values**.
Switches between a single-month and two-month dropdown calendar.

- [applyValueMode](/Documentation/ApiReference/UI_Components/dxDateBox/Configuration/#applyValueMode)     
Defines whether the selected value is applied instantly or after a user clicks the **Apply** button.

To get started with the DevExtreme DateRangeBox component, refer to the [Getting Started with DateRangeBox](/Documentation/Guide/UI_Components/DateRangeBox/Getting_Started_with_DateRangeBox/) tutorial.
