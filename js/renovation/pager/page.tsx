import { Component, ComponentBindings, JSXComponent, OneWay } from 'devextreme-generator/component_declaration/common';

const PAGER_PAGE_CLASS = 'dx-page';
const PAGER_SELECTION_CLASS = 'dx-selection';
const PAGER_PAGE_SELECTION_CLASS = `${PAGER_PAGE_CLASS} ${PAGER_SELECTION_CLASS}`;
export const viewFunction = ({ className, value }: PagerPage) => {
    return (<div className={className}>{value}</div>);
};

@ComponentBindings()
export class PagerPageInput {
    @OneWay() index?: number;
    @OneWay() selected: boolean = false;
    @OneWay() value?: string;
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})

export default class PagerPage extends JSXComponent<PagerPageInput> {
    get value() {
        const
            { value } = this.props;
        // TODO Vitik: copy code from pager.js
        return value;
    }
    get className() {
        const
            { selected } = this.props;
        return selected ? PAGER_PAGE_SELECTION_CLASS : PAGER_PAGE_CLASS;
    }

}
