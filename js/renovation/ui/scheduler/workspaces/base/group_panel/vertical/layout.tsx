import {
  Component, CSSAttributes, JSXComponent,
} from '@devextreme-generator/declarations';
import {
  GroupRenderItem,
} from '../../../types.d';
import { Row } from './row';
import { addHeightToStyle } from '../../../utils';
import { GroupPanelLayoutProps } from '../group_panel_layout_props';

export const viewFunction = ({
  restAttributes,
  style,
  props: {
    className,
    groupPanelData,
    resourceCellTemplate,
    elementRef,
  },
}: GroupPanelVerticalLayout): JSX.Element => (
  <div
    className={className}
    ref={elementRef}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    style={style}
  >
    <div className="dx-scheduler-group-flex-container">
      {groupPanelData.groupPanelItems.map((group: GroupRenderItem[]) => (
        <Row
          groupItems={group}
          cellTemplate={resourceCellTemplate}
          key={group[0].key}
        />
      ))}
    </div>
  </div>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelVerticalLayout extends JSXComponent(GroupPanelLayoutProps) {
  get style(): CSSAttributes {
    const { height, styles } = this.props;

    return addHeightToStyle(height, styles);
  }
}
