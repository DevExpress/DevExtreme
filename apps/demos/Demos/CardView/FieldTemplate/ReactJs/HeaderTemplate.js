import React from 'react';

const HeaderTemplate = ({ text }) => (
  <div
    className="task__header"
    title={text}
  >
    {text}
  </div>
);
export default HeaderTemplate;
