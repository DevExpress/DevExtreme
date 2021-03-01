import { Component, JSXComponent } from 'devextreme-generator/component_declaration/common';
import { DateTableCellBase } from '../../base/date_table/cell';
import { DateTableLayoutBase } from '../../base/date_table/layout';
import { LayoutProps } from '../../base/layout_props';

export const viewFunction = ({
  restAttributes,
  props: {
    viewData,
    dataCellTemplate,
    addDateTableClass,
  },
}: DayDateTableLayout): JSX.Element => (
  <DateTableLayoutBase
    viewData={viewData}
    addDateTableClass={addDateTableClass}
    cellTemplate={DateTableCellBase}
    dataCellTemplate={dataCellTemplate}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export class DayDateTableLayout extends JSXComponent(LayoutProps) {}
