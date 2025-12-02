import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

import { GroupPanelHorizontalCell, GroupPanelHorizontalCellDefaultProps } from './group_panel_horizontal_cell';
import type { GroupPanelRowProps } from './group_panel_props';
import { GroupPanelRowDefaultProps } from './group_panel_props';

export class GroupPanelHorizontalRow extends BaseInfernoComponent<GroupPanelRowProps> {
  render(): JSX.Element {
    const {
      cellTemplate,
      className,
      groupItems,
    } = this.props;

    return (
      <tr className={`dx-scheduler-group-row ${className}`}>
        {
          groupItems.map(({
            colSpan,
            color,
            data,
            id,
            isFirstGroupCell,
            isLastGroupCell,
            key,
            text,
          }, index) => <GroupPanelHorizontalCell
            key={key}
            text={text}
            id={id}
            data={data}
            index={index}
            color={color}
            colSpan={colSpan ?? GroupPanelHorizontalCellDefaultProps.colSpan}
            isFirstGroupCell={Boolean(isFirstGroupCell)}
            isLastGroupCell={Boolean(isLastGroupCell)}
            cellTemplate={cellTemplate}
          />)
        }
      </tr>
    );
  }
}

GroupPanelHorizontalRow.defaultProps = GroupPanelRowDefaultProps;
