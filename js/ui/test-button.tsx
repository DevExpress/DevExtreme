import { Component, Prop, Event, InternalState, Listen, React } from "../component_declaration/common";
import { getDocument } from "../core/dom_adapter";
const document = getDocument();

@Component({
    name: 'Button',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction
})

export default class Button {
    @Prop() classNames?: string[]
    @Prop() height?: string;
    @Prop() hint?: string;
    @Prop() pressed?: boolean;
    @Prop() stylingMode?: string;
    @Prop() text?: string;
    @Prop() type?: string;
    @Prop() width?: string;

    @Event() onClick?: (e: any) => void = (() => { });

    @InternalState() _hovered: boolean = false;
    @InternalState() _active: boolean = false;

    @Listen("pointerover")
    onPointerOver() {
        this._hovered = true;
    }

    @Listen("pointerout")
    onPointerOut() {
        this._hovered = false;
    }

    @Listen("pointerdown")
    onPointerDown() {
        this._active = true;
    }

    @Listen('pointerup', { target: document })
    onPointerUp() {
        //this._active = false;
    }

    @Listen("click")
    onClickHandler(e: any) {
        this.onClick!({ type: this.type, text: this.text });
    }
}

function getCssClasses(model: any) {
    const classNames = ['dx-button'];

    if (model.stylingMode === 'outlined') {
        classNames.push('dx-button-mode-outlined');
    } else if (model.stylingMode === 'text') {
        classNames.push('dx-button-mode-text');
    } else {
        classNames.push('dx-button-mode-contained');
    }

    if (model.type === 'danger') {
        classNames.push('dx-button-danger');
    } else if (model.type === 'default') {
        classNames.push('dx-button-default');
    } else if (model.type === 'success') {
        classNames.push('dx-button-success');
    } else {
        classNames.push('dx-button-normal');
    }

    if (model.text) {
        classNames.push('dx-button-has-text');
    }

    if (model._hovered) {
        classNames.push("dx-state-hover");
    }

    if (model.pressed || model._active) {
        classNames.push("dx-state-active");
    }
    return classNames.concat(model.classNames).join(" ");
}

function viewModelFunction(model: Button) {
    return {
        cssClasses: getCssClasses(model),
        style: {
            width: model.width
        },
        ...model
    };
}

function viewFunction(viewModel: Button & { cssClasses: string, style: { width?: string } }) {
    return (
        <div
            className={viewModel.cssClasses}
            title={viewModel.hint}
            style={viewModel.style}
            onPointerOver={viewModel.onPointerOver}
            onPointerOut={viewModel.onPointerOut}
            onPointerDown={viewModel.onPointerDown}
            onClick={viewModel.onClickHandler}>
            <div className="dx-button-content">
                <span className="dx-button-text">{viewModel.text}</span>
            </div>
        </div>
    );
}

