import 'generic_light.css!';
import fx from 'common/core/animation/fx';
import { createWrapper, initTestMarkup, CLASSES, isDesktopEnvironment } from '../../helpers/scheduler/helpers.js';

const { test, module, testStart } = QUnit;

const SELECTED_CELL_CLASS = CLASSES.selectedCell.slice(1);

testStart(() => initTestMarkup());

module('Cells Selection', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    },
}, () => {
    if(isDesktopEnvironment()) {
        ['standard', 'virtual'].forEach((scrollingMode) => {
            [{
                startCell: 4,
                endCell: 6,
                intermediateCells: [12],
                selectedCellsAmount: 5,
                cellFromAnotherGroup: 7,
                view: 'day',
            }, {
                startCell: 29,
                endCell: 33,
                intermediateCells: [85, 87],
                selectedCellsAmount: 9,
                cellFromAnotherGroup: 20,
                view: 'week',
            }, {
                startCell: 19,
                endCell: 39,
                intermediateCells: [29],
                selectedCellsAmount: 11,
                cellFromAnotherGroup: 24,
                view: 'month',
            }].forEach(({
                startCell, endCell, intermediateCells,
                selectedCellsAmount, cellFromAnotherGroup, view,
            }) => {
                test(`Mouse Multiselection should work correctly with ${view} when it is grouped by date when scrolling is ${scrollingMode}`, function(assert) {
                    const scheduler = createWrapper({
                        views: [{
                            type: view,
                            groupOrientation: 'horizontal',
                            groupByDate: true,
                            intervalCount: 2,
                        }],
                        currentView: view,
                        currentDate: new Date(2021, 0, 11),
                        startDayHour: 0,
                        endDayHour: 2,
                        scrolling: { mode: scrollingMode },
                        resources: [{
                            fieldExpr: 'ownerId',
                            dataSource: [{
                                id: 1, text: 'A',
                            }, {
                                id: 2, text: 'B',
                            }]
                        }],
                        groups: ['ownerId'],
                        height: 600,
                        width: 2000,
                    });

                    scheduler.workSpace.selectCells(startCell, endCell);

                    let cells = scheduler.workSpace.getCells();

                    assert.equal(scheduler.workSpace.getSelectedCells().length, selectedCellsAmount, 'the amount of selected cells is correct');
                    assert.ok(cells.eq(startCell).hasClass(SELECTED_CELL_CLASS), 'the start cell is selected');
                    assert.ok(cells.eq(endCell).hasClass(SELECTED_CELL_CLASS), 'the end cell is selected');
                    intermediateCells.forEach((cell) => {
                        assert.ok(cells.eq(cell).hasClass(SELECTED_CELL_CLASS), 'intermediate cell is selected');
                    });

                    scheduler.workSpace.selectCells(endCell, cellFromAnotherGroup);

                    cells = scheduler.workSpace.getCells();

                    assert.equal(scheduler.workSpace.getSelectedCells().length, selectedCellsAmount, 'the amount of selected cells has not changed');
                    assert.ok(cells.eq(startCell).hasClass(SELECTED_CELL_CLASS), 'the start cell is selected');
                    assert.ok(cells.eq(endCell).hasClass(SELECTED_CELL_CLASS), 'the end cell is selected');
                    intermediateCells.forEach((cell) => {
                        assert.ok(cells.eq(cell).hasClass(SELECTED_CELL_CLASS), 'intermediate cell is selected');
                    });
                    assert.notOk(cells.eq(cellFromAnotherGroup).hasClass(SELECTED_CELL_CLASS), 'cell from another group is not selected');
                });
            });
        });

        test('Header should not rerender while selection', function(assert) {
            const scheduler = createWrapper({
                views: ['week'],
                currentView: 'week',
                currentDate: new Date(2021, 0, 11),
                startDayHour: 0,
                endDayHour: 2,
                height: 600,
                width: 800,
            });

            const renderRHeaderPanelSpy = sinon.spy(scheduler.instance.getWorkSpace(), 'renderRHeaderPanel');

            scheduler.workSpace.selectCells(2, 4);

            assert.equal(renderRHeaderPanelSpy.callCount, 0, 'Header was not render');
        });
    }
});
