import type DataGrid from '../../../models/dataGrid';
import DataRow from '../../../models/dataGrid/data/row';

// An inserted row shares aria-rowindex 1 with the first data row and precedes it in the DOM.
export const getFirstDataRow = (dataGrid: DataGrid): DataRow => new DataRow(
  dataGrid.getDataRow(0).element.first(),
);
