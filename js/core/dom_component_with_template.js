import { extend } from "./utils/extend";
import DomComponent from "./dom_component";
import TemplateManager from './template_manager';

const DOMComponentWithTemplate = DomComponent.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), TemplateManager.createDefaultOptions());
    },

    _getAnonymousTemplateName: function() {
        return void 0;
    },

    _init: function() {
        this.callBase();

        const { integrationOptions = {} } = this.option();
        const { createTemplate } = integrationOptions;

        this._templateManager = new TemplateManager(
            createTemplate,
            this._getAnonymousTemplateName()
        );
        this._initTemplates();
    },

    _dispose: function() {
        this._templateManager.dispose();
        this.callBase();
    },

    _initTemplates: function() {
        const { templates, anonymousTemplateMeta } = this._templateManager.extractTemplates(this.$element());
        const anonymousTemplate = this.option(`integrationOptions.templates.${anonymousTemplateMeta.name}`);

        templates.forEach(({ name, template }) => {
            this.optionSilent(`integrationOptions.templates.${name}`, template);
        });

        if(anonymousTemplateMeta.name && !anonymousTemplate) {
            this.optionSilent(`integrationOptions.templates.${anonymousTemplateMeta.name}`, anonymousTemplateMeta.template);
        }
    },

    _getTemplateByOption: function(optionName) {
        return this._getTemplate(this.option(optionName));
    },

    _getTemplate: function(templateSource) {
        const templates = this.option('integrationOptions.templates');
        const isAsyncTemplate = this.option('templatesRenderAsynchronously');
        const skipTemplates = this.option('integrationOptions.skipTemplates');

        return this._templateManager.getTemplate(
            templateSource,
            templates,
            {
                isAsyncTemplate,
                skipTemplates
            },
            this
        );
    },

    _saveTemplate: function(name, template) {
        this._setOptionWithoutOptionChange(
            'integrationOptions.templates.' + name,
            this._templateManager._createTemplate(template)
        );
    },
});

module.exports = DOMComponentWithTemplate;
