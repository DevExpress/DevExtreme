import {
  ComponentBindings, JSXTemplate, OneWay, Template,
} from '@devextreme-generator/declarations';
import { DataCellTemplateProps, ViewCellData } from '../../types.d';
import { LayoutProps } from '../layout_props';
import { DateTableCellBase } from './cell';

export interface CellTemplateProps extends ViewCellData {
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}

@ComponentBindings()
export class DateTableLayoutProps extends LayoutProps {
  @OneWay() isProvideVirtualCellWidth = false;

  @Template() cellTemplate: JSXTemplate<CellTemplateProps> = DateTableCellBase;
}
