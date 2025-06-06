import React from 'react';
import { ProgressBar } from 'devextreme-react/progress-bar';

const Progress = ({value}) => {
    return <div className="task__progress">
        <ProgressBar
            value={value}
            statusFormat={(ratio) => `${ratio * 100}%`}
        ></ProgressBar>
    </div>;
}

export default Progress;