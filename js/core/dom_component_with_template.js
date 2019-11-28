import { extend } from "./utils/extend";
import DomComponent from "./dom_component";
import TemplateManager from './template_manager';

const DOMComponentWithTemplate = DomComponent.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), TemplateManager.getDefaultOptions());
    },

    _getAnonymousTemplateName: function() {
        return undefined;
    },

    _init: function() {
        this.callBase();

        const integrationOptions = this.option('integrationOptions');
        const createTemplate = integrationOptions && integrationOptions.createTemplate;

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
        const getElementContent = () => this.$element().contents();
        const { templates, anonymousTemplateMeta } = this._templateManager.initTemplates(getElementContent);
        const anonymousTemplate = this.option('integrationOptions.templates.' + anonymousTemplateMeta.name);

        templates.forEach(({ name, template }) => {
            // TODO: we should use `silent` instead of `this._setOptionSilent` method here
            this._setOptionSilent('integrationOptions.templates.' + name, template);
        });

        if(anonymousTemplateMeta.name && !anonymousTemplate) {
            // TODO: we should use `silent` instead of `this._setOptionSilent` method here
            this._setOptionSilent('integrationOptions.templates.' + anonymousTemplateMeta.name, anonymousTemplateMeta.template);
        }
    },

    _getTemplateByOption: function(optionName) {
        return this._getTemplate(this.option(optionName));
    },

    _getTemplate: function(templateSource) {
        const that = this;
        const getIntegrationTemplate = tSource => this.option('integrationOptions.templates')[tSource];
        const isAsyncTemplate = this.option('templatesRenderAsynchronously');
        const skipTemplates = this.option('integrationOptions.skipTemplates');

        return this._templateManager.getTemplate(
            templateSource,
            that,
            getIntegrationTemplate,
            isAsyncTemplate,
            skipTemplates
        );
    },

    _saveTemplate: function(name, template) {
        this._setOptionSilent(
            'integrationOptions.templates.' + name,
            this._templateManager._createTemplate(template)
        );
    },
});

module.exports = DOMComponentWithTemplate;
