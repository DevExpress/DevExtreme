import React from 'react';
import List from 'devextreme-react/list';
import { navigation } from './data.js';

function NavigationList() {
  return (
    <div
      className="list"
      style={{ width: '200px' }}
    >
      <List
        dataSource={navigation}
        className="panel-list"
      />
    </div>
  );
}
export default NavigationList;
