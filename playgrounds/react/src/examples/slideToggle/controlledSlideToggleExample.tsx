import {DxSlideToggle, TTextPosition} from '@devexpress/react/slideToggle';
import React, {useCallback, useState} from 'react';

function ControlledSlideToggleExample() {
  const [state, setState] = useState(true);
  const [config, setConfig] = useState({
    text: 'React passed text',
    textPosition: 'right' as TTextPosition,
  });

  const handleValueChange = useCallback((value: boolean) => {
    setState(value);
  }, []);
  const appClick = useCallback(() => setState(!state), [state]);

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
        Controlled mode
      </div>
      <div className="example__control">
        <DxSlideToggle value={state}
                       text={config.text}
                       textPosition={config.textPosition}
                       valueChange={handleValueChange}/>
      </div>
      <div className="example__info">
        <div className="example__play-part">
          <button onClick={appClick}>
            Toggle
          </button>
          <div>
            App value: {state.toString()}
          </div>
        </div>
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

export {ControlledSlideToggleExample};
