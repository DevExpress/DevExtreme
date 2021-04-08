import {
  Component,
  ComponentBindings,
  JSXComponent,
} from '@devextreme-generator/declarations';
import { HeaderPanelLayout, HeaderPanelLayoutProps } from '../../base/header_panel/layout';
import { TimelineDateHeaderLayout } from './date_header/layout';

export const viewFunction = ({
  props: {
    dateHeaderMap,
    groupByDate,
    groups,
    groupOrientation,
    groupPanelCellBaseColSpan,
    columnCountPerGroup,
    isRenderDateHeader,
    resourceCellTemplate,
    dateCellTemplate,
    timeCellTemplate,
  },
}: TimelineHeaderPanelLayout): JSX.Element => (
  <HeaderPanelLayout
    dateHeaderTemplate={TimelineDateHeaderLayout}
    dateHeaderMap={dateHeaderMap}
    groupByDate={groupByDate}
    groups={groups}
    groupOrientation={groupOrientation}
    groupPanelCellBaseColSpan={groupPanelCellBaseColSpan}
    columnCountPerGroup={columnCountPerGroup}
    isRenderDateHeader={isRenderDateHeader}
    resourceCellTemplate={resourceCellTemplate}
    dateCellTemplate={dateCellTemplate}
    timeCellTemplate={timeCellTemplate}
  />
);

@ComponentBindings()
export class TimelineHeaderPanelLayoutProps extends HeaderPanelLayoutProps {}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class TimelineHeaderPanelLayout extends JSXComponent(TimelineHeaderPanelLayoutProps) {}
