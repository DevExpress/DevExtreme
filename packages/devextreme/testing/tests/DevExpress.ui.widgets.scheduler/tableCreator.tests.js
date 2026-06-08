import tableCreatorModule from '__internal/scheduler/table_creator';

const { tableCreator } = tableCreatorModule;

const FIXTURE_DATA = [{
    resourceText: 'o1',
    children: [{
        resourceText: 'r1',
        children: [{
            resourceText: 'a1'
        }, {
            resourceText: 'a2'
        }]
    }, {
        resourceText: 'r2',
        children: [{
            resourceText: 'a1'
        }, {
            resourceText: 'a2'
        }]
    }, {
        resourceText: 'r3',
        children: [{
            resourceText: 'a1'
        }, {
            resourceText: 'a2'
        }]
    }]
}, {
    resourceText: 'o2',
    children: [{
        resourceText: 'r1',
        children: [{
            resourceText: 'a1'
        }, {
            resourceText: 'a2'
        }]
    }, {
        resourceText: 'r2',
        children: [{
            resourceText: 'a1'
        }, {
            resourceText: 'a2'
        }]
    }, {
        resourceText: 'r3',
        children: [{
            resourceText: 'a1'
        }, {
            resourceText: 'a2'
        }]
    }]
}];

function checkCell(cell, expectedData, assert) {
    const parentRow = cell.parentElement;

    assert.equal(parentRow.getElementsByTagName('td').length, expectedData.totalCellCount, 'Cell Count is OK');
    assert.equal(cell.textContent, expectedData.textContent, 'Cell text is OK');
    assert.strictEqual(cell.getAttribute('rowspan'), expectedData.rowspan, 'Cell rowspan is OK');
}

QUnit.module('Vertical table');

QUnit.test('Default rendering', async function(assert) {
    const table = tableCreator.makeGroupedTableFromJSON(FIXTURE_DATA);
    const rows = table.getElementsByTagName('tr');
    const cells = table.getElementsByTagName('td');

    assert.equal(table.tagName.toLowerCase(), 'table', 'Table is created');
    assert.equal(rows.length, 12, 'Row count is OK');

    checkCell(cells[0], { totalCellCount: 3, textContent: 'o1', rowspan: '6' }, assert);
    checkCell(cells[1], { totalCellCount: 3, textContent: 'r1', rowspan: '2' }, assert);
    checkCell(cells[2], { totalCellCount: 3, textContent: 'a1', rowspan: null }, assert);

    checkCell(cells[3], { totalCellCount: 1, textContent: 'a2', rowspan: null }, assert);

    checkCell(cells[4], { totalCellCount: 2, textContent: 'r2', rowspan: '2' }, assert);
    checkCell(cells[5], { totalCellCount: 2, textContent: 'a1', rowspan: null }, assert);

    checkCell(cells[6], { totalCellCount: 1, textContent: 'a2', rowspan: null }, assert);

    checkCell(cells[7], { totalCellCount: 2, textContent: 'r3', rowspan: '2' }, assert);
    checkCell(cells[8], { totalCellCount: 2, textContent: 'a1', rowspan: null }, assert);

    checkCell(cells[9], { totalCellCount: 1, textContent: 'a2', rowspan: null }, assert);

    checkCell(cells[10], { totalCellCount: 3, textContent: 'o2', rowspan: '6' }, assert);
    checkCell(cells[11], { totalCellCount: 3, textContent: 'r1', rowspan: '2' }, assert);
    checkCell(cells[12], { totalCellCount: 3, textContent: 'a1', rowspan: null }, assert);

    checkCell(cells[13], { totalCellCount: 1, textContent: 'a2', rowspan: null }, assert);

    checkCell(cells[14], { totalCellCount: 2, textContent: 'r2', rowspan: '2' }, assert);
    checkCell(cells[15], { totalCellCount: 2, textContent: 'a1', rowspan: null }, assert);

    checkCell(cells[16], { totalCellCount: 1, textContent: 'a2', rowspan: null }, assert);

    checkCell(cells[17], { totalCellCount: 2, textContent: 'r3', rowspan: '2' }, assert);
    checkCell(cells[18], { totalCellCount: 2, textContent: 'a1', rowspan: null }, assert);

    checkCell(cells[19], { totalCellCount: 1, textContent: 'a2', rowspan: null }, assert);
});

QUnit.test('Cells rendering using the \'th\' tag', async function(assert) {
    const table = tableCreator.makeGroupedTableFromJSON(FIXTURE_DATA, {
        cellTag: 'th'
    });

    const cells = table.getElementsByTagName('th');

    assert.equal(cells.length, 20, 'Cells are OK');
});

QUnit.test('Custom css class for the table', async function(assert) {
    const table = tableCreator.makeGroupedTableFromJSON(FIXTURE_DATA, {
        groupTableClass: 'group-table'
    });

    assert.equal(table.className, 'group-table', 'The table css class is OK');
});

QUnit.test('Custom css class for rows', async function(assert) {
    const table = tableCreator.makeGroupedTableFromJSON(FIXTURE_DATA, {
        groupRowClass: 'group-row'
    });

    const rows = table.getElementsByTagName('tr');

    Array.prototype.forEach.call(rows, function(row) {
        assert.equal(row.className, 'group-row', 'The row css class is OK');
    });
});

QUnit.test('Custom css class for cells', async function(assert) {
    const table = tableCreator.makeGroupedTableFromJSON(FIXTURE_DATA, {
        groupCellClass: 'group-cell'
    });

    const cells = table.getElementsByTagName('td');

    Array.prototype.forEach.call(cells, function(cell) {
        assert.equal(cell.className, 'group-cell', 'The cell css class is OK');
    });
});

QUnit.test('Custom content for cells', async function(assert) {
    const table = tableCreator.makeGroupedTableFromJSON(FIXTURE_DATA, {
        groupCellCustomContent: function(cell, cellText) {
            const innerCellContent = document.createElement('div');
            innerCellContent.className = 'cell-content';
            innerCellContent.appendChild(cellText);

            cell.appendChild(innerCellContent);
        }
    });

    const cells = table.getElementsByTagName('td');

    Array.prototype.forEach.call(cells, function(cell) {
        assert.equal(cell.getElementsByClassName('cell-content').length, 1, 'The cell content is OK');
    });
});
