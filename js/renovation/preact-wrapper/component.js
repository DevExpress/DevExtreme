import * as Preact from 'preact';
import { useLayoutEffect } from 'preact/hooks';
import $ from '../../core/renderer';
import DOMComponent from '../../core/dom_component';
import { extend } from '../../core/utils/extend';
import { wrapElement, removeDifferentElements } from './utils';
import { getPublicElement } from '../../core/element';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

function abandonProps() {
    return {
        _hasAnonymousTemplateContent: null,
        class: null,
        elementAttr: null,
        integrationOptions: null,
    };
}

export default class PreactWrapper extends DOMComponent {
    getInstance() {
        return this;
    }

    get viewRef() {
        return this._viewRef.current;
    }

    _getDefaultOptions() {
        return extend(
            super._getDefaultOptions(),
            this._viewComponent.defaultProps,
        );
    }

    _initMarkup() {
        const props = this.getAllProps();
        if(this._shouldRefresh) {
            this._shouldRefresh = false;

            this._renderPreact({
                ...props, width: null, height: null, style: null, className: null,
            });
        }
        this._renderPreact(props);
    }

    _renderPreact(props) {
        const containerNode = this.$element().get(0);
        const replaceNode = (!this._preactReplaced && containerNode.parentNode) ? containerNode : undefined;

        if(containerNode.parentNode) {
            this._preactReplaced = true;
        }

        Preact.render(
            Preact.h(this._viewComponent, props),
            containerNode,
            replaceNode,
        );
    }

    _render() { }

    _dispose() {
        Preact.render(null, this.$element().get(0));
        super._dispose();
    }

    get elementAttr() {
        if(!this._elementAttr) {
            const { attributes } = this.$element()[0];
            this._elementAttr = {
                ...Object.keys(attributes).reduce((a, key) => {
                    if(attributes[key].specified) {
                        a[attributes[key].name] = attributes[key].value;
                    }
                    return a;
                }, {}),
            };
        }
        const elemStyle = this.$element()[0].style;
        const style = {};
        for(let i = 0; i < elemStyle.length; i++) {
            style[elemStyle[i]] = elemStyle.getPropertyValue(elemStyle[i]);
        }
        this._elementAttr.style = style;

        const cssClass = this.$element()[0].getAttribute('class');
        if(cssClass) {
            this._elementAttr.class = cssClass
                .split(' ')
                .filter((name) => name.indexOf('dx-') < 0)
                .join(' ');
        }

        return this._elementAttr;
    }

    getAllProps() {
        const options = { ...this.option(), ref: this._viewRef };
        return this.getProps({
            ...options,
            ...this.elementAttr,
            ...options.elementAttr,
            className: [
                ...new Set([
                    ...(this.elementAttr.class || '').split(' '),
                    ...(options.elementAttr.class || '').split(' '),
                ]),
            ]
                .filter((s) => s)
                .join(' '),
            ...this._actionsMap,
            ...abandonProps(),
        });
    }

    _getActionConfigs() {
        return {};
    }

    _init() {
        super._init();
        this._actionsMap = {};

        Object.keys(this._getActionConfigs()).forEach((name) => this._addAction(name));

        this._viewRef = Preact.createRef();
        this._supportedKeys = () => ({});
    }

    _addAction(event, action) {
        this._actionsMap[event] = action
            || this._createActionByOption(event, this._getActionConfigs()[event]);
    }

    _optionChanged(option) {
        const { name } = option || {};
        if(name && this._getActionConfigs()[name]) {
            this._addAction(name);
        }

        super._optionChanged(option);
        this._invalidate();
    }

    _stateChange(name) {
        return (value) => this.option(name, value);
    }

    _createTemplateComponent(props, templateOption, canBeAnonymous) {
        if(
            !templateOption
            && this.option('_hasAnonymousTemplateContent')
            && canBeAnonymous
        ) {
            templateOption = this._templateManager.anonymousTemplateName;
        }
        if(!templateOption) {
            return;
        }

        const template = this._getTemplate(templateOption);
        return ({ parentRef, data, index }) => {
            useLayoutEffect(
                () => {
                    const $parent = $(parentRef.current);
                    const $children = $parent.contents();

                    const payload = {
                        container: getPublicElement($parent),
                        model: data,
                        transclude:
                            canBeAnonymous
                            && templateOption
                            === this._templateManager.anonymousTemplateName,
                    };
                    if(isFinite(index)) {
                        payload.index = index;
                    }

                    let $template = $(template.render(payload));

                    if($template.hasClass(TEMPLATE_WRAPPER_CLASS)) {
                        $template = wrapElement($parent, $template);
                    }
                    const $newChildren = $parent.contents();

                    return () => {
                        // NOTE: order is important
                        removeDifferentElements($children, $newChildren);
                    };
                },
                Object.keys(props).map((key) => props[key]),
            );

            return <Preact.Fragment />;
        };
    }

    _wrapKeyDownHandler(handler) {
        return (options) => {
            const { originalEvent, keyName, which } = options;
            const keys = this._supportedKeys();
            const func = keys[keyName] || keys[which];

            // NOTE: registered handler has more priority
            if(func !== undefined) {
                const handler = func.bind(this);
                const result = handler(originalEvent, options);

                if(!result) {
                    originalEvent.cancel = true;
                    return originalEvent;
                }
            }

            // NOTE: make it possible to pass onKeyDown property
            return handler?.(originalEvent, options);
        };
    }

    // Public API
    repaint() {
        this._shouldRefresh = true;
        this._refresh();
    }

    registerKeyHandler(key, handler) {
        const currentKeys = this._supportedKeys();
        this._supportedKeys = () => ({ ...currentKeys, [key]: handler });
    }

    // NOTE: this method will be deprecated
    //       aria changes should be defined in declaration or passed through property
    setAria() {
        throw new Error(
            '"setAria" method is deprecated, use "aria" property instead',
        );
    }
}
