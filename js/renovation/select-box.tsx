import { Ref, Effect, Component, ComponentBindings, JSXComponent, Event, OneWay } from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './widget';
import DataSource, { DataSourceOptions } from '../data/data_source';

export const viewFunction = ({ widgetRef }: SelectBox) => {
    return (<div ref={widgetRef as any}/>);
};

@ComponentBindings()
export class SelectBoxProps extends WidgetProps {
    @OneWay() dataSource?: string | Array<string | any> | DataSource | DataSourceOptions;
    @OneWay() displayExpr?: string;
    @OneWay() value: any;
    @OneWay() valueExpr?: string;
    @Event() onSelectionChanged: ((value: number) => void) = () =>  {};
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
        ($(this.widgetRef) as any).dxSelectBox(this.props as any);
    }

}
