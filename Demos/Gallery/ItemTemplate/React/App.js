import React from 'react';
import { Gallery } from 'devextreme-react';
import { galleryData } from './data.js';
import Item from './item.js';

class App extends React.Component {
  render() {
    return (
      <div className='widget-container'>
        <Gallery
          dataSource={galleryData}
          height={440}
          width='100%'
          loop={true}
          showIndicator={false}
          itemRender={Item} />
      </div>
    );
  }
}

export default App;
