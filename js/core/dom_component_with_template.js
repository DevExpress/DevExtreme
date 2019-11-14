import { extend } from "./utils/extend";
import DomComponent from "./dom_component";
import TemplateManager from './template_manager';

const DOMComponentWithTemplate = DomComponent.inherit({
    // ctor: function() {
    //     debugger
    //     this.callBase();
    //     this._templateManager = new TemplateManager(this.option, this.$element);
    // },

    _getDefaultOptions: function() {
        return extend(this.callBase(), this._templateManager.getDefaultOptions());
    },

    _init: function() {
        this.callBase();
        this._templateManager = new TemplateManager(this.option, this.$element);
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
        return this._templateManager.getTemplateByOption(optionName);
        // return this._getTemplate(this.option(optionName));
    },

    _getTemplate: function(templateSource) {
        return this._templateManager.getTemplate(templateSource);
    },
});

module.exports = DOMComponentWithTemplate;
