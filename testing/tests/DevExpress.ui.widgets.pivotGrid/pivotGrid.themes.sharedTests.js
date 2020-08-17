import $ from 'jquery';
import PivotGrid from 'ui/pivot_grid/ui.pivot_grid';

const PIVOTGRID_EXPANDED_CLASS = 'dx-pivotgrid-expanded';
const PIVOTGRID_TOTAL_CLASS = 'dx-total';
const PIVOTGRID_ROW_TOTAL_CLASS = 'dx-row-total';
const PIVOTGRID_GRAND_TOTAL_CLASS = 'dx-grandtotal';

export const runThemesSharedTests = function(moduleNamePostfix) {
    QUnit.module('Scenarios.' + moduleNamePostfix, {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
            $('#qunit-fixture').html('<div id="PivotGrid"></div>');
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, function() {
        // T922737
        [true, false].forEach((rtlEnabled) => {
            QUnit.test(`Cell text contains inside a region of cell: rtlEnabled - ${rtlEnabled}`, function(assert) {
                const pivotGridOptions = {
                    dataSource: {
                        fields: [{
                            width: 120,
                            dataField: 'region',
                            area: 'row',
                            expanded: true
                        }, {
                            dataField: 'city',
                            area: 'row',
                        }, {
                            dataField: 'city',
                            area: 'column'
                        }],
                        store: [{
                            'region': 'North America word1',
                            'city': 'New York'
                        }]
                    }
                };

                const pivotGridElement = document.getElementById('PivotGrid');
                new PivotGrid(pivotGridElement, {
                    ...pivotGridOptions,
                    width: 400,
                    height: 400,
                    showRowGrandTotals: true,
                    rtlEnabled
                });
                this.clock.tick();

                const cellElement = pivotGridElement.querySelector(`.${PIVOTGRID_EXPANDED_CLASS}`);
                const cellTextElement = cellElement.lastChild;

                const cellRect = cellElement.getBoundingClientRect();
                const cellTextRect = cellTextElement.getBoundingClientRect();

                assert.strictEqual(cellRect.width > cellTextRect.width, true, 'width');
                assert.strictEqual(cellRect.right > cellTextRect.right, true, 'right');
                assert.strictEqual(cellRect.left < cellTextRect.left, true, 'left');
                assert.strictEqual(cellRect.top < cellTextRect.top, true, 'top');
                assert.strictEqual(cellRect.bottom > cellTextRect.bottom, true, 'bottom');


                const totalCellElement = pivotGridElement.querySelector(`.${PIVOTGRID_TOTAL_CLASS}`);
                const grandTotalCellElement = pivotGridElement.querySelector(`.${PIVOTGRID_ROW_TOTAL_CLASS}.${PIVOTGRID_GRAND_TOTAL_CLASS}.dx-last-cell`);

                const totalCellRect = totalCellElement.getBoundingClientRect();
                const totalTextRect = totalCellElement.lastChild.getBoundingClientRect();
                const grandTotalRect = grandTotalCellElement.getBoundingClientRect();
                const grandTotalTextRect = grandTotalCellElement.lastChild.getBoundingClientRect();

                if(rtlEnabled) {
                    assert.roughEqual(totalCellRect.right - totalTextRect.right, grandTotalRect.right - grandTotalTextRect.right, 0.1, 'total & grandTotal cells have the same padding');
                } else {
                    assert.roughEqual(totalTextRect.left - totalCellRect.left, grandTotalTextRect.left - grandTotalRect.left, 0.1, 'total & grandTotal cells have the same padding');
                }
            });
        });

    });
};
