import React from 'react';
import { type TreeListTypes } from 'devextreme-react/tree-list';
import { type Employee } from './types';

export default function Employee(props: TreeListTypes.ColumnCellTemplateData<Employee>) {
  const { First_Name, Last_Name } = props.data;

  return (
    <div className="name__wrapper">
      <div className="name__img-wrapper">
        <img
          src={`../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`}
          alt={`${First_Name} ${Last_Name}`}
        />
      </div>
      <div className="name__text-wrapper">
        <div>{First_Name}</div>
        <div>{Last_Name}</div>
      </div>
    </div>
  );
}
