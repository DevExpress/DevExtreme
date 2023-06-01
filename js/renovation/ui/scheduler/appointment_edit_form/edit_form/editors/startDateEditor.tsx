import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { FormDate, normalizeNewStartDate } from '../utils/normalizeDate';
import { DateEditor } from './dateEditor';

// istanbul ignore next: should be tested in React infrastructure
export const viewFunction = ({
  props: {
    value,
    disabled,
    firstDayOfWeek,
    isAllDay,
  },
  valueChange,
}: StartDateEditor): JSX.Element => (
  <DateEditor
    value={value}
    valueChange={valueChange}
    firstDayOfWeek={firstDayOfWeek}
    disabled={disabled}
    isAllDay={isAllDay}
  />
);

@ComponentBindings()
export class StartDateEditorProps {
  @OneWay() value!: Date;

  @OneWay() firstDayOfWeek!: number | undefined;

  @OneWay() isAllDay!: boolean;

  @OneWay() disabled?: boolean;

  @OneWay() startDate: FormDate;

  @OneWay() endDate: FormDate;

  @OneWay() dateChange!: (date: Date) => void;
}

@Component({ view: viewFunction })
export class StartDateEditor extends JSXComponent<
StartDateEditorProps, 'value' | 'firstDayOfWeek' | 'isAllDay' | 'dateChange'>() {
  valueChange(newDate: Date): Date {
    const result = normalizeNewStartDate(
      newDate,
      this.props.startDate,
      this.props.endDate,
    );

    this.props.dateChange(result);

    return result;
  }
}
