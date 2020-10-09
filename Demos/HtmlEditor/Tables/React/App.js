import React from 'react';

import HTMLReactParser from 'html-react-parser';

import { markup } from './data.js';
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor';

const headerValues = [false, 1, 2, 3];

class App extends React.Component {
  render() {
    return (
      <div className="widget-container">
        <HtmlEditor height="350px">
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
            <Item formatName="insertRowAbove" />
            <Item formatName="insertRowBelow" />
            <Item formatName="insertColumnLeft" />
            <Item formatName="insertColumnRight" />
            <Item formatName="deleteRow" />
            <Item formatName="deleteColumn" />
            <Item formatName="deleteTable" />
          </Toolbar>
          {HTMLReactParser(markup)}
        </HtmlEditor>
      </div>
    );
  }
}

export default App;
