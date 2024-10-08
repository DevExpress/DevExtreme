import { Popup } from '../inferno_wrappers/popup';
import { Sortable } from '../inferno_wrappers/sortable';
import { TreeView } from '../inferno_wrappers/tree_view';

export interface ColumnChooserProps {
  items: {
    text: string;
  }[];

  visible: boolean;
}

export function ColumnChooser({ visible, items }: ColumnChooserProps): JSX.Element | null {
  if (!visible) {
    return null;
  }

  return (
    <Popup
      visible={visible}
      shading={false}
      dragEnabled={true}
      resizeEnabled={true}
      width={250}
      height={260}
    >
      <Sortable
        group='cardview'
      >
        <TreeView
          items={items}
        />
      </Sortable>
    </Popup>
  );
}
