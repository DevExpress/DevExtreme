The DevExtreme JavaScript **Gantt** component allows users to filter a particular column by values listed in a pop-up menu. To open this menu, click the filter icon in the column header.
## Display Header Filter Icons

Set the **headerFilter**.[visible](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/headerFilter/#visible) property to **true** to display filter icons for all columns. To hide the filter icon for a specific column, disable that column’s [allowHeaderFilter](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/#allowHeaderFiltering) property.

## Enable Search in Header Filters

Users can search for values in a header filter. To display the search bar, set the **search.**[enabled](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/headerFilter/search/#enabled) property to **true** in the global [headerFilter](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/headerFilter/) object or in a column’s [headerFilter](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/headerFilter/) object. Use the **search.**[mode](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/headerFilter/search/#mode) property to specify the comparison type.

## Change Available Filter Values

A header filter consists of unique values in its column. To change the filter values, group them with the [groupInterval](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/headerFilter/#groupInterval) property or bind the [data source](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/headerFilter/#dataSource) to this header filter.
