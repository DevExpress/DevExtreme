import React from 'react';
import { type TreeListTypes } from 'devextreme-react/tree-list';
import { type Employee } from './types';

export default function Status(props: TreeListTypes.ColumnCellTemplateData<Employee>) {
  const { Status } = props.data;

  return (
    <div className={`status status--${Status.toLowerCase()}`}>
      <div className="indicator" />
      <div>{Status}</div>
    </div>
  );
}
