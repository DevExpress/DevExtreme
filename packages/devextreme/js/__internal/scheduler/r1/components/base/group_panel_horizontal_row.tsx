import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/r1/utils/index';

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
    const CellTemplateComponent = getTemplate(cellTemplate);

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
            // @ts-ignore
          }, index) => <GroupPanelHorizontalCell
            key={key}
            text={text}
            id={id}
            data={data}
            index={index}
            color={color}
            colSpan={colSpan ?? GroupPanelHorizontalCellDefaultProps.colSpan}
            isFirstGroupCell={!!isFirstGroupCell}
            isLastGroupCell={!!isLastGroupCell}
            cellTemplate={CellTemplateComponent}
          />)
        }
      </tr>
    );
  }
}

GroupPanelHorizontalRow.defaultProps = GroupPanelRowDefaultProps;
