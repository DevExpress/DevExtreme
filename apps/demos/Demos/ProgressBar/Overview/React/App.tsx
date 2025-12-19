import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'devextreme-react/button';
import { ProgressBar } from 'devextreme-react/progress-bar';

const MAX_VALUE = 10;

function formatTime(value: number): string {
  return `00:00:${(`0${value}`).slice(-2)}`;
}

function statusFormat(ratio: number): string {
  return `Loading: ${ratio * 100}%`;
}

const elementAttr = { 'aria-label': 'Progress Bar' };
let intervalId: ReturnType<typeof setInterval>;

export default function App() {
  const [seconds, setSeconds] = useState<number>(MAX_VALUE);
  const [buttonText, setButtonText] = useState<string>('Start progress');
  const [inProgress, setInProgress] = useState<boolean>(false);

  useEffect(() => {
    if (seconds === 0) {
      setButtonText('Restart progress');
      setInProgress(!inProgress);
      clearInterval(intervalId);
    }
  }, [seconds, inProgress]);

  const onButtonClick = useCallback(() => {
    if (inProgress) {
      setButtonText('Continue progress');
      clearInterval(intervalId);
    } else {
      setButtonText('Stop progress');

      if (seconds === 0) {
        setSeconds(MAX_VALUE);
      }

      intervalId = setInterval(() => {
        setSeconds((prevValue: number): number => prevValue - 1);
      }, 1000);
    }

    setInProgress(!inProgress);
  }, [seconds, inProgress]);

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
        max={MAX_VALUE}
        elementAttr={elementAttr}
        statusFormat={statusFormat}
        value={MAX_VALUE - seconds}
      />
    </div>
  );
}
