import { Component, ComponentBindings, JSXComponent, OneWay } from 'devextreme-generator/component_declaration/common';

export const viewFunction = ({ props: { message, className } }: ErrorMessage) => (
    <div className={`dx-validationsummary dx-validationsummary-item ${className}`}>
        {message}
    </div>
);

@ComponentBindings()
export class ErrorMessageProps {
    @OneWay() className?: string = '';
    @OneWay() message?: string = '';
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})
export default class ErrorMessage extends JSXComponent<ErrorMessageProps> {}
