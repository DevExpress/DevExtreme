import {TTextPosition} from '@devexpress/react/slideToggle';
import {
  DxSlideToggle,
  DxSlideToggleIndicatorViewProps,
  DxSlideToggleTextViewProps
} from '@devexpress/react/slideToggle';
import React, {useCallback, useState} from 'react';

import './customizationExample.css';
import catImage from '../../assets/cat.jpeg';
import dogImage from '../../assets/dog.webp';


const CustomIndicator = ({data: {value}}: DxSlideToggleIndicatorViewProps) => {
  return (
    <div className={'custom-indicator'}>
      {
        value
          ? <img className={'custom-indicator__image'} src={catImage} alt={'cat'}/>
          : <img className={'custom-indicator__image'} src={dogImage} alt={'dog'}/>
      }
    </div>
  )
}

const CustomText = ({data: {text}}: DxSlideToggleTextViewProps) => {
  return (
    <div className={'custom-text'}>
      {text}
    </div>
  )
}

function CustomizationExample() {
  const [config, setConfig] = useState({
    text: 'Fully customizable',
    textPosition: 'right' as TTextPosition,
  });

  const changeTextPosition = useCallback((event: React.ChangeEvent<HTMLSelectElement>) =>
    setConfig({
      ...config,
      textPosition: event.target.value as TTextPosition,
    }), [config]);

  const changeText = useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
    setConfig({
      ...config,
      text: event.target.value,
    }), [config]);

  return (
    <div className="example">
      <div className="example__title">
        Customization
      </div>
      <div className="example__control">
        <DxSlideToggle defaultValue={false}
                       text={config.text}
                       textPosition={config.textPosition}
                       indicatorView={CustomIndicator}
                       textView={CustomText}/>
      </div>
      <div className="example__info">
        <div className="example__play-part">
          <span>Select text position:</span>
          <select className="example-input" value={config.textPosition} onChange={changeTextPosition}>
            <option value={'left'}>Left</option>
            <option value={'right'}>Right</option>
          </select>
        </div>
        <div className="example__play-part">
          <span>Set text:</span>
          <input className="example-input" type="text" value={config.text} onChange={changeText}/>
        </div>
      </div>
    </div>
  )
}

export {CustomizationExample};
