var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    clickEvent = require("../../events/click"),
    extend = require("../../core/utils/extend").extend,
    errors = require("../widget/ui.errors"),
    CheckBox = require("../check_box"),
    RadioButton = require("../radio_group/radio_button"),
    eventUtils = require("../../events/utils"),
    registerDecorator = require("./ui.list.edit.decorator_registry").register,
    EditDecorator = require("./ui.list.edit.decorator");


var SELECT_DECORATOR_ENABLED_CLASS = "dx-list-select-decorator-enabled",

    SELECT_DECORATOR_SELECT_ALL_CLASS = "dx-list-select-all",
    SELECT_DECORATOR_SELECT_ALL_CHECKBOX_CLASS = "dx-list-select-all-checkbox",
    SELECT_DECORATOR_SELECT_ALL_LABEL_CLASS = "dx-list-select-all-label",

    SELECT_CHECKBOX_CONTAINER_CLASS = "dx-list-select-checkbox-container",
    SELECT_CHECKBOX_CLASS = "dx-list-select-checkbox",

    SELECT_RADIO_BUTTON_CONTAINER_CLASS = "dx-list-select-radiobutton-container",
    SELECT_RADIO_BUTTON_CLASS = "dx-list-select-radiobutton",

    FOCUSED_STATE_CLASS = "dx-state-focused";

var CLICK_EVENT_NAME = eventUtils.addNamespace(clickEvent.name, "dxListEditDecorator");

registerDecorator(
    "selection",
    "default",
    EditDecorator.inherit({

        _init: function() {
            this.callBase.apply(this, arguments);

            var selectionMode = this._list.option("selectionMode");

            this._singleStrategy = selectionMode === "single";
            this._containerClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CONTAINER_CLASS : SELECT_CHECKBOX_CONTAINER_CLASS;
            this._controlClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CLASS : SELECT_CHECKBOX_CLASS;

            this._controlWidget = this._singleStrategy ? RadioButton : CheckBox;

            this._list.$element().addClass(SELECT_DECORATOR_ENABLED_CLASS);
        },

        beforeBag: function(config) {
            var $itemElement = config.$itemElement,
                $container = config.$container;

            var $control = $("<div>").addClass(this._controlClass);
            new this._controlWidget($control, extend(this._commonOptions(), {
                value: this._isSelected($itemElement),
                focusStateEnabled: false,
                hoverStateEnabled: false,
                onValueChanged: (function(e) {
                    this._processCheckedState($itemElement, e.value);
                    e.event && e.event.stopPropagation();
                }).bind(this)
            }));

            $container.addClass(this._containerClass);
            $container.append($control);
        },

        modifyElement: function(config) {
            this.callBase.apply(this, arguments);

            var $itemElement = config.$itemElement,
                control = this._controlWidget.getInstance($itemElement.find("." + this._controlClass));

            eventsEngine.on($itemElement, "stateChanged", (function(e, state) {
                control.option("value", state);
            }).bind(this));
        },

        _updateSelectAllState: function() {
            if(!this._$selectAll) {
                return;
            }

            this._selectAllCheckBox.option("value", this._list.isSelectAll());
        },

        afterRender: function() {
            if(this._list.option("selectionMode") !== "all") {
                return;
            }

            if(!this._$selectAll) {
                this._renderSelectAll();
            } else {
                this._updateSelectAllState();
            }
        },

        handleKeyboardEvents: function(currentFocusedIndex, moveFocusUp) {
            const moveFocusDown = !moveFocusUp;
            const list = this._list;
            const lastItemIndex = list._getLastItemIndex();
            const isFocusOutOfList = moveFocusUp && currentFocusedIndex === 0 || moveFocusDown && currentFocusedIndex === lastItemIndex;

            if(this._selectAllCheckBox && isFocusOutOfList) {
                list.option("focusedElement", this._selectAllCheckBox.$element());
            } else {
                if(currentFocusedIndex === -1) {
                    currentFocusedIndex = moveFocusDown ? 0 : lastItemIndex;
                }

                list.focusListItem(currentFocusedIndex);
            }
        },

        handleEnterPressing: function() {
            if(this._$selectAll && this._selectAllCheckBox.$element().hasClass(FOCUSED_STATE_CLASS)) {
                this._selectAllCheckBox.option("value", !this._selectAllCheckBox.option("value"));
                return true;
            }
        },

        _renderSelectAll: function() {
            var $selectAll = this._$selectAll = $("<div>").addClass(SELECT_DECORATOR_SELECT_ALL_CLASS),
                list = this._list,
                downArrowHandler = list._supportedKeys().downArrow.bind(list);

            this._selectAllCheckBox = list._createComponent($("<div>")
                .addClass(SELECT_DECORATOR_SELECT_ALL_CHECKBOX_CLASS)
                .appendTo($selectAll), CheckBox, { focusStateEnabled: false });

            this._selectAllCheckBox.registerKeyHandler("downArrow", downArrowHandler);

            $("<div>").addClass(SELECT_DECORATOR_SELECT_ALL_LABEL_CLASS)
                .text(this._list.option("selectAllText"))
                .appendTo($selectAll);

            this._list.itemsContainer().prepend($selectAll);

            this._updateSelectAllState();
            this._attachSelectAllHandler();
        },

        _attachSelectAllHandler: function() {
            this._selectAllCheckBox.option("onValueChanged", this._selectAllHandler.bind(this));

            eventsEngine.off(this._$selectAll, CLICK_EVENT_NAME);
            eventsEngine.on(this._$selectAll, CLICK_EVENT_NAME, this._selectAllClickHandler.bind(this));
        },

        _selectAllHandler: function(e) {
            e.event && e.event.stopPropagation();

            var isSelectedAll = this._selectAllCheckBox.option("value");

            var result = this._list._createActionByOption("onSelectAllValueChanged")({ value: isSelectedAll });
            if(result === false) {
                return;
            }

            if(isSelectedAll === true) {
                this._selectAllItems();
            } else if(isSelectedAll === false) {
                this._unselectAllItems();
            }
        },

        _checkSelectAllCapability: function() {
            var list = this._list,
                dataSource = list.getDataSource();

            if(list.option("selectAllMode") === "allPages" && list.option("grouped") && (!dataSource || !dataSource.group())) {
                errors.log("W1010");
                return false;
            }
            return true;
        },

        _selectAllItems: function() {
            if(!this._checkSelectAllCapability()) return;

            this._list._selection.selectAll(this._list.option("selectAllMode") === "page");
        },

        _unselectAllItems: function() {
            if(!this._checkSelectAllCapability()) return;

            this._list._selection.deselectAll(this._list.option("selectAllMode") === "page");
        },

        _selectAllClickHandler: function() {
            this._selectAllCheckBox.option("value", !this._selectAllCheckBox.option("value"));
        },

        _isSelected: function($itemElement) {
            return this._list.isItemSelected($itemElement);
        },

        _processCheckedState: function($itemElement, checked) {
            if(checked) {
                this._list.selectItem($itemElement);
            } else {
                this._list.unselectItem($itemElement);
            }
        },

        dispose: function() {
            this._disposeSelectAll();
            this._list.$element().removeClass(SELECT_DECORATOR_ENABLED_CLASS);
            this.callBase.apply(this, arguments);
        },

        _disposeSelectAll: function() {
            if(this._$selectAll) {
                this._$selectAll.remove();
                this._$selectAll = null;
            }
        }
    })
);
