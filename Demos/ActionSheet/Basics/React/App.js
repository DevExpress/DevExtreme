import React from 'react';
import { ActionSheet, Button, Switch } from 'devextreme-react';
import { actionSheetItems } from './data.js';
import notify from 'devextreme/ui/notify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActionSheetVisible: false,
      showTitle: true,
      showCancelButton: true
    };

    this.showActionSheet = this.showActionSheet.bind(this);
    this.onActionSheetItemClick = this.onActionSheetItemClick.bind(this);
    this.onActionSheetCancelClick = this.onActionSheetCancelClick.bind(this);
    this.onActionSheetButtonClick = this.onActionSheetButtonClick.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeCancelButton = this.changeCancelButton.bind(this);
  }

  render() {
    return (
      <div>
        <ActionSheet dataSource={actionSheetItems} title="Choose action" showTitle={this.state.showTitle} showCancelButton={this.state.showCancelButton}
          visible={this.state.isActionSheetVisible} onItemClick={this.onActionSheetItemClick} onCancelClick={this.onActionSheetCancelClick} />
        <div className="button">
          <Button width="100%" text="Click to show Action Sheet" onClick={this.showActionSheet} />
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Show title</span>
            <Switch value={this.state.showTitle} onValueChanged={this.changeTitle} />
          </div>
          <div className="option">
            <span>Show cancel button</span>
            <Switch value={this.state.showCancelButton} onValueChanged={this.changeCancelButton} />
          </div>
        </div>
      </div>
    );
  }

  showActionSheet() {
    this.setState({
      isActionSheetVisible: true
    });
  }

  onActionSheetItemClick(e) {
    this.onActionSheetButtonClick(e.itemData.text);
  }

  onActionSheetCancelClick() {
    this.onActionSheetButtonClick('Cancel');
  }

  onActionSheetButtonClick(buttonName) {
    this.setState({
      isActionSheetVisible: false
    });
    notify(`The "${buttonName}" button is clicked.`);
  }

  changeTitle(e) {
    this.setState({
      showTitle: e.value
    });
  }

  changeCancelButton(e) {
    this.setState({
      showCancelButton: e.value
    });
  }
}

export default App;
