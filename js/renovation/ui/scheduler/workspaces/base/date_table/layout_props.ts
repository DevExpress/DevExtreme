import {
  ComponentBindings, JSXTemplate, Template,
} from 'devextreme-generator/component_declaration/common';
import { DataCellTemplateProps } from '../../types.d';
import { LayoutProps } from '../layout_props';

@ComponentBindings()
export class DateTableLayoutProps extends LayoutProps {
  @Template() cellTemplate!: JSXTemplate<{
    startDate: Date;
    endDate: Date;
    groups?: object;
    groupIndex?: number;
    isFirstGroupCell?: boolean;
    isLastGroupCell?: boolean;
    index: number;
    dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
    key: string;
  }>;
}
