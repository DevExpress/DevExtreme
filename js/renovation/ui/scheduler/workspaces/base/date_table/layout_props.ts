import {
  ComponentBindings, JSXTemplate, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { DataCellTemplateProps, ViewCellData } from '../../types.d';
import { LayoutProps } from '../layout_props';

export interface CellTemplateProps extends ViewCellData {
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}

@ComponentBindings()
export class DateTableLayoutProps extends LayoutProps {
  @OneWay() isVirtual?: boolean;

  @OneWay() leftVirtualCellWidth = 0;

  @OneWay() rightVirtualCellWidth = 0;

  @OneWay() topVirtualRowHeight = 0;

  @OneWay() bottomVirtualRowHeight = 0;

  @Template() cellTemplate!: JSXTemplate<CellTemplateProps>;
}
