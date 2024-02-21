import React from 'react';

type DataCellProps = {
  data: { startDate: Date; groups: { employeeID: number; }; text: string; }
};

const isWeekEnd = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const getCurrentTraining = (date: number, employeeID: number) => {
  const result = (date + employeeID) % 3;
  const currentTraining = `training-background-${result}`;

  return currentTraining;
};

const DataCell = (props: DataCellProps) => {
  const { data: { startDate, groups: { employeeID }, text } } = props;

  const dayClasses = [
    'day-cell',
    getCurrentTraining(startDate.getDate(), employeeID),
  ];

  const employeeClasses = [`employee-${employeeID}`, 'dx-template-wrapper'];
  if (isWeekEnd(startDate)) {
    employeeClasses.push(`employee-weekend-${employeeID}`);
  }

  return (
    <div className={employeeClasses.join(' ')}>
      <div className={dayClasses.join(' ')}>
        {text}
      </div>
    </div>
  );
};

export default DataCell;
