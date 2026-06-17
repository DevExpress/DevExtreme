import dateLocalization from '@js/common/core/localization/date';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { formatWeekdayAndDay } from '@ts/scheduler/r1/utils/index';

import type { ViewDataProviderOptions } from './view_model/types';
import SchedulerWorkSpaceIndicator from './work_space_indicator';

const WEEK_NUMBER_LABEL_CLASS = 'dx-scheduler-week-number-label';
const HEADER_PANEL_EMPTY_CELL_CLASS = 'dx-scheduler-header-panel-empty-cell';

function getLocaleBasedWeekRule(): string {
  return dateLocalization.firstDayOfWeekIndex() === 1 ? 'firstFourDays' : 'firstDay';
}

class SchedulerWorkspaceVertical extends SchedulerWorkSpaceIndicator {
  protected override getFormat(): (date: Date) => string {
    return formatWeekdayAndDay;
  }

  generateRenderOptions(): ViewDataProviderOptions {
    const options = super.generateRenderOptions();

    return {
      ...options,
      isGenerateTimePanelData: true,
    };
  }

  protected override isRenderHeaderPanelEmptyCell(): boolean {
    return true;
  }

  renderRHeaderPanel(isRenderDateHeader = true): void {
    super.renderRHeaderPanel(isRenderDateHeader);
    this.renderWeekNumberInCornerCell();
  }

  private renderWeekNumberInCornerCell(): void {
    if (!this.option().showWeekNumbers) {
      this.$element().find(`.${WEEK_NUMBER_LABEL_CLASS}`).remove();
      return;
    }

    const startDate = this.getStartViewDate();
    const firstDayOfWeek = this.option().firstDayOfWeek
      ?? dateLocalization.firstDayOfWeekIndex();
    const weekNumberRule = this.option().weekNumberRule ?? 'auto';
    const resolvedRule = weekNumberRule === 'auto' ? getLocaleBasedWeekRule() : weekNumberRule;
    const weekNumber = dateUtils.getWeekNumber(startDate, firstDayOfWeek, resolvedRule);

    const $emptyCell = this.$element().find(`.${HEADER_PANEL_EMPTY_CELL_CLASS}`);
    $emptyCell.find(`.${WEEK_NUMBER_LABEL_CLASS}`).remove();
    $('<div>').addClass(WEEK_NUMBER_LABEL_CLASS).text(weekNumber).prependTo($emptyCell);
  }
}

export default SchedulerWorkspaceVertical;
