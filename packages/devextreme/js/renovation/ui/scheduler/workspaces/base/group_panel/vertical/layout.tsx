import {
  Component, ComponentBindings, CSSAttributes, ForwardRef, JSXComponent, RefObject,
} from '@devextreme-generator/declarations';
import {
  GroupRenderItem,
} from '../../../types';
import { Row } from './row';
import { addHeightToStyle } from '../../../utils';
import { GroupPanelLayoutProps } from '../group_panel_layout_props';

export const viewFunction = ({
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

@ComponentBindings()
export class VerticalGroupPanelLayoutProps extends GroupPanelLayoutProps {
  @ForwardRef() elementRef?: RefObject<HTMLDivElement>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelVerticalLayout extends JSXComponent(VerticalGroupPanelLayoutProps) {
  get style(): CSSAttributes {
    const { height, styles } = this.props;

    return addHeightToStyle(height, styles);
  }
}
