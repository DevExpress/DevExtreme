The [DateBox](/Documentation/ApiReference/UI_Components/dxDateBox/) editor helps users enter or modify date and time values.
<!--split--> 

This demo illustrates the following DateBox properties:

- [value](/Documentation/ApiReference/UI_Components/dxDateBox/Configuration/#value)     
A value the DateBox displays.

- [type](/Documentation/ApiReference/UI_Components/dxDateBox/Configuration/#type)       
Specifies whether the DateBox allows users to select one of the following types:

  - *"date"*    
  Users can select the date from the calendar, or they can type in their own date value (in the required format).

  - *"time"*    
  Users can select a time from a range between 12:00 AM and 11:30 PM at 30-minute intervals, or they can type in their own time value (in the required format). Specify the [interval](/Documentation/ApiReference/UI_Components/dxDateBox/Configuration/#interval) property to set the time interval.

  - *"datetime"*    
  Users can select the date from the calendar and the time from the spin and dropdown editors. They can also choose the **Today** button.

- [displayFormat](/Documentation/ApiReference/UI_Components/dxDateBox/Configuration/#displayFormat)        
A date/time display format. You can use one of the [predefined formats](/Documentation/ApiReference/Common/Object_Structures/format/#type) or specify a [custom format](/Documentation/Guide/Common/Value_Formatting/#Format_Widget_Values/Custom_Format_String). This demo illustrates the latter.

- [pickerType](/Documentation/ApiReference/UI_Components/dxDateBox/Configuration/#pickerType)        
Specifies the type of UI used to select a date or time. This demo shows how to change a calendar to a roller date picker. 

- [showClearButton](/Documentation/ApiReference/UI_Components/dxDateBox/Configuration/#showClearButton)        
Specifies whether to display the button that clears the DateBox **value**.

- [disabled](/Documentation/ApiReference/UI_Components/dxDateBox/Configuration/#disabled)        
Specifies whether the DateBox responds to user interaction.

- [disabledDates](/Documentation/ApiReference/UI_Components/dxDateBox/Configuration/#disabledDates)      
Dates that are not available for selection.

- [applyValueMode](/Documentation/ApiReference/UI_Components/dxDateBox/Configuration/#applyValueMode)     
Defines whether the selected value applies instantly or after a user clicks the **Apply** button.

To get started with the DevExtreme DateBox component, refer to the following tutorial for step-by-step instructions: [Getting Started with DateBox](/Documentation/Guide/UI_Components/DateBox/Getting_Started_with_DateBox/).