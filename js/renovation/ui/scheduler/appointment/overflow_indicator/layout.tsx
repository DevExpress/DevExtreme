import {
  Component,
  ComponentBindings,
  Consumer,
  CSSAttributes,
  Effect,
  InternalState,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../utils/combine_classes';
import { OverflowIndicatorTemplateProps, OverflowIndicatorViewModel } from '../types';
import { Button } from '../../../button';
import { getIndicatorColor, getOverflowIndicatorStyles } from './utils';
import messageLocalization from '../../../../../localization/message';
import type { AppointmentCollectorTemplateData } from '../../../../../ui/scheduler';
import { AppointmentsContext, IAppointmentContext } from '../../appointments_context';
import { mergeStylesWithColor } from '../utils';

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
    style={styles}
    className={classes}
    type="default"
    stylingMode="contained"
  >
    {
      OverflowIndicatorTemplate
        ? (<OverflowIndicatorTemplate data={data} />)
        : (<span>{text}</span>)
    }
  </Button>
);

@ComponentBindings()
export class OverflowIndicatorProps {
  @OneWay() viewModel!: OverflowIndicatorViewModel;

  @OneWay() groups!: string[];

  @Template() overflowIndicatorTemplate?: JSXTemplate<OverflowIndicatorTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class OverflowIndicator extends JSXComponent<OverflowIndicatorProps, 'viewModel' | 'groups'>() {
  @Consumer(AppointmentsContext)
  appointmentsContextValue!: IAppointmentContext;

  @InternalState()
  color?: string;

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

  get appointmentStyles(): CSSAttributes | undefined {
    return getOverflowIndicatorStyles(this.props.viewModel);
  }

  get styles(): CSSAttributes | undefined {
    return mergeStylesWithColor(
      this.color,
      this.appointmentStyles,
    );
  }

  get classes(): string {
    return combineClasses({
      'dx-scheduler-appointment-collector': true,
      'dx-scheduler-appointment-collector-compact': this.data.isCompact,
    });
  }

  @Effect()
  updateStylesEffect(): void {
    const { viewModel, groups } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getIndicatorColor(
      this.appointmentsContextValue,
      viewModel,
      groups,
    )
      .then((color) => { this.color = color; });
  }
}
