import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { Tooltip } from '../../../overlays/tooltip';
import { AppointmentList } from './appointment_list';
import { AppointmentViewModel } from '../types';

const wrapperAttr = {
  class: 'dx-scheduler-appointment-tooltip-wrapper',
};

export const viewFunction = ({
  props: {
    onVisibleChange,
    visible,
    dataList,
    target,
  },
}: AppointmentTooltip): JSX.Element => (
  <Tooltip
    focusStateEnabled={false}
    hideOnOutsideClick
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

  @OneWay() target!: HTMLElement;

  @OneWay() dataList!: AppointmentViewModel[];
}

@Component({ view: viewFunction })
export class AppointmentTooltip extends
  JSXComponent<AppointmentTooltipProps, 'visible' | 'onVisibleChange' | 'target' | 'dataList'>() {
}
