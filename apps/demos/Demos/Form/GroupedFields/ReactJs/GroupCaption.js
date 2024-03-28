import React from 'react';

const GroupCaption = ({ iconName, caption }) => (
  <React.Fragment>
    <i className={`dx-icon dx-icon-${iconName}`}></i>
    <span>{caption}</span>
  </React.Fragment>
);
export default GroupCaption;
