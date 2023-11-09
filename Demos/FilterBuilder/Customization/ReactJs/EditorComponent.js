import React from 'react';
import TagBox from 'devextreme-react/tag-box';
import { categories, categoryLabel } from './data.js';
// eslint-disable-next-line no-unused-vars
export const EditorComponent = (props) => {
  const onValueChanged = React.useCallback(
    (e) => {
      props.data.setValue(e.value && e.value.length ? e.value : null);
    },
    [props.data],
  );
  return (
    <TagBox
      inputAttr={categoryLabel}
      defaultValue={props.data.value}
      items={categories}
      onValueChanged={onValueChanged}
      width="auto"
    />
  );
};
