var $ = require("../../core/renderer"),
    dataCoreUtils = require("../../core/utils/data"),
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    devices = require("../../core/devices"),
    iconUtils = require("../../core/utils/icon"),
    HierarchicalDataAdapter = require("./ui.data_adapter"),
    CollectionWidget = require("../collection/ui.collection_widget.edit"),
    BindableTemplate = require("../widget/bindable_template"),
    isFunction = require("../../core/utils/type").isFunction,
    noop = require("../../core/utils/common").noop;

var DISABLED_STATE_CLASS = "dx-state-disabled";

/**
* @name HierarchicalCollectionWidget
* @type object
* @inherits CollectionWidget
* @module ui/hierarchical_collection/ui.hierarchical_collection_widget
* @export default
* @hidden
*/
var HierarchicalCollectionWidget = CollectionWidget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name HierarchicalCollectionWidgetOptions.keyExpr
            * @type string|function
            * @default 'id'
            */
            keyExpr: "id",

            /**
            * @name HierarchicalCollectionWidgetOptions.displayExpr
            * @type string|function(item)
            * @type_function_param1 item:object
            * @default 'text'
            */
            displayExpr: "text",

            /**
            * @name HierarchicalCollectionWidgetOptions.selectedExpr
            * @type string|function
            * @default 'selected'
            */
            selectedExpr: "selected",

            /**
            * @name HierarchicalCollectionWidgetOptions.disabledExpr
            * @type string|function
            * @default 'disabled'
            */
            disabledExpr: "disabled",

            /**
            * @name HierarchicalCollectionWidgetOptions.itemsExpr
            * @type string|function
            * @default 'items'
            */
            itemsExpr: "items",

            /**
             * @name HierarchicalCollectionWidgetOptions.hoverStateEnabled
             * @type boolean
             * @default true
             * @inheritdoc
             */
            hoverStateEnabled: true,

            parentIdExpr: "parentId",
            expandedExpr: "expanded"
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name HierarchicalCollectionWidgetOptions.focusStateEnabled
                    * @type boolean
                    * @default true @for desktop
                    * @inheritdoc
                    */
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this._initAccessors();
        this._initDataAdapter();
        this._initDynamicTemplates();
    },

    _initDataSource: function() {
        this.callBase();
        this._dataSource && this._dataSource.paginate(false);
    },

    _initDataAdapter: function() {
        var accessors = this._createDataAdapterAccessors();

        this._dataAdapter = new HierarchicalDataAdapter(
            extend({
                dataAccessors: {
                    getters: accessors.getters,
                    setters: accessors.setters
                },
                items: this.option("items")
            }, this._getDataAdapterOptions()));
    },

    _getDataAdapterOptions: noop,

    _initDynamicTemplates: function() {
        var that = this;

        this._defaultTemplates["item"] = new BindableTemplate(function($container, itemData) {
            $container
                .html(itemData.html)
                .append(this._getIconContainer(itemData))
                .append(this._getTextContainer(itemData))
                .append(this._getPopoutContainer(itemData));
            that._addContentClasses(itemData, $container.parent());
        }.bind(this), ["text", "html", "items", "icon"], this.option("integrationOptions.watchMethod"), {
            "text": this._displayGetter,
            "items": this._itemsGetter
        });
    },

    _getIconContainer: function(itemData) {
        return itemData.icon ? iconUtils.getImageContainer(itemData.icon) : undefined;
    },

    _getTextContainer: function(itemData) {
        return $("<span>").text(itemData.text);
    },

    _getPopoutContainer: noop,

    _addContentClasses: noop,

    _initAccessors: function() {
        var that = this;
        each(this._getAccessors(), function(_, accessor) {
            that._compileAccessor(accessor);
        });
    },

    _getAccessors: function() {
        return ["key", "display", "selected", "items", "disabled", "parentId", "expanded"];
    },

    _getChildNodes: function(node) {
        var that = this,
            arr = [];
        each(node.internalFields.childrenKeys, function(_, key) {
            var childNode = that._dataAdapter.getNodeByKey(key);
            arr.push(childNode);
        });
        return arr;
    },

    _hasChildren: function(node) {
        return node && node.internalFields.childrenKeys.length;
    },

    _compileAccessor: function(optionName) {
        var getter = "_" + optionName + "Getter",
            setter = "_" + optionName + "Setter",
            optionExpr = this.option(optionName + "Expr");

        if(!optionExpr) {
            this[getter] = noop;
            this[setter] = noop;
            return;
        } else if(isFunction(optionExpr)) {
            this[setter] = function(obj, value) { obj[optionExpr()] = value; };
            this[getter] = function(obj) { return obj[optionExpr()]; };
            return;
        }

        this[getter] = dataCoreUtils.compileGetter(optionExpr);
        this[setter] = dataCoreUtils.compileSetter(optionExpr);
    },

    _createDataAdapterAccessors: function() {
        var that = this,
            accessors = {
                getters: {},
                setters: {}
            };

        each(this._getAccessors(), function(_, accessor) {
            var getterName = "_" + accessor + "Getter",
                setterName = "_" + accessor + "Setter",
                newAccessor = accessor === "parentId" ? "parentKey" : accessor;

            accessors.getters[newAccessor] = that[getterName];
            accessors.setters[newAccessor] = that[setterName];
        });

        return accessors;
    },

    _initMarkup: function() {
        this.callBase();
        this._addWidgetClass();
    },

    _addWidgetClass: function() {
        this._focusTarget().addClass(this._widgetClass());
    },

    _widgetClass: noop,

    _renderItemFrame: function(index, itemData) {
        var $itemFrame = this.callBase.apply(this, arguments);

        $itemFrame.toggleClass(DISABLED_STATE_CLASS, !!this._disabledGetter(itemData));
        return $itemFrame;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "displayExpr":
            case "keyExpr":
                this._initAccessors();
                this._initDynamicTemplates();
                this.repaint();
                break;
            case "itemsExpr":
            case "selectedExpr":
            case "disabledExpr":
            case "expandedExpr":
            case "parentIdExpr":
                this._initAccessors();
                this._initDataAdapter();
                this.repaint();
                break;
            case "items":
                this._initDataAdapter();
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    }
});

module.exports = HierarchicalCollectionWidget;
