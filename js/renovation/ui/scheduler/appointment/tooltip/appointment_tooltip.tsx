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
  wrapperAttr,
  props: {
    onVisibleChange,
    visible,
    dataList,
    target,
  },
}: AppointmentTooltip): JSX.Element => (
  <Tooltip
    closeOnOutsideClick
    visible={visible}
    visibleChange={onVisibleChange}
    target={target}
    wrapperAttr={wrapperAttr}
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
  wrapperAttr = {
    class: 'dx-scheduler-appointment-tooltip-wrapper',
  };
}
