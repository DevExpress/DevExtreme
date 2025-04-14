import * as React from 'react';
import { TagBox } from 'devextreme-react/tag-box';
import { TextBox } from 'devextreme-react/text-box';

function Field() {
  return (<TextBox placeholder="test" />);
}

const items = ['Item 1', 'Item 2', 'Item 3'];

export default (): React.ReactElement | null => {
  return (
    <TagBox
      items={items}
      showSelectionControls={true}
      fieldRender={Field}
    />
  );
};
