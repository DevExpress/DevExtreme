Our **DataGrid** UI component allows you to group multiple columns under one header (band). This demo shows an example: the "Nominal GDP" and "Population" bands have banded columns.

You can drag one of the bands across the grid to reorder all its banded columns simultaneously. You can also move the band to the column chooser and hide the banded columns. Banded columns remain interactive.

To create the banded layout, do one of the following:

* Assign a hierarchical structure to the [columns](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/) option. The code in this demo is an example.

* Implement a [customizeColumns](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/#customizeColumns) function where you should specify the [ownerBand](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#ownerBand) and [isBand](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#isBand) column options. Refer to the **isBand** description for a code sample.
