import React from 'react';
import ReactDOM from 'react-dom';
import Splitter, { Item } from 'devextreme-react/splitter';
import PaneContent from './PaneContent.tsx';

const generate = (data,element,title, initialSize?: string) => {
  const container = document.createElement('div');
  ReactDOM.render(<PaneContent title={title} {...data} size={initialSize} />, container);
  console.log(element);
  
  element.setAttribute('tabIndex',"0");

  return container;
}

const App = () =>{

  return(
  <React.Fragment>
    <Splitter
      id="splitter"
    >
      <Item
        resizable={true}
        size="140px"
        minSize="70px"
        template={(data,index,element) => generate(data,element,'Left Pane', '140px')}
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
            template={(data,index,element) => generate(data,element,'Central Pane')}
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
                template={(data,index,element) => generate(data,element,'Nested Left Pane', '30%')}
              />
              <Item
                resizable={true}
                template={(data,index,element) => generate(data,element,'Nested Central Pane')}
              />
              <Item
                resizable={true}
                collapsible={true}
                size="30%"
                minSize="5%"
                template={(data,index,element) => generate(data,element,'Nested Right Pane', '30%')}
              />
            </Splitter>
          </Item>
        </Splitter>
      </Item>
      <Item
        resizable={false}
        collapsible={false}
        size="140px"
        template={(data,index,element) => generate(data,element,'Right Pane', '140px')}
      />
    </Splitter>
  </React.Fragment>
)};

export default App;
