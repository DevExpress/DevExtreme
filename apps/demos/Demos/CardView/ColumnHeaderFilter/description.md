DevExtreme CardView includes a header used to filter cards by field values. Click the filter icon in the field's header panel to open the pop-up CardView filter.
<!--split-->

### Display Header Filter Icons

Assign `true` to the **headerFilter**.[visible](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/headerFilter/#visible) property to allow users to filter CardView fields with header icons. To hide the icon for a specific column, set **columns**.[allowHeaderFiltering](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#allowHeaderFiltering) to `false`.

### Enable Search UI Within Header Filters

DevExtreme CardView supports text-based search (to find specific values in a header filter). Define the [search](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/headerFilter/search/) property in the **headerFilter** object or a **columns**.[headerFilter](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/headerFilter/) object to configure this capability.

The search panel checks for values only within the same data field. To expand search to additional fields, use the **search**.[searchExpr](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/headerFilter/search/#searchExpr) property. For example, this demo allows you to enter a state name in the City column's header filter. You can then see a list of all cities within the specified state and select city names that you want to use as a filter.

To apply a comparison operation (used to search header filter values), specify the **search**.[mode](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/headerFilter/search/#mode) property.
