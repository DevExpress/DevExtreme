import React from 'react';
import List from 'devextreme-react/list';
import { employees } from './data.ts';
import type { Employee } from './types.ts';

const GroupTemplate = (item: Employee) => <div>Assigned: {item.key}</div>;

const App = () => (
  <div className="list-container">
    <List
      dataSource={employees}
      height="100%"
      grouped={true}
      collapsibleGroups={true}
      groupRender={GroupTemplate} />
  </div>
);

export default App;
