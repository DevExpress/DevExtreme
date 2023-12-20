import React, { useCallback, useState } from 'react';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import MultiView, { MultiViewTypes } from 'devextreme-react/multi-view';
import { multiViewItems as companies } from './data.ts';
import CompanyItem from './CompanyItem.tsx';

const App = () => {
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [loop, setLoop] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelectionChanged = useCallback((args: MultiViewTypes.OptionChangedEvent) => {
    if (args.name === 'selectedIndex') {
      setSelectedIndex(args.value);
    }
  }, [setSelectedIndex]);

  const onLoopChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setLoop(args.value);
  }, [setLoop]);

  const onAnimationEnabledChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setAnimationEnabled(args.value);
  }, [setAnimationEnabled]);

  return (
    <div id="multiview">
      <div>
        Item <span>
          {selectedIndex + 1}
        </span> of <span>
          {companies.length}
        </span>: <i>
          Swipe the view horizontally to switch to the next view.
        </i>
      </div>
      <MultiView
        height={300}
        dataSource={companies}
        selectedIndex={selectedIndex}
        onOptionChanged={onSelectionChanged}
        loop={loop}
        itemComponent={CompanyItem}
        animationEnabled={animationEnabled}
      />
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            value={loop}
            onValueChanged={onLoopChanged}
            text="Loop enabled"
          />
        </div>
        <div className="option">
          <CheckBox
            value={animationEnabled}
            onValueChanged={onAnimationEnabledChanged}
            text="Animation enabled"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
