import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';
import { HeaderPanelLayout, HeaderPanelLayoutProps } from '../../base/header_panel/layout';
import { TimelineDateHeaderLayout } from './date_header/layout';
import { HeaderPanel } from '../../../../../component_wrapper/scheduler/header_panel';

export const viewFunction = ({
  props: {
    dateHeaderData,
    groupPanelData,
    groupByDate,
    groups,
    groupOrientation,
    isRenderDateHeader,
    resourceCellTemplate,
    dateCellTemplate,
    timeCellTemplate,
  },
}: TimelineHeaderPanelLayout): JSX.Element => (
  <HeaderPanelLayout
    dateHeaderTemplate={TimelineDateHeaderLayout}
    dateHeaderData={dateHeaderData}
    groupPanelData={groupPanelData}
    groupByDate={groupByDate}
    groups={groups}
    groupOrientation={groupOrientation}
    isRenderDateHeader={isRenderDateHeader}
    resourceCellTemplate={resourceCellTemplate}
    dateCellTemplate={dateCellTemplate}
    timeCellTemplate={timeCellTemplate}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true, component: HeaderPanel },
})
export class TimelineHeaderPanelLayout extends JSXComponent<HeaderPanelLayoutProps, 'dateHeaderData'>() {}
