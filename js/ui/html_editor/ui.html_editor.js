import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import windowUtils from "../../core/utils/window";
import { getPublicElement } from "../../core/utils/dom";
import registerComponent from "../../core/component_registrator";
import EmptyTemplate from "../widget/empty_template";
import Editor from "../editor/editor";
import QuillRegistrator from "./quill_registrator";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import MarkdownConverter from "./markdownConverter";

let RICH_EDIT_CLASS = "dx-htmleditor",
    ANONYMOUS_TEMPLATE_NAME = "content";

let HtmlEditor = Editor.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            valueType: "HTML",
            placeholder: "Type something",
            mention: null,
            allowImageResizing: true,
            resizing: null
        });
    },

    _init: function() {
        this.callBase();

        this._quillRegistrator = new QuillRegistrator();
        this._prepareConverters();
    },

    _prepareConverters: function() {
        if(!this._quillDeltaConverter) {
            this._quillDeltaConverter = new QuillDeltaToHtmlConverter();
        }

        if(this.option("valueType") === "Markdown" && !this._markdownConverter) {
            this._markdownConverter = new MarkdownConverter();
        }
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["content"] = new EmptyTemplate(this);
    },

    _initMarkup: function() {
        let template = this._getTemplate("content");

        this._$htmlContainer = windowUtils.hasWindow() ? $("<div>") : $("<textarea>");

        template && template.render({
            container: getPublicElement(this._$htmlContainer),
            noModel: true
        });

        this.$element().addClass(RICH_EDIT_CLASS).wrapInner(this._$htmlContainer);

        this.callBase();
    },

    _render: function() {
        let markup = this.option("value");

        if(this._isMarkdownValue()) {
            markup = this._markdownConverter.toHtml(markup);
        }

        if(markup) {
            this._$htmlContainer.html(markup);
        }

        this._renderHtmlEditor();
        this.callBase();
    },

    _renderHtmlEditor: function() {
        let that = this,
            modulesConfig = that._getModulesConfig();

        this._htmlEditor = this._quillRegistrator.createEditor(this._$htmlContainer[0], {
            placeholder: this.option("placeholder"),
            modules: modulesConfig,
            theme: "basic"
        });

        this._htmlEditor.on("text-change", function(newDelta, oldDelta, source) {
            let resultMarkup,
                delta = that._htmlEditor.getContents(),
                htmlMarkup = that._convertToHtml(delta.ops);

            that._isEditorUpdating = true;

            if(that._isMarkdownValue()) {
                resultMarkup = that._updateValueByType("Markdown", htmlMarkup);
            } else {
                resultMarkup = htmlMarkup;
            }
            that.option("value", resultMarkup);
        });
    },

    _getModulesConfig: function() {
        let modulesConfig = {};

        if(this.option("allowImageResizing")) {
        }

        if(this.option("mention")) {
        }

        if(this.option("dataPlaceholders")) {
        }

        return modulesConfig;
    },

    _getToolbarConfig: function() {
        return [];
    },

    _getBaseModuleConfig: function(userOptionName) {
        let userConfig = this.option(userOptionName);

        return extend({
            editorInstance: this
        }, userConfig);
    },

    _convertToHtml: function(deltaOps) {
        this._quillDeltaConverter.rawDeltaOps = deltaOps;
        return this._quillDeltaConverter.convert();
    },

    _updateValueByType: function(valueType, value) {
        var currentValue = value || this.option("value"),
            updatedValue;

        if(valueType === "Markdown") {
            updatedValue = this._markdownConverter.toMarkdown(currentValue);
        } else {
            updatedValue = this._markdownConverter.toHtml(currentValue);
        }

        return updatedValue;
    },

    _isMarkdownValue: function() {
        return this.option("valueType") === "Markdown";
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "value":
                if(!this._htmlEditor) {
                    this._$htmlContainer.html(args.value);
                    return;
                }

                if(this._isEditorUpdating) {
                    delete this._isEditorUpdating;
                } else {
                    let updatedValue;

                    if(this._isMarkdownValue()) {
                        updatedValue = this._updateValueByType("HTML", args.value);
                    } else {
                        updatedValue = args.value;
                    }

                    let newDelta = this._htmlEditor.clipboard.convert(updatedValue);
                    this._htmlEditor.setContents(newDelta);
                }
                this.callBase(args);
                break;
            case "placeholder":
            case "mention":
            case "dataPlaceholders":
            case "allowImageResizing":
            case "resizing":
                this._invalidate();
                break;
            case "valueType":
                this._prepareConverters();
                this.option("value", this._updateValueByType(args.value));
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent("dxHtmlEditor", HtmlEditor);

module.exports = HtmlEditor;
