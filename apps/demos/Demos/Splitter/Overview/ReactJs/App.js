import React from 'react';
import Splitter, { Item } from 'devextreme-react/splitter';
import PaneContent from './PaneContent.js';

const PaneContentWithTitleRender = (title) => {
  const PaneContentRender = (data) => (
    <PaneContent
      title={title}
      {...data}
    />
  );
  return PaneContentRender;
};
const App = () => (
  <React.Fragment>
    <Splitter id="splitter">
      <Item
        resizable={true}
        size="140px"
        minSize="70px"
        render={PaneContentWithTitleRender('Left Pane')}
      />
      <Item resizable={true}>
        <Splitter orientation="vertical">
          <Item
            resizable={true}
            collapsible={true}
            maxSize="75%"
            render={PaneContentWithTitleRender('Central Pane')}
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
                render={PaneContentWithTitleRender('Nested Left Pane')}
              />
              <Item
                resizable={true}
                render={PaneContentWithTitleRender('Nested Central Pane')}
              />
              <Item
                resizable={true}
                collapsible={true}
                size="30%"
                minSize="5%"
                render={PaneContentWithTitleRender('Nested Right Pane')}
              />
            </Splitter>
          </Item>
        </Splitter>
      </Item>
      <Item
        resizable={false}
        collapsible={false}
        size="140px"
        render={PaneContentWithTitleRender('Right Pane')}
      />
    </Splitter>
  </React.Fragment>
);
export default App;
