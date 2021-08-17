testUtils.postponeUntil(() => testUtils.findElements('span').some(x => (x.innerHTML || '').indexOf('Home Appliances Total') != -1), 200, 20000).then(() => testUtils
    .postponeUntilFound('.dx-pivotgrid').then(() => testUtils.importAnd(() => 'devextreme/ui/pivot_grid', () => DevExpress.ui.dxPivotGrid, function (dxPivotGrid) {
        testUtils.findElements('.dx-pivotgrid:first-of-type').forEach((x) => {
            dxPivotGrid.getInstance(x).resetOption('height');
        })
    }))
);
