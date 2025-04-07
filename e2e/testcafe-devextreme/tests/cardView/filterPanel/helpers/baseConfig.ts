import { data } from '../../helpers/simpleArrayData';

export const baseConfig = {
  dataSource: data,
  columns: [
    {
      dataField: 'id',
    },
    {
      dataField: 'title',
    },
    {
      dataField: 'name',
    },
    {
      dataField: 'lastName',
    },
  ],
  filterPanel: {
    visible: true,
  },
};
