import React, { useCallback, useState } from 'react';
import ActionSheet, { ActionSheetTypes } from 'devextreme-react/action-sheet';
import Button from 'devextreme-react/button';
import Switch, { SwitchTypes } from 'devextreme-react/switch';
import notify from 'devextreme/ui/notify';
import { actionSheetItems } from './data.ts';

const App = () => {
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showCancelButton, setShowCancelButton] = useState(true);

  const showActionSheet = useCallback(() => {
    setIsActionSheetVisible(true);
  }, [setIsActionSheetVisible]);

  const onActionSheetButtonClick = useCallback((buttonName: string) => {
    setIsActionSheetVisible(false);
    notify(`The "${buttonName}" button is clicked.`);
  }, [setIsActionSheetVisible]);

  const onActionSheetItemClick = useCallback((e: ActionSheetTypes.ItemClickEvent) => {
    onActionSheetButtonClick(e.itemData.text);
  }, [onActionSheetButtonClick]);

  const onActionSheetCancelClick = useCallback(() => {
    onActionSheetButtonClick('Cancel');
  }, [onActionSheetButtonClick]);

  const changeTitle = useCallback((e: SwitchTypes.ValueChangedEvent) => {
    setShowTitle(e.value);
  }, [setShowTitle]);

  const changeCancelButton = useCallback((e: SwitchTypes.ValueChangedEvent) => {
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
