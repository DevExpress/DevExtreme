import {
  Component,
  ComponentBindings,
  Fragment,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = ({
  textParts,
  props: {
    text,
    splitText,
  },
}: DateHeaderText): JSX.Element => (
  <Fragment>
    {
      splitText
        // eslint-disable-next-line react/jsx-key
        ? textParts.map((part) => (<span className="dx-scheduler-header-panel-cell-date">{part}</span>))
        : text
    }
  </Fragment>
);

@ComponentBindings()
export class DateHeaderTextProps {
  @OneWay() text?: string = '';

  @OneWay() splitText = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateHeaderText extends JSXComponent(DateHeaderTextProps) {
  get textParts(): string[] {
    const { text } = this.props;

    return text
      ? text.split(' ')
      : [''];
  }
}
