import { extend } from "./utils/extend";
import DomComponent from "./dom_component";
import TemplateManager from './template_manager';

const DOMComponentWithTemplate = DomComponent.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), TemplateManager.getDefaultOptions());
    },

    _init: function() {
        this.callBase();

        const createTemplate = (...args) => this.option('integrationOptions.createTemplate')(...args);

        this._templateManager = new TemplateManager(
            this.option.bind(this),
            createTemplate
        );

        this._initTemplates();
    },

    _dispose: function() {
        this._templateManager.dispose();
        this.callBase();
    },

    _initTemplates: function() {
        const getElementContent = () => this.$element().contents();
        const optionTemplates = this.option('integrationOptions.templates');

        const { templates, anonymousTemplateMeta } = this._templateManager.initTemplates(getElementContent);

        templates.forEach(({ name, template }) => {
            const templateSource = TemplateManager.validateTemplateSource(template);
            optionTemplates[name] = this.option('integrationOptions.createTemplate')(templateSource);
        });

        if(anonymousTemplateMeta.name && !optionTemplates[anonymousTemplateMeta.name]) {
            const templateSource = TemplateManager.validateTemplateSource(anonymousTemplateMeta.template);
            optionTemplates[anonymousTemplateMeta.name] = this.option('integrationOptions.createTemplate')(templateSource);
        }
    },

    _getTemplateByOption: function(optionName) {
        const getIntegrationTemplate = tSource => this.option('integrationOptions.templates')[tSource];
        const isAsyncTemplate = () => this.option('templatesRenderAsynchronously');
        const getSkipTemplates = () => this.option('integrationOptions.skipTemplates');

        return this._templateManager.getTemplate(
            this.option(optionName),
            getIntegrationTemplate,
            isAsyncTemplate,
            getSkipTemplates
        );
    },

    _getTemplate: function(templateSource) {
        const getIntegrationTemplate = tSource => this.option('integrationOptions.templates')[tSource];
        const isAsyncTemplate = () => this.option('templatesRenderAsynchronously');
        const getSkipTemplates = () => this.option('integrationOptions.skipTemplates');

        return this._templateManager.getTemplate(
            templateSource,
            getIntegrationTemplate,
            isAsyncTemplate,
            getSkipTemplates
        );
    },

    _saveTemplate: function(name, template) {
        // this._templateManager.saveTemplate(name, template);

        const templates = this.option('integrationOptions.templates');
        const templateSource = TemplateManager.validateTemplateSource(template);
        templates[name] = this.option('integrationOptions.createTemplate')(templateSource);
    },
});

module.exports = DOMComponentWithTemplate;
