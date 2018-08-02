var _Number = Number,
    _isString = require("../../core/utils/type").isString,
    extend = require("../../core/utils/extend").extend,
    _patchFontOptions = require("./utils").patchFontOptions,
    parseHorizontalAlignment = require("./utils").enumParser(["left", "center", "right"]),
    parseVerticalAlignment = require("./utils").enumParser(["top", "bottom"]),

    DEFAULT_MARGIN = 10,
    DEFAULT_GAP = 3;

function hasText(text) {
    return !!(text && String(text).length > 0);
}

function processTitleLength(elem, text, width) {
    if(elem.attr({ text: text }).applyEllipsis(width)) {
        elem.setTitle(text);
    }
}

function pickMarginValue(value) {
    return value >= 0 ? _Number(value) : DEFAULT_MARGIN;
}

function validateMargin(margin) {
    var result;
    if(margin >= 0) {
        result = { left: _Number(margin), top: _Number(margin), right: _Number(margin), bottom: _Number(margin) };
    } else {
        margin = margin || {};
        result = {
            left: pickMarginValue(margin.left),
            top: pickMarginValue(margin.top),
            right: pickMarginValue(margin.right),
            bottom: pickMarginValue(margin.bottom)
        };
    }
    return result;
}

function Title(params) {
    this._params = params;
    this._group = params.renderer.g().attr({ "class": params.cssClass }).linkOn(params.renderer.root, { name: "title", after: "peripheral" });
    this._hasText = false;
}

// There is no normal inheritance from LayoutElement because it is actually a container of methods rather than a class.
extend(Title.prototype, require("./layout_element").LayoutElement.prototype, {
    dispose: function() {
        var that = this;
        that._group.linkRemove();
        that._group.linkOff();
        if(that._titleElement) {
            that._clipRect.dispose();
            that._titleElement = that._subtitleElement = that._clipRect = null;
        }
        that._params = that._group = that._options = null;
    },

    _updateOptions: function(options) {
        this._options = options;
        this._options.horizontalAlignment = parseHorizontalAlignment(options.horizontalAlignment, "center");
        this._options.verticalAlignment = parseVerticalAlignment(options.verticalAlignment, "top");
        this._options.margin = validateMargin(options.margin);
    },

    _updateStructure: function() {
        var that = this,
            renderer = that._params.renderer,
            group = that._group,
            alignObj = { align: that._options.horizontalAlignment };

        // Looks like the following "laziness" is only to avoid unnecessary DOM content creation -
        // for example when widget is created without "title" option.
        if(!that._titleElement) {
            that._titleElement = renderer.text().attr(alignObj).append(group);
            that._subtitleElement = renderer.text().attr(alignObj);
            that._clipRect = renderer.clipRect();
            group.attr({ "clip-path": that._clipRect.id });
        }

        group.linkAppend();
        hasText(that._options.subtitle.text) ? that._subtitleElement.append(group) : that._subtitleElement.remove();
    },

    _updateTexts: function() {
        var that = this,
            options = that._options,
            subtitleOptions = options.subtitle,
            titleElement = that._titleElement,
            subtitleElement = that._subtitleElement,
            testText = "A",
            titleBox,
            y;

        titleElement.attr({ text: testText, y: 0 }).css(_patchFontOptions(options.font));
        titleBox = titleElement.getBBox(); // for multiline text
        that._titleTextY = titleBox.height + titleBox.y;

        titleElement.attr({ text: options.text });
        titleBox = titleElement.getBBox();
        y = -titleBox.y;

        titleElement.attr({ y: y });

        if(hasText(subtitleOptions.text)) {
            y += titleBox.height + titleBox.y;
            subtitleElement.attr({ text: subtitleOptions.text, y: 0 }).css(_patchFontOptions(subtitleOptions.font));
            y += -subtitleElement.getBBox().y - that._titleTextY + DEFAULT_GAP;
            subtitleElement.attr({ y: y });
        }
    },

    _updateBoundingRectAlignment: function() {
        var boundingRect = this._boundingRect,
            options = this._options;

        boundingRect.verticalAlignment = options.verticalAlignment;
        boundingRect.horizontalAlignment = options.horizontalAlignment;
        boundingRect.cutLayoutSide = options.verticalAlignment;
        boundingRect.cutSide = "vertical";
        boundingRect.position = {
            horizontal: options.horizontalAlignment,
            vertical: options.verticalAlignment
        };
    },

    update: function(options) {
        var that = this,
            _hasText = hasText(options.text),
            isLayoutChanged = _hasText || _hasText !== that._hasText;
        if(_hasText) {
            that._updateOptions(options);
            that._updateStructure();
            that._updateTexts();
            that._boundingRect = {};
            that._updateBoundingRect();
            that._updateBoundingRectAlignment();
        } else {
            that._group.linkRemove();
            that._boundingRect = null;
        }
        that._hasText = _hasText;
        return isLayoutChanged;
    },

    draw: function(width, height) {
        var that = this,
            layoutOptions;

        that._group.linkAppend();
        that._correctTitleLength(width);
        layoutOptions = that.getLayoutOptions();

        if(layoutOptions.height > height) {
            this.freeSpace();
        }

        return that;
    },

    probeDraw: function(width, height) {
        this.draw(width, height);

        return this;
    },

    _correctTitleLength: function(width) {
        var that = this,
            options = that._options,
            margin = options.margin,
            maxWidth = width - margin.left - margin.right;

        processTitleLength(that._titleElement, options.text, maxWidth);
        that._subtitleElement && processTitleLength(that._subtitleElement, options.subtitle.text, maxWidth);

        that._updateBoundingRect();
    },

    getLayoutOptions: function() {
        return this._boundingRect || null;
    },

    shift: function(x, y) {
        var that = this,
            box = that.getLayoutOptions();

        that._group.move(x - box.x, y - box.y);
        that._setClipRectSettings();

        return that;
    },

    _setClipRectSettings: function() {
        var bBox = this.getLayoutOptions();

        this._clipRect.attr({ x: bBox.x, y: bBox.y, width: bBox.width, height: bBox.height });
    },

    _updateBoundingRect: function() {
        var that = this,
            options = that._options,
            margin = options.margin,
            boundingRect = that._boundingRect,
            box;

        box = that._group.getBBox();

        box.height += margin.top + margin.bottom - that._titleTextY;
        box.width += margin.left + margin.right;
        box.x -= margin.left;
        box.y += that._titleTextY - margin.top;

        if(options.placeholderSize > 0) {
            box.height = options.placeholderSize;
        }

        boundingRect.height = box.height;
        boundingRect.width = box.width;
        boundingRect.x = box.x;
        boundingRect.y = box.y;
    },

    // BaseWidget_layout_implementation
    layoutOptions: function() {
        return this._boundingRect && {
            horizontalAlignment: this._boundingRect.horizontalAlignment,
            verticalAlignment: this._boundingRect.verticalAlignment,
            priority: 0
        };
    },

    measure: function(size) {
        this.draw(size[0], size[1]);
        return [this._boundingRect.width, this._boundingRect.height];
    },

    move: function(rect) {
        var boundingRect = this._boundingRect;
        if(rect[2] - rect[0] < boundingRect.width || rect[3] - rect[1] < boundingRect.height) {
            this.draw(rect[2] - rect[0], rect[3] - rect[1]);
        }
        this.shift(Math.round(rect[0]), Math.round(rect[1]));
    },

    freeSpace: function() {
        var that = this;
        that._params.incidentOccurred("W2103");
        that._group.linkRemove();
        that._boundingRect.width = that._boundingRect.height = 0;
    }
    // BaseWidget_layout_implementation
});

exports.Title = Title;

///#DEBUG
Title.prototype.DEBUG_getOptions = function() { return this._options; };
///#ENDDEBUG

function processTitleOptions(options) {
    var newOptions = _isString(options) ? { text: options } : (options || {});
    newOptions.subtitle = _isString(newOptions.subtitle) ? { text: newOptions.subtitle } : (newOptions.subtitle || {});
    return newOptions;
}

exports.plugin = {
    name: "title",
    init: function() {
        var that = this;
        // "exports" is used for testing purposes.
        that._title = new exports.Title({
            renderer: that._renderer,
            cssClass: that._rootClassPrefix + "-title",
            incidentOccurred: that._incidentOccurred
        });
        that._layout.add(that._title);
    },
    dispose: function() {
        this._title.dispose();
        this._title = null;
    },
    customize: function(constructor) {
        constructor.addChange({
            code: "TITLE",
            handler: function() {
                if(this._title.update(extend(true, {}, this._themeManager.theme("title"), processTitleOptions(this.option("title"))))) {
                    this._change(["LAYOUT"]);
                }
            },
            isThemeDependent: true,
            option: "title",
            isOptionChange: true
        });
    }
};
