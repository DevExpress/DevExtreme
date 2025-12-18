import React from 'react';

import { type TreeListTypes } from 'devextreme-react/tree-list';

import { type Employee } from './types';

export default function Status(props: TreeListTypes.ColumnCellTemplateData<Employee>) {
  const { Status } = props.data;
  const statusClass = Status ? `status status--${Status.toLowerCase()}` : '';

  return (
    <div className={statusClass}>
      <div className="indicator" />
      <div>{Status}</div>
    </div>
  );
}
