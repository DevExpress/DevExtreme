import React from 'react';
import { ProgressBar } from 'devextreme-react/progress-bar';

interface ProgressProps {
  value: number;
}

const progressElementAttributes = { 'aria-label': 'Progress Bar' };
const formatPercent = (_: unknown, value: number) => `${value}%`;

const Progress = ({ value }: ProgressProps) => (
  <div className="task__progress">
    <ProgressBar
      value={value}
      elementAttr={progressElementAttributes}
      statusFormat={formatPercent}
    />
  </div>
);

export default Progress;
