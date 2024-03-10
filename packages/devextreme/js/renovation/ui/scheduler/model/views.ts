/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { isString } from '../../../../core/utils/type';
import { CurrentViewConfigProps, ViewProps } from '../props';
import { CurrentViewConfigType } from '../workspaces/props';
import { ViewType } from '../../../../__internal/scheduler/__migration/types';
import { viewsUtils } from '../../../../__internal/scheduler/__migration/utils/index';

export const getCurrentViewProps = (
  currentView: string | ViewType,
  // https://github.com/DevExpress/devextreme-renovation/issues/754
  views: (ViewType | Partial<ViewProps>)[],
): Partial<ViewProps> => {
  const currentViewProps = viewsUtils.getCurrentView(currentView, views);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return isString(currentViewProps)
    ? { type: currentViewProps }
    : currentViewProps;
};

export function getViewConfigProp<T>(schedulerProp: T, viewProp: T | undefined): T {
  return viewProp !== undefined ? viewProp : schedulerProp;
}

export const getCurrentViewConfig = (
  // https://github.com/DevExpress/devextreme-renovation/issues/754
  currentViewProps: Partial<ViewProps>,
  schedulerProps: CurrentViewConfigProps,
  // This is a WA for:
  // https://github.com/DevExpress/devextreme-renovation/issues/832
  // https://github.com/DevExpress/devextreme-renovation/issues/831
  currentDate: Date | string | number,
): CurrentViewConfigType => {
  const {
    scrolling: schedulerScrolling,
    width,
    height,
    ...restSchedulerProps
  } = schedulerProps;
  const { scrolling } = currentViewProps;

  const isVirtualScrolling = schedulerScrolling.mode === 'virtual'
        || scrolling?.mode === 'virtual';
  const crossScrollingEnabled = schedulerProps.crossScrollingEnabled
        || isVirtualScrolling;

  const result = {
    scrolling: schedulerScrolling,
    ...restSchedulerProps,
    ...currentViewProps,

    schedulerHeight: schedulerProps.height,
    schedulerWidth: schedulerProps.width,
    crossScrollingEnabled,

    // Default value for templates in Angular is null
    appointmentTemplate: currentViewProps.appointmentTemplate
      || restSchedulerProps.appointmentTemplate,
    dataCellTemplate: currentViewProps.dataCellTemplate || restSchedulerProps.dataCellTemplate,
    dateCellTemplate: currentViewProps.dateCellTemplate || restSchedulerProps.dateCellTemplate,
    timeCellTemplate: currentViewProps.timeCellTemplate || restSchedulerProps.timeCellTemplate,
    resourceCellTemplate: currentViewProps.resourceCellTemplate
      || restSchedulerProps.resourceCellTemplate,
    appointmentCollectorTemplate: currentViewProps.appointmentCollectorTemplate
      || restSchedulerProps.appointmentCollectorTemplate,
    appointmentTooltipTemplate: currentViewProps.appointmentTooltipTemplate
      || restSchedulerProps.appointmentTooltipTemplate,
    allDayPanelMode: currentViewProps.allDayPanelMode
      || restSchedulerProps.allDayPanelMode,
  };

  return {
    ...result,
    hoursInterval: result.cellDuration / 60,
    allDayPanelExpanded: true,
    allowMultipleCellSelection: true,
    currentDate,
  } as CurrentViewConfigType;
};

export const getValidGroups = (
  schedulerGroups: string[],
  viewGroups?: string[],
): string[] => getViewConfigProp(schedulerGroups, viewGroups);
