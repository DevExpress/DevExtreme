import { Component, ComponentBindings, JSXComponent, OneWay } from 'devextreme-generator/component_declaration/common';

// const VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';
// const ITEM_CLASS = VALIDATION_SUMMARY_CLASS + '-item';
// const ITEM_DATA_KEY = VALIDATION_SUMMARY_CLASS + '-item-data';

export const viewFunction = ({ props: { message, className } }: ErrorMessage) => (
    <div className={`dx-validationsummary dx-validationsummary-item ${className}`}>
        {message}
    </div>
);

@ComponentBindings()
export class ErrorMessageInput {
    @OneWay() className?: string = '';
    @OneWay() message?: string = '';
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    components: [],
    view: viewFunction,
})
export default class ErrorMessage extends JSXComponent<ErrorMessageInput> {}
