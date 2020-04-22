import { Ref, Effect, Component, ComponentBindings, JSXComponent, OneWay, Event, TwoWay } from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './widget';

export const viewFunction = ({ widgetRef }: NumberBox) => {
    return (<div ref={widgetRef as any}/>);
};

@ComponentBindings()
class NumberBoxProps extends WidgetProps {
    // props was copied from js\ui\number_box.d.ts

    // buttons?: Array<'clear' | 'spins' | dxTextEditorButton>;
    // format?: format;
    @OneWay() invalidValueMessage?: string;
    @OneWay() max?: number;
    @OneWay() min?: number;
    @OneWay() mode?: 'number' | 'text' | 'tel';
    // tslint:disable-next-line: max-line-length
    // onValueChanged?: ((e: { component?: T, element?: dxElement, model?: any, value?: any, previousValue?: any, event?: event }) => any);
    @Event() onValueChanged?: (e: {value: number}) => void;
    @OneWay() showSpinButtons?: boolean;
    @OneWay() step?: number;
    @OneWay() useLargeSpinButtons?: boolean;
    @TwoWay() value?: number;
    @Event() valueChange?: ((value: number) => void) = () =>  {};
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})
export default class NumberBox extends JSXComponent<NumberBoxProps> {
    @Ref()
    widgetRef!: HTMLDivElement;
    @Effect()
    setupWidget() {
        ($(this.widgetRef) as any).dxNumberBox(this.props as any);
    }

}
