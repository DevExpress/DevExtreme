import {
  Component,
  ComponentBindings,
  Effect,
  InternalState,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { SelectBox } from '../../../../editors/drop_down_editors/select_box';
import messageLocalization from '../../../../../../localization/message';
import timeZoneDataUtils from '../../../../../../ui/scheduler/timezones/utils.timezones_data';
import DataSource from '../../../../../../data/data_source';

const noTzTitle = messageLocalization.format('dxScheduler-noTimezoneTitle');

// istanbul ignore next: should be tested in React infrastructure
export const viewFunction = ({
  timeZone,
  dataSource,
}: TimeZoneEditor): JSX.Element => (
  <SelectBox
    value={timeZone}
    dataSource={dataSource}
    displayExpr="title"
    valueExpr="id"
    placeholder={noTzTitle}
    searchEnabled
  />
);

@ComponentBindings()
export class TimeZoneEditorProps {
  @OneWay() value!: string | undefined;

  @OneWay() date!: Date;

  @OneWay() valueChange!: (timeZone: string) => void;
}

@Component({ view: viewFunction })
export class TimeZoneEditor extends JSXComponent<
TimeZoneEditorProps, 'date' | 'value' | 'valueChange'>() {
  @InternalState()
  timeZone: string | undefined;

  @Effect({ run: 'once' }) // WA props are no accessible on state init
  initDate(): void {
    if (!this.timeZone) {
      this.timeZone = this.props.value;
    }
  }

  updateDate(timeZone: string): void {
    this.timeZone = timeZone;

    this.props.valueChange(timeZone);
  }

  get dataSource(): DataSource {
    return new DataSource({
      store: timeZoneDataUtils.getDisplayedTimeZones(this.props.date),
      paginate: true,
      pageSize: 10,
    });
  }
}
