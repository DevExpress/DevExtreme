import React from 'react';
import Splitter, { Item } from 'devextreme-react/splitter';

import PaneContent from './PaneContent.tsx';

const App = () => (
  <React.Fragment>
    <Splitter id="splitter">
      <Item resizable={true} size="140px" minSize="70px" paneName="Left Pane" component={PaneContent} />
      <Item resizable={true}>
        <Splitter orientation="vertical">
          <Item resizable={true} collapsible={true} maxSize="75%" paneName="Central Pane" component={PaneContent} /> 
          <Item resizable={true} collapsible={true}>
            <Splitter>
              <Item resizable={true} collapsible={true} size="30%" minSize="5%" paneName="Nested Left Pane" component={PaneContent} />
              <Item resizable={true} paneName="Nested Central Pane" component={PaneContent} />
              <Item resizable={true} collapsible={true} size="30%" minSize="5%" paneName="Nested Right Pane" component={PaneContent} />
            </Splitter>
          </Item>
        </Splitter>
      </Item>
      <Item resizable={false} collapsible={false} size="140px" paneName="Right Pane" component={PaneContent} />
    </Splitter>
  </React.Fragment>
);

export default App;
