import React from 'react';
import { Button } from 'devextreme-react/button';
import { ProgressBar } from 'devextreme-react/progress-bar';

const maxValue = 10;

function formatTime(value) {
  return `00:00:${(`0${value}`).slice(-2)}`;
}

function statusFormat(ratio: number) {
  return `Loading: ${ratio * 100}%`;
}

const elementAttr = { 'aria-label': 'Progress Bar' };
let intervalId;

export default function App() {
  const [seconds, setSeconds] = React.useState(maxValue);
  const [buttonText, setButtonText] = React.useState('Start progress');
  const [inProgress, setInProgress] = React.useState(false);

  React.useEffect(() => {
    if (seconds === 0) {
      setButtonText('Restart progress');
      setInProgress(!inProgress);
      clearInterval(intervalId);
    }
  }, [seconds]);

  const onButtonClick = React.useCallback(() => {
    if (inProgress) {
      setButtonText('Continue progress');
      clearInterval(intervalId);
    } else {
      setButtonText('Stop progress');

      if (seconds === 0) {
        setSeconds(maxValue);
      }

      intervalId = setInterval(() => {
        setSeconds((prevValue: number) => prevValue - 1);
      }, 1000);
    }

    setInProgress(!inProgress);
  }, [setInProgress, setButtonText, seconds, inProgress]);

  return (
    <div className="form">
      <Button
        id="progress-button"
        text={buttonText}
        width={200}
        onClick={onButtonClick}
      />
      <div className="progress-info">
        Time left {formatTime(seconds)}
      </div>
      <ProgressBar
        id="progress-bar-status"
        className={seconds === 0 ? 'complete' : ''}
        width="90%"
        min={0}
        max={maxValue}
        elementAttr={elementAttr}
        statusFormat={statusFormat}
        value={maxValue - seconds}
      />
    </div>
  );
}
