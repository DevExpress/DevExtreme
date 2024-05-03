import React, { useRef, useLayoutEffect } from 'react';
import Splitter, { Item } from 'devextreme-react/splitter';
import PaneContent from './PaneContent.js';

const PaneContentWithTitleRender = (title, initialSize) => {
  const paneContentRef = useRef(null);
  const PaneContentRender = (data) => (
    <div ref={paneContentRef}>
      <PaneContent
        title={title}
        {...data}
        size={initialSize}
      />
    </div>
  );
  useLayoutEffect(() => {
    Promise.resolve().then(() => {
      if (paneContentRef.current) {
        const element = paneContentRef.current.parentNode;
        element.setAttribute('tabIndex', '0');
      }
    });
  }, [paneContentRef]);
  return PaneContentRender;
};
const App = () => (
  <React.Fragment>
    <Splitter id="splitter">
      <Item
        resizable={true}
        size="140px"
        minSize="70px"
        render={PaneContentWithTitleRender('Left Pane', '140px')}
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
                render={PaneContentWithTitleRender('Nested Left Pane', '30%')}
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
                render={PaneContentWithTitleRender('Nested Right Pane', '30%')}
              />
            </Splitter>
          </Item>
        </Splitter>
      </Item>
      <Item
        resizable={false}
        collapsible={false}
        size="140px"
        render={PaneContentWithTitleRender('Right Pane', '140px')}
      />
    </Splitter>
  </React.Fragment>
);
export default App;
