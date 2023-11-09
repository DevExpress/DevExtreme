import React from 'react';
import TagBox, { TagBoxTypes } from 'devextreme-react/tag-box';
import { categories, categoryLabel } from './data.ts';

// eslint-disable-next-line no-unused-vars
export const EditorComponent = (props: { data: { value: any, setValue: (value: any) => void } }) => {
  const onValueChanged = React.useCallback((e: TagBoxTypes.ValueChangedEvent) => {
    props.data.setValue(e.value && e.value.length ? e.value : null);
  }, [props.data]);

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
