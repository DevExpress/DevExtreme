import DateRangeBox from '@ts/ui/date_range_box/date_range_box';

import { DateBoxModel } from './date_box';
import { DropDownEditorModel } from './drop_down_editor';

const CLASSES = {
  startDateBox: 'dx-start-datebox',
  endDateBox: 'dx-end-datebox',
  calendarCell: 'dx-calendar-cell',
};

export class DateRangeBoxModel extends DropDownEditorModel {
  public getInstance(): DateRangeBox {
    return DateRangeBox.getInstance(this.root);
  }

  public getStartDateBox(): DateBoxModel {
    return new DateBoxModel(this.root.querySelector(`.${CLASSES.startDateBox}`) as HTMLElement);
  }

  public getEndDateBox(): DateBoxModel {
    return new DateBoxModel(this.root.querySelector(`.${CLASSES.endDateBox}`) as HTMLElement);
  }

  public getCalendarCells(): HTMLElement[] {
    const overlayContent = this.getOverlay().getElement();

    return Array.from(overlayContent?.querySelectorAll<HTMLElement>(`.${CLASSES.calendarCell}`) ?? []);
  }
}
