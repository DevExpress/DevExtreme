
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import DataGrid from '../../model/dataGrid';

fixture `Virtual Columns`
    .page(url(__dirname, '../container.html'));

test('DataGrid should not scroll back to the focused cell after horizontal scrolling if \'columnRenderingMode\' is virtual', async t => {
    const dataGrid = new DataGrid('#container');

    await t.click(dataGrid.getDataCell(0, 0).element);
    await dataGrid.scrollTo({ x: 50 });
    await t.expect(dataGrid.getScrollLeft()).eql(50);
    await dataGrid.scrollTo({ x: 100 });
    await t.expect(dataGrid.getScrollLeft()).eql(100);
}).before(() => {
    const generateData = (rowCount, columnCount) => {
        const items = [];

        for(let i = 0; i < rowCount; i++) {
            const item = { };

            for(let j = 0; j < columnCount; j++) {
                item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
            }

            items.push(item);
        }

        return items;
    };

    return createWidget('dxDataGrid', {
        width: 450,
        dataSource: generateData(10, 30),
        columnWidth: 100,
        scrolling: {
            columnRenderingMode: 'virtual'
        }
    });
});
