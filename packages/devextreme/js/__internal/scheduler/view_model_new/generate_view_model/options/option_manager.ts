import {
  getGroupSize,
} from '@ts/scheduler/view_model_new/generate_view_model/options/get_group_size';

import { Cache } from '../../../global_cache';
import type Scheduler from '../../../m_scheduler';
import type {
  CellInterval,
  CompareOptions,
  DateInterval,
  LayoutIntervals,
  PanelName,
} from '../../types';
import type { CollectorOptions } from '../steps/add_collector/types';
import type { GeometryOptions } from '../steps/add_geometry/types';
import { getMonthIntervals } from './get_month_intervals';
import { getPanelCollectorOptions } from './get_panel_collector_options';
import type { ViewModelOptions } from './get_view_model_options';
import { getViewModelOptions } from './get_view_model_options';
import { getWeekIntervals } from './get_week_intervals';

const getLayoutIntervals = (
  compareOptions: CompareOptions,
  cellDurationMinutes: number,
  viewOffset: number,
  isTimeline: boolean,
  isMonthView: boolean,
  panelName: PanelName,
): LayoutIntervals => {
  switch (true) {
    case isMonthView:
      return getMonthIntervals(compareOptions, viewOffset, isTimeline);
    case panelName === 'allDayPanel':
      return getMonthIntervals(compareOptions, viewOffset, false);
    default:
      return getWeekIntervals(compareOptions, cellDurationMinutes, viewOffset, isTimeline);
  }
};

export class OptionManager {
  private readonly cache = new Cache();

  public readonly options: ViewModelOptions;

  constructor(protected schedulerStore: Scheduler) {
    this.options = getViewModelOptions(schedulerStore);
  }

  protected getPanelOptions(panelName: PanelName): {
    splitIntervals: DateInterval[];
    cells: CellInterval[];
    collectorOptions: CollectorOptions;
    geometryOptions: GeometryOptions;
  } {
    const workspace = this.schedulerStore.getWorkSpace();
    const panelDOMSize = workspace.getPanelDOMSize(panelName);

    return this.cache.memo(panelName, () => {
      const {
        type,
        viewOffset,
        groupOrientation,
        viewOrientation: nativeViewOrientation,
        isGroupByDate,
        groupCount,
        compareOptions,
        isMonthView,
        isRTLEnabled,
        isAdaptivityEnabled,
        cellDurationMinutes,
        isTimelineView,
        hasAllDayPanel,
      } = this.options;
      const viewOrientation = panelName === 'allDayPanel' ? 'horizontal' : nativeViewOrientation;
      const isCompactCollector = isAdaptivityEnabled || viewOrientation === 'vertical';
      const collectorCSS = workspace.getCollectorDimension(isCompactCollector, panelName);
      const {
        cellSize,
        collectorSizes,
        maxLevel,
        minLevel,
      } = getPanelCollectorOptions(this.schedulerStore, {
        alwaysReserveSpaceForCollector: type === 'month',
        isTimelineView,
        viewOrientation,
        isAdaptivityEnabled,
        collectorCSS,
        DOMMetaData: workspace.getDOMElementsMetaData(),
        panelName,
      });

      const {
        cells,
        intervals,
      } = getLayoutIntervals(
        compareOptions,
        cellDurationMinutes,
        viewOffset,
        isTimelineView || panelName === 'allDayPanel',
        isMonthView,
        panelName,
      );

      const splitIntervals = isGroupByDate ? cells : intervals;
      const geometryOptions: GeometryOptions = {
        intervals,
        cells,
        maxAppointmentsPerCell: maxLevel,
        hasAllDayPanel,
        viewOrientation,
        groupOrientation,
        isGroupByDate,
        isTimelineView,
        isRTLEnabled,
        isAdaptivityEnabled,
        cellSize,
        collectorPosition: viewOrientation === 'vertical' ? 'end' : 'start',
        ...collectorSizes,
        groupCount,
        groupSize: getGroupSize({
          ...compareOptions,
          cellSize,
          cellDurationMinutes,
          intervals,
          cells,
          viewType: type,
        }),
        panelSize: panelDOMSize,
      };
      const collectorOptions: CollectorOptions = {
        cells,
        minLevel,
        maxLevel,
        collectBy: viewOrientation === 'horizontal' ? 'byOccupation' : 'byStartDate',
        isCompact: isCompactCollector,
      };

      return {
        splitIntervals,
        cells,
        collectorOptions,
        geometryOptions,
      };
    });
  }

  getSplitIntervals(panelName: PanelName): DateInterval[] {
    return this.getPanelOptions(panelName).splitIntervals;
  }

  getCells(panelName: PanelName): CellInterval[] {
    return this.getPanelOptions(panelName).cells;
  }

  getCollectorOptions(panelName: PanelName): CollectorOptions {
    return this.getPanelOptions(panelName).collectorOptions;
  }

  getGeometryOptions(panelName: PanelName): GeometryOptions {
    return this.getPanelOptions(panelName).geometryOptions;
  }
}
