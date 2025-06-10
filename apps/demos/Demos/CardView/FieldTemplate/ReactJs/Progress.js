import React from 'react';
import { ProgressBar } from 'devextreme-react/progress-bar';

const elementAttr = { 'aria-label': 'Progress Bar' };
const Progress = ({ value }) => (
  <div className="task__progress">
    <ProgressBar
      value={value}
      elementAttr={elementAttr}
      statusFormat={(ratio) => `${ratio * 100}%`}
    />
  </div>
);
export default Progress;
