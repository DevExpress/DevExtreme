import React from 'react';
import Splitter, { Item } from 'devextreme-react/splitter';
import PaneContent from './PaneContent.js';

const App = () => (
  <React.Fragment>
    <Splitter id="splitter">
      <Item
        resizable={true}
        minSize="70px"
        size="140px"
        render={PaneContent('Pane Left')}
      />
      <Item resizable={true}>
        <Splitter orientation="vertical">
          <Item
            resizable={true}
            collapsible={true}
            maxSize="75%"
            render={PaneContent('Central Pane')}
          />
          <Item
            resizable={true}
            collapsible={true}
          >
            <Splitter>
              <Item
                collapsible={true}
                minSize="5%"
                size="30%"
                render={PaneContent('Nested Left Pane')}
              />
              <Item render={PaneContent('Nested Central Pane')} />
              <Item
                collapsible={true}
                minSize="5%"
                size="30%"
                render={PaneContent('Nested Right Pane')}
              />
            </Splitter>
          </Item>
        </Splitter>
      </Item>
      <Item
        resizable={false}
        collapsible={false}
        size="140px"
        render={PaneContent('Right Pane')}
      />
    </Splitter>
  </React.Fragment>
);
export default App;
