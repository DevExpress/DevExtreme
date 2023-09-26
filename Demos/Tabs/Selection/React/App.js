import React from 'react';

import Tabs from 'devextreme-react/tabs';
import SelectBox from 'devextreme-react/select-box';

import { tabs, longtabs, tabLabel } from './data.js';

const App = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onTabsSelectionChanged = React.useCallback((args) => {
    if (args.name === 'selectedIndex') {
      setSelectedIndex(args.value);
    }
  }, [setSelectedIndex]);

  const onValueChanged = React.useCallback((args) => {
    setSelectedIndex(args.value);
  }, [setSelectedIndex]);

  return (
    <React.Fragment>
      <div id="longtabs">
        <div className="caption">Tabs</div>
        <Tabs dataSource={longtabs} />
      </div>
      <div id="scrolledtabs">
        <div className="caption">Tabs with Overflow</div>
        <Tabs
          dataSource={longtabs}
          width={300}
          scrollByContent={true}
          showNavButtons={true}
        />
      </div>
      <div id="tabs">
        <div className="caption">API</div>
        <Tabs
          dataSource={tabs}
          selectedIndex={selectedIndex}
          onOptionChanged={onTabsSelectionChanged}
        />
        <div className="content dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Selected index:</div>
            <div className="dx-field-value">
              <SelectBox
                dataSource={tabs}
                displayExpr="text"
                inputAttr={tabLabel}
                valueExpr="id"
                value={selectedIndex}
                onValueChanged={onValueChanged}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Selected content:</div>
            <div className="dx-field-value-static left-aligned">
              {tabs[selectedIndex].content}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;
