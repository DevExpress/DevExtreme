The DevExtreme CardView includes a column header filter option – with it, users can quickly filter cards against values selected in a pop-up menu. To display the built-in filter menu, users can click the CardView’s header filter icon (displayed within the header panel).
<!--split-->

### Display Header Filter Icons

Assign **true** to the **headerFilter**.[visible](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/headerFilter/#visible) property to display header filter icons for all columns. To hide the icon for a specific column, set the column's [allowHeaderFiltering](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#allowHeaderFiltering) property to **false**.

### Enable Search UI Within Header Filters

The DevExtreme CardView includes a text-based search option. This feature allows users to search for specific values within a header filter. To configure the search panel, define the [search](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/headerFilter/search/) property in the global [headerFilter](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/headerFilter/) object or in a **columns**.[headerFilter](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/headerFilter/) object.

The search panel's default behavior looks for values only within the same data field. You can include additional fields in the search. Specify the **search**.[searchExpr](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/headerFilter/search/#searchExpr) property for this purpose. For example, this demo allows you to enter a state name in the City column's header filter. You can then see a list of all cities within the specified state and select city names that you want to use as a filter.

To apply a comparison operation used to search header filter values, specify the **search**.[mode](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/headerFilter/search/#mode) property.
