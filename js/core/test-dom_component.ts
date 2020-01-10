import { Component, Prop, Event, InternalState, Listen, React, Template } from "../../declarations/component_declaration/common";
import config from './config';
import { extend } from './utils/extend';
import { hasWindow } from '../core/utils/window';

const getStyles = ({ width, height }) => {
    return {
        width: width === null ? '' : width,
        height: height === null ? '' : height,
    }
}

const getCssClasses = (model: any) => {
    const className = [];

    if (model.rtlEnabled) {
        className.push('dx-rtl');
    }
    if (model.visibilityChanged && hasWindow()) {
        className.push('dx-visibility-change-handler');
    }
    if (model.elementAttr.class) {
        className.push(model.elementAttr.class);
    }

    return className;
};

const getAttributes = ({ elementAttr }) => {
    const attrs = extend({}, elementAttr);
    delete attrs.class;

    return attrs;
};

export const domComponentViewModel = ({
    rtlEnabled,
    elementAttr = {},
    disabled = false,
    visibilityChanged = false,
}) => {
    const style = getStyles({ width, height });
    const className = getCssClasses({ rtlEnabled, elementAttr, visibilityChanged });
    const attrsWithoutClass = getAttributes({ elementAttr });

    return {
        rtlEnabled,
        elementAttr: attrsWithoutClass,
        disabled,
        className,
        style,
    };
};

export default class DomComponent {
    @Prop() width?: string | number | null = null;
    @Prop() height?: string | number | null = null;
    @Prop() rtlEnabled?: { [name: string]: any } = config().rtlEnabled;
    @Prop() elementAttr?: { [name: string]: any } = {};
    @Prop() disabled?: boolean = false;
}
