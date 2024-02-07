import React from 'react';
import Gallery from 'devextreme-react/gallery';
import { galleryData } from './data.ts';
import Item from './item.tsx';

const App = () => (
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

export default App;
