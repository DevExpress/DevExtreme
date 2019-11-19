import { extend } from "./utils/extend";
import DomComponent from "./dom_component";
import TemplateManager from './template_manager';

const DOMComponentWithTemplate = DomComponent.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), TemplateManager.getDefaultOptions());
    },

    __getDefaultTemplates: function() {
        return this._defaultTemplates;
    },

    __getElement: function() {
        return this.$element;
    },

    __getOption: function(optionName) {
        return this.option(optionName);
    },

    _init: function() {
        this.callBase();
        this._defaultTemplates = {};

        this._templateManager = new TemplateManager(
            this.option.bind(this),
            this.$element.bind(this),
            this,
            this.__getDefaultTemplates.bind(this),
            this._getAnonymousTemplateName.bind(this)
        );

        this._initTemplates();
    },

    _dispose: function() {
        this._templateManager.dispose();
        this.callBase();
    },

    // ????
    _cleanTemplates: function() {
        this._templateManager.dispose();
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

    _saveTemplate: function(name, template) {
        var templates = this.option("integrationOptions.templates");
        templates[name] = this._templateManager.createTemplate(template);
    },

    _extractAnonymousTemplate: function() {
        // ????
    }
});

module.exports = DOMComponentWithTemplate;
