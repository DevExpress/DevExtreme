import $ from "../../core/renderer";
import themes from "../themes";
import commonUtils from "../../core/utils/common";
import { isPlainObject } from "../../core/utils/type";
import registerComponent from "../../core/component_registrator";
import { inArray } from "../../core/utils/array";
import { extend } from "../../core/utils/extend";
import { each } from "../../core/utils/iterator";
import AsyncCollectionWidget from "../collection/ui.collection_widget.async";
import Promise from "../../core/polyfills/promise";
import { BindableTemplate } from "../../core/templates/bindable_template";
import fx from "../../animation/fx";

const TOOLBAR_CLASS = "dx-toolbar";
const TOOLBAR_BEFORE_CLASS = "dx-toolbar-before";
const TOOLBAR_CENTER_CLASS = "dx-toolbar-center";
const TOOLBAR_AFTER_CLASS = "dx-toolbar-after";
const TOOLBAR_BOTTOM_CLASS = "dx-toolbar-bottom";
const TOOLBAR_MINI_CLASS = "dx-toolbar-mini";
const TOOLBAR_ITEM_CLASS = "dx-toolbar-item";
const TOOLBAR_LABEL_CLASS = "dx-toolbar-label";
const TOOLBAR_BUTTON_CLASS = "dx-toolbar-button";
const TOOLBAR_ITEMS_CONTAINER_CLASS = "dx-toolbar-items-container";
const TOOLBAR_GROUP_CLASS = "dx-toolbar-group";
const TOOLBAR_COMPACT_CLASS = "dx-toolbar-compact";
const TOOLBAR_LABEL_SELECTOR = "." + TOOLBAR_LABEL_CLASS;
const TEXT_BUTTON_MODE = "text";
const DEFAULT_BUTTON_TYPE = "default";

const TOOLBAR_ITEM_DATA_KEY = "dxToolbarItemDataKey";

var ToolbarBase = AsyncCollectionWidget.inherit({
    compactMode: false,

    /**
     * @name  dxToolbarOptions.dataSource
     * @type string|Array<string,dxToolbarItem,object>|DataSource|DataSourceOptions
     * @default null
     */

    /**
     * @name dxToolbarOptions.items
     * @type Array<string, dxToolbarItem, object>
     * @fires dxToolbarOptions.onOptionChanged
     */

    /**
    * @name dxToolbarItem
    * @inherits CollectionWidgetItem
    * @type object
    */
    /**
    * @name dxToolbarItem.widget
    * @type Enums.ToolbarItemWidget
    */
    /**
    * @name dxToolbarItem.options
    * @type object
    */

    ctor: function(element, options) {
        this._userOptions = options || {};

        this.callBase(element, options);
    },

    _getSynchronizableOptionsForCreateComponent: function() {
        return this.callBase().filter(item => item !== "disabled");
    },

    _initTemplates: function() {
        this.callBase();
        var template = new BindableTemplate(function($container, data, rawModel) {
            if(isPlainObject(data)) {
                if(data.text) {
                    $container.text(data.text).wrapInner("<div>");
                }

                if(data.html) {
                    $container.html(data.html);
                }

                if(data.widget === "dxButton") {
                    if(this.option("useFlatButtons")) {
                        data.options = data.options || {};
                        data.options.stylingMode = data.options.stylingMode || TEXT_BUTTON_MODE;
                    }

                    if(this.option("useDefaultButtons")) {
                        data.options = data.options || {};
                        data.options.type = data.options.type || DEFAULT_BUTTON_TYPE;
                    }
                }
            } else {
                $container.text(String(data));
            }

            this._getTemplate("dx-polymorph-widget").render({
                container: $container,
                model: rawModel,
                parent: this
            });
        }.bind(this), ["text", "html", "widget", "options"], this.option("integrationOptions.watchMethod"));

        this._templateManager.addDefaultTemplates({
            item: template,
            menuItem: template,
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            renderAs: "topToolbar",

            grouped: false,

            useFlatButtons: false,
            useDefaultButtons: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return themes.isMaterial();
                },
                options: {
                    useFlatButtons: true
                }
            }
        ]);
    },

    _itemContainer: function() {
        return this._$toolbarItemsContainer.find([
            "." + TOOLBAR_BEFORE_CLASS,
            "." + TOOLBAR_CENTER_CLASS,
            "." + TOOLBAR_AFTER_CLASS
        ].join(","));
    },

    _itemClass: function() {
        return TOOLBAR_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return TOOLBAR_ITEM_DATA_KEY;
    },

    _buttonClass: function() {
        return TOOLBAR_BUTTON_CLASS;
    },

    _dimensionChanged: function() {
        this._arrangeItems();
        this._applyCompactMode();
    },

    _initMarkup: function() {
        this._renderToolbar();
        this._renderSections();

        this.callBase();

        this.setAria("role", "toolbar");
    },

    _waitParentAnimationFinished: function() {
        const $element = this.$element();
        const timeout = 15;
        return new Promise(resolve => {
            const check = () => {
                let readyToResolve = true;
                $element.parents().each((_, parent) => {
                    if(fx.isAnimating($(parent))) {
                        readyToResolve = false;
                        return false;
                    }
                });
                if(readyToResolve) {
                    resolve();
                }
                return readyToResolve;
            };
            const runCheck = () => {
                clearTimeout(this._waitParentAnimationTimeout);
                this._waitParentAnimationTimeout = setTimeout(() => check() || runCheck(), timeout);
            };
            runCheck();
        });
    },

    _render: function() {
        this.callBase();
        this._renderItemsAsync();

        if(themes.isMaterial()) {
            Promise.all([
                this._waitParentAnimationFinished(),
                this._checkWebFontForLabelsLoaded()
            ]).then(this._dimensionChanged.bind(this));
        }
    },

    _postProcessRenderItems: function() {
        this._arrangeItems();
    },

    _renderToolbar: function() {
        this.$element()
            .addClass(TOOLBAR_CLASS)
            .toggleClass(TOOLBAR_BOTTOM_CLASS, this.option("renderAs") === "bottomToolbar");

        this._$toolbarItemsContainer = $("<div>")
            .addClass(TOOLBAR_ITEMS_CONTAINER_CLASS)
            .appendTo(this.$element());
    },

    _renderSections: function() {
        var $container = this._$toolbarItemsContainer,
            that = this;
        each(["before", "center", "after"], function() {
            var sectionClass = "dx-toolbar-" + this,
                $section = $container.find("." + sectionClass);

            if(!$section.length) {
                that["_$" + this + "Section"] = $section = $("<div>")
                    .addClass(sectionClass)
                    .appendTo($container);
            }
        });
    },

    _checkWebFontForLabelsLoaded: function() {
        const $labels = this.$element().find(TOOLBAR_LABEL_SELECTOR);
        const promises = [];
        $labels.each((_, label) => {
            const text = $(label).text();
            const fontWeight = $(label).css("fontWeight");
            promises.push(themes.waitWebFont(text, fontWeight));
        });
        return Promise.all(promises);
    },

    _arrangeItems: function(elementWidth) {
        elementWidth = elementWidth || this.$element().width();

        this._$centerSection.css({
            margin: "0 auto",
            float: "none"
        });

        var beforeRect = this._$beforeSection.get(0).getBoundingClientRect(),
            afterRect = this._$afterSection.get(0).getBoundingClientRect();

        this._alignCenterSection(beforeRect, afterRect, elementWidth);

        var $label = this._$toolbarItemsContainer.find(TOOLBAR_LABEL_SELECTOR).eq(0),
            $section = $label.parent();

        if(!$label.length) {
            return;
        }

        var labelOffset = beforeRect.width ? beforeRect.width : $label.position().left,
            widthBeforeSection = $section.hasClass(TOOLBAR_BEFORE_CLASS) ? 0 : labelOffset,
            widthAfterSection = $section.hasClass(TOOLBAR_AFTER_CLASS) ? 0 : afterRect.width,
            elemsAtSectionWidth = 0;

        $section.children().not(TOOLBAR_LABEL_SELECTOR).each(function() {
            elemsAtSectionWidth += $(this).outerWidth();
        });

        var freeSpace = elementWidth - elemsAtSectionWidth,
            sectionMaxWidth = Math.max(freeSpace - widthBeforeSection - widthAfterSection, 0);

        if($section.hasClass(TOOLBAR_BEFORE_CLASS)) {
            this._alignSection(this._$beforeSection, sectionMaxWidth);
        } else {
            var labelPaddings = $label.outerWidth() - $label.width();
            $label.css("maxWidth", sectionMaxWidth - labelPaddings);
        }
    },

    _alignCenterSection: function(beforeRect, afterRect, elementWidth) {
        this._alignSection(this._$centerSection, elementWidth - beforeRect.width - afterRect.width);

        var isRTL = this.option("rtlEnabled"),
            leftRect = isRTL ? afterRect : beforeRect,
            rightRect = isRTL ? beforeRect : afterRect,
            centerRect = this._$centerSection.get(0).getBoundingClientRect();

        if(leftRect.right > centerRect.left || centerRect.right > rightRect.left) {
            this._$centerSection.css({
                marginLeft: leftRect.width,
                marginRight: rightRect.width,
                float: leftRect.width > rightRect.width ? "none" : "right"
            });
        }
    },

    _alignSection: function($section, maxWidth) {
        var $labels = $section.find(TOOLBAR_LABEL_SELECTOR),
            labels = $labels.toArray();

        maxWidth = maxWidth - this._getCurrentLabelsPaddings(labels);

        var currentWidth = this._getCurrentLabelsWidth(labels),
            difference = Math.abs(currentWidth - maxWidth);

        if(maxWidth < currentWidth) {
            labels = labels.reverse();
            this._alignSectionLabels(labels, difference, false);
        } else {
            this._alignSectionLabels(labels, difference, true);
        }
    },

    _alignSectionLabels: function(labels, difference, expanding) {
        var getRealLabelWidth = function(label) { return label.getBoundingClientRect().width; };

        for(var i = 0; i < labels.length; i++) {
            var $label = $(labels[i]),
                currentLabelWidth = Math.ceil(getRealLabelWidth(labels[i])),
                labelMaxWidth;

            if(expanding) {
                $label.css("maxWidth", "inherit");
            }

            var possibleLabelWidth = Math.ceil(expanding ? getRealLabelWidth(labels[i]) : currentLabelWidth);

            if(possibleLabelWidth < difference) {
                labelMaxWidth = expanding ? possibleLabelWidth : 0;
                difference = difference - possibleLabelWidth;
            } else {
                labelMaxWidth = expanding ? currentLabelWidth + difference : currentLabelWidth - difference;
                $label.css("maxWidth", labelMaxWidth);
                break;
            }

            $label.css("maxWidth", labelMaxWidth);
        }
    },

    _applyCompactMode: function() {
        var $element = this.$element();
        $element.removeClass(TOOLBAR_COMPACT_CLASS);

        if(this.option("compactMode") && this._getSummaryItemsWidth(this.itemElements(), true) > $element.width()) {
            $element.addClass(TOOLBAR_COMPACT_CLASS);
        }
    },

    _getCurrentLabelsWidth: function(labels) {
        var width = 0;

        labels.forEach(function(label, index) {
            width += $(label).outerWidth();
        });

        return width;
    },

    _getCurrentLabelsPaddings: function(labels) {
        var padding = 0;

        labels.forEach(function(label, index) {
            padding += ($(label).outerWidth() - $(label).width());
        });

        return padding;
    },

    _renderItem: function(index, item, itemContainer, $after) {
        var location = item.location || "center",
            container = itemContainer || this["_$" + location + "Section"],
            itemHasText = !!(item.text || item.html),
            itemElement = this.callBase(index, item, container, $after);

        itemElement
            .toggleClass(this._buttonClass(), !itemHasText)
            .toggleClass(TOOLBAR_LABEL_CLASS, itemHasText)
            .addClass(item.cssClass);

        return itemElement;
    },

    _renderGroupedItems: function() {
        var that = this;

        each(this.option("items"), function(groupIndex, group) {
            var groupItems = group.items,
                $container = $("<div>").addClass(TOOLBAR_GROUP_CLASS),
                location = group.location || "center";

            if(!groupItems || !groupItems.length) {
                return;
            }

            each(groupItems, function(itemIndex, item) {
                that._renderItem(itemIndex, item, $container, null);
            });

            that._$toolbarItemsContainer.find(".dx-toolbar-" + location).append($container);
        });
    },

    _renderItems: function(items) {
        var grouped = this.option("grouped") && items.length && items[0].items;
        grouped ? this._renderGroupedItems() : this.callBase(items);
    },

    _getToolbarItems: function() {
        return this.option("items") || [];
    },

    _renderContentImpl: function() {
        var items = this._getToolbarItems();

        this.$element().toggleClass(TOOLBAR_MINI_CLASS, items.length === 0);

        if(this._renderedItemsCount) {
            this._renderItems(items.slice(this._renderedItemsCount));
        } else {
            this._renderItems(items);
        }

        this._applyCompactMode();
    },

    _renderEmptyMessage: commonUtils.noop,

    _clean: function() {
        this._$toolbarItemsContainer.children().empty();
        this.$element().empty();
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._arrangeItems();
        }
    },

    _isVisible: function() {
        return this.$element().width() > 0 && this.$element().height() > 0;
    },

    _getIndexByItem: function(item) {
        return inArray(item, this._getToolbarItems());
    },

    _itemOptionChanged: function(item, property, value) {
        this.callBase.apply(this, [item, property, value]);
        this._arrangeItems();
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "width":
                this.callBase.apply(this, arguments);
                this._dimensionChanged();
                break;
            case "renderAs":
            case "useFlatButtons":
            case "useDefaultButtons":
                this._invalidate();
                break;
            case "compactMode":
                this._applyCompactMode();
                break;
            case "grouped":
                break;
            default:
                this.callBase.apply(this, arguments);
        }
    },

    _dispose: function() {
        this.callBase();
        clearTimeout(this._waitParentAnimationTimeout);
    },

    /**
    * @name dxToolbarMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxToolbarMethods.focus
    * @publicName focus()
    * @hidden
    */
});

registerComponent("dxToolbarBase", ToolbarBase);

module.exports = ToolbarBase;
