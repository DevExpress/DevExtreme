import $ from '../../core/renderer';
import DOMComponent from '../../core/dom_component';
import * as Preact from 'preact';
import { extend } from '../../core/utils/extend';
import { getInnerActionName } from './utils';
import { isEmpty } from '../../core/utils/string';
import { wrapElement, removeDifferentElements } from '../preact-wrapper/utils';
import { useLayoutEffect } from 'preact/hooks';
import { getPublicElement } from '../../core/utils/dom';

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

    _render() {
        // NOTE: see ui.widget
        // this._renderContent();
    }
    // _renderContent() { }

    getAllProps(isFirstRender) {
        const options = extend({}, this.option());
        const attributes = this.$element()[0].attributes;
        const { width, height } = this.$element()[0].style;

        if(isFirstRender) {
            options.elementAttr = extend(Object.keys(attributes).reduce((a, key) => {
                if(attributes[key].specified) {
                    a[attributes[key].name] = attributes[key].value;
                }
                return a;
            }, {}), options.elementAttr);
        } else {
            if(attributes.id) {
                // NOTE: workaround to save container id
                options.elementAttr = extend({ [attributes.id.name]: attributes.id.value }, options.elementAttr);
            }
            if(attributes.class) {
                // NOTE: workaround to save custom classes on type changes
                options.classNames = attributes.class.value
                    .split(' ')
                    .filter(name => name.indexOf('dx-') < 0);
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

        return this.getProps && this.getProps(options) || options;
    }

    _init() {
        super._init();
        this._initWidget && this._initWidget();
    }

    _createViewRef() {
        this.viewRef = Preact.createRef();
    }

    _optionChanged(option) {
        if(option) {
            super._optionChanged(option);
        }
        this._invalidate();
    }

    _addAction(name, config) {
        this.option(getInnerActionName(name), this._createActionByOption(name, config));
    }

    _createTemplateComponent(props, templateOption, canBeAnonymous) {
        if(!templateOption && this.option('_hasAnonymousTemplateContent') && canBeAnonymous) {
            templateOption = this._templateManager.anonymousTemplateName;
        }
        if(!templateOption) {
            return;
        }

        const template = this._getTemplate(templateOption);
        return ({ parentRef, ...restProps }) => {
            useLayoutEffect(() => {
                const $parent = $(parentRef.current);
                const $children = $parent.contents();

                let $template = $(template.render({
                    container: getPublicElement($parent),
                    model: restProps,
                    transclude: canBeAnonymous && templateOption === this._templateManager.anonymousTemplateName,
                    // TODO index
                }));

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

    // Public API
    repaint() {
        this._refresh();
    }

    // NOTE: this method will be deprecated
    //       aria changes should be defined in declaration or passed through property
    setAria() {
        throw new Error('"setAria" method is deprecated, use "aria" property instead');
    }
}
