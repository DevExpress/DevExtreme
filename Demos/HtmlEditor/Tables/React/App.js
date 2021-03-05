import React from 'react';

import { markup } from './data.js';
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor';

const headerValues = [false, 1, 2, 3];

class App extends React.Component {
  render() {
    return (
      <div className="widget-container">
        <HtmlEditor
          height="350px"
          defaultValue={markup}
        >
          <Toolbar>
            <Item
              name="header"
              acceptedValues={headerValues}
            />
            <Item name="separator" />
            <Item name="bold" />
            <Item name="color" />
            <Item name="separator" />
            <Item name="alignLeft" />
            <Item name="alignCenter" />
            <Item name="alignRight" />
            <Item name="separator" />
            <Item name="insertTable" />
            <Item name="deleteTable" />
            <Item name="insertRowAbove" />
            <Item name="insertRowBelow" />
            <Item name="deleteRow" />
            <Item name="insertColumnLeft" />
            <Item name="insertColumnRight" />
            <Item name="deleteColumn" />
          </Toolbar>
        </HtmlEditor>
      </div>
    );
  }
}

export default App;
