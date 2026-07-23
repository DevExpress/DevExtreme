import type { PropsWithClassName } from '@ts/core/r1/index';
import { BaseInfernoComponent, normalizeStyles } from '@ts/core/r1/runtime/inferno/index';
import type { JSXTemplate } from '@ts/core/r1/types';
import { PublicTemplate } from '@ts/scheduler/r1/components/templates/index';
import type { ResourceCellTemplateProps } from '@ts/scheduler/r1/components/types';

import { combineClasses } from '../../../../core/r1/utils/render_utils';
import type { GroupPanelTreeNode } from '../../../types';

export interface GroupPanelVerticalNodeProps extends Partial<PropsWithClassName> {
  node: GroupPanelTreeNode;
  index: number;
  cellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
}

export const GroupPanelVerticalNodeDefaultProps: GroupPanelVerticalNodeProps = {
  node: {
    key: '',
    id: 0,
    text: '',
    data: { id: 0 },
    resourceIndex: '',
    leafCount: 1,
    children: [],
  },
  index: 0,
  className: '',
};

export class GroupPanelVerticalNode extends BaseInfernoComponent<GroupPanelVerticalNodeProps> {
  render(): JSX.Element {
    const {
      node, index, cellTemplate, className,
    } = this.props;
    const isLeaf = node.children.length === 0;

    const rowClasses = combineClasses({
      'dx-scheduler-group-row': true,
      [className ?? '']: Boolean(className),
    });
    const cellClasses = combineClasses({
      'dx-scheduler-group-header': true,
      'dx-scheduler-group-header-leaf': isLeaf,
    });

    return (
      <div className={rowClasses} style={normalizeStyles({ flexGrow: node.leafCount })} role="row">
        <div
          className={cellClasses}
          title={node.text}
          role="rowheader"
          aria-label={node.text}
        >
          {
            cellTemplate
              ? <PublicTemplate
                template={cellTemplate}
                templateProps={{
                  data: {
                    data: node.data,
                    id: node.id,
                    color: node.color,
                    text: node.text,
                  },
                  index,
                } as ResourceCellTemplateProps}
                />
              : (
                <div className="dx-scheduler-group-header-content">
                  {node.text}
                </div>
              )
          }
        </div>
        {
          !isLeaf && (
            <div className="dx-scheduler-group-flex-container" role="rowgroup">
              {
                node.children.map((child, childIndex) => <GroupPanelVerticalNode
                  key={child.key}
                  node={child}
                  index={childIndex}
                  cellTemplate={cellTemplate}
                />)
              }
            </div>
          )
        }
      </div>
    );
  }
}

GroupPanelVerticalNode.defaultProps = GroupPanelVerticalNodeDefaultProps;
