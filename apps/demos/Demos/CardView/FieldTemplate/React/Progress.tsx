import React from 'react';
import { ProgressBar } from 'devextreme-react/progress-bar';

interface ProgressProps {
  value: number;
}

const Progress = ({ value }: ProgressProps) => {
  return <div className="task__progress">
    <ProgressBar
      value={value}
      elementAttr={{ 'aria-label': 'Progress Bar' }}
      statusFormat={(_, value: number) => `${value}%`}
    />
  </div>;
}

export default Progress;
