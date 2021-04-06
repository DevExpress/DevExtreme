import {
  Component,
  ComponentBindings,
  JSXComponent,
} from '@devextreme-generator/declarations';
import { HeaderPanelLayout, HeaderPanelLayoutProps } from '../../base/header_panel/layout';
import { TimelineDateHeaderLayout } from './date_header/layout';
import HeaderPanel from '../../../../../component_wrapper/scheduler_header_panel';

export const viewFunction = ({
  props: {
    dateHeaderData,
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
    dateHeaderData={dateHeaderData}
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
  jQuery: { register: true, component: HeaderPanel },
})
export class TimelineHeaderPanelLayout extends JSXComponent(TimelineHeaderPanelLayoutProps) {}
