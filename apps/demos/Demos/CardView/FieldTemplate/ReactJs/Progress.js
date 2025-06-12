import React from 'react';
import { ProgressBar } from 'devextreme-react/progress-bar';

const Progress = ({ value }) => (
  <div className="task__progress">
    <ProgressBar
      value={value}
      elementAttr={{ 'aria-label': 'Progress Bar' }}
      statusFormat={(ratio) => `${ratio * 100}%`}
    />
  </div>
);
export default Progress;
