To change how a DateBox displays dates, use the [displayFormat](/Documentation/ApiReference/UI_Widgets/dxDateBox/Configuration/#displayFormat) property. This demo illustrates the following examples:

- **Locale-dependent format**     
The DateBox formats its value according to the user's locale. This is the default format and you do not need to define the **displayFormat** property. Refer to the following help topic for more information: [Localize Dates, Numbers, and Currencies](/Documentation/Guide/Common/Localization/#Localize_Dates_Numbers_and_Currencies)

- **Built-in predefined formats**    
DevExtreme supports various [predefined formats](/Documentation/ApiReference/Common/Object_Structures/format/#type). You can use simple strings or shortcuts that define commonly used date formats instead of complex expressions. Review the linked document for a list of values you can assign to **displayFormat**.  This demo uses the "shortdate" format. 

- **LDML pattern**    
Use an LDML pattern to construct a custom date-time format string. This demo sets **displayFormat** property to "EEEE, d of MMM, yyyy HH:mm" - a combination of the day of the week, day number, month, year, hour, and minute. The editor displays the formatted value. Refer to the following help topic for information about supported format characters: [Custom Format String](/Documentation/Guide/Common/Value_Formatting/#Format_Widget_Values/Custom_Format_String)    

- **Format with literal characters**    
Specify the **displayFormat** property as a string that contains literal and LDML characters. Wrap any characters that are not part of the LDML pattern in quotation marks. Otherwise, they can be interpreted as wildcards. In this example, if you remove quotation marks from the word "Year", the letter "a" is interpreted as an "AM/PM" placeholder.

You can also use an input mask in the DateBox. Input masks ensure that the input value matches the **displayFormat**. To do this, set the [useMaskBehavior](/Documentation/ApiReference/UI_Widgets/dxDateBox/Configuration/#useMaskBehavior) value to *true*.

For more information about value formatting, refer to the [Value Formatting](/Documentation/Guide/Common/Value_Formatting/) article.
