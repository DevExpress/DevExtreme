/* eslint-disable */
import $ from '../../core/renderer';
import DOMComponent from '../../core/dom_component';
import * as Preact from 'preact';
import { isEmpty } from '../../core/utils/string';
import { wrapElement, removeDifferentElements } from '../preact-wrapper/utils';
import { useLayoutEffect } from 'preact/hooks';
import { getPublicElement } from '../../core/element';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

export default class PreactWrapper extends DOMComponent {
    getInstance() {
        return this;
    }

    _initMarkup() {
        const isFirstRender = this.$element().children().length === 0;
        const hasParent = this.$element().parent().length > 0;
        const container = isFirstRender && hasParent ? this.$element().get(0) : undefined;

        Preact.render(Preact.h(this._viewComponent, this.getAllProps(isFirstRender)), this.$element().get(0), container);
    }

    _dispose() {
        Preact.render(null, this.$element().get(0));
        super._dispose();
    }

    _render() {
        // NOTE: see ui.widget
        // this._renderContent();
    }
    // _renderContent() { }

    getAllProps(isFirstRender) {
        const options = { ...this.option() };
        const attributes = this.$element()[0].attributes;
        const { width, height } = this.$element()[0].style;

        if(isFirstRender) {
            options.elementAttr = {
                ...Object.keys(attributes).reduce((a, key) => {
                    if(attributes[key].specified) {
                        a[attributes[key].name] = attributes[key].value;
                    }
                    return a;
                }, {}),
                ...options.elementAttr
            };
        } else {
            if(attributes.id) {
                // NOTE: workaround to save container id
                options.elementAttr = {
                    [attributes.id.name]: attributes.id.value,
                    ...options.elementAttr
                };
            }
            if(attributes.class) {
                // NOTE: workaround to save custom classes on type changes
                const customClass = attributes.class.value
                    .split(' ')
                    .filter(name => name.indexOf('dx-') < 0)
                    .join(' ');
                const classes = options.elementAttr.class ? options.elementAttr.class.concat(customClass) : customClass;
                options.elementAttr = { class: classes, ...options.elementAttr };
            }
        }
        if(!isEmpty(width)) {
            options.width = width;
        }
        if(!isEmpty(height)) {
            options.height = height;
        }

        if(this.viewRef) {
            options.ref = this.viewRef;
        }

        Object.keys(this._actionsMap).forEach(name => {
            options[name] = this._actionsMap[name];
        });

        return this.getProps && this.getProps(options) || options;
    }

    _getActionConfigs() { return {}; }

    _init() {
        super._init();
        this._actionsMap = {};

        Object.keys(this._getActionConfigs()).forEach(name => this._addAction(name));

        this._initWidget && this._initWidget();
        this._supportedKeys = () => ({});
    }

    _addAction(event, action) {
        this._actionsMap[event] = action || this._createActionByOption(event, this._getActionConfigs()[event]);
    }

    _createViewRef() {
        this.viewRef = Preact.createRef();
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
        if(!templateOption && this.option('_hasAnonymousTemplateContent') && canBeAnonymous) {
            templateOption = this._templateManager.anonymousTemplateName;
        }
        if(!templateOption) {
            return;
        }

        const template = this._getTemplate(templateOption);
        return ({ parentRef, data, index }) => {
            useLayoutEffect(() => {
                const $parent = $(parentRef.current);
                const $children = $parent.contents();

                const payload = {
                    container: getPublicElement($parent),
                    model: data,
                    transclude: canBeAnonymous && templateOption === this._templateManager.anonymousTemplateName
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
            }, Object.keys(props).map(key => props[key]));

            return (<Preact.Fragment/>);
        };
    }

    _wrapKeyDownHandler(handler) {
        return (event, options) => {
            const { originalEvent, keyName, which } = options;
            const keys = this._supportedKeys();
            const func = keys[keyName] || keys[which];

            // NOTE: registered handler has more priority
            if(func !== undefined) {
                const handler = func.bind(this);
                const result = handler(originalEvent, options);

                if(!result) {
                    event.cancel = true;
                    return event;
                }
            }

            // NOTE: make it possible to pass onKeyDown property
            return handler?.(event, options);
        };
    }

    // Public API
    repaint() {
        this._refresh();
    }

    registerKeyHandler(key, handler) {
        const currentKeys = this._supportedKeys();
        this._supportedKeys = () => ({ ...currentKeys, [key]: handler });
    }

    // NOTE: this method will be deprecated
    //       aria changes should be defined in declaration or passed through property
    setAria() {
        throw new Error('"setAria" method is deprecated, use "aria" property instead');
    }
}
/* eslint-enable */
