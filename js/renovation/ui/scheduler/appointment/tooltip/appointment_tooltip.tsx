import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { Tooltip } from '../../../overlays/tooltip';
import { AppointmentList } from './appointment_list';
import { AppointmentViewModel } from '../types';

export const viewFunction = ({
  updateVisible,
  props: {
    visible,
    dataList,
    target,
  },
}: AppointmentTooltip): JSX.Element => (
  <Tooltip
    closeOnOutsideClick
    visible={visible}
    visibleChange={updateVisible}
    target={target}
    wrapperAttr={{
      class: 'dx-scheduler-appointment-tooltip-wrapper',
    }}
  >
    <AppointmentList
      appointments={dataList}
    />
  </Tooltip>
);

@ComponentBindings()
export class AppointmentTooltipProps {
  @OneWay() visible!: boolean;

  @OneWay() onVisibleChange!: (value: boolean) => void;

  @OneWay() target!: HTMLElement | undefined;

  @OneWay() dataList!: AppointmentViewModel[];
}

@Component({ view: viewFunction })
export class AppointmentTooltip extends
  JSXComponent<AppointmentTooltipProps, 'visible' | 'onVisibleChange' | 'target' | 'dataList'>() {
  updateVisible(visible: boolean): void {
    this.props.onVisibleChange(visible);
  }
}
