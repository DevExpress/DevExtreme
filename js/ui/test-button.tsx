import { Component, Prop, React } from "../component_declaration/common";
import { getImageSourceType } from '../core/utils/icon';

import Widget from './test-widget';
import JSXConstructor from "../component_declaration/jsx";

const WidgetJSX = JSXConstructor<Widget>(Widget);

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
    return null;
}

const getCssClasses = (model: any) => {
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
    return classNames.concat(model.classNames).join(" ");
}

export const viewModelFunction = (model: Button) => {
    let icon;
    if(model.icon || model.type === 'back') {
        icon = getImageContainerJSX(model.icon || 'back');
    }
    const supportedKeys = () => {
        const click = e => {
            e.preventDefault();
            model.onClick && model.onClick(e);
        };

        return { space: click, enter: click };
    }
    return {
        ...model,
        elementAttr: { ...model.elementAttr, role: 'button' },
        aria: { label: model.text && model.text.trim() },
        cssClasses: getCssClasses(model),
        icon,
        supportedKeys,
    };
}

export const viewFunction = (viewModel: Button) => (
    <WidgetJSX
        className={viewModel.cssClasses}
        onClick={viewModel.onClick}
        width={viewModel.width}
        height={viewModel.height}
        rtlEnabled={viewModel.rtlEnabled}
        elementAttr={viewModel.elementAttr}
        disabled={viewModel.disabled}
        visible={viewModel.visible}
        hint={viewModel.hint}
        tabIndex={viewModel.tabIndex}
        accessKey={viewModel.accessKey}
        focusStateEnabled={viewModel.focusStateEnabled}
        hoverStateEnabled={viewModel.hoverStateEnabled}
        activeStateEnabled={viewModel.activeStateEnabled}
        supportedKeys={viewModel.supportedKeys}
        aria={viewModel.aria}
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
    </WidgetJSX>
);

@Component({
    name: 'Button',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction,
})

export default class Button extends Widget {
    @Prop() classNames?: string[]
    @Prop() icon?: string;
    @Prop() pressed?: boolean;
    @Prop() stylingMode?: string;
    @Prop() text?: string;
    @Prop() type?: string;
    @Prop() contentRender?: any;
}
