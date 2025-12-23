import React, { useCallback, useState } from 'react';
import CheckBox, { type CheckBoxTypes } from 'devextreme-react/check-box';
import MultiView, { type MultiViewTypes } from 'devextreme-react/multi-view';
import { companies } from './data.ts';
import CompanyItem from './CompanyItem.tsx';

const App = () => {
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(true);
  const [loop, setLoop] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onAnimationEnabledChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent): void => {
    setAnimationEnabled(args.value);
  }, []);

  const onLoopChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent): void => {
    setLoop(e.value);
  }, []);

  const onSelectionChanged = useCallback((e: MultiViewTypes.OptionChangedEvent): void => {
    if (e.name === 'selectedIndex') {
      setSelectedIndex(e.value);
    }
  }, []);

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
