import React from 'react';

export default function Status(props) {
  const { Status } = props.data;
  return (
    <div className={`status status--${Status.toLowerCase()}`}>
      <div className="indicator" />
      <div>{Status}</div>
    </div>
  );
}
