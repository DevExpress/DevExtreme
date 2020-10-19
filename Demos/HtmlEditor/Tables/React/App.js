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
              formatName="header"
              formatValues={headerValues}
            />
            <Item formatName="separator" />
            <Item formatName="bold" />
            <Item formatName="color" />
            <Item formatName="separator" />
            <Item formatName="alignLeft" />
            <Item formatName="alignCenter" />
            <Item formatName="alignRight" />
            <Item formatName="separator" />
            <Item formatName="insertTable" />
            <Item formatName="deleteTable" />
            <Item formatName="insertRowAbove" />
            <Item formatName="insertRowBelow" />
            <Item formatName="deleteRow" />
            <Item formatName="insertColumnLeft" />
            <Item formatName="insertColumnRight" />
            <Item formatName="deleteColumn" />
          </Toolbar>
        </HtmlEditor>
      </div>
    );
  }
}

export default App;
