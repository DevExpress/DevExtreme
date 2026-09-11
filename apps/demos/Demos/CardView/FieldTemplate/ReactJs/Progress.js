import React from 'react';
import { ProgressBar } from 'devextreme-react/progress-bar';

const progressElementAttributes = { 'aria-label': 'Progress Bar' };
const formatPercent = (_, value) => `${value}%`;
const Progress = ({ value }) => (
  <div className="task__progress">
    <ProgressBar
      value={value}
      elementAttr={progressElementAttributes}
      statusFormat={formatPercent}
    />
  </div>
);
export default Progress;
