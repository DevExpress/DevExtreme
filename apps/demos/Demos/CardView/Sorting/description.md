The CardView component can sort values by a single or multiple fields. Use the **sorting**.[mode](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/sorting/#mode) property to specify the sort mode.
<!--split-->

- **Single sort mode**       
A user can click the header panel item to sort by this field and click it again to change the sort order (ascending or descending). An arrow icon in the header panel item indicates the sort order.

- **Multiple sort mode**         
A user can hold the **Shift** key and click header panel items in the order the user wants to apply sorting. A number in the header panel item indicates the sort index.

To cancel a field's sort settings, a user should hold the **Ctrl** key (**Cmd** on macOS) and click the header panel item.

A user can also apply or cancel sort settings in the header panel item's context menu. To disallow a user to sort by a particular field, set the field's [allowSorting](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#allowSorting) property to `false`.

To specify the initial sort settings, use the field's [sortOrder](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#sortOrder) and [sortIndex](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#sortIndex) properties. You can also use these properties to change sort settings at runtime.