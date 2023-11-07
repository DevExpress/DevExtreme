import React from 'react';
import TagBox from 'devextreme-react/tag-box';

const nameLabel = { 'aria-label': 'Name' };
const EmployeeTagBoxComponent = (props) => {
  const onValueChanged = React.useCallback(
    (e) => {
      props.data.setValue(e.value);
    },
    [props],
  );
  const onSelectionChanged = React.useCallback(() => {
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
      onSelectionChanged={onSelectionChanged}
    />
  );
};
export default EmployeeTagBoxComponent;
