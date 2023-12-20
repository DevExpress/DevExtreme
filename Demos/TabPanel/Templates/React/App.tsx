import React, { useCallback, useState } from 'react';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import TabPanel, { TabPanelTypes } from 'devextreme-react/tab-panel';
import { multiViewItems as companies } from './data.ts';
import CompanyItem from './CompanyItem.tsx';

const itemTitleRender = (company) => <span>{company.CompanyName}</span>;

const App = () => {
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  const [loop, setLoop] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelectionChanged = useCallback((args: TabPanelTypes.OptionChangedEvent) => {
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

  const onSwipeEnabledChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setSwipeEnabled(args.value);
  }, [setSwipeEnabled]);

  return (
    <div>
      <TabPanel
        height={260}
        dataSource={companies}
        selectedIndex={selectedIndex}
        onOptionChanged={onSelectionChanged}
        loop={loop}
        itemTitleRender={itemTitleRender}
        itemComponent={CompanyItem}
        animationEnabled={animationEnabled}
        swipeEnabled={swipeEnabled}
      />
      <div className="item-box">
        Item <span>{selectedIndex + 1}</span> of <span>{companies.length}</span>
      </div>
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
        <div className="option">
          <CheckBox
            value={swipeEnabled}
            onValueChanged={onSwipeEnabledChanged}
            text="Swipe enabled"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
