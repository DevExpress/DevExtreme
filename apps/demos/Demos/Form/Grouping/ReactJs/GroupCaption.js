import React from 'react';

const GroupCaption = ({ iconName, caption }) => (
  <>
    <i className={`dx-icon dx-icon-${iconName}`}></i>
    <span>{caption}</span>
  </>
);
export default GroupCaption;
