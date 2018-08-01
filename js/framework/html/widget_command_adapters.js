var Class = require("../../core/class"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    iteratorUtils = require("../../core/utils/iterator"),
    commandToContainer = require("../utils").utils.commandToContainer,
    fx = require("../../animation/fx"),
    TransitionExecutorModule = require("../../animation/transition_executor/transition_executor"),
    DX_COMMAND_TO_WIDGET_ADAPTER = "dxCommandToWidgetAdapter";

/* Base Implementation */

var WidgetItemWrapperBase = Class.inherit({
    ctor: function(command, containerOptions) {
        this.command = command;
        this.widgetItem = this._createWidgetItem(command, containerOptions);
    },
    _createWidgetItem: function(command, containerOptions) {
        var itemOptions = extend({}, containerOptions, command.option()),
            executeCommandCallback = function(e) { command.execute(e); },
            result;

        itemOptions.text = commandToContainer.resolveTextValue(command, containerOptions);
        itemOptions.icon = commandToContainer.resolveIconValue(command, containerOptions);
        itemOptions.type = commandToContainer.resolvePropertyValue(command, containerOptions, "type");
        itemOptions.location = commandToContainer.resolvePropertyValue(command, containerOptions, "location");
        itemOptions.locateInMenu = commandToContainer.resolvePropertyValue(command, containerOptions, "locateInMenu");
        itemOptions.showText = commandToContainer.resolvePropertyValue(command, containerOptions, "showText");

        result = this._createWidgetItemCore(itemOptions, executeCommandCallback);
        result.command = command;

        return result;
    },
    _createWidgetItemCore: function(itemOptions, executeCommandCallback) {
        return itemOptions;
    },
    dispose: function() {
        delete this.command;
        delete this.widgetItem;
    }
});

var WidgetAdapterBase = Class.inherit({
    ctor: function($widgetElement) {
        this._commandToWidgetItemOptionNames = {};// TODO refactor widgets. Use 'text' instead of 'title' everywhere.
        this.$widgetElement = $widgetElement;
        this.$widgetElement.data(DX_COMMAND_TO_WIDGET_ADAPTER, this);

        this.widget = this._getWidgetByElement($widgetElement);
        this._widgetWidgetContentReadyHandler = this._onWidgetContentReady.bind(this);
        this._widgetWidgetItemRenderedHandler = this._onWidgetItemRendered.bind(this);
        this._widgetDisposingHandler = this._onWidgetDisposing.bind(this);
        this.widget.on("itemRendered", this._widgetWidgetItemRenderedHandler);
        this.widget.on("contentReady", this._widgetWidgetContentReadyHandler);
        this.widget.on("disposing", this._widgetDisposingHandler);
        this.itemWrappers = [];
        this._transitionExecutor = new TransitionExecutorModule.TransitionExecutor();
    },
    addCommand: function(command, containerOptions) {
        var itemWrapper = this._createItemWrapper(command, containerOptions);
        this.itemWrappers.push(itemWrapper);
        this._addItemToWidget(itemWrapper);
        this._commandChangedHandler = this._onCommandChanged.bind(this);
        itemWrapper.command.on("optionChanged", this._commandChangedHandler);
    },
    beginUpdate: function() {
        this.widget.beginUpdate();
    },
    endUpdate: function() {
        this.widget.endUpdate();
        return this.animationDeferred;
    },
    _onWidgetItemRendered: function(e) {
        if(e.itemData.isJustAdded && e.itemData.command && e.itemData.command.option("visible") && this._commandRenderedAnimation) {
            this._transitionExecutor.enter(e.itemElement, this._commandRenderedAnimation);
        }
        delete e.itemData.isJustAdded;
    },
    _onWidgetContentReady: function(e) {
        this.animationDeferred = this._transitionExecutor.start();
    },
    _onWidgetDisposing: function() {
        this.dispose(true);
    },
    _setWidgetItemOption: function(optionName, optionValue, itemCommand) {
        var items = this.widget.option("items"),
            itemIndex = inArray(itemCommand, iteratorUtils.map(items, function(item) {
                return item.command || {};
            }));

        if(itemIndex > -1) {
            var optionPath = "items[" + itemIndex + "].";

            if(!this._requireWidgetRefresh(optionName) && this.widget.option("items[" + itemIndex + "]").options) {
                optionPath += "options.";
            }

            optionPath += this._commandToWidgetItemOptionNames[optionName] || optionName;

            this.widget.option(optionPath, optionValue);
        }
    },
    _requireWidgetRefresh: function(optionName) {
        return optionName === "visible" || optionName === "locateInMenu" || optionName === "location";
    },
    _onCommandChanged: function(args) {
        if(args.name === "highlighted" || args.component.isOptionDeprecated(args.name)) {
            return;
        }

        this._setWidgetItemOption(args.name, args.value, args.component);
    },
    _addItemToWidget: function(itemWrapper) {
        var items = this.widget.option("items");
        items.push(itemWrapper.widgetItem);
        if(this.widget.$element().is(":visible")) {
            itemWrapper.widgetItem.isJustAdded = true;
        }
        this.widget.option("items", items);
    },
    refresh: function() {
        var items = this.widget.option("items");
        this.widget.option("items", items);
    },
    clear: function(widgetDisposing) {
        var that = this;

        iteratorUtils.each(that.itemWrappers, function(index, itemWrapper) {
            itemWrapper.command.off("optionChanged", that._commandChangedHandler);
            itemWrapper.dispose();
        });

        this.itemWrappers.length = 0;

        if(!widgetDisposing) {
            this._clearWidgetItems();
        }
    },
    _clearWidgetItems: function() {
        this.widget.option("items", []);
    },
    dispose: function(widgetDisposing) {
        this.clear(widgetDisposing);
        if(this.widget) {
            this.widget.off("itemRendered", this._widgetWidgetItemRenderedHandler);
            this.widget.off("contentReady", this._widgetContentReadyHandler);
            this.widget.off("disposing", this._widgetDisposingHandler);
            this.$widgetElement.removeData(DX_COMMAND_TO_WIDGET_ADAPTER);
            delete this.widget;
            delete this.$widgetElement;
        }
    }
});

var CommandToWidgetAdapter = Class.inherit({
    ctor: function(createAdapter) {
        this.createAdapter = createAdapter;
    },
    _getWidgetAdapter: function($container) {
        var widgetAdapter = $container.data(DX_COMMAND_TO_WIDGET_ADAPTER);

        if(!widgetAdapter) {
            widgetAdapter = this.createAdapter($container);
        }

        return widgetAdapter;
    },
    addCommand: function($container, command, containerOptions) {
        var widgetAdapter = this._getWidgetAdapter($container);
        widgetAdapter.addCommand(command, containerOptions);
    },
    clearContainer: function($container) {
        var widgetAdapter = this._getWidgetAdapter($container);
        widgetAdapter.clear();
    },
    beginUpdate: function($container) {
        var widgetAdapter = this._getWidgetAdapter($container);
        widgetAdapter.beginUpdate();
    },
    endUpdate: function($container) {
        var widgetAdapter = this._getWidgetAdapter($container);
        return widgetAdapter.endUpdate();
    }
});

/* dxToolbar Implementation */

var dxToolbarItemWrapper = WidgetItemWrapperBase.inherit({
    _createWidgetItemCore: function(itemOptions, executeCommandCallback) {
        var widgetItem;

        itemOptions.onClick = executeCommandCallback;

        if(itemOptions.location === "menu" || itemOptions.locateInMenu === "always") {
            widgetItem = itemOptions;
            widgetItem.isAction = true;
        } else {
            widgetItem = {
                locateInMenu: itemOptions.locateInMenu,
                location: itemOptions.location,
                visible: itemOptions.visible,
                options: itemOptions,
                widget: "dxButton"
            };

            if(itemOptions.showText === "inMenu") {
                widgetItem.showText = itemOptions.showText;
            }

            itemOptions.visible = true;
            delete itemOptions.location;
        }

        return widgetItem;
    }
});

var dxToolbarAdapter = WidgetAdapterBase.inherit({
    ctor: function($widgetElement) {
        this.callBase($widgetElement);
        this._commandToWidgetItemOptionNames = {
            title: "text"
        };

        if(this.widget.option("renderAs") === "topToolbar") {
            this._commandRenderedAnimation = "command-rendered-top";
        } else {
            this._commandRenderedAnimation = "command-rendered-bottom";
        }
    },
    _getWidgetByElement: function($element) {
        return $element.dxToolbar("instance");
    },
    _createItemWrapper: function(command, containerOptions) {
        return new dxToolbarItemWrapper(command, containerOptions);
    },
    addCommand: function(command, containerOptions) {
        this.widget.option("visible", true);
        this.callBase(command, containerOptions);
    }
});

/* dxList Implementation */

var dxListItemWrapper = WidgetItemWrapperBase.inherit({
    _createWidgetItemCore: function(itemOptions, executeCommandCallback) {
        itemOptions.title = itemOptions.text;
        itemOptions.onClick = executeCommandCallback;
        return itemOptions;
    }
});

var dxListAdapter = WidgetAdapterBase.inherit({
    _createItemWrapper: function(command, containerOptions) {
        return new dxListItemWrapper(command, containerOptions);
    },
    _getWidgetByElement: function($element) {
        return $element.dxList("instance");
    }
});

/* dxNavBar Implementation */

var dxNavBarItemWrapper = WidgetItemWrapperBase.inherit({});

var dxNavBarAdapter = WidgetAdapterBase.inherit({
    ctor: function($widgetElement) {
        this.callBase($widgetElement);
        this._commandToWidgetItemOptionNames = {
            title: "text"
        };
        this.widget.option("onItemClick", this._onNavBarItemClick.bind(this));
    },
    _onNavBarItemClick: function(e) {
        var items = this.widget.option("items");

        for(var i = items.length; --i;) {
            items[i].command.option("highlighted", false);
        }
        e.itemData.command.execute(e);
    },
    _getWidgetByElement: function($element) {
        return $element.dxNavBar("instance");
    },
    _createItemWrapper: function(command, containerOptions) {
        return new dxNavBarItemWrapper(command, containerOptions);
    },
    addCommand: function(command, containerOptions) {
        this.callBase(command, containerOptions);
        this._updateSelectedIndex();
    },
    _onCommandChanged: function(args) {
        var optionName = args.name,
            newValue = args.value;

        if(optionName === "highlighted" && newValue) {
            this._updateSelectedIndex();
        }
        this.callBase(args);
    },
    _updateSelectedIndex: function() {
        var items = this.widget.option("items");
        for(var i = 0, itemsCount = items.length; i < itemsCount; i++) {
            var command = items[i].command;
            if(command && command.option("highlighted")) {
                this.widget.option("selectedIndex", i);
                break;
            }
        }
    }
});

/* dxPivot Implementation */

var dxPivotItemWrapper = WidgetItemWrapperBase.inherit({
    _createWidgetItemCore: function(itemOptions, executeCommandCallback) {
        itemOptions.title = itemOptions.text;
        return itemOptions;
    }
});

var dxPivotAdapter = WidgetAdapterBase.inherit({
    ctor: function($widgetElement) {
        this.callBase($widgetElement);
        this.widget.option("onSelectionChanged", this._onPivotSelectionChange.bind(this));
    },
    _onPivotSelectionChange: function(e) {
        if(e.addedItems.length && e.removedItems.length && e.addedItems[0] && e.addedItems[0].command) {
            e.addedItems[0].command.execute(e);
        }
    },
    _getWidgetByElement: function($element) {
        return $element.dxPivot("instance");
    },
    _createItemWrapper: function(command, containerOptions) {
        return new dxPivotItemWrapper(command, containerOptions);
    },
    addCommand: function(command, containerOptions) {
        this.callBase(command, containerOptions);
        this._updateSelectedIndex();
    },
    _onCommandChanged: function(args) {
        var optionName = args.name,
            newValue = args.value;

        if(optionName === "visible") {
            this._reRenderPivot();
        } else if(optionName === "highlighted" && newValue) {
            this._updateSelectedIndex();
        }
        this.callBase(args);
    },
    _addItemToWidget: function(itemWrapper) {
        if(itemWrapper.command.option("visible")) {
            this.callBase(itemWrapper);
        }
    },
    _updateSelectedIndex: function() {
        var pivot = this.widget,
            items = pivot.option("items") || [];

        fx.off = true;
        for(var i = 0, itemsCount = items.length; i < itemsCount; i++) {
            var command = items[i].command;
            if(command && command.option("highlighted")) {
                pivot.option("selectedIndex", i);
                break;
            }
        }
        fx.off = false;
    },
    _reRenderPivot: function() {
        var that = this;

        that.widget.option("items", []);
        iteratorUtils.each(that.itemWrappers, function(index, itemWrapper) {
            if(itemWrapper.command.option("visible")) {
                that._addItemToWidget(itemWrapper);
            }
        });

        that.refresh();
        that._updateSelectedIndex();
    }
});

/* dxSlideOut Implementation */

var dxSlideOutItemWrapper = WidgetItemWrapperBase.inherit({});

var dxSlideOutAdapter = WidgetAdapterBase.inherit({
    ctor: function($widgetElement) {
        this.callBase($widgetElement);
        this._commandToWidgetItemOptionNames = {
            title: "text"
        };
        this.widget.option("onItemClick", this._onSlideOutItemClick.bind(this));
    },
    _onSlideOutItemClick: function(e) {
        e.itemData.command.execute(e);
    },
    _getWidgetByElement: function($element) {
        return $element.dxSlideOut("instance");
    },
    _createItemWrapper: function(command, containerOptions) {
        return new dxSlideOutItemWrapper(command, containerOptions);
    },
    _updateSelectedIndex: function() {
        var items = this.widget.option("items") || [];
        for(var i = 0, itemsCount = items.length; i < itemsCount; i++) {
            var command = items[i].command;
            if(command && command.option("highlighted")) {
                this.widget.option("selectedIndex", i);
                break;
            }
        }
    },
    addCommand: function(command, containerOptions) {
        this.callBase(command, containerOptions);
        this._updateSelectedIndex();
    },
    _onCommandChanged: function(args) {
        var optionName = args.name,
            newValue = args.value;

        if(optionName === "highlighted" && newValue) {
            this._updateSelectedIndex();
        }
        this.callBase(args);
    }
});

exports.dxToolbar = new CommandToWidgetAdapter(function($widgetElement) {
    return new dxToolbarAdapter($widgetElement);
});

exports.dxList = new CommandToWidgetAdapter(function($widgetElement) {
    return new dxListAdapter($widgetElement);
});

exports.dxNavBar = new CommandToWidgetAdapter(function($widgetElement) {
    return new dxNavBarAdapter($widgetElement);
});

exports.dxPivot = new CommandToWidgetAdapter(function($widgetElement) {
    return new dxPivotAdapter($widgetElement);
});

exports.dxSlideOut = new CommandToWidgetAdapter(function($widgetElement) {
    return new dxSlideOutAdapter($widgetElement);
});

///#DEBUG
exports.WidgetItemWrapperBase = WidgetItemWrapperBase;
exports.WidgetAdapterBase = WidgetAdapterBase;
///#ENDDEBUG
