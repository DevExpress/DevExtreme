import React from 'react';
import ActionSheet from 'devextreme-react/action-sheet';
import List from 'devextreme-react/list';

import notify from 'devextreme/ui/notify';

import RenderContactItem from './ContactItem.js';
import { actionSheetItems, contacts } from './data.js';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isActionSheetVisible: false,
      actionSheetTarget: ''
    };

    this.onActionSheetItemClick = this.onActionSheetItemClick.bind(this);
    this.onListItemClick = this.onListItemClick.bind(this);
  }

  render() {
    return (
      <div className="app-container">
        <List
          id="list"
          items={contacts}
          itemRender={RenderContactItem}
          onItemClick={this.onListItemClick}
        />
        <ActionSheet
          title="Choose action"
          usePopover={true}
          visible={this.state.isActionSheetVisible}
          target={this.state.actionSheetTarget}
          items={actionSheetItems}
          onItemClick={this.onActionSheetItemClick}
        />
      </div>
    );
  }

  onListItemClick(e) {
    this.setState({
      isActionSheetVisible: true,
      actionSheetTarget: e.itemElement
    });
  }

  onActionSheetItemClick(e) {
    this.setState({
      isActionSheetVisible: false
    });
    notify(`The "${e.itemData.text}" button is clicked.`);
  }
}

export default App;
