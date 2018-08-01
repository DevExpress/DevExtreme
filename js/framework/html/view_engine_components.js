var errors = require("../errors"),
    domUtils = require("../../core/utils/dom"),
    registerComponent = require("../../core/component_registrator"),
    MarkupComponent = require("./markup_component").MarkupComponent;

require("../../integration/knockout");

/**
* @name dxView
* @type object
* @module framework/html/view_engine_components
* @deprecated
*/
var View = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxViewOptions.name
            * @type string
            * @default null
            */
            name: null,
            /**
            * @name dxViewOptions.title
            * @type string
            * @default null
            */
            title: null
            /**
            * @name dxViewOptions.disableCache
            * @type Boolean
            */
            /**
            * @name dxViewOptions.modal
            * @type Boolean
            */
            /**
            * @name dxViewOptions.orientation
            * @type string
            * @acceptValues 'portrait'|'landscape'
            */
            /**
             * @name dxViewOptions.pane
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
* @name dxLayout
* @type object
* @module framework/html/view_engine_components
* @deprecated
*/
var Layout = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxLayoutOptions.name
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
* @name dxViewPlaceholder
* @type object
* @module framework/html/view_engine_components
* @deprecated
*/
var ViewPlaceholder = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxViewPlaceholderOptions.viewName
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
* @name dxTransition
* @type object
* @module framework/html/view_engine_components
* @deprecated
*/
var Transition = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxTransitionOptions.name
            * @type string
            * @default null
            */
            name: null,
            /**
            * @name dxTransitionOptions.type
            * @type string
            * @default undefined
            * @acceptValues 'slide'|'fade'|'overflow'
            * @deprecated #animation
            */
            type: undefined,
            /**
            * @name dxTransitionOptions.animation
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
        element.wrapInner("<div>");
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
* @name dxContentPlaceholder
* @type object
* @module framework/html/view_engine_components
* @deprecated
*/
var ContentPlaceholder = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxContentPlaceholderOptions.name
            * @type string
            * @default null
            */
            name: null,
            /**
            * @name dxContentPlaceholderOptions.transition
            * @type string
            * @default undefined
            * @acceptValues 'none'|'slide'|'fade'|'overflow'
            * @deprecated #animation
            */
            transition: undefined,
            /**
            * @name dxContentPlaceholderOptions.animation
            * @type string
            * @default "slide"
            */
            animation: "none",
            /**
            * @name dxContentPlaceholderOptions.contentCssPosition
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
* @name dxContent
* @type object
* @module framework/html/view_engine_components
* @deprecated
*/
var Content = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxContentOptions.targetPlaceholder
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
