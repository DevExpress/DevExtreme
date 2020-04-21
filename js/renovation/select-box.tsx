import { Ref, Effect, Component, ComponentBindings, JSXComponent } from 'devextreme-generator/component_declaration/common';

export const viewFunction = ({ widgetRef }: SelectBox) => {
    return (<div ref={widgetRef as any}/>);
};

@ComponentBindings()
export class SelectBoxProps {
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
