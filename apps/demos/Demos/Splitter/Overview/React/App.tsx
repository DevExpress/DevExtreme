import React from 'react';
import Splitter, { Item } from 'devextreme-react/splitter';
import PaneContent from './PaneContent.tsx';

const PaneContentRender = (title) => (data) => (<PaneContent title={title} {...data}/>);

const App = () => (
  <React.Fragment>
    <Splitter id="splitter">
      <Item resizable={true} size="140px" minSize="70px" render={PaneContentRender('Left Pane')} />
      <Item resizable={true}>
        <Splitter orientation="vertical">
          <Item resizable={true} collapsible={true} maxSize="75%" render={PaneContentRender('Central Pane')} /> 
          <Item resizable={true} collapsible={true}>
            <Splitter>
              <Item resizable={true} collapsible={true} size="30%" minSize="5%" render={PaneContentRender('Nested Left Pane')} />
              <Item resizable={true} render={PaneContentRender('Nested Central Pane')} />
              <Item resizable={true} collapsible={true} size="30%" minSize="5%" render={PaneContentRender('Nested Right Pane')} />
            </Splitter>
          </Item>
        </Splitter>
      </Item>
      <Item resizable={false} collapsible={false} size="140px" render={PaneContentRender('Right Pane')} />
    </Splitter>
  </React.Fragment>
);

export default App;
