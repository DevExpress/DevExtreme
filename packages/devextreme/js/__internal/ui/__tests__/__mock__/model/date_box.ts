import DateBox from '@ts/ui/date_box/date_box';

import { DropDownEditorModel } from './drop_down_editor';

const CLASSES = {
  calendarCell: 'dx-calendar-cell',
};

export class DateBoxModel extends DropDownEditorModel {
  public getInstance(): DateBox {
    return DateBox.getInstance(this.root);
  }

  public getCalendarCells(): HTMLElement[] {
    const overlayContent = this.getOverlay().getElement();

    return Array.from(overlayContent?.querySelectorAll<HTMLElement>(`.${CLASSES.calendarCell}`) ?? []);
  }
}
