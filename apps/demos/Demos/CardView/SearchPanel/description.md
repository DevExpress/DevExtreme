To enable user data search, activate the [searchPanel](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/searchPanel/) by setting its [visible](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/searchPanel/#visible) property to `true`.

CardView searches through all fields, whether [visible](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#visible) or hidden. To limit search operations within visible fields, enable the **searchPanel**.[searchVisibleColumnsOnly](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/searchPanel/#searchVisibleColumnsOnly) property. To omit specific fields, set the field’s [allowSearch](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/columns/#allowSearch) property to `false`.
<!--split-->

Numeric, date, and Boolean values match if they are equal to the search query. String values match if they contain the query. Search for string values is case-insensitive.

To specify a search query in code, set the **searchPanel**.[text](/Documentation/ApiReference/UI_Components/dxCardView/Configuration/searchPanel/#text) property or call the [searchByText(text)](/Documentation/ApiReference/UI_Components/dxCardView/Methods/#searchByTexttext) method.
