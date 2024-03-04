import React from 'react';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import Grid from './Grid.js';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DnDBetweenGrids';
const tasksStore = AspNetData.createStore({
  key: 'ID',
  loadUrl: `${url}/Tasks`,
  updateUrl: `${url}/UpdateTask`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
const App = () => (
  <div className="tables">
    <div className="column">
      <Grid
        tasksStore={tasksStore}
        status={1}
      />
    </div>
    <div className="column">
      <Grid
        tasksStore={tasksStore}
        status={2}
      />
    </div>
  </div>
);
export default App;
