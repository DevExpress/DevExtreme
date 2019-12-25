import { Component, Prop, Event, InternalState, Listen, React, Template } from "../component_declaration/common";
import { getDocument } from '../core/dom_adapter';
import { getImageSourceType } from '../core/utils/icon';
import { isDefined } from '../core/utils/type';
const document = getDocument();

// ===========================
// accessKey: null,
// activeStateEnabled: true,
// component: null,
// disabled: false,
// focusStateEnabled: true,
// hoverStateEnabled: true,
// onContentReady: null,
// onDisposing: null,
// onInitialized: null,
// onOptionChanged: null,
// render: null,
// rtlEnabled: false,
// stylingMode: "contained",
// tabIndex: 0,
// template: "content",
// useSubmitBehavior: false,
// validationGroup: undefined,
// visible: true,
// ===========================

// from core/utils/icon

const ICON_CLASS = 'dx-icon';
const SVG_ICON_CLASS = 'dx-svg-icon';

const getImageContainerJSX = (source: string) => {
    const type = getImageSourceType(source);
    if(type === 'image')
        return (<img src={source} className={ICON_CLASS}></img>);
    if(type === 'fontIcon')
        return (<i className={`${ICON_CLASS} ${source}`}></i>);
    if(type === 'dxIcon')
        return (<i className={`${ICON_CLASS} ${ICON_CLASS}-${source}`}></i>);
    if(type === 'svg')
        return (<i className={`${ICON_CLASS} ${SVG_ICON_CLASS}`}>{source}></i>);
}

// from core/utils/icon - END

const getCssClasses = (model: any) => {
    const classNames = ['dx-widget', 'dx-button'];
    model.elementAttr.class && classNames.push(model.elementAttr.class);

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
    } else if (model.type === 'back') {
        classNames.push('dx-button-back');
    } else {
        classNames.push('dx-button-normal');
    }

    if (model.text) {
        classNames.push('dx-button-has-text');
    }
    if(model.icon) {
        classNames.push('dx-button-has-icon');
    }

    if (model._hovered) {
        classNames.push('dx-state-hover');
    }

    if (model.pressed || model._active) {
        classNames.push('dx-state-active');
    }

    if (!model.visible) {
        classNames.push('dx-state-invisible');
    }
    return classNames.concat(model.classNames).join(" ");
}

const getElementAttribute = (name: string, value: string) => {
    const validName = (name === 'role' || name === 'id') ? name : `aria-${name}`;
    const validValue = isDefined(value) ? value.toString() : null;

    const result: any = {};
    result[validName] = validValue;
    return result;
};

const getAttributes = (attrs: any) => {
    let elementAttributes = {};

    for (let attrName in attrs) {
        elementAttributes = { ...elementAttributes, ...getElementAttribute(attrName, attrs[attrName]) };
    }
    return elementAttributes;
};

const viewModelFunction = (model: Button) => {
    let icon;
    if(model.icon || model.type === 'back') {
        icon = getImageContainerJSX(model.icon || 'back');
    }
    const elementAttributes = getAttributes(model.elementAttr);

    return {
        ...model,
        elementAttributes,
        cssClasses: getCssClasses(model),
        style: {
            width: model.width,
            height: model.height
        },
        icon,
    };
}

const viewFunction = (viewModel: Button & { cssClasses: string, style: { width?: string } }) => (
    <div
        {...viewModel.elementAttr}
        className={viewModel.cssClasses}
        title={viewModel.hint}
        style={viewModel.style}
        hidden={!viewModel.visible}
        onPointerOver={viewModel.onPointerOver}
        onPointerOut={viewModel.onPointerOut}
        onPointerDown={viewModel.onPointerDown}
        onClick={viewModel.onClickHandler}
    >
        {viewModel.contentRender && (
            <div className="dx-button-content">
                <viewModel.contentRender icon={viewModel.icon} text={viewModel.text} />
            </div>
        ) || (
            <div className="dx-button-content">
                {viewModel.icon}
                {viewModel.text && <span className="dx-button-text">{viewModel.text}</span>}
            </div>
        )}

    </div>
);

@Component({
    name: 'Button',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction,
})

export default class Button {
    @Prop() classNames?: string[]
    @Prop() height?: string;
    @Prop() hint?: string;
    @Prop() icon?: string;
    @Prop() pressed?: boolean;
    @Prop() stylingMode?: string;
    @Prop() text?: string;
    @Prop() type?: string;
    @Prop() width?: string;
    @Prop() elementAttr?: any = {};
    @Prop() visible?: boolean = true;

    // @Template() contentRender?: any;
    @Prop() contentRender?: any;

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
        this._active = false;
    }

    @Listen("click")
    onClickHandler(e: any) {
        this.onClick!({ type: this.type, text: this.text });
    }
}
