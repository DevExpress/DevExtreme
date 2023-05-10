import React from 'react';

import Toolbar, { Item } from 'devextreme-react/toolbar';
import List from 'devextreme-react/list';

import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import 'devextreme/ui/select_box';

import { productTypes, products } from './data.js';

function renderLabel() {
  return <div className="toolbar-label"><b>Tom&apos;s Club</b> Products</div>;
}

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Toolbar>
          <Item location="before"
            widget="dxButton"
            options={backButtonOptions} />
          <Item location="before"
            widget="dxButton"
            options={refreshButtonOptions} />
          <Item location="center"
            locateInMenu="never"
            render={renderLabel} />
          <Item location="after"
            locateInMenu="auto"
            widget="dxSelectBox"
            options={selectBoxOptions} />
          <Item location="after"
            locateInMenu="auto"
            widget="dxButton"
            options={addButtonOptions} />
          <Item locateInMenu="always"
            widget="dxButton"
            options={saveButtonOptions} />
          <Item locateInMenu="always"
            widget="dxButton"
            options={printButtonOptions} />
          <Item locateInMenu="always"
            widget="dxButton"
            options={settingsButtonOptions} />
        </Toolbar>
        <List id="products" dataSource={productsStore} />
      </React.Fragment>
    );
  }
}

const productsStore = new DataSource(products);

const backButtonOptions = {
  icon: 'back',
  onClick: () => {
    notify('Back button has been clicked!');
  },
};

const refreshButtonOptions = {
  icon: 'refresh',
  onClick: () => {
    notify('Refresh button has been clicked!');
  },
};

const selectBoxOptions = {
  width: 140,
  items: productTypes,
  valueExpr: 'id',
  displayExpr: 'text',
  value: productTypes[0].id,
  inputAttr: { 'aria-label': 'Categories' },
  onValueChanged: (args) => {
    if (args.value > 1) {
      productsStore.filter('type', '=', args.value);
    } else {
      productsStore.filter(null);
    }
    productsStore.load();
  },
};

const addButtonOptions = {
  icon: 'plus',
  onClick: () => {
    notify('Add button has been clicked!');
  },
};

const saveButtonOptions = {
  text: 'Save',
  onClick: () => {
    notify('Save option has been clicked!');
  },
};

const printButtonOptions = {
  text: 'Print',
  onClick: () => {
    notify('Print option has been clicked!');
  },
};

const settingsButtonOptions = {
  text: 'Settings',
  onClick: () => {
    notify('Settings option has been clicked!');
  },
};

export default App;
