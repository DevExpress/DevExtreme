import { Ref, Effect, Component, ComponentBindings, JSXComponent } from 'devextreme-generator/component_declaration/common';

export const viewFunction = ({ widgetRef }: NumberBox) => {
    return (<div ref={widgetRef as any}/>);
};

@ComponentBindings()
class NumberBoxProps {

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
