import { Ref, Effect, Component, ComponentBindings, JSXComponent } from 'devextreme-generator/component_declaration/common';

export const viewFunction = ({ widgetRef }: NumberBox) => {
    return (<div ref={widgetRef as any}/>);
};

@ComponentBindings()
class NumberBoxInput {

}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})
export default class NumberBox extends JSXComponent<NumberBoxInput> {
    @Ref()
    widgetRef!: HTMLDivElement;
    @Effect()
    setupWidget() {
        ($(this.widgetRef) as any).dxNumberBox(this.props as any);
    }

}
