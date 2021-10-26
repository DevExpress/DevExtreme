import {
  Component, ComponentBindings, CSSAttributes, JSXComponent, JSXTemplate, OneWay, Template,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../utils/combine_classes';
import { OverflowIndicatorTemplateProps, OverflowIndicatorViewModel } from '../types';
import { Button } from '../../../button';
import { getOverflowIndicatorStyles } from './utils';
import messageLocalization from '../../../../../localization/message';

export const viewFunction = ({
  text,
  styles,
  classes,
  appointmentCount,
  isCompact,
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
        <OverflowIndicatorTemplate
          appointmentCount={appointmentCount}
          isCompact={isCompact}
        />
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
  get appointmentCount(): number {
    return this.props.viewModel.items.settings.length;
  }

  get isCompact(): boolean {
    return this.props.viewModel.isCompact;
  }

  get text(): string {
    const {
      isCompact,
    } = this.props.viewModel;

    if (isCompact) {
      return `${this.appointmentCount}`;
    }

    const formatter = messageLocalization.getFormatter(
      'dxScheduler-moreAppointments',
    ) as (value: number) => string;

    return formatter(this.appointmentCount);
  }

  get styles(): CSSAttributes {
    return getOverflowIndicatorStyles(this.props.viewModel);
  }

  get classes(): string {
    return combineClasses({
      'dx-scheduler-appointment-collector': true,
      'dx-scheduler-appointment-collector-compact': this.isCompact,
    });
  }
}
