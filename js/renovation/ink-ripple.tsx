import { Component, ComponentBindings, JSXComponent, OneWay, Ref, Method } from 'devextreme-generator/component_declaration/common';
import { showWave, hideWave } from '../ui/widget/utils.ink_ripple';

// TODO: remake old ink ripple in new JSX component
export const viewFunction = (viewModel) => {
    return <div className="dx-inkripple" />;
};

@ComponentBindings()
export class InkRippleInput {
    @OneWay() config?: any = {};
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})
export default class InkRipple extends JSXComponent<InkRippleInput> {
    @Ref() waveRef!: HTMLDivElement;

    @Method()
    hideWave(event) {
        const { config } = this.props;
        hideWave(config, event);
    }

    @Method()
    showWave(conf) {
        const { config } = this.props;
        showWave(config, conf);
    }
}
