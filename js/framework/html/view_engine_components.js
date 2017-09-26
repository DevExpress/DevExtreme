"use strict";

var errors = require("../errors"),
    domUtils = require("../../core/utils/dom"),
    registerComponent = require("../../core/component_registrator"),
    MarkupComponent = require("./markup_component").MarkupComponent;

require("../../integration/knockout");

/**
* @name dxview
* @publicName dxView
* @type object
* @module framework/html/view_engine_components
*/
var View = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxviewoptions_name
            * @publicName name
            * @type string
            * @default null
            */
            name: null,
            /**
            * @name dxviewoptions_title
            * @publicName title
            * @type string
            * @default null
            */
            title: null
            /**
            * @name dxviewoptions_disableCache
            * @publicName disableCache
            * @type Boolean
            */
            /**
            * @name dxviewoptions_modal
            * @publicName modal
            * @type Boolean
            */
            /**
            * @name dxviewoptions_orientation
            * @publicName orientation
            * @type string
            * @acceptValues 'portrait'|'landscape'
            */
            /**
             * @name dxviewoptions_pane
             * @publicName pane
             * @type string
             * @default 'detail'
             * @acceptValues 'master'|'detail'
             */
        });
    },

    ctor: function() {
        this._id = domUtils.uniqueId();
        this.callBase.apply(this, arguments);
    },

    _render: function() {
        this.callBase();
        this.element().addClass("dx-view");
        this.element().attr("dx-data-template-id", this._id);
    },

    getId: function() {
        return this._id;
    }
});

/**
* @name dxlayout
* @publicName dxLayout
* @type object
* @module framework/html/view_engine_components
*/
var Layout = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxlayoutoptions_name
            * @publicName name
            * @type string
            * @default null
            */
            name: null
        });
    },

    _render: function() {
        this.callBase();
        this.element().addClass("dx-layout");
    }
});


/**
* @name dxviewPlaceholder
* @publicName dxViewPlaceholder
* @type object
* @module framework/html/view_engine_components
*/
var ViewPlaceholder = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxviewPlaceholderoptions_viewName
            * @publicName viewName
            * @type string
            * @default null
            */
            viewName: null
        });
    },

    _render: function() {
        this.callBase();
        this.element().addClass("dx-view-placeholder");
    }
});

var setupTransitionElement = function($element, transitionType, transitionName, contentCssPosition) {
    if(contentCssPosition === "absolute") {
        $element.addClass("dx-transition-absolute");
    } else {
        $element.addClass("dx-transition-static");
    }
    $element
        .addClass("dx-transition")
        .addClass("dx-transition-" + transitionName)
        .addClass("dx-transition-" + transitionType)
        .attr("data-dx-transition-type", transitionType)
        .attr("data-dx-transition-name", transitionName);
};

var setupTransitionInnerElement = function($element) {
    $element.addClass("dx-transition-inner-wrapper");
};

/**
* @name dxtransition
* @publicName dxTransition
* @type object
* @module framework/html/view_engine_components
*/
var Transition = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxtransitionoptions_name
            * @publicName name
            * @type string
            * @default null
            */
            name: null,
            /**
            * @name dxtransitionoptions_type
            * @publicName type
            * @type string
            * @default undefined
            * @acceptValues 'slide'|'fade'|'overflow'
            * @deprecated #animation
            */
            type: undefined,
            /**
            * @name dxtransitionoptions_animation
            * @publicName animation
            * @type string
            * @default "slide"
            */
            animation: "slide"
        });
    },

    _render: function() {
        this.callBase();
        var element = this.element();
        setupTransitionElement(element, this.option("type") || this.option("animation"), this.option("name"), "absolute");
        element.wrapInner("<div/>");
        setupTransitionInnerElement(element.children());

        // deprecated since 15.1
        if(this.option("type")) {
            errors.log("W0003", "dxTransition", "type", "15.1", "Use the 'animation' property instead");
        }
    },

    _clean: function() {
        this.callBase();
        this.element().empty();
    }
});

/**
* @name dxcontentplaceholder
* @publicName dxContentPlaceholder
* @type object
* @module framework/html/view_engine_components
*/
var ContentPlaceholder = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxcontentplaceholderoptions_name
            * @publicName name
            * @type string
            * @default null
            */
            name: null,
            /**
            * @name dxcontentplaceholderoptions_transition
            * @publicName transition
            * @type string
            * @default undefined
            * @acceptValues 'none'|'slide'|'fade'|'overflow'
            * @deprecated #animation
            */
            transition: undefined,
            /**
            * @name dxcontentplaceholderoptions_animation
            * @publicName animation
            * @type string
            * @default "slide"
            */
            animation: "none",
            /**
            * @name dxcontentplaceholderoptions_contentCssPosition
            * @publicName contentCssPosition
            * @type string
            * @default 'absolute'
            * @acceptValues 'absolute'|'static'
            */
            contentCssPosition: "absolute"
        });
    },

    _render: function() {
        this.callBase();
        var $element = this.element();
        $element.addClass("dx-content-placeholder").addClass("dx-content-placeholder-" + this.option("name"));
        $element.attr("data-dx-content-placeholder-name", this.option("name"));
        setupTransitionElement($element, this.option("transition") || this.option("animation"), this.option("name"), this.option("contentCssPosition"));

        // deprecated since 15.1
        if(this.option("transition")) {
            errors.log("W0003", "dxContentPlaceholder", "transition", "15.1", "Use the 'animation' property instead");
        }
    }
});

/**
* @name dxcontent
* @publicName dxContent
* @type object
* @module framework/html/view_engine_components
*/
var Content = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxcontentoptions_targetPlaceholder
            * @publicName targetPlaceholder
            * @type string
            * @default null
            */
            targetPlaceholder: null
        });
    },

    _optionChanged: function() {
        this._refresh();
    },

    _clean: function() {
        this.callBase();
        this.element().removeClass(this._currentClass);
    },

    _render: function() {
        this.callBase();
        var element = this.element();
        element.addClass("dx-content");
        this._currentClass = "dx-content-" + this.option("targetPlaceholder");
        element.attr("data-dx-target-placeholder-id", this.option("targetPlaceholder"));
        element.addClass(this._currentClass);
        setupTransitionInnerElement(element);
    }
});

registerComponent("dxView", View);
registerComponent("dxLayout", Layout);
registerComponent("dxViewPlaceholder", ViewPlaceholder);
registerComponent("dxContentPlaceholder", ContentPlaceholder);
registerComponent("dxTransition", Transition);
registerComponent("dxContent", Content);

exports.dxView = View;
exports.dxLayout = Layout;
exports.dxViewPlaceholder = ViewPlaceholder;
exports.dxContentPlaceholder = ContentPlaceholder;
exports.dxTransition = Transition;
exports.dxContent = Content;
