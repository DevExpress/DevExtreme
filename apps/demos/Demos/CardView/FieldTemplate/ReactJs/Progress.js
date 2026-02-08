import React from 'react';
import { ProgressBar } from 'devextreme-react/progress-bar';

const Progress = ({ value }) => (
  <div className="task__progress">
    <ProgressBar
      value={value}
      elementAttr={{ 'aria-label': 'Progress Bar' }}
      statusFormat={(_, value) => `${value}%`}
    />
  </div>
);
export default Progress;
