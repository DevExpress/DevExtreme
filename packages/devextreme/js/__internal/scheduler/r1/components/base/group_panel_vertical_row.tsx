import { BaseInfernoComponent, normalizeStyles } from '@ts/core/r1/runtime/inferno/index';

import { renderUtils } from '../../utils/index';
import type { GroupPanelRowProps } from './group_panel_props';
import { GroupPanelRowDefaultProps } from './group_panel_props';
import { GroupPanelVerticalCell } from './group_panel_vertical_cell';

export class GroupPanelVerticalRow extends BaseInfernoComponent<GroupPanelRowProps> {
  render(): JSX.Element {
    const {
      className,
      groupItems,
      height,
      cellTemplate,
    } = this.props;
    const styles = height === undefined
      ? undefined
      : normalizeStyles(renderUtils.addHeightToStyle(height));

    return (
      <div
        className={`dx-scheduler-group-row ${className}`}
        style={styles}
      >
        {
          groupItems.map(({
            color,
            data,
            id,
            key,
            text,
          }, index) => <GroupPanelVerticalCell
            key={key}
            text={text}
            id={id}
            data={data}
            index={index}
            color={color}
            cellTemplate={cellTemplate}
          />)
        }
      </div>
    );
  }
}

GroupPanelVerticalRow.defaultProps = GroupPanelRowDefaultProps;
