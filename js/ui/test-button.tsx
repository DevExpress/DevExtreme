import { Component, Prop, React } from "../component_declaration/common";
import { getImageSourceType } from '../core/utils/icon';

import Widget from './test-widget';

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

    return {
        ...model,
        cssClasses: getCssClasses(model),
        icon
    };
}

export const viewFunction = (viewModel: Button) => (
    <Widget
        className={'viewModel.cssClasses'}
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
    </Widget>
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
    @Prop() elementAttr?: { [name: string]: any } = {};
    @Prop() visible?: boolean = true;

    @Prop() contentRender?: any;
}
