import 'ui/tree_list';
import { baseModuleConfig } from '../../helpers/dataGridHelper.js';
import $ from 'jquery';
import { TreeListWrapper } from '../../helpers/wrappers/dataGridWrappers.js';

const treeListWrapper = new TreeListWrapper('#treeList');


QUnit.testStart(function() {
    const markup = `
        <div id="treeList"></div>
    `;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Virtual Scrolling', baseModuleConfig, () => {
    // T1097528
    [true, false].forEach(legacyMode => {
        QUnit.test('Last row should not disappear after adding new row when refreshMode is repaint', function(assert) {
        // arrange
            const treeList = $('#treeList').dxTreeList({
                dataSource: [{ id: 1 }, { id: 2 }],
                keyExpr: 'id',
                height: 100,
                scrolling: {
                    virtual: true,
                    legacyMode
                },
                editing: {
                    refreshMode: 'repaint'
                },
            }).dxTreeList('instance');

            this.clock.tick(500);

            // assert
            assert.strictEqual(treeList.getVisibleRows().length, 2, 'visible rows count');

            // act
            treeList.addRow();
            treeList.saveEditData();

            // assert
            assert.strictEqual(treeList.getVisibleRows().length, 3, 'visible rows count');
        });
    });

    QUnit.test('It should be possible to scroll to the last row when columnAutoWidth: true (T1121483)', function(assert) {
        // arrange
        const employees = [
            {
                ID: 1,
                Head_ID: -1,
                Full_Name: 'John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart John Heart ',
                Title: 'CEO',
            }, {
                ID: 2,
                Head_ID: 1,
                Full_Name: 'Samantha Bright',
                Title: 'COO',
            }, {
                ID: 3,
                Head_ID: 1,
                Full_Name: 'Arthur Miller',
                Title: 'CTO',
            }, {
                ID: 4,
                Head_ID: 1,
                Full_Name: 'Robert Reagan',
                Title: 'CMO',
            }, {
                ID: 5,
                Head_ID: 1,
                Full_Name: 'Greta Sims',
                Title: 'HR Manager',
            }, {
                ID: 6,
                Head_ID: 3,
                Full_Name: 'Brett Wade',
                Title: 'IT Manager',
            }, {
                ID: 7,
                Head_ID: 5,
                Full_Name: 'Sandra Johnson',
                Title: 'Controller',
            }, {
                ID: 8,
                Head_ID: 4,
                Full_Name: 'Ed Holmes',
                Title: 'Sales Manager',
            }, {
                ID: 9,
                Head_ID: 3,
                Full_Name: 'Barb Banks',
                Title: 'Support Manager',
            }, {
                ID: 10,
                Head_ID: 2,
                Full_Name: 'Kevin Carter',
                Title: 'Shipping Manager',
            }, {
                ID: 11,
                Head_ID: 5,
                Full_Name: 'Cindy Stanwick',
                Title: 'HR Assistant',
            }, {
                ID: 12,
                Head_ID: 8,
                Full_Name: 'Sammy Hill',
                Title: 'Sales Assistant',
            }, {
                ID: 13,
                Head_ID: 10,
                Full_Name: 'Davey Jones',
                Title: 'Shipping Assistant',
            }, {
                ID: 14,
                Head_ID: 10,
                Full_Name: 'Victor Norris',
                Title: 'Shipping Assistant',
            }, {
                ID: 15,
                Head_ID: 10,
                Full_Name: 'Mary Stern',
                Title: 'Shipping Assistant',
            }, {
                ID: 16,
                Head_ID: 10,
                Full_Name: 'Robin Cosworth',
                Title: 'Shipping Assistant',
            }, {
                ID: 17,
                Head_ID: 9,
                Full_Name: 'Kelly Rodriguez',
                Title: 'Support Assistant',
            }, {
                ID: 18,
                Head_ID: 9,
                Full_Name: 'James Anderson',
                Title: 'Support Assistant',
            }, {
                ID: 19,
                Head_ID: 9,
                Full_Name: 'Antony Remmen',
                Title: 'Support Assistant',
            }, {
                ID: 20,
                Head_ID: 8,
                Full_Name: 'Olivia Peyton',
                Title: 'Sales Assistant',
            }, {
                ID: 21,
                Head_ID: 6,
                Full_Name: 'Taylor Riley',
                Title: 'Network Admin',
            }, {
                ID: 22,
                Head_ID: 6,
                Full_Name: 'Amelia Harper',
                Title: 'Network Admin',
            }, {
                ID: 23,
                Head_ID: 6,
                Full_Name: 'Wally Hobbs',
                Title: 'Programmer',
            }, {
                ID: 24,
                Head_ID: 6,
                Full_Name: 'Brad Jameson',
                Title: 'Programmer',
            }, {
                ID: 25,
                Head_ID: 6,
                Full_Name: 'Karen Goodson',
                Title: 'Programmer',
            }, {
                ID: 26,
                Head_ID: 5,
                Full_Name: 'Marcus Orbison',
                Title: 'Travel Coordinator',
            }, {
                ID: 27,
                Head_ID: 5,
                Full_Name: 'Sandy Bright',
                Title: 'Benefits Coordinator',
            }, {
                ID: 28,
                Head_ID: 6,
                Full_Name: 'Morgan Kennedy',
                Title: 'Graphic Designer',
            }, {
                ID: 29,
                Head_ID: 28,
                Full_Name: 'Violet Bailey',
                Title: 'Jr Graphic Designer',
            }, {
                ID: 30,
                Head_ID: 5,
                Full_Name: 'Ken Samuelson',
                Title: 'Ombudsman',
            }
        ];

        const treeList = $('#treeList').dxTreeList({
            dataSource: employees,
            keyExpr: 'ID',
            height: 480,
            width: 500,
            wordWrapEnabled: true,
            columns: [{
                dataField: 'Title',
                caption: 'Position',
                width: 120,
            }, {
                dataField: 'Full_Name',
                width: 400
            }],
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            editing: {
                refreshMode: 'repaint'
            },
        }).dxTreeList('instance');

        this.clock.tick(1000);
        let visibleRows = treeList.getVisibleRows();
        // assert

        // assert
        assert.equal(visibleRows.length, 16, 'rows are rendered initially');
        assert.equal(visibleRows[0].key, 1, 'initial first visible row');
        assert.equal(visibleRows[visibleRows.length - 1].key, 16, 'initial last visible row');

        // act
        treeList.getScrollable().scrollTo({ top: 100000 });
        this.clock.tick(500);
        visibleRows = treeList.getVisibleRows();


        // assert
        assert.equal(visibleRows.length, 10, 'rows are rendered at the bottom');
        assert.equal(visibleRows[0].key, 21, 'first visible row at the bottom');
        assert.equal(visibleRows[visibleRows.length - 1].key, 30, 'last visible row at the bottom');
        assert.ok(treeListWrapper.rowsView.isRowVisible(10), 'last row visible');

        // act
        treeList.getScrollable().scrollTo({ top: 100000 });
        this.clock.tick(300);
        visibleRows = treeList.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 10, 'rows are rendered at the bottom second time');
        assert.equal(visibleRows[0].key, 21, 'first visible row at the bottom second time');
        assert.equal(visibleRows[visibleRows.length - 1].key, 30, 'last visible row at the bottom second time');
        assert.ok(treeListWrapper.rowsView.isRowVisible(10), 'last row visible');

    });
});
