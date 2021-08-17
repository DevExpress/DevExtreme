testUtils
    .postponeUntilFound('.dx-pivotgrid')
    .then(() => testUtils.importAnd(() => 'devextreme/ui/pivot_grid', () => DevExpress.ui.dxPivotGrid, function (dxPivotGrid) {
        testUtils.findElements('.dx-pivotgrid:first-of-type').forEach((x) => {
            dxPivotGrid.getInstance(x).resetOption('height');
        })
    }));
