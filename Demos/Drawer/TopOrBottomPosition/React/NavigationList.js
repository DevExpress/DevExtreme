import React from 'react';

import List from 'devextreme-react/list';
import { navigation } from './data.js';

function NavigationList() {
  return (
    <div className="list">
      <List
        dataSource={navigation}
        className="panel-list"
        height={200} />
    </div>
  );
}

export default NavigationList;
