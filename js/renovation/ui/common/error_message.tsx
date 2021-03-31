import {
  ComponentBindings, OneWay, JSXComponent, Component,
} from '@devextreme-generator/declarations';

export const viewFunction = (
  { props: { message, className }, restAttributes }: ErrorMessage,
): JSX.Element => (
  <div
    className={`dx-validationsummary dx-validationsummary-item ${className}`}
      /* eslint-disable react/jsx-props-no-spreading */
    {...restAttributes}
  >
    {message}
  </div>
);

@ComponentBindings()
export class ErrorMessageProps {
  @OneWay() className?: string = '';

  @OneWay() message?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ErrorMessage extends JSXComponent(ErrorMessageProps) {}
