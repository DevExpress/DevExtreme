import { Ref, Effect, Component, ComponentBindings, JSXComponent, Event, OneWay, TwoWay } from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './widget';
import DataSource, { DataSourceOptions } from '../data/data_source';
import dxSelectBox from '../ui/select_box';

export const viewFunction = ({ widgetRef }: SelectBox) => {
    return (<div ref={widgetRef as any}/>);
};

@ComponentBindings()
export class SelectBoxProps extends WidgetProps {
    @OneWay() dataSource?: string | Array<string | any> | DataSource | DataSourceOptions;
    @OneWay() displayExpr?: string;
    @TwoWay() value?: number;
    @OneWay() valueExpr?: string;
    @Event() valueChange?: ((value: number) => void) = () =>  {};
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})
export default class SelectBox extends JSXComponent<SelectBoxProps> {
    @Ref()
    widgetRef!: HTMLDivElement;
    @Effect()
    setupWidget() {
        const  { valueChange } = this.props;
        // tslint:disable-next-line: no-unused-expression
        new dxSelectBox(this.widgetRef, {
            ...this.props as any,
            onValueChanged: (e) => {
                valueChange!(e.value);
            },
        });
    }

}
