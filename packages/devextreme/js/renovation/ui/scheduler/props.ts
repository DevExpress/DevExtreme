/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable max-classes-per-file */
import {
  ComponentBindings,
  OneWay,
  Nested,
  Template,
} from '@devextreme-generator/declarations';

import type { JSXTemplate } from '@devextreme-generator/declarations';

import DataSource from '../../../data/data_source';
import type { DataSourceOptions } from '../../../data/data_source';

import { DataCellTemplateProps, DateTimeCellTemplateProps, ResourceCellTemplateProps } from './workspaces/types';
import type { AllDayPanelModeType, ViewType } from '../../../__internal/scheduler/__migration/types';

@ComponentBindings()
export class ScrollingProps {
  @OneWay()
  mode?: 'standard' | 'virtual';
}

@ComponentBindings()
export class ResourceProps {
  @OneWay()
  allowMultiple?: boolean;

  @OneWay()
  dataSource?: string | unknown[] | DataSource | DataSourceOptions;

  @OneWay()
  label?: string;

  @OneWay()
  useColorAsDefault?: boolean;

  /* Field expressions */

  @OneWay()
  valueExpr?: string | ((data: unknown) => string);

  @OneWay()
  colorExpr?: string;

  @OneWay()
  displayExpr?: string | ((resource: unknown) => string);

  @OneWay()
  fieldExpr?: string;
}

@ComponentBindings()
export class ViewProps {
  @OneWay()
  endDayHour?: number;

  @OneWay()
  startDayHour?: number;

  @OneWay()
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  @OneWay()
  cellDuration?: number;

  @OneWay()
  groups?: string[];

  @OneWay()
  maxAppointmentsPerCell?: number | 'auto' | 'unlimited';

  @OneWay()
  agendaDuration?: number;

  @OneWay()
  groupByDate?: boolean;

  @OneWay()
  groupOrientation?: 'horizontal' | 'vertical';

  @OneWay()
  intervalCount?: number;

  @OneWay()
  name?: string;

  @OneWay()
  startDate?: Date | number | string;

  @OneWay()
  type?: ViewType;

  @OneWay()
  allDayPanelMode?: AllDayPanelModeType;

  @Nested()
  scrolling?: ScrollingProps;

  /* Templates */

  @Template()
  dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;

  @Template()
  dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template()
  timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template()
  resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;
}
