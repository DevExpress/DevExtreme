import {
  Component, ComponentBindings, CSSAttributes, JSXComponent, JSXTemplate, OneWay, Template,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../utils/combine_classes';
import { OverflowIndicatorTemplateProps, OverflowIndicatorViewModel } from '../types';
import { Button } from '../../../button';
import { getOverflowIndicatorStyles } from './utils';
import messageLocalization from '../../../../../localization/message';
import type { AppointmentCollectorTemplateData } from '../../../../../ui/scheduler';

export const viewFunction = ({
  text,
  styles,
  classes,
  data,
  props: {
    overflowIndicatorTemplate: OverflowIndicatorTemplate,
  },
}: OverflowIndicator): JSX.Element => (
  <Button
    text={text}
    style={styles}
    className={classes}
    type="default"
    stylingMode="contained"
  >
    {
      OverflowIndicatorTemplate && (
        <OverflowIndicatorTemplate data={data} />
      )
    }
  </Button>
);

@ComponentBindings()
export class OverflowIndicatorProps {
  @OneWay() viewModel!: OverflowIndicatorViewModel;

  @Template() overflowIndicatorTemplate?: JSXTemplate<OverflowIndicatorTemplateProps>; // TODO
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class OverflowIndicator extends JSXComponent<OverflowIndicatorProps, 'viewModel'>() {
  get data(): AppointmentCollectorTemplateData {
    return {
      appointmentCount: this.props.viewModel.items.settings.length,
      isCompact: this.props.viewModel.isCompact,
    };
  }

  get text(): string {
    const {
      isCompact,
    } = this.props.viewModel;
    const {
      appointmentCount,
    } = this.data;

    if (isCompact) {
      return `${appointmentCount}`;
    }

    const formatter = messageLocalization.getFormatter(
      'dxScheduler-moreAppointments',
    ) as (value: number) => string;

    return formatter(appointmentCount);
  }

  get styles(): CSSAttributes {
    return getOverflowIndicatorStyles(this.props.viewModel);
  }

  get classes(): string {
    return combineClasses({
      'dx-scheduler-appointment-collector': true,
      'dx-scheduler-appointment-collector-compact': this.data.isCompact,
    });
  }
}
