import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import windowUtils from "../../core/utils/window";
import { getPublicElement } from "../../core/utils/dom";
import registerComponent from "../../core/component_registrator";
import EmptyTemplate from "../widget/empty_template";
import Editor from "../editor/editor";
import QuillRegistrator from "./quill_registrator";

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
        let value = this.option("value");

        if(value) {
            this._$htmlContainer.html(value);
        }

        this._renderHtmlEditor();
        this.callBase();
    },

    _renderHtmlEditor: function() {
        let that = this,
            modulesConfig = that._getModulesConfig();

        this._htmlEditor = this._quillRegistrator.createEditor(this._$htmlContainer[0], {
            placeholder: this.option("placeholder"),
            modules: modulesConfig
        });

        this._htmlEditor.on("text-change", function(newDelta, oldDelta, source) {
            // let resultMarkup,
            //     HtmlMarkup = that._htmlEditor.getSemanticHTML();

            // that._isEditorUpdating = true;

            // if(that._isMarkdownValue()) {
            //     resultMarkup = that._updateValueByType("Markdown", HtmlMarkup);
            // } else {
            //     resultMarkup = HtmlMarkup;
            // }
            // that.option("value", resultMarkup);
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

    _updateValueByType: function(valueType, value) {
        return value;
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
                    this._htmlEditor.setContents([], "silent");

                    if(this._isMarkdownValue()) {
                        updatedValue = this._updateValueByType("HTML", args.value);
                    } else {
                        updatedValue = args.value;
                    }

                    this._htmlEditor.clipboard.dangerouslyPasteHTML(0, updatedValue);
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
                this.option("value", this._updateValueByType(args.value));
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent("dxHtmlEditor", HtmlEditor);

module.exports = HtmlEditor;
