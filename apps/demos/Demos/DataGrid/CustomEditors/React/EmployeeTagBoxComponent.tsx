import React, { useCallback } from 'react';
import TagBox, { TagBoxTypes } from 'devextreme-react/tag-box';

const nameLabel = { 'aria-label': 'Name' };

const EmployeeTagBoxComponent = (props) => {
  const onValueChanged = useCallback((e: TagBoxTypes.ValueChangedEvent) => {
    props.data.setValue(e.value);
  }, [props]);

  const onSelectionChanged = useCallback(() => {
    props.data.component.updateDimensions();
  }, [props]);

  return (
    <TagBox
      dataSource={props.data.column.lookup.dataSource}
      defaultValue={props.data.value}
      valueExpr="ID"
      displayExpr="FullName"
      showSelectionControls={true}
      maxDisplayedTags={3}
      inputAttr={nameLabel}
      showMultiTagOnly={false}
      applyValueMode="useButtons"
      searchEnabled={true}
      onValueChanged={onValueChanged}
      onSelectionChanged={onSelectionChanged} />
  );
};

export default EmployeeTagBoxComponent;
