import React from 'react';
import ActionSheet from 'devextreme-react/action-sheet';
import Button from 'devextreme-react/button';
import Switch from 'devextreme-react/switch';
import notify from 'devextreme/ui/notify';
import { actionSheetItems } from './data.js';

const App = () => {
  const [isActionSheetVisible, setIsActionSheetVisible] = React.useState(false);
  const [showTitle, setShowTitle] = React.useState(true);
  const [showCancelButton, setShowCancelButton] = React.useState(true);

  const showActionSheet = React.useCallback(() => {
    setIsActionSheetVisible(true);
  }, [setIsActionSheetVisible]);

  const onActionSheetItemClick = React.useCallback((e) => {
    onActionSheetButtonClick(e.itemData.text);
  }, [onActionSheetButtonClick]);

  const onActionSheetCancelClick = React.useCallback(() => {
    onActionSheetButtonClick('Cancel');
  }, [onActionSheetButtonClick]);

  const onActionSheetButtonClick = React.useCallback((buttonName) => {
    setIsActionSheetVisible(false);
    notify(`The "${buttonName}" button is clicked.`);
  }, [setIsActionSheetVisible]);

  const changeTitle = React.useCallback((e) => {
    setShowTitle(e.value);
  }, [setShowTitle]);

  const changeCancelButton = React.useCallback((e) => {
    setShowCancelButton(e.value);
  }, [setShowCancelButton]);

  return (
    <div>
      <ActionSheet
        dataSource={actionSheetItems}
        title="Choose action"
        showTitle={showTitle}
        showCancelButton={showCancelButton}
        visible={isActionSheetVisible}
        onItemClick={onActionSheetItemClick}
        onCancelClick={onActionSheetCancelClick} />
      <div className="button">
        <Button width="100%" text="Click to show Action Sheet" onClick={showActionSheet} />
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Show title</span>
          <Switch value={showTitle} onValueChanged={changeTitle} />
        </div>
        <div className="option">
          <span>Show cancel button</span>
          <Switch value={showCancelButton} onValueChanged={changeCancelButton} />
        </div>
      </div>
    </div>
  );
};

export default App;
