import React from 'react';

import HTMLReactParser from 'html-react-parser';

import { markup } from './data.js';
import HtmlEditor, { Toolbar, MediaResizing, Item } from 'devextreme-react/html-editor';
import CheckBox from 'devextreme-react/check-box';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isMultiline: true
    };
    this.sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
    this.fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];
    this.headerValues = [false, 1, 2, 3, 4, 5];
    this.enabled = {
      enabled: true
    };
  }
  render() {
    return (
      <React.Fragment>
        <div className="widget-container">
          <HtmlEditor height="550px">
            <MediaResizing enabled={true} />
            <Toolbar multiline={this.state.isMultiline}>
              <Item formatName="undo" />
              <Item formatName="redo" />
              <Item formatName="separator" />
              <Item
                formatName="size"
                formatValues={this.sizeValues}
              />
              <Item
                formatName="font"
                formatValues={this.fontValues}
              />
              <Item formatName="separator" />
              <Item formatName="bold" />
              <Item formatName="italic" />
              <Item formatName="strike" />
              <Item formatName="underline" />
              <Item formatName="separator" />
              <Item formatName="alignLeft" />
              <Item formatName="alignCenter" />
              <Item formatName="alignRight" />
              <Item formatName="alignJustify" />
              <Item formatName="separator" />
              <Item formatName="orderedList" />
              <Item formatName="bulletList" />
              <Item formatName="separator" />
              <Item
                formatName="header"
                formatValues={this.headerValues}
              />
              <Item formatName="separator" />
              <Item formatName="color" />
              <Item formatName="background" />
              <Item formatName="separator" />
              <Item formatName="link" />
              <Item formatName="image" />
              <Item formatName="separator" />
              <Item formatName="clear" />
              <Item formatName="codeBlock" />
              <Item formatName="blockquote" />
            </Toolbar>
            {HTMLReactParser(markup)}
          </HtmlEditor>
          <div className="options">
            <div className="caption">Options</div>
            <div className="option">
              <CheckBox
                text="Multiline toolbar"
                value={this.state.isMultiline}
                onValueChanged={this.multilineChanged}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  multilineChanged = (e) => {
    this.setState({
      isMultiline: e.value
    });
  }
}

export default App;
