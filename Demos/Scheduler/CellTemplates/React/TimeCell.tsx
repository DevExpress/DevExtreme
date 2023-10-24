import React from 'react';
import Utils from './utils.ts';

type TimeCellProps = {
  data: { date: Date; text: string; };
};

const TimeCell = (props: TimeCellProps) => {
  const { date, text } = props.data;

  const isDinner = Utils.isDinner(date);
  const hasCoffeeCupIcon = Utils.hasCoffeeCupIcon(date);

  return (
    <div className={isDinner ? 'dinner' : null}>
      {text}
      {hasCoffeeCupIcon && <div className='cafe' />}
    </div>
  );
};

export default TimeCell;
