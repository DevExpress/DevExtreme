import {
  ComponentBindings, JSXTemplate, Template,
} from 'devextreme-generator/component_declaration/common';
import { DataCellTemplateProps, ViewCellData } from '../../types.d';
import { LayoutProps } from '../layout_props';

export interface CellTemplateProps extends ViewCellData {
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}

@ComponentBindings()
export class DateTableLayoutProps extends LayoutProps {
  @Template() cellTemplate?: JSXTemplate<CellTemplateProps>;
}
