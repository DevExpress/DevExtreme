import React from 'react';
import Splitter, { Item } from 'devextreme-react/splitter';
import PaneContent from './PaneContent.js';

const PaneContentWithTitle = (title, initialSize) => (data) =>
  (
    <PaneContent
      title={title}
      {...data}
      size={initialSize}
    />
  );
const App = () => (
  <React.Fragment>
    <Splitter id="splitter">
      <Item
        resizable={true}
        size="140px"
        minSize="70px"
        component={PaneContentWithTitle('Left Pane', '140px')}
      />
      <Item resizable={true}>
        <Splitter orientation="vertical">
          <Item
            resizable={true}
            collapsible={true}
            maxSize="75%"
            component={PaneContentWithTitle('Central Pane')}
          />
          <Item
            resizable={true}
            collapsible={true}
          >
            <Splitter>
              <Item
                resizable={true}
                collapsible={true}
                size="30%"
                minSize="5%"
                component={PaneContentWithTitle('Nested Left Pane', '30%')}
              />
              <Item
                resizable={true}
                component={PaneContentWithTitle('Nested Central Pane')}
              />
              <Item
                resizable={true}
                collapsible={true}
                size="30%"
                minSize="5%"
                component={PaneContentWithTitle('Nested Right Pane', '30%')}
              />
            </Splitter>
          </Item>
        </Splitter>
      </Item>
      <Item
        resizable={false}
        collapsible={false}
        size="140px"
        component={PaneContentWithTitle('Right Pane', '140px')}
      />
    </Splitter>
  </React.Fragment>
);
export default App;
