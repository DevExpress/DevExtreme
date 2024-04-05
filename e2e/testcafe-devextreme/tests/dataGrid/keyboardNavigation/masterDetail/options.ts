import { ClientFunction } from 'testcafe';
import type { Properties } from 'devextreme/ui/data_grid';
import { employees, tasks } from './data';

// NOTE: testcafe fails if adding imported variable to dependencies
const gridTasks = tasks;

export const gridOptions: Properties = {
  dataSource: employees,
  keyExpr: 'ID',
  showBorders: true,
  columns: [{
    dataField: 'Prefix',
    caption: 'Title',
    width: 70,
  },
  'FirstName',
  'LastName', {
    dataField: 'BirthDate',
    dataType: 'date',
  },
  ],
  editing: {
    mode: 'form',
    allowUpdating: true,
  },
  masterDetail: {
    enabled: true,
    template: ClientFunction((container, options) => {
      const devexpress = (window as any).DevExpress;
      const currentEmployeeData = options.data;

      $('<div>')
        .addClass('master-detail-caption')
        .text(`${currentEmployeeData.FirstName} ${currentEmployeeData.LastName}'s Tasks:`)
        .appendTo(container);

      $('<div>')
        // @ts-expect-error dx.all.d.ts typings are missing
        .dxDataGrid({
          columnAutoWidth: true,
          showBorders: true,
          columns: ['Priority', {
            caption: 'Completed',
            dataType: 'boolean',
            calculateCellValue(rowData) {
              return rowData.Status === 'Completed';
            },
          }],
          dataSource: new devexpress.data.DataSource({
            store: new devexpress.data.ArrayStore({
              key: 'ID',
              data: gridTasks,
            }),
            filter: ['EmployeeID', '=', options.key],
          }),
        }).appendTo(container);
    }, { dependencies: { gridTasks } }),
  },
};
