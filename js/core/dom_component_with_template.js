import { extend } from "./utils/extend";
import DomComponent from "./dom_component";
import TemplateManager from './template_manager';

const DOMComponentWithTemplate = DomComponent.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), TemplateManager.getDefaultOptions());
    },

    __getElement: function() {
        return this.$element();
    },

    __getOption: function(optionName) {
        return this.option(optionName);
    },

    _init: function() {
        this.callBase();
        this._templateManager = new TemplateManager(
            this.__getOption,
            this.__getElement,
            this
        );
    },

    _dispose: function() {
        this._templateManager.dispose();
        this.callBase();
    },

    _initTemplates: function() {
        this._templateManager.initTemplates();
    },

    _getAnonymousTemplateName: function() {
        return TemplateManager.getAnonymousTemplateName();
    },

    _getTemplateByOption: function(optionName) {
        return this._templateManager.getTemplate(this.option(optionName));
    },

    _getTemplate: function(templateSource) {
        return this._templateManager.getTemplate(templateSource);
    },
});

module.exports = DOMComponentWithTemplate;
