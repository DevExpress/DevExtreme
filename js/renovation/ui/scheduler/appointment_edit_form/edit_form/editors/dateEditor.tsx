import {
  Component,
  ComponentBindings,
  Effect,
  InternalState,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { DateBox, DateEditorType } from '../../../../editors/drop_down_editors/date_box';
import { getFirstDayOfWeek } from '../../utils';

// istanbul ignore next: should be tested in React infrastructure
export const viewFunction = ({
  date,
  type,
  calendarOptions,
  props: {
    disabled,
  },
  updateDate,
}: DateEditor): JSX.Element => (
  <DateBox
    width="100%"
    useMaskBehavior
    value={date}
    valueChange={updateDate}
    type={type}
    calendarOptions={calendarOptions}
    disabled={disabled}
  />
);

@ComponentBindings()
export class DateEditorProps {
  @OneWay() value!: Date;

  @OneWay() firstDayOfWeek!: number | undefined;

  @OneWay() isAllDay!: boolean;

  @OneWay() disabled?: boolean;

  @OneWay() valueChange!: (date: Date) => Date;
}

@Component({ view: viewFunction })
export class DateEditor extends JSXComponent<
DateEditorProps, 'value' | 'firstDayOfWeek' | 'isAllDay' | 'valueChange'>() {
  @InternalState()
  date: Date | undefined;

  @Effect({ run: 'once' }) // WA props are no accessible on state init
  initDate(): void {
    if (!this.date) {
      this.date = this.props.value;
    }
  }

  updateDate(date: Date): void {
    this.date = this.props.valueChange(date);
  }

  get calendarOptions(): { firstDayOfWeek: number } {
    return {
      firstDayOfWeek: getFirstDayOfWeek(this.props.firstDayOfWeek),
    };
  }

  get type(): DateEditorType {
    return this.props.isAllDay
      ? 'date'
      : 'datetime';
  }
}
