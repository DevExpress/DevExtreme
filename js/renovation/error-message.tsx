import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = ({ props: { message, className }, restAttributes }: ErrorMessage) => (
  <div
    className={`dx-validationsummary dx-validationsummary-item ${className}`}
    {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
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
export default class ErrorMessage extends JSXComponent<ErrorMessageProps> {}
