import React, { useCallback, useState } from 'react';
import CheckBox, { type CheckBoxTypes } from 'devextreme-react/check-box';
import TabPanel, { type TabPanelTypes } from 'devextreme-react/tab-panel';
import { multiViewItems as companies } from './data.ts';
import type { Company } from './types.ts';
import CompanyItem from './CompanyItem.tsx';

const itemTitleRender = (company: Company) => <span>{company.CompanyName}</span>;

const App = () => {
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(true);
  const [swipeEnabled, setSwipeEnabled] = useState<boolean>(true);
  const [loop, setLoop] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onAnimationEnabledChanged = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setAnimationEnabled(value);
  }, []);

  const onSwipeEnabledChanged = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setSwipeEnabled(value);
  }, []);

  const onLoopChanged = useCallback(({ value }: CheckBoxTypes.ValueChangedEvent): void => {
    setLoop(value);
  }, []);

  const onSelectionChanged = useCallback(({ name, value }: TabPanelTypes.OptionChangedEvent): void => {
    if (name === 'selectedIndex') {
      setSelectedIndex(value);
    }
  }, []);

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
