import React from 'react';

import List from 'devextreme-react/list.js';
import { navigation } from './data.js';

function NavigationList() {
  return (
    <div className="list">
      <List
        dataSource={navigation}
        className="panel-list dx-theme-accent-as-background-color"
        height={200} />
    </div>
  );
}

export default NavigationList;
