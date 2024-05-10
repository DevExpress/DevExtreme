import React from 'react';
import Splitter, { Item } from 'devextreme-react/splitter';
import PaneContent from './PaneContent.tsx';

const PaneContentWithTitle = (title: string, initialSize?: string) => (data) => (<PaneContent title={title} {...data} size={initialSize} />);

const App = () => (
  <React.Fragment>
    <Splitter
      id="splitter"
    >
      <Item
        resizable={true}
        size="140px"
        minSize="70px"
        render={PaneContentWithTitle('Left Pane', '140px')}
      />
      <Item
        resizable={true}
      >
        <Splitter
          orientation="vertical"
        >
          <Item
            resizable={true}
            collapsible={true}
            maxSize="75%"
            collapsedSize="8%"
            render={PaneContentWithTitle('Central Pane')}
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
                render={PaneContentWithTitle('Nested Left Pane', '30%')}
              />
              <Item
                resizable={true}
                render={PaneContentWithTitle('Nested Central Pane')}
              />
              <Item
                resizable={true}
                collapsible={true}
                size="30%"
                minSize="5%"
                render={PaneContentWithTitle('Nested Right Pane', '30%')}
              />
            </Splitter>
          </Item>
        </Splitter>
      </Item>
      <Item
        resizable={false}
        collapsible={false}
        size="140px"
        render={PaneContentWithTitle('Right Pane', '140px')}
      />
    </Splitter>
  </React.Fragment>
);

export default App;
