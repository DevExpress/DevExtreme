The DevExtreme JavaScript Gantt component allows users to sort the displayed data by one or more columns.
<!--split-->

Use the **sorting**.[mode](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/sorting/#mode) property to switch between the following sort options:

- **Single**       
Click on a particular column header to sort the Gantt data by that column. A further click on the header will invert the sort order. A glyph within the column header indicates the sort order.
- **Multiple**       
Press and hold the **Shift** key and select column headers by clicking on them to sort the Gantt data by multiple columns. The overall sort order will depend on the order the column headers were selected. A number is displayed within the header to show the index of that column in the overall sort order.

To exclude a column from the sort criteria, hold **Ctrl** and click the column header.

A header’s context menu allows a user to define the column’s sort settings. To disable sorting for a particular column, set the column’s [allowSorting](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/#allowSorting) property to **false**.

The [sortOrder](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/#sortOrder) and [sortIndex](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/#sortIndex) properties allow you to specify the initial sort settings and to change them at runtime.
