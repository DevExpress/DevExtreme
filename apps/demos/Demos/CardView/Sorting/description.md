The DevExtreme CardView component can sort values against one or more fields. Use the **sorting**.[mode](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/sorting/#mode) property to specify sort mode.
<!--split-->

- **Single sort mode**       
A user can click a header panel item to sort by a given field and click it again to change sort order (ascending or descending). An arrow icon in the header panel item indicates sort order.

- **Multiple sort mode**         
A user can hold the **Shift** key and click multiple header panel items to reorder cards. A number in the header panel item indicates the sort index.

To cancel field sort settings, hold the **Ctrl** key (**Cmd** on macOS) and click the appropriate header panel item.

You can also apply or cancel sort settings via the header panel item's context menu. To disable sort operations for a particular field, set the field's [allowSorting](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#allowSorting) property to `false`.

To specify initial sort settings, use the field's [sortOrder](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#sortOrder) and [sortIndex](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#sortIndex) properties. You can also use these properties to change sort settings at runtime.