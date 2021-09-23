A header filter allows users to select values from a predefined set and filter rows by these values. The values are listed in a pop-up menu. To open this menu, users can click header filter icons in column headers.

### Display Header Filter Icons

Enable the **headerFilter**.[visible](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/headerFilter/#visible) property to display header filter icons for all columns. If you want to hide the icon for a specific column, disable the column's [allowHeaderFiltering](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/columns/#allowHeaderFiltering) property.

### Enable Search Within Header Filters

Users can search values within header filters. To display the search bar, assign **true** to the [allowSearch](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/headerFilter/#allowSearch) property in the global [headerFilter](/Documentation/ApiReference/UI_Components/dxGantt/Configuration/headerFilter/) object.

### Change Available Filter Values

Filter values are generated automatically based on column values.
