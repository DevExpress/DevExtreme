import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

import { GroupPanelHorizontalRow } from './group_panel_horizontal_row';
import type { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelBaseDefaultProps } from './group_panel_props';

export class GroupPanelHorizontal extends BaseInfernoComponent<GroupPanelBaseProps> {
  render(): JSX.Element {
    const {
      groupPanelData: { groupPanelItems },
      resourceCellTemplate,
    } = this.props;

    return (
      <>
        {
          groupPanelItems.map((group) => <GroupPanelHorizontalRow
              key={group[0].key}
              groupItems={group}
              cellTemplate={resourceCellTemplate}
            />)
        }
      </>
    );
  }
}

GroupPanelHorizontal.defaultProps = GroupPanelBaseDefaultProps;
