import { BaseInfernoComponent, normalizeStyles } from '@ts/core/r1/runtime/inferno/index';

import { renderUtils } from '../../utils/index';
import type { GroupPanelProps } from './group_panel';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
import { GroupPanelVerticalRow } from './group_panel_vertical_row';

export class GroupPanelVertical extends BaseInfernoComponent<GroupPanelProps> {
  render(): JSX.Element {
    const {
      className,
      elementRef,
      groupPanelData,
      resourceCellTemplate,
      height,
      styles,
    } = this.props;
    const style = normalizeStyles(renderUtils.addHeightToStyle(height, styles));

    return (
      <div
        ref={elementRef}
        className={className}
        style={style}
      >
        <div className="dx-scheduler-group-flex-container">
          {
            groupPanelData.groupPanelItems
              .map((group) => <GroupPanelVerticalRow
                key={group[0].key}
                groupItems={group}
                cellTemplate={resourceCellTemplate}
              />)
          }
        </div>
      </div>
    );
  }
}

GroupPanelVertical.defaultProps = GroupPanelBaseDefaultProps;
