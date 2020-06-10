import React from 'react';
import Utils from './utils.js';

export default function TimeCell(props) {
  const { date, text } = props.itemData;
  const isDinner = Utils.isDinner(date);

  return (
    <div className={isDinner ? 'dinner' : null}>
      {text}
      {isDinner ? <div className='cafe' /> : null}
    </div>
  );
}
