import React from 'react';
import { type TreeListTypes } from 'devextreme-react/tree-list';
import { type Employee } from './types';

export default function Email(props: TreeListTypes.ColumnCellTemplateData<Employee>) {
  const { Email } = props.data;

  return <a href={`mailto:${Email}`}>{Email}</a>;
}
