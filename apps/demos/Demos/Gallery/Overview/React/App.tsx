import React, { useCallback, useState } from 'react';

import CheckBox from 'devextreme-react/check-box';
import type { CheckBoxTypes } from 'devextreme-react/check-box';
import Gallery from 'devextreme-react/gallery';

import { gallery } from './data.ts';

const App = () => {
  const [loop, setLoop] = useState(true);
  const [slideShow, setSlideShow] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);
  const [showIndicator, setShowIndicator] = useState(true);

  const onLoopChanged = useCallback((data: CheckBoxTypes.ValueChangedEvent) => {
    setLoop(data.value);
  }, []);

  const onSlideShowChanged = useCallback((data: CheckBoxTypes.ValueChangedEvent) => {
    setSlideShow(data.value);
  }, []);

  const onShowNavButtonsChanged = useCallback((data: CheckBoxTypes.ValueChangedEvent) => {
    setShowNavButtons(data.value);
  }, []);

  const onShowIndicatorChanged = useCallback((data: CheckBoxTypes.ValueChangedEvent) => {
    setShowIndicator(data.value);
  }, []);

  return (
    <div>
      <div className="widget-container">
        <Gallery
          id="gallery"
          dataSource={gallery}
          height={300}
          slideshowDelay={slideShow ? 2000 : 0}
          loop={loop}
          showNavButtons={showNavButtons}
          showIndicator={showIndicator} />
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox text="Loop mode" value={loop} onValueChanged={onLoopChanged} />
        </div>
        <div className="option">
          <CheckBox text="Slide show" value={slideShow} onValueChanged={onSlideShowChanged} />
        </div>
        <div className="option">
          <CheckBox text="Navigation buttons" value={showNavButtons} onValueChanged={onShowNavButtonsChanged} />
        </div>
        <div className="option">
          <CheckBox text="Indicator" value={showIndicator} onValueChanged={onShowIndicatorChanged} />
        </div>
      </div>
    </div>
  );
};

export default App;
