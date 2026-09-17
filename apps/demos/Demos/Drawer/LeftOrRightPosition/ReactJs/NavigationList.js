import React from 'react';
import List from 'devextreme-react/list';
import { navigation } from './data.js';

const listStyle = { width: '200px' };
function NavigationList() {
  return (
    <div
      className="list"
      style={listStyle}
    >
      <List
        dataSource={navigation}
        className="panel-list"
      />
    </div>
  );
}
export default NavigationList;
