import React from 'react';
import CheckBox from 'devextreme-react/check-box';
import TabPanel from 'devextreme-react/tab-panel';
import { multiViewItems as companies } from './data.js';
import CompanyItem from './CompanyItem.js';

const itemTitleRender = (company) => <span>{company.CompanyName}</span>;

const App = () => {
  const [animationEnabled, setAnimationEnabled] = React.useState(true);
  const [swipeEnabled, setSwipeEnabled] = React.useState(true);
  const [loop, setLoop] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelectionChanged = React.useCallback((args) => {
    if (args.name === 'selectedIndex') {
      setSelectedIndex(args.value);
    }
  }, [setSelectedIndex]);

  const onLoopChanged = React.useCallback((args) => {
    setLoop(args.value);
  }, [setLoop]);

  const onAnimationEnabledChanged = React.useCallback((args) => {
    setAnimationEnabled(args.value);
  }, [setAnimationEnabled]);

  const onSwipeEnabledChanged = React.useCallback((args) => {
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
