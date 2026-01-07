import React from 'react';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import type { Vehicle } from './types';

export default function Category(props: DataGridTypes.ColumnCellTemplateData<Vehicle>) {
  return <div className="category__wrapper">{props.data?.CategoryName}</div>;
}
