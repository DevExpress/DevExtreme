import React from 'react';

import Tabs from 'devextreme-react/tabs';
import SelectBox from 'devextreme-react/select-box';
import MultiView from 'devextreme-react/multi-view';

import { employees, selectBoxLabel } from './data.js';

class EmployeeInfo extends React.Component {
  render() {
    const {
      text, picture, position, notes,
    } = this.props.data;

    return (
      <div className="employee-info">
        <img alt={text} className="employee-photo dx-theme-border-color" src={picture} />
        <p className="employee-notes">
          <b>Position: {position}</b><br />
          {notes}
        </p>
      </div>
    );
  }
}

const App = () => {
  const [selectedItem, setSelectedItem] = React.useState(employees[0]);

  const onSelectionChanged = React.useCallback((args) => {
    setSelectedItem(args.selectedItem || args.addedItems[0]);
  }, [setSelectedItem]);

  return (
    <div id="center-content">
      <div id="demo-items-container">
        <div className="content dx-fieldset">
          <div className="dx-field">
            <Tabs
              dataSource={employees}
              onSelectionChanged={onSelectionChanged}
              selectedItem={selectedItem}
            />
          </div>

          <div className="dx-field select-box-container">
            <div className="dx-field-label">Selected user:</div>
            <div className="dx-field-value">
              <SelectBox
                dataSource={employees}
                inputAttr={selectBoxLabel}
                value={selectedItem}
                onSelectionChanged={onSelectionChanged}
                displayExpr="text"
              />
            </div>
          </div>

          <div className="dx-field multiview-container">
            <MultiView
              height={112}
              dataSource={employees}
              selectedItem={selectedItem}
              onSelectionChanged={onSelectionChanged}
              loop={false}
              itemComponent={EmployeeInfo}
              animationEnabled={true}
            />
          </div>

          <div className="icon-container">
            <span className="dx-icon dx-icon-info"></span>
            <span className="demo-info">You can swipe this area.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
