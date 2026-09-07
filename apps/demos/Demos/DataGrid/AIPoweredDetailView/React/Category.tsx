import React from 'react';
import { type DataGridTypes } from 'devextreme-react/data-grid';
import { type Vehicle } from './types';

export default function Category({ data }: DataGridTypes.ColumnCellTemplateData<Vehicle>) {
  const categoryClass = `category__wrapper category-${data?.CategoryID}__bg-color`;
  return <div className={categoryClass}>{data?.CategoryName}</div>;
}
