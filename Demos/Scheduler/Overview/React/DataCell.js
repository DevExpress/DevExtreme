import React from 'react';

function isWeekEnd(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function getCurrentTraining(date, employeeID) {
  const result = (date + employeeID) % 3;
  const currentTraining = `training-background-${result}`;

  return currentTraining;
}

class DataCell extends React.PureComponent {

  render() {
    const { data: { startDate, groups: { employeeID }, text } } = this.props;
    const dayClasses = [
      'day-cell',
      getCurrentTraining(startDate.getDate(), employeeID)
    ];

    const employeeClasses = [ `employee-${employeeID}`, 'dx-template-wrapper' ];
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
  }
}

export default DataCell;
