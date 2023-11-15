import React from 'react';
import Gallery from 'devextreme-react/gallery';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import { gallery } from './data.ts';

const App = () => {
  const [loop, setLoop] = React.useState(true);
  const [slideShow, setSlideShow] = React.useState(true);
  const [showNavButtons, setShowNavButtons] = React.useState(true);
  const [showIndicator, setShowIndicator] = React.useState(true);

  const onLoopChanged = React.useCallback((data: CheckBoxTypes.ValueChangedEvent) => {
    setLoop(data.value);
  }, [setLoop]);

  const onSlideShowChanged = React.useCallback((data: CheckBoxTypes.ValueChangedEvent) => {
    setSlideShow(data.value);
  }, [setSlideShow]);

  const onShowNavButtonsChanged = React.useCallback((data: CheckBoxTypes.ValueChangedEvent) => {
    setShowNavButtons(data.value);
  }, [setShowNavButtons]);

  const onShowIndicatorChanged = React.useCallback((data: CheckBoxTypes.ValueChangedEvent) => {
    setShowIndicator(data.value);
  }, [setShowIndicator]);

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
