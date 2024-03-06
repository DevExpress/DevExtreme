import React from 'react';
import List from 'devextreme-react/list';
import { navigation } from './data.ts';

function NavigationList() {
  return (
    <div className="list" style={{ width: '200px' }}>
      <List
        dataSource={navigation}
        hoverStateEnabled={false}
        activeStateEnabled={false}
        focusStateEnabled={false}
        className="panel-list" />
    </div>
  );
}

export default NavigationList;
