import React from 'react';

export default function Status(props) {
  const { Status } = props.data;
  const statusClass = Status ? `status status--${Status.toLowerCase()}` : '';
  return (
    <div className={statusClass}>
      <div className="indicator" />
      <div>{Status}</div>
    </div>
  );
}
