import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import TabPanel from 'devextreme-react/tab-panel';
import TabPanelItem from './TabPanelItem.js';
import {
  tabsPositionsSelectBoxLabel,
  tabsPositions,
  stylingModesSelectBoxLabel,
  stylingModes,
  iconPositionsSelectBoxLabel,
  iconPositions,
  dataSource,
} from './data.js';

const App = () => {
  const [tabsPosition, setTabsPosition] = React.useState(tabsPositions[0]);
  const [stylingMode, setStylingMode] = React.useState(stylingModes[0]);
  const [iconPosition, setIconPosition] = React.useState(iconPositions[0]);
  const onTabsPositionChanged = React.useCallback(
    (args) => {
      setTabsPosition(args.value);
    },
    [setTabsPosition],
  );
  const onStylingModeChanged = React.useCallback(
    (args) => {
      setStylingMode(args.value);
    },
    [setStylingMode],
  );
  const onIconPositionChanged = React.useCallback(
    (args) => {
      setIconPosition(args.value);
    },
    [setIconPosition],
  );
  return (
    <div className="tabpanel-demo">
      <div className="widget-container">
        <TabPanel
          className="dx-theme-background-color"
          width="100%"
          height={418}
          animationEnabled={true}
          swipeEnabled={true}
          showNavButtons={true}
          dataSource={dataSource}
          tabsPosition={tabsPosition}
          stylingMode={stylingMode}
          iconPosition={iconPosition}
          itemComponent={TabPanelItem}
        />
      </div>

      <div className="options">
        <div className="caption">Options</div>

        <div className="option">
          <div className="option-label">Tab position</div>

          <SelectBox
            inputAttr={tabsPositionsSelectBoxLabel}
            items={tabsPositions}
            value={tabsPosition}
            onValueChanged={onTabsPositionChanged}
          />
        </div>

        <div className="option">
          <div className="option-label">Styling mode</div>

          <SelectBox
            inputAttr={stylingModesSelectBoxLabel}
            items={stylingModes}
            value={stylingMode}
            onValueChanged={onStylingModeChanged}
          />
        </div>

        <div className="option">
          <div className="option-label">Icon position</div>

          <SelectBox
            inputAttr={iconPositionsSelectBoxLabel}
            items={iconPositions}
            value={iconPosition}
            onValueChanged={onIconPositionChanged}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
