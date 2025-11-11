import React from 'react';
import { Vehicle } from './types';
import { type DataGridTypes } from 'devextreme-react/data-grid';

export default function Category(props: DataGridTypes.ColumnCellTemplateData<Vehicle>) {
  return <div className='category__wrapper'>{props.data.CategoryName}</div>;
}
