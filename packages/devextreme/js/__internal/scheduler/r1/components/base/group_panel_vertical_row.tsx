import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

import type { GroupPanelRowProps } from './group_panel_props';
import { GroupPanelRowDefaultProps } from './group_panel_props';
import { GroupPanelVerticalCell } from './group_panel_vertical_cell';

export class GroupPanelVerticalRow extends BaseInfernoComponent<GroupPanelRowProps> {
  render(): JSX.Element {
    const {
      className,
      groupItems,
      cellTemplate,
    } = this.props;

    return (
      <div className={`dx-scheduler-group-row ${className}`}>
        {
          groupItems.map(({
            color,
            data,
            id,
            key,
            text,
            rowSpan,
          }, index) => <GroupPanelVerticalCell
            key={key}
            text={text}
            id={id}
            data={data}
            index={index}
            color={color}
            cellTemplate={cellTemplate}
            rowSpan={rowSpan}
          />)
        }
      </div>
    );
  }
}

GroupPanelVerticalRow.defaultProps = GroupPanelRowDefaultProps;
