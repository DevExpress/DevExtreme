If you want users to search data, display the [searchPanel](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/searchPanel/). Set its [visible](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/searchPanel/#visible) property to **true**.

The CardView searches in all fields, regardless of whether they are [visible](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#visible) or hidden. To exclude hidden fields from search, enable the **searchPanel**.[searchVisibleColumnsOnly](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/searchPanel/#searchVisibleColumnsOnly) property. You can also exclude any specific field. To do this, set its [allowSearch](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#allowSearch) property to **false**.
<!--split-->

Numeric, date, and Boolean values match only if they are equal to the search query. String values match if they contain the query. Search for strings is case-insensitive.

To specify a search query in code, set the **searchPanel**.[text](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/searchPanel/#text) property or call the [searchByText(text)](/Documentation/ApiReference/UI_Components/dxCardView/Methods/#searchByTexttext) method.
