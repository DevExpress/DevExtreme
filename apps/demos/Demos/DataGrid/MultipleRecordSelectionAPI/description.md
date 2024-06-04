DataGrid has the following API for multiple record selection:

* [selectAll()](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#selectAll) / [deselectAll()](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#deselectAll)       
Selects / deselects all rows or current page rows, depending on the value of [selectAllMode](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/selection/#selectAllMode).

* [selectRows(keys, preserve)](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#selectRowskeys_preserve) / [deselectRows(keys)](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#deselectRowskeys)       
Selects / deselects rows with the specified keys.

* [selectRowsByIndexes(indexes)](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#selectRowsByIndexesindexes)       
Selects rows with specific indexes.

* [clearSelection()](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#clearSelection)       
Clears the selection of all rows on all pages.

* [getSelectedRowKeys()](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#getSelectedRowKeys) / [getSelectedRowsData()](/Documentation/ApiReference/UI_Components/dxDataGrid/Methods/#getSelectedRowsData)       
Gets the selected rows' keys or data objects.

In this demo, **selectAll()** or **selectRows(keys, preserve)** is called when you change the SelectBox value and **clearSelection()** is called when you click the Clear Selection button.