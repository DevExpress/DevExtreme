Use the [format](/Documentation/ApiReference/UI_Components/dxNumberBox/Configuration/#format) property to specify the integer, currency, accounting, percent, and other formats of the NumberBox value.

The format property can accept the following value types:

- Predefined format    
See the [type](/Documentation/ApiReference/Common/Object_Structures/format/#type) property description for a list of accepted values.

- Custom format string    
Use a LDML pattern to specify a custom format. Refer to the following article for more information: [Custom Format String](/Documentation/Guide/Common/Value_Formatting/#Format_UI_Component_Values/Custom_Format_String).

- Function    
A function should apply a custom format to a value and return the formatted value as a string. Functions are useful for advanced formatting.

- Object    
Full format configuration. The object structure is shown in the [format](/Documentation/ApiReference/Common/Object_Structures/format/) API section.
