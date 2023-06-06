DateRangeBox API includes the [displayFormat](/Documentation/ApiReference/UI_Widgets/dxDateRangeBox/Configuration/#displayFormat) property that allows you to change date display format. This demo shows the following examples:

- **Locale-dependent format**     
DateRangeBox formats date range values according to the specified locale. You do not need to define a format with the **displayFormat** property. For more information, refer to the [Localize Dates, Numbers, and Currencies](/Documentation/Guide/Common/Localization/#Localize_Dates_Numbers_and_Currencies) topic. 

- **Built-in predefined formats**    
DevExtreme allows you to apply various [predefined formats](/Documentation/ApiReference/Common/Object_Structures/format/#type). You can specify simple strings or shortcuts that define widely used date formats instead of complex expressions. This demo illustrates how to display dates in the "shortdate" format. 

- **Locale Data Markup Language (LDML) pattern**    
To define a custom date format string, you can use an LDML pattern. In this demo, the **displayFormat** property is set to "EEEE, d of MMM, yyyy". This expression illustrates a combination of the day of the week, day number, month and year. The input field displays the formatted value. Refer to the [Custom Format String](/Documentation/Guide/Common/Value_Formatting/#Format_Widget_Values/Custom_Format_String) topic for information about supported format characters.    

- **Add literal characters**    
You can specify the **displayFormat** property as a string that contains literal and Locale Data Markup Language characters. We recommend you to wrap any characters that are not part of the LDML pattern in quotation marks. Otherwise, they can be interpreted as wildcards. In this demo, if you specify the word "Year" without quotation marks, the letter "a" is interpreted as an "AM/PM" placeholder.

To ensure that the input value matches **displayFormat**, you can apply a corresponding input mask to DateRangeBox. Set [useMaskBehavior](/Documentation/ApiReference/UI_Widgets/dxDateRangeBox/Configuration/#useMaskBehavior) property to **true**.

Refer to the [Value Formatting](/Documentation/Guide/Common/Value_Formatting/) article, for more information.
