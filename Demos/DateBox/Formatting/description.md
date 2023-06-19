Use the [displayFormat](/Documentation/ApiReference/UI_Widgets/dxDateBox/Configuration/#displayFormat) property to change how DateBox displays date values. This demo illustrates the following:

- **Locale-dependent format**
The DateBox formats values based upon a user's locale. This is the default format. As such, you do not need to define the **displayFormat** property. Refer to the following help topic for more information: [Localize Dates, Numbers, and Currencies](/Documentation/Guide/Common/Localization/#Localize_Dates_Numbers_and_Currencies)

- **Built-in predefined formats**
DevExtreme supports various [predefined formats](/Documentation/ApiReference/Common/Object_Structures/format/#type). You can use simple strings or shortcuts that define commonly used date formats instead of complex expressions. Review the linked document for a list of values you can assign to **displayFormat**. This demo uses the "shortdate" format.

- **LDML pattern**
Use an LDML pattern to construct a custom date-time format string. This demo sets **displayFormat** property to "EEEE, d of MMM, yyyy HH:mm". This expression displays week day, day number, month, year, hour, and minute. The editor displays the formatted value. Refer to the following help topic for information about supported format characters: [Custom Format String](/Documentation/Guide/Common/Value_Formatting/#Format_Widget_Values/Custom_Format_String).   

- **Format with literal characters**
Specify the **displayFormat** property as a string that contains literal and LDML characters. Wrap any characters that are not part of the LDML pattern in quotation marks - otherwise, they may be interpreted as wildcards. In this example, if you remove quotation marks from the word "Year", the letter "a" is interpreted as an "AM/PM" placeholder.

You can also use an input mask in the DateBox. Input masks ensure that input values match the **displayFormat** (set the [useMaskBehavior](/Documentation/ApiReference/UI_Widgets/dxDateBox/Configuration/#useMaskBehavior) value to *true*).

For additional formatting-related information, please refer to the following help topic: [Value Formatting](/Documentation/Guide/Common/Value_Formatting/).
