import { extend } from "./utils/extend";
import DomComponent from "./dom_component";
import TemplateManager from './template_manager';

const DOMComponentWithTemplate = DomComponent.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), TemplateManager.getDefaultOptions());
    },

    _init: function() {
        this.callBase();

        this._templateManager = new TemplateManager(
            this.option.bind(this),
            this.$element.bind(this)
        );

        this._initTemplates();
    },

    _dispose: function() {
        this._templateManager.dispose();
        this.callBase();
    },

    _initTemplates: function() {
        const getElementContent = () => this.$element().contents();

        this._templateManager.initTemplates(getElementContent);
    },

    _getTemplateByOption: function(optionName) {
        return this._templateManager.getTemplate(this.option(optionName));
    },

    _getTemplate: function(templateSource) {
        return this._templateManager.getTemplate(templateSource);
    },

    _saveTemplate: function(name, template) {
        this._templateManager.saveTemplate(name, template);
    },
});

module.exports = DOMComponentWithTemplate;
