Use our DateRangeBox [displayFormat](/Documentation/ApiReference/UI_Widgets/dxDateRangeBox/Configuration/#displayFormat) property to change date display format as requirements dictate. This demo illustrates the following:

- **Locale-dependent format**     
DateRangeBox formats date range values based upon the specified locale. You do not need to define a format with the **displayFormat** property. For more information, refer to the following help topic: [Localize Dates, Numbers, and Currencies](/Documentation/Guide/Common/Localization/#Localize_Dates_Numbers_and_Currencies).

- **Built-in predefined formats**    
DevExtreme allows you to apply various [predefined formats](/Documentation/ApiReference/Common/Object_Structures/format/#type). You can specify simple strings or shortcuts that define widely used date formats instead of complex expressions. This demo illustrates how to display dates using the "shortdate" format.

- **Locale Data Markup Language (LDML) pattern** 
To define a custom date format string, use the LDML pattern. In this demo, the **displayFormat** property is set to "EEEE, d of MMM, yyyy". This expression displays week day, day number, month and year. The input field displays the formatted value. For additional information on supported format characters, refer to the following help topic: [Custom Format String](/Documentation/Guide/Common/Value_Formatting/#Format_Widget_Values/Custom_Format_String).
  
- **Add literal characters**  
You can specify the **displayFormat** property as a string with literal and Locale Data Markup Language characters. You should wrap characters that are not part of the LDML pattern within quotation marks - otherwise, they may be interpreted as wildcards. In this demo, if you specify the word "Year" without quotation marks, the letter "a" is interpreted as an "AM/PM" placeholder.

To ensure that input values match **displayFormat**, you can apply an input mask to our DateRangeBox (set the control’s [useMaskBehavior](/Documentation/ApiReference/UI_Widgets/dxDateRangeBox/Configuration/#useMaskBehavior) property to **true**).

For additional formatting-related information, please refer to the following help topic: [Value Formatting](/Documentation/Guide/Common/Value_Formatting/).
