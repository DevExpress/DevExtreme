import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { FormDate, normalizeNewEndDate } from '../utils/normalizeDate';
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
}: EndDateEditor): JSX.Element => (
  <DateEditor
    value={value}
    valueChange={valueChange}
    firstDayOfWeek={firstDayOfWeek}
    disabled={disabled}
    isAllDay={isAllDay}
  />
);

@ComponentBindings()
export class EndDateEditorProps {
  @OneWay() value!: Date;

  @OneWay() firstDayOfWeek!: number | undefined;

  @OneWay() isAllDay!: boolean;

  @OneWay() disabled?: boolean;

  @OneWay() startDate: FormDate;

  @OneWay() endDate: FormDate;

  @OneWay() dateChange!: (date: Date) => void;
}

@Component({ view: viewFunction })
export class EndDateEditor extends JSXComponent<
EndDateEditorProps, 'value' | 'firstDayOfWeek' | 'isAllDay' | 'dateChange'>() {
  valueChange(newDate: Date): Date {
    const result = normalizeNewEndDate(
      newDate,
      this.props.startDate,
      this.props.endDate,
    );

    this.props.dateChange(result);

    return result;
  }
}
