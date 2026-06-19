import type { Appointment, Occurrence } from '@js/ui/scheduler';

import type Scheduler from '../m_scheduler';
import { filterAppointments } from './filtration/filter_appointments';
import { getOccurrences } from './filtration/get_occurrences';
import { generateAgendaViewModel } from './generate_view_model/generate_agenda_view_model';
import { generateGridViewModel, sortAppointments } from './generate_view_model/generate_grid_view_model';
import { getDefaultAppointmentSize } from './generate_view_model/options/get_min_appointment_size';
import { OptionManager } from './generate_view_model/options/option_manager';
import type { RealSize } from './generate_view_model/steps/add_geometry/types';
import { getAgendaAppointmentInfo, getAppointmentInfo } from './get_appointment_info';
import { prepareAppointments } from './preparation/prepare_appointments';
import type {
  AppointmentCollectorViewModel,
  AppointmentEntity,
  AppointmentItemViewModel,
  AppointmentViewModelPlain,
  ListEntity,
  MinimalAppointmentEntity,
  SortedEntity,
  UTCDatesBeforeSplit,
} from './types';

const computeAutoPerRowHeights = (
  sortedItems: SortedEntity[],
  panelName: 'regularPanel' | 'allDayPanel',
  minHeight: number,
  baseCellHeight: number,
  isMonthView: boolean,
): number[] => {
  const maxLevelPerRow: Record<number, number> = {};

  for (const item of sortedItems) {
    const inPanel = panelName === 'allDayPanel' ? item.isAllDayPanelOccupied : !item.isAllDayPanelOccupied;
    if (inPanel) {
      const rowKey = isMonthView ? item.rowIndex : item.groupIndex;
      const prev = maxLevelPerRow[rowKey] ?? 0;
      if (item.maxLevel > prev) {
        maxLevelPerRow[rowKey] = item.maxLevel;
      }
    }
  }

  const keys = Object.keys(maxLevelPerRow);
  if (keys.length === 0) {
    return [];
  }

  const maxKey = Math.max(...keys.map(Number));
  const heights: number[] = Array<number>(maxKey + 1).fill(baseCellHeight);
  for (const [key, maxLevel] of Object.entries(maxLevelPerRow)) {
    heights[Number(key)] = Math.max(baseCellHeight, maxLevel * minHeight);
  }
  return heights;
};

const computeAllDayAutoHeight = (
  sortedItems: SortedEntity[],
  minHeight: number,
  baseCellHeight: number,
): number => {
  let maxLevel = 0;

  for (const item of sortedItems) {
    if (item.isAllDayPanelOccupied) {
      maxLevel = Math.max(maxLevel, item.maxLevel);
    }
  }

  return maxLevel > 0
    ? Math.max(baseCellHeight, maxLevel * minHeight)
    : baseCellHeight;
};

class AppointmentLayoutManager {
  private preparedItems: MinimalAppointmentEntity[] = [];

  private _filteredItems: ListEntity[] = [];

  public get filteredItems(): ListEntity[] { return this._filteredItems; }

  private _sortedItems: SortedEntity[] = [];

  public get sortedItems(): SortedEntity[] { return this._sortedItems; }

  // NOTE: Here we should pass global store. But right now scheduler component is global store
  constructor(public schedulerStore: Scheduler) {}

  public prepareAppointments(items?: Appointment[]): void {
    this.preparedItems = prepareAppointments(this.schedulerStore, items);
  }

  public filterAppointments(): void {
    this._filteredItems = filterAppointments(this.schedulerStore, this.preparedItems);
  }

  public getOccurrences(
    startDate: Date,
    endDate: Date,
    rawAppointments: Appointment[],
  ): Occurrence[] {
    const preparedAppointments = prepareAppointments(this.schedulerStore, rawAppointments);
    const occurrences = getOccurrences(
      this.schedulerStore,
      startDate,
      endDate,
      preparedAppointments,
    );

    return occurrences;
  }

  public hasAllDayAppointments(): boolean {
    return this._filteredItems.filter((item: ListEntity) => item.isAllDayPanelOccupied).length > 0;
  }

  public generateViewModel(): AppointmentViewModelPlain[] {
    const viewType = this.schedulerStore.currentView.type;
    if (viewType === 'agenda') {
      const viewModel = generateAgendaViewModel(this.schedulerStore, this._filteredItems);
      return viewModel.map((item) => ({
        ...item,
        isAgendaModel: true,
        info: getAgendaAppointmentInfo(item),
      }));
    }

    const optionManager = new OptionManager(this.schedulerStore);

    this._sortedItems = sortAppointments(optionManager, this._filteredItems);

    const {
      autoHeight,
      viewOrientation,
      isTimelineView,
      isMonthView,
      isAdaptivityEnabled,
      hasAllDayPanel,
    } = optionManager.options;

    const isAutoHeightApplicable = autoHeight && (isTimelineView || isMonthView);

    if (isAutoHeightApplicable) {
      const workspace = this.schedulerStore.getWorkSpace();
      const baseCellHeight = Math.max(workspace.getCellHeight(), 1);
      const minAppointmentHeight = getDefaultAppointmentSize({
        isTimelineView,
        isAdaptivityEnabled,
        viewOrientation,
      }).height;

      const autoRowHeights = computeAutoPerRowHeights(
        this._sortedItems,
        'regularPanel',
        minAppointmentHeight,
        baseCellHeight,
        isMonthView,
      );

      if (autoRowHeights.length) {
        workspace.setAutoRowHeights(autoRowHeights);
        optionManager.setAutoRowHeights(autoRowHeights);
      }

      if (hasAllDayPanel) {
        const allDayBaseCellHeight = Math.max(workspace.getAllDayHeight(), 1);
        const allDayMinAppointmentHeight = getDefaultAppointmentSize({
          isTimelineView: false,
          isAdaptivityEnabled,
          viewOrientation: 'horizontal',
        }).height;
        const requiredAllDayHeight = computeAllDayAutoHeight(
          this._sortedItems,
          allDayMinAppointmentHeight,
          allDayBaseCellHeight,
        );

        workspace.setAutoAllDayRowHeight(requiredAllDayHeight);
      }

      optionManager.clearCache();
    } else {
      const workspace = this.schedulerStore.getWorkSpace();
      workspace.clearAutoRowHeight();
      optionManager.resetAutoRowHeights();
    }

    const viewModel = generateGridViewModel(
      this.schedulerStore,
      optionManager,
      this._sortedItems,
    );

    const isSkipResizing = (appointment: ListEntity): boolean => appointment.isAllDayPanelOccupied
      && viewType === 'day'
      && this.schedulerStore.currentView.intervalCount === 1;
    const toItem = (item: AppointmentEntity): AppointmentItemViewModel => ({
      itemData: item.itemData,
      allDay: item.isAllDayPanelOccupied,
      groupIndex: item.groupIndex,
      sortedIndex: item.sortedIndex,
      direction: item.direction,
      level: item.level,
      maxLevel: item.maxLevel,
      empty: item.empty,
      top: item.top,
      left: item.left,
      height: item.height,
      width: item.width,
      reduced: item.reduced,
      partIndex: item.partIndex,
      partTotalCount: item.partCount,
      rowIndex: item.rowIndex,
      columnIndex: item.columnIndex,
      skipResizing: isSkipResizing(item),
      info: getAppointmentInfo(item),
    });
    const toCollectedItem = (
      item: ListEntity & UTCDatesBeforeSplit & RealSize,
    ): AppointmentItemViewModel => ({
      itemData: item.itemData,
      allDay: item.isAllDayPanelOccupied,
      groupIndex: item.groupIndex,
      width: item.width,
      height: item.height,
      info: getAppointmentInfo(item),
    } as unknown as AppointmentItemViewModel);

    return viewModel.map((item) => {
      if (item.items.length) {
        return {
          itemData: item.itemData,
          allDay: item.isAllDayPanelOccupied,
          groupIndex: item.groupIndex,
          sortedIndex: item.sortedIndex,
          top: item.top,
          left: item.left,
          width: item.width,
          height: item.height,
          isCompact: item.isCompact,
          items: item.items.map(toCollectedItem),
        } as AppointmentCollectorViewModel;
      }

      return toItem(item);
    });
  }
}

export default AppointmentLayoutManager;
