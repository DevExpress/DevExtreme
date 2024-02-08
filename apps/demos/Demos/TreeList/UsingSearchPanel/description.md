If you want users to search data, display the [searchPanel](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/searchPanel/). Set its [visible](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/searchPanel/#visible) property to **true**.

The TreeList searches in all columns, regardless of whether they are [visible](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#visible) or hidden. To exclude hidden columns from search, enable the **searchPanel**.[searchVisibleColumnsOnly](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/searchPanel/#searchVisibleColumnsOnly) property. You can also exclude any specific column. To do this, set its [allowSearch](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/columns/#allowSearch) property to **false**

Numeric, date, and Boolean values match only if they are equal to the search query. String values match if they contain the query. Search for strings is case-insensitive.

To specify a search query in code, set the **searchPanel**.[text](/Documentation/ApiReference/UI_Components/dxTreeList/Configuration/searchPanel/#text) property or call the [searchByText(text)](/Documentation/ApiReference/UI_Components/dxTreeList/Methods/#searchByTexttext) method.
