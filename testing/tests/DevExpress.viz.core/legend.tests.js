var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    vizMocks = require("../../helpers/vizMocks.js"),
    legendModule = require("viz/components/legend");

var Legend = legendModule.Legend;

var environment = {
    beforeEach: function() {
        var that = this;
        this.renderer = new vizMocks.Renderer();
        this.bBoxes = [];

        this.rootGroup = this.renderer.g();
        this.renderer.g.reset();
        this.renderer.text();
        this.renderer.text.reset();
        this.options = getLegendOptions();

        this.data = this.createData(3);
        this.createMarker = sinon.spy(function() {
            return that.renderer.circle();
        });
        this.size = { width: 400, height: 300 };
        this.nameField = 'text';
        this.indexField = 'index';
        this.backgroundClass = 'dxc-border';
        this.itemGroupClass = 'dxc-item';
        this.renderer.bBoxTemplate = function() {
            return that.bBoxes.pop() || { x: 1, y: 3, height: 10, width: 20 };
        };
        this.options._incidentOccurred = sinon.spy();
    },
    afterEach: noop,
    createSimpleLegend: function() {
        var that = this,
            bBoxes = this.bBoxes;

        if(bBoxes && bBoxes.length) {
            this.data = this.createData(bBoxes.length);
            this.bBoxes = bBoxes.slice().reverse();
        }

        return this.createLegend({
            renderer: this.renderer, group: this.rootGroup, textField: this.nameField,
            getFormatObject: function(data) {
                var res = {};
                res[that.indexField] = data.id;
                res[that.colorField] = data.states.normal.fill;
                res[that.nameField] = data.text;
                return res;
            },
            itemGroupClass: this.itemGroupClass,
            backgroundClass: this.backgroundClass
        }, this.data, this.options);
    },
    createLegend: function(settings, data, options) {
        this.legend = new Legend(settings).update(data, options);
        return this.legend;
    },
    createAndDrawLegend: function() {
        return this.createSimpleLegend().draw(this.size.width, this.size.height);
    },
    getRenderedElements: function() {
        var insideLegendGroup = this.renderer.g.returnValues[0],
            items = $.map(insideLegendGroup.children, function(item) {
                return {
                    group: item,
                    marker: item.children[0],
                    text: item.children[1]
                };
            });

        return { insideLegendGroup: insideLegendGroup, items: items };
    },
    checkItems: function(assert, items) {
        var i = 0,
            insideLegendGroup = this.renderer.g.firstCall.returnValue,
            borderCorrection = insideLegendGroup.children.length % 2,
            item,
            itemsCount = items.length;

        this._checkMarkup(assert, itemsCount);

        for(; i < items.length; i++) {
            item = items[i];
            item.marker && this._checkMarker(assert, item.marker, i + borderCorrection);
            item.label && this._checkLabel(assert, item.label, i);
            item.tracker && this._checkTrackers(assert, item.tracker, i);
        }

        this._checkCreatingMarkerAndLabel(assert, itemsCount);
    },
    createData: function(itemCount) {
        var data = [],
            i;

        for(i = 0; i < itemCount; i++) {
            data.push({
                id: i,
                text: "Marker " + (i + 1),
                states: { normal: { fill: "color-" + (i + 1) } }
            });
        }

        return data;
    },
    _checkMarkup: function(assert, itemsCount) {
        var that = this,
            i,
            insideLegendGroup = this.renderer.g.firstCall.returnValue,
            borderCorrection = insideLegendGroup.children.length % 2,
            items = insideLegendGroup.children;

        assert.equal(items.length, itemsCount * 2 + borderCorrection, "Legend created the correct items count.");

        for(i = 0; i < itemsCount; i++) {
            assert.equal(items[i * 2 + borderCorrection], that.renderer.rect.getCall(i + borderCorrection).returnValue, "first element is marker rect. " + i + " ID");
            assert.equal(items[i * 2 + 1 + borderCorrection], that.renderer.text.getCall(i).returnValue, "second element is text, " + i + " ID");
        }
    },
    _checkCreatingMarkerAndLabel: function(assert, itemsCount) {
        var i = 0;
        for(; i < itemsCount; i++) {
            this._checkCreatingMarker(assert, i);
            this._checkCreatingLabel(assert, i);
        }
    },
    _checkCreatingMarker: function(assert, indexItem) {
        var marker = this.renderer.rect.getCall(indexItem);
        assert.equal(marker.args[0], 0);
        assert.equal(marker.args[1], 0);
    },
    _checkCreatingLabel: function(assert, indexItem) {
        var label = this.renderer.text.getCall(indexItem);
        assert.equal(label.args[1], 0);
        assert.equal(label.args[2], 0);
    },
    _checkMarker: function(assert, markerAttr, index) {
        var marker = this.renderer.rect.getCall(index).returnValue,
            settings = marker._stored_settings;

        $.each(markerAttr, function(key, value) {
            switch(key) {
                case "translateX":
                    assert.equal(marker.move.lastCall.args[0], value, key + " marker attr; " + index + " id");
                    break;
                case "translateY":
                    assert.equal(marker.move.lastCall.args[1], value, key + " marker attr; " + index + " id");
                    break;
                default:
                    assert.equal(settings[key], value, key + " marker attr; " + index + " id");
            }
        });
    },
    _checkLabel: function(assert, labelAttr, index) {
        var label = this.renderer.text.getCall(index).returnValue,
            settings = label._stored_settings;

        $.each(labelAttr, function(key, value) {
            switch(key) {
                case "translateX":
                    assert.equal(label.move.lastCall.args[0], value, key + " label attr; " + index + " id");
                    break;
                case "translateY":
                    assert.equal(label.move.lastCall.args[1], value, key + " label attr; " + index + " id");
                    break;
                default:
                    assert.equal(settings[key], value, key + " label attr; " + index + " id");
            }
        });
    },
    _checkTrackers: function(assert, trackerAttr, indexItem) {
        var tracker = this.legend._items[indexItem].tracker;
        assert.equal(tracker.left, trackerAttr.left, "left");
        assert.equal(tracker.top, trackerAttr.top, "top");
        assert.equal(tracker.right, trackerAttr.right, "right");
        assert.equal(tracker.bottom, trackerAttr.bottom, "bottom");
    }
};

function getDefaultStates() {
    return {
        hover: { hatching: { direction: "right" }, fill: 'blue' },
        normal: { fill: '#00FF00' },
        selection: { hatching: { direction: "right" }, fill: 'black' }
    };
}

function getLegendOptions(options) {
    options = options || {};

    return $.extend(true, {}, {
        visible: true,
        margin: 8,
        markerSize: 14,
        font: {
            color: '#7F7F7F',
            family: "Helvetica",
            size: 14
        },
        border: {
            visible: false,
            width: 1,
            color: "red"
        },
        position: 'outside',
        paddingLeftRight: 10,
        paddingTopBottom: 10,
        columnItemSpacing: 8,
        rowItemSpacing: 8,
        hoverMode: 'includePoints',
        cutSide: "vertical"
    }, options);
}

function getLegendData(count) {
    var states = getDefaultStates(),
        array = [],
        i;

    for(i = 0; i < count; i++) {
        array.push({
            text: i + "",
            id: i,
            argument: "argument" + i,
            argumentIndex: "argumentIndex" + i,
            states: states
        });
    }

    return array;
}

QUnit.module("constructor", environment);

QUnit.test("create legend without options and data", function(assert) {
    assert.ok(this.createLegend({}));
});

QUnit.test('init without options', function(assert) {
    assert.ok(this.createLegend({ renderer: new vizMocks.Renderer(), group: new vizMocks.Element() }, null));
});

QUnit.test('create legend with options', function(assert) {
    assert.ok(this.createLegend({}, null, this.options));
});

QUnit.test("getOptions", function(assert) {
    this.options.hoverMode = "customHoverMode";
    var legend = this.createSimpleLegend();

    assert.strictEqual(legend.getOptions().hoverMode, "customhovermode");
});

QUnit.module("draw legend", environment);

QUnit.test('draw without set options', function(assert) {
    assert.ok(this.createLegend({}, null, null).draw());
});

QUnit.test("visible = false", function(assert) {
    this.options.visible = false;
    this.createSimpleLegend();
    assert.ok(!this.renderer.g.called);
});

QUnit.test('Creates correct types of objects for series', function(assert) {
    var marker, text, elements;

    this.createAndDrawLegend(200, 200);

    elements = this.getRenderedElements();

    assert.equal(elements.insideLegendGroup.append.firstCall.args[0], this.rootGroup, 'Series groups were added, trackers was added');

    assert.equal(this.renderer.g.callCount, 1); // _insideLegendGroup
    assert.equal(elements.insideLegendGroup.children.length, this.data.length * 2);
    for(var i = 0; i < this.data.length; i++) {
        marker = this.renderer.rect.getCall(i).returnValue;
        text = this.renderer.text.getCall(i).returnValue;
        assert.deepEqual(marker.attr.firstCall.args[0], { 'fill': this.data[i].states.normal.fill, opacity: undefined }, 'Rect element not found for series ' + i);

        assert.equal(text.typeOfNode, 'text', 'Text element for series ' + i);
        assert.equal(text.stub("setTitle").callCount, 0, 'Text element for series ' + i);
        assert.equal(text._stored_settings.text, this.data[i].text, 'Text value for series ' + i);
    }
});

QUnit.test('Draw with Title', function(assert) {
    this.options.customizeHint = function() {
        return this.seriesName + ' ' + this.seriesColor + ' ' + this.seriesNumber;
    };

    this.nameField = 'seriesName';
    this.colorField = 'seriesColor';
    this.indexField = 'seriesNumber';
    this.createAndDrawLegend(200, 200);

    for(var i = 0; i < this.data.length; i++) {
        assert.equal(this.renderer.text.getCall(i).returnValue.setTitle.firstCall.args[0], this.data[i].text + " " + this.data[i].states.normal.fill + " " + this.data[i].id, 'Text element for series ' + i);
    }
});

QUnit.test('Create legend, hover fill is "none"', function(assert) {
    var states = {
        hover: { hatching: {}, fill: 'none' },
        selection: { hatching: {}, fill: 'black' }
    };
    this.data = [
        {
            text: 'First',
            id: 0,
            states: { hover: states.hover, selection: states.selection, normal: { fill: '#00FF00' } }
        },
        {
            text: 'Second',
            id: 1,
            states: { hover: states.hover, selection: states.selection, normal: { fill: '#99FF99' } }
        },
        {
            text: 'Third',
            id: 2,
            states: { hover: states.hover, selection: states.selection, normal: { fill: 'blue' } }
        }
    ];
    var legend = this.createSimpleLegend();

    legend.draw(200, 200);

    states = $.map(legend._items, function(item) { return item.states; });

    assert.equal(states[0].hovered.fill, "#00FF00");
    assert.equal(states[0].selected.fill, "black");

    assert.equal(states[1].hovered.fill, "#99FF99");
    assert.equal(states[1].selected.fill, "black");

    assert.equal(states[2].hovered.fill, "blue");
    assert.equal(states[2].selected.fill, "black");
});

QUnit.test('Create legend, textOpacity is "undefined"', function(assert) {
    this.options.font.opacity = 0.5;
    var states = {
        hover: { hatching: {}, fill: 'none' },
        selection: { hatching: {}, fill: 'black' }
    };
    this.data = [
        {
            text: 'First',
            id: 0,
            states: { hover: states.hover, selection: states.selection, normal: { fill: '#00FF00' } },
            textOpacity: undefined
        }
    ];

    this.createSimpleLegend()
        .draw(200, 200);

    assert.equal(this.renderer.text.lastCall.returnValue.css.lastCall.args[0].opacity, 0.5, "Label should have opacity");
});

QUnit.test('Create legend, textOpacity less than font opacity', function(assert) {
    this.options.font.opacity = 0.5;
    var states = {
        hover: { hatching: {}, fill: 'none' },
        selection: { hatching: {}, fill: 'black' }
    };
    this.data = [
        {
            text: 'First',
            id: 0,
            states: { hover: states.hover, selection: states.selection, normal: { fill: '#00FF00' } },
            textOpacity: 0.3
        }
    ];
    this.createAndDrawLegend();

    assert.equal(this.renderer.text.lastCall.returnValue.css.lastCall.args[0].opacity, 0.3, "Label should be changed");
});

QUnit.test('Create legend, selected fill is "none"', function(assert) {
    var states = {
        hover: { hatching: {}, fill: 'red' },
        selection: { hatching: {}, fill: 'none' }
    };

    this.data = [{
        text: 'First',
        id: 0,
        states: { hover: states.hover, selection: states.selection, normal: { fill: '#00FF00' } }
    }, {
        text: 'Second',
        id: 1,
        states: { hover: states.hover, selection: states.selection, normal: { fill: '#99FF99' } }
    }, {
        text: 'Third',
        id: 2,
        states: { hover: states.hover, selection: states.selection, normal: { fill: 'blue' } }
    }];
    var legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.ok(legend);
    assert.ok(legend._insideLegendGroup);
    states = $.map(legend._items, function(item) { return item.states; });

    assert.equal(states[0].hovered.fill, "red");
    assert.equal(states[0].selected.fill, "#00FF00");

    assert.equal(states[1].hovered.fill, "red");
    assert.equal(states[1].selected.fill, "#99FF99");

    assert.equal(states[2].hovered.fill, "red");
    assert.equal(states[2].selected.fill, "blue");
});

QUnit.test('Update', function(assert) {
    var states = getDefaultStates();
    this.data = [{
        text: 'First',
        id: 0,
        states: { hover: states.hover, selection: states.selection, normal: { fill: '#00FF00' } }
    }];
    var legend = this.createSimpleLegend()
            .draw(200, 200)
            .update([{
                text: 'newText', id: 0, states: {
                    hover: { fill: 'green1', hatching: { direction: 'right' } },
                    normal: { fill: 'none' },
                    selection: { fill: 'blue1', hatching: { direction: 'left' } }
                }
            }], this.options)
            .draw();

    states = $.map(legend._items, function(item) { return item.states; });

    assert.equal(states[0].hovered.fill, "green1");
    assert.deepEqual(states[0].hovered.hatching.direction, "right", "hover hatching");
    assert.equal(states[0].selected.fill, "blue1");
    assert.deepEqual(states[0].selected.hatching.direction, 'left');
});

QUnit.test('Draw legend, orientation = "horizontal"', function(assert) {
    this.options.orientation = 'horizontal';
    this.data = [{ text: 'First', id: 0, states: getDefaultStates() }];

    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [{
        id: 0,
        marker: {
            fill: "#00FF00",
            width: 14,
            height: 14
        },
        label: {
            text: "First"
        },
        tracker: {
            left: -4,
            top: -4,
            right: 24,
            bottom: 32
        }
    }]);
});

QUnit.test('Draw legend, orientation = "vertical"', function(assert) {
    this.options.orientation = 'vertical';
    this.data = [{ text: 'First', id: 0, states: getDefaultStates() }];
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [{
        id: 0,
        marker: {
            fill: "#00FF00",
            width: 14,
            height: 14
        },
        label: {
            text: "First"
        },
        tracker: {
            left: -4,
            top: -4,
            right: 45,
            bottom: 18
        }
    }]);
});

QUnit.test('Draw legend, itemTextPosition = "bottom"', function(assert) {
    this.options.itemTextPosition = 'bottom';
    this.data = [{ text: 'First', id: 0, states: getDefaultStates() }];
    var legend = this.createSimpleLegend();

    legend.draw(200, 200);

    this.checkItems(assert, [{
        id: 0,
        marker: {
            fill: "#00FF00",
            width: 14,
            height: 14
        },
        label: {
            text: "First"
        },
        tracker: {
            left: -4,
            top: -4,
            right: 24,
            bottom: 32
        }
    }]);
});

QUnit.test("Clear group if the size is too small. Width", function(assert) {
    this.createSimpleLegend()
        .draw(4, 200);

    assert.ok(this.renderer.g.returnValues[0].dispose.calledOnce);
    assert.ok(this.options._incidentOccurred.calledOnce);
    assert.ok(this.options._incidentOccurred.calledWith("W2104"));
});

QUnit.module("Check items position", environment);

QUnit.test("Vertical orientation", function(assert) {
    this.options.itemTextPosition = "bottom";
    this.data = this.createData(1);
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } }
    ]);
});

QUnit.test("Vertical orientation. ItemTextPosition = 'top'", function(assert) {
    this.options.itemTextPosition = "top";
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 14 }, label: { translateX: -1, translateY: -3 } },
        { id: 1, marker: { translateX: 3, translateY: 50 }, label: { translateX: -1, translateY: 33 } },
        { id: 2, marker: { translateX: 3, translateY: 86 }, label: { translateX: -1, translateY: 69 } }
    ]);
});

QUnit.test("Vertical orientation. ItemTextPosition = 'right'", function(assert) {
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 20, translateY: 21 } },
        { id: 2, marker: { translateX: 0, translateY: 44 }, label: { translateX: 20, translateY: 43 } }
    ]);
});

QUnit.test("Vertical orientation. Two columns", function(assert) {
    this.options.itemTextPosition = "bottom";
    this.data = this.createData(4);
    this.createSimpleLegend().draw(200, 130);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 3, translateY: 36 }, label: { translateX: -1, translateY: 51 } },
        { id: 2, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 3, marker: { translateX: 31, translateY: 36 }, label: { translateX: 27, translateY: 51 } }
    ]);
});

QUnit.test("Vertical orientation. Two columns. ItemTextPosition = 'right'", function(assert) {
    this.options.border.visible = true;
    this.createSimpleLegend().draw(200, 91);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 20, translateY: 21 } },
        { id: 2, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } }
    ]);
});

QUnit.test("Vertical orientation. Three columns", function(assert) {
    this.options.itemTextPosition = "bottom";
    this.createSimpleLegend().draw(200, 70);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 59, translateY: 0 }, label: { translateX: 55, translateY: 15 } }
    ]);
});

QUnit.test("Horizontal orientation", function(assert) {
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = "right";
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } },
        { id: 2, marker: { translateX: 98, translateY: 0 }, label: { translateX: 118, translateY: -1 } }
    ]);
});

QUnit.test("Horizontal orientation. itemTextPosition = 'top'", function(assert) {
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = "top";
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 14 }, label: { translateX: -1, translateY: -3 } },
        { id: 1, marker: { translateX: 31, translateY: 14 }, label: { translateX: 27, translateY: -3 } },
        { id: 2, marker: { translateX: 59, translateY: 14 }, label: { translateX: 55, translateY: -3 } }
    ]);
});

QUnit.test("Horizontal orientation. two rows", function(assert) {
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = "top";
    this.createSimpleLegend().draw(91, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 14 }, label: { translateX: -1, translateY: -3 } },
        { id: 1, marker: { translateX: 31, translateY: 14 }, label: { translateX: 27, translateY: -3 } },
        { id: 2, marker: { translateX: 3, translateY: 50 }, label: { translateX: -1, translateY: 33 } }
    ]);
});

QUnit.test("Horizontal orientation. itemTextPosition = 'left'", function(assert) {
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = "left";
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 27, translateY: 0 }, label: { translateX: -1, translateY: -1 } },
        { id: 1, marker: { translateX: 76, translateY: 0 }, label: { translateX: 48, translateY: -1 } },
        { id: 2, marker: { translateX: 125, translateY: 0 }, label: { translateX: 97, translateY: -1 } }
    ]);
});

QUnit.test("rowCount options", function(assert) {
    this.options.rowCount = 1;
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } },
        { id: 2, marker: { translateX: 98, translateY: 0 }, label: { translateX: 118, translateY: -1 } }
    ]);
});

QUnit.test("columnCount options. vertical orientation", function(assert) {
    this.options.columnCount = 3;
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } },
        { id: 2, marker: { translateX: 98, translateY: 0 }, label: { translateX: 118, translateY: -1 } }
    ]);
});

QUnit.test("Horizontal orientation. bottom", function(assert) {
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 59, translateY: 0 }, label: { translateX: 55, translateY: 15 } }
    ]);
});

QUnit.test("columnCount options", function(assert) {
    this.options.columnCount = 1;
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 3, translateY: 36 }, label: { translateX: -1, translateY: 51 } },
        { id: 2, marker: { translateX: 3, translateY: 72 }, label: { translateX: -1, translateY: 87 } }
    ]);
});

QUnit.test("rowCount options. horizontal orientation", function(assert) {
    this.options.rowCount = 3;
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 3, translateY: 36 }, label: { translateX: -1, translateY: 51 } },
        { id: 2, marker: { translateX: 3, translateY: 72 }, label: { translateX: -1, translateY: 87 } }
    ]);
});

QUnit.test("columnItemSpacing options", function(assert) {
    this.options.orientation = 'horizontal';
    this.options.columnItemSpacing = 10;
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 33, translateY: 0 }, label: { translateX: 29, translateY: 15 } },
        { id: 2, marker: { translateX: 63, translateY: 0 }, label: { translateX: 59, translateY: 15 } }
    ]);
});

QUnit.test("rowItemSpacing options", function(assert) {
    this.options.rowItemSpacing = 10;
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 24 }, label: { translateX: 20, translateY: 23 } },
        { id: 2, marker: { translateX: 0, translateY: 48 }, label: { translateX: 20, translateY: 47 } }
    ]);
});

QUnit.test("paddingLeftRight options", function(assert) {
    this.options.border.visible = true;
    this.options.paddingLeftRight = 20;
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(120, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 3, translateY: 36 }, label: { translateX: -1, translateY: 51 } }
    ]);
});

QUnit.test("paddingTopBottom options", function(assert) {
    this.options.border.visible = true;
    this.options.paddingTopBottom = 20;
    this.createSimpleLegend().draw(200, 101);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 20, translateY: 21 } },
        { id: 2, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } }
    ]);
});

QUnit.test("T405783, border is visible", function(assert) {
    this.options.border.visible = true;
    this.options.columnCount = 2;
    this.createSimpleLegend().draw(200, 56);

    this.checkItems(assert, [
            { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
            { id: 1, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } },
            { id: 2, marker: { translateX: 98, translateY: 0 }, label: { translateX: 118, translateY: -1 } }
    ]);
});

QUnit.test("T405783, border is not visible", function(assert) {
    this.options.border.visible = false;
    this.options.columnCount = 2;
    this.createSimpleLegend().draw(200, 72);

    this.checkItems(assert, [
            { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
            { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 20, translateY: 21 } },
            { id: 2, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } }
    ]);
});

QUnit.test("itemsAlignment options. Center. items in one line.", function(assert) {
    this.options.itemsAlignment = "center";
    this.options.columnCount = 2;
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = "right";
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } },
        { id: 2, marker: { translateX: 25, translateY: 22 }, label: { translateX: 45, translateY: 21 } }
    ]);
});

QUnit.test("itemsAlignment options. Left", function(assert) {
    this.options.itemsAlignment = "left";
    this.options.columnCount = 2;
    this.options.orientation = 'horizontal';

    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 3, translateY: 36 }, label: { translateX: -1, translateY: 51 } }
    ]);
});

QUnit.test("itemsAlignment options. Center", function(assert) {
    this.options.itemsAlignment = "center";
    this.options.columnCount = 2;
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 17, translateY: 36 }, label: { translateX: 13, translateY: 51 } }
    ]);
});

QUnit.test("itemsAlignment options. Right", function(assert) {
    this.options.itemsAlignment = "right";
    this.options.columnCount = 2;
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 31, translateY: 36 }, label: { translateX: 27, translateY: 51 } }
    ]);
});

QUnit.test("Vertical orientation. Transform must be rounded", function(assert) {
    this.data[2].size = 13;
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 20, translateY: 21 } },
        { id: 2, marker: { translateX: 1, translateY: 44 }, label: { translateX: 20, translateY: 43 } }
    ]);
});

QUnit.test("item size > legend canvas", function(assert) {
    assert.expect(0);

    this.createSimpleLegend().draw(10, 10);
});

QUnit.module("Label align", environment);

QUnit.test("text align. right", function(assert) {
    this.createSimpleLegend().draw(200, 200);
    this.checkItems(assert, [
        { id: 0, label: { align: "left" } },
        { id: 0, label: { align: "left" } },
        { id: 0, label: { align: "left" } }
    ]);
});

QUnit.test("text align. left", function(assert) {
    this.options.itemTextPosition = "left";
    this.createSimpleLegend().draw(200, 200);
    this.checkItems(assert, [
        { id: 0, label: { align: "right" } },
        { id: 0, label: { align: "right" } },
        { id: 0, label: { align: "right" } }
    ]);
});

QUnit.test("text align. top", function(assert) {
    this.options.itemTextPosition = "top";
    this.createSimpleLegend().draw(200, 200);
    this.checkItems(assert, [
        { id: 0, label: { align: "center" } },
        { id: 0, label: { align: "center" } },
        { id: 0, label: { align: "center" } }
    ]);
});

QUnit.test("text align. bottom", function(assert) {
    this.options.itemTextPosition = "bottom";
    this.createSimpleLegend().draw(200, 200);
    this.checkItems(assert, [
        { id: 0, label: { align: "center" } },
        { id: 0, label: { align: "center" } },
        { id: 0, label: { align: "center" } }
    ]);
});

QUnit.test("bottom", function(assert) {
    this.options.orientation = "horizontal";
    this.bBoxes = [{ x: 0, y: 0, width: 20, height: 40 },
        { x: 0, y: 0, width: 20, height: 10 },
        { x: 0, y: 0, width: 20, height: 10 }];

    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: 0, translateY: 18 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 28, translateY: 18 } },
        { id: 2, marker: { translateX: 59, translateY: 0 }, label: { translateX: 56, translateY: 18 } }
    ]);
});

QUnit.test("top", function(assert) {
    this.options.orientation = "horizontal";
    this.options.itemTextPosition = "top";
    this.bBoxes = [{ x: 0, y: 0, width: 20, height: 40 },
        { x: 0, y: 0, width: 20, height: 10 },
        { x: 0, y: 0, width: 20, height: 10 }];

    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 44 }, label: { translateX: 0, translateY: 0 } },
        { id: 1, marker: { translateX: 31, translateY: 44 }, label: { translateX: 28, translateY: 30 } },
        { id: 2, marker: { translateX: 59, translateY: 44 }, label: { translateX: 56, translateY: 30 } }
    ]);
});

QUnit.test("left", function(assert) {
    this.options.itemTextPosition = "left";
    this.bBoxes = [{ x: 0, y: 0, width: 40, height: 10 },
        { x: 0, y: 0, width: 20, height: 10 },
        { x: 0, y: 0, width: 20, height: 10 }];

    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 47, translateY: 0 }, label: { translateX: 0, translateY: 2 } },
        { id: 1, marker: { translateX: 47, translateY: 22 }, label: { translateX: 20, translateY: 24 } },
        { id: 2, marker: { translateX: 47, translateY: 44 }, label: { translateX: 20, translateY: 46 } }
    ]);
});

QUnit.test("right", function(assert) {
    this.bBoxes = [{ x: 0, y: 0, width: 40, height: 10 },
        { x: 0, y: 0, width: 20, height: 10 },
        { x: 0, y: 0, width: 20, height: 10 }];

    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 21, translateY: 2 } },
        { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 21, translateY: 24 } },
        { id: 2, marker: { translateX: 0, translateY: 44 }, label: { translateX: 21, translateY: 46 } }
    ]);
});

QUnit.module('legend', environment);

QUnit.test('Draw trackers after enabled legend after disable legend', function(assert) {
    this.data = this.data.slice(0, 3);
    var legend = this.createSimpleLegend().draw(200, 200);
    legend._options.visible = false;
    legend.draw();

    legend._options.visible = true;
    legend.draw();

    var trackers = $.map(legend._items, function(item) {
        return item.tracker;
    });

    assert.deepEqual(trackers, [{
        "bottom": 18,
        "id": 0,
        "left": -4,
        "right": 45,
        "top": -4,
        "argument": undefined,
        "argumentIndex": undefined
    },
    {
        "bottom": 40,
        "id": 1,
        "left": -4,
        "right": 45,
        "top": 18,
        "argument": undefined,
        "argumentIndex": undefined
    },
    {
        "bottom": 62,
        "id": 2,
        "left": -4,
        "right": 45,
        "top": 40,
        "argument": undefined,
        "argumentIndex": undefined
    }]);
});

QUnit.test('Default label format', function(assert) {
    this.nameField = 'seriesName';
    var legend = this.createSimpleLegend();

    var formatResult = legend._options.customizeText.call({ seriesName: 'test name' }, { seriesName: 'test name' });

    assert.equal(formatResult, 'test name');
});

QUnit.test('Custom label format', function(assert) {
    this.options.customizeText = function() { return this.text + ' ' + this.itemIndex; };
    var legend = this.createSimpleLegend();

    var formatResult = legend._options.customizeText.call({ text: 'test name', itemIndex: 1 }, { text: 'test name', itemIndex: 1 });

    assert.equal(formatResult, 'test name 1');
});

QUnit.test('Custom label title format', function(assert) {
    this.options.customizeHint = function() { return this.text + ' ' + this.itemIndex; };
    var legend = this.createSimpleLegend();

    var formatResult = legend._options.customizeHint.call({ text: 'test name', itemIndex: 1 }, { text: 'test name', itemIndex: 1 });

    assert.equal(formatResult, 'test name 1');
});

QUnit.test('Draw legend with custom format label', function(assert) {
    this.data = [{ text: 'First', id: 0, states: $.extend(true, getDefaultStates(), { normal: { fill: 'red' } }) }];
    this.options.customizeText = function() { return this.seriesName + ':' + this.seriesIndex + ':' + this.seriesColor; };
    this.nameField = 'seriesName';
    this.indexField = 'seriesIndex';
    this.colorField = 'seriesColor';
    var legend = this.createSimpleLegend();

    legend.draw(200, 200);

    this.checkItems(assert, [{
        id: 0, label: { text: 'First:0:red', x: 0, y: 0 }
    }]);
});

QUnit.test('Border is not drawn, position = "inside", backgroundColor is not specify', function(assert) {
    var options = {
            containerBackgroundColor: '#ffffff',
            position: 'inside'
        },
        legendData = [{ text: 'First', id: 0, states: getDefaultStates() }];
    this.data = legendData;
    this.options = getLegendOptions(options);
    var legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.ok(legend);
    assert.ok(legend._insideLegendGroup);
    assert.equal(legend._legendGroup.children.length, 1, 'inside group created, trackers was added');
    assert.equal(legend._insideLegendGroup.children.length, legendData.length * 2 + 1, 'Series groups were added');
    assert.equal(legend._insideLegendGroup.children[0].attr.firstCall.args[0].fill, '#ffffff');
});

QUnit.test('Border is not drawn, backgroundColor is specify', function(assert) {
    var options = {
            containerBackgroundColor: '#ffffff',
            backgroundColor: '#123456'
        },
        legendData = [{ text: 'First', id: 0, states: getDefaultStates() }];
    this.data = legendData;
    this.options = getLegendOptions(options);
    var legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.ok(legend);
    assert.ok(legend._insideLegendGroup);
    assert.equal(legend._legendGroup.children.length, 1, 'inside group created');
    assert.equal(legend._insideLegendGroup.children.length, legendData.length * 2 + 1, 'Series groups were added');
    assert.equal(legend._insideLegendGroup.children[0].attr.firstCall.args[0].fill, '#123456');
});

QUnit.test('Border is drawn', function(assert) {
    var options = {
            border: {
                visible: true,
                width: 1,
                color: 'black',
                dashStyle: 'dot'
            }
        },
        legendData = [{ text: 'First', id: 0, states: getDefaultStates() }];
    this.data = legendData;
    this.options = getLegendOptions(options);
    var legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.ok(legend);
    assert.ok(legend._insideLegendGroup);
    assert.equal(legend._legendGroup.children.length, 1, 'inside group created, trackers was added');
    assert.equal(legend._insideLegendGroup.children.length, legendData.length * 2 + 1, 'Series groups were added');

    assert.equal(legend._insideLegendGroup.children[0].attr.firstCall.args[0].fill, 'none');
    assert.equal(legend._insideLegendGroup.children[0].attr.firstCall.args[0]['class'], 'dxc-border');
    assert.equal(legend._insideLegendGroup.children[0]._stored_settings["stroke-width"], 1);
    assert.equal(legend._insideLegendGroup.children[0]._stored_settings.stroke, 'black');
    assert.equal(legend._insideLegendGroup.children[0]._stored_settings.dashStyle, 'dot');
});

QUnit.test('Border is drawn, position = "inside"', function(assert) {
    var options = {
            containerBackgroundColor: '#ffffff',
            border: {
                visible: true,
                width: 1,
                color: 'black',
                dashStyle: 'dot'
            },
            position: 'inside'
        },
        legendData = [{ text: 'First', id: 0, states: getDefaultStates() }];
    this.data = legendData;
    this.options = getLegendOptions(options);
    var legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.ok(legend);
    assert.ok(legend._insideLegendGroup);
    assert.equal(legend._legendGroup.children.length, 1, 'inside group created, trackers was added');
    assert.equal(legend._insideLegendGroup.children.length, legendData.length * 2 + 1, 'Series groups were added');
    assert.equal(legend._insideLegendGroup.children[0].attr.firstCall.args[0].fill, '#ffffff');
    assert.equal(legend._insideLegendGroup.children[0].attr.firstCall.args[0]['class'], 'dxc-border');
    assert.equal(legend._insideLegendGroup.children[0]._stored_settings["stroke-width"], 1);
    assert.equal(legend._insideLegendGroup.children[0]._stored_settings.stroke, 'black');
    assert.equal(legend._insideLegendGroup.children[0]._stored_settings.dashStyle, 'dot');
});

QUnit.test('Draw background rect.Legend with border', function(assert) {
    var states = getDefaultStates(),
        options = {
            border: {
                visible: true,
                color: 'green',
                width: 1,
                dashStyle: "dash",
                opacity: 0.5
            },
            paddingLeftRight: 5,
            paddingTopBottom: 10
        },
        legendMockBBox = { width: 120, height: 40, x: 30, y: 50 };
    this.data = [{
        text: 'first item',
        id: 0,
        states: states
    }, {
        text: 'second item',
        id: 1,
        states: states
    }, {
        text: 'third item',
        id: 2,
        states: states
    }];
    this.options = getLegendOptions(options);
    var legend = this.createSimpleLegend();

    legend._legendGroup.stub("getBBox") && (legend._legendGroup.getBBox = function() { return legendMockBBox; });

    legend.draw(200, 200);

    var borderRect = legend._insideLegendGroup.children[0];

    assert.deepEqual(borderRect._stored_settings, {
        'class': "dxc-border",
        "fill": "none",
        x: -4,
        y: -7,
        width: 20 + 2 * options.paddingLeftRight,
        height: 10 + 2 * options.paddingTopBottom,
        "stroke-width": options.border.width,
        stroke: options.border.color,
        "stroke-opacity": options.border.opacity,
        dashStyle: options.border.dashStyle,
        rx: 0,
        ry: 0,
        opacity: undefined
    });
});

QUnit.test('Draw background rect.Legend without border', function(assert) {
    var states = getDefaultStates(),
        options = {
            backgroundColor: 'red',
            border: {
                visible: false,
                color: 'green',
                width: 1,
                dashStyle: "dash",
                opacity: 0.5
            },
            paddingLeftRight: 5,
            paddingTopBottom: 10
        },
        mockBBox = { width: 120, height: 40, x: 30, y: 50 };
    this.data = [{
        text: 'first item',
        id: 0,
        states: states
    }, {
        text: 'second item',
        id: 1,
        states: states
    }, {
        text: 'third item',
        id: 2,
        states: states
    }];
    this.options = getLegendOptions(options);
    var legend = this.createSimpleLegend();

    legend._legendGroup.stub("getBBox") && (legend._legendGroup.getBBox = function() { return mockBBox; });

    legend.draw(200, 200);

    var borderRect = legend._insideLegendGroup.children[0];

    assert.deepEqual(borderRect._stored_settings, {
        'class': "dxc-border",
        "fill": "red",
        x: -4,
        y: -7,
        width: 20 + 2 * options.paddingLeftRight,
        height: 10 + 2 * options.paddingTopBottom,
        opacity: undefined
    });
});

QUnit.test('Legend with incorrect margin number', function(assert) {
    this.options.margin = -20;
    var legend = this.createSimpleLegend();

    assert.deepEqual(legend._options.margin, { left: 10, right: 10, top: 10, bottom: 10 }, 'Margin should have default margin');
});

QUnit.test('Legend with incorrect margin number - string', function(assert) {
    this.options.margin = "bad";
    var legend = this.createSimpleLegend();

    assert.deepEqual(legend._options.margin, { left: 10, right: 10, top: 10, bottom: 10 }, 'Margin should have default margin');
});

QUnit.test('Legend with incorrect margin number - string number', function(assert) {
    this.options = getLegendOptions({ margin: '5' });
    var legend = this.createSimpleLegend();

    assert.ok(legend, 'Legend was created');
    assert.deepEqual(legend._options.margin, { left: 5, right: 5, top: 5, bottom: 5 }, 'Margin should have default margin');
});

QUnit.test('Legend with incorrect margin number - null', function(assert) {
    this.options = getLegendOptions({ margin: null });
    var legend = this.createSimpleLegend();

    assert.ok(legend, 'Legend was created');
    assert.deepEqual(legend._options.margin, { left: 0, right: 0, top: 0, bottom: 0 }, 'Margin should have default margin');
});

QUnit.test('Legend with incorrect margin object', function(assert) {
    this.options = getLegendOptions({
        margin: {
            top: undefined,
            bottom: NaN,
            left: -10,
            right: 'abs'
        }
    });
    var legend = this.createSimpleLegend();

    assert.ok(legend, 'Legend was created');
    assert.deepEqual(legend._options.margin, { left: 10, right: 10, top: 10, bottom: 10 }, 'Margin should have default margin');
});

QUnit.test('Legend with incorrect margin object - all fields are string number', function(assert) {
    this.options = getLegendOptions({
        margin: {
            top: '1',
            bottom: '2',
            left: '3',
            right: '4'
        }
    });
    var legend = this.createSimpleLegend();

    assert.ok(legend, 'Legend was created');
    assert.deepEqual(legend._options.margin, { left: 3, right: 4, top: 1, bottom: 2 }, 'Margin should have default margin');
});

QUnit.test('Mapping indexes', function(assert) {
    var states = getDefaultStates();
    this.data = [{
        text: 'first item',
        id: 11,
        states: states
    }, {
        text: 'second item',
        id: 4,
        states: states
    }, {
        text: 'third item',
        id: 7,
        states: states
    }];


    var legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.equal(legend._markersId[11], 0);
    assert.equal(legend._markersId[4], 1);
    assert.equal(legend._markersId[7], 2);

    assert.equal(legend._items[0].tracker.id, 11);
    assert.equal(legend._items[1].tracker.id, 4);
    assert.equal(legend._items[2].tracker.id, 7);
});

QUnit.test('shift legend', function(assert) {
    this.data = getLegendData(3);

    var legend = this.createSimpleLegend();

    legend.draw(200, 200);
    legend.shift(10, 15);

    assert.ok(legend._insideLegendGroup.attr.calledOnce);
    assert.deepEqual(legend._insideLegendGroup.attr.firstCall.args[0], { translateX: 17, translateY: 20 });
});

QUnit.test('coordsIn', function(assert) {
    this.renderer.bBoxTemplate = { x: 10, y: 15, height: 30, width: 20 };
    this.data = getLegendData(3);

    var legend = this.createSimpleLegend();

    legend.draw(200, 200);
    legend.shift(10, 15);

    assert.ok(!legend.coordsIn(9, 30));
    assert.ok(legend.coordsIn(10, 30));
    assert.ok(legend.coordsIn(20, 30));
    assert.ok(legend.coordsIn(30, 30));
    assert.ok(!legend.coordsIn(31, 30));

    assert.ok(!legend.coordsIn(20, 14));
    assert.ok(legend.coordsIn(20, 15));
    assert.ok(legend.coordsIn(20, 30));
    assert.ok(legend.coordsIn(20, 45));
    assert.ok(!legend.coordsIn(20, 46));

    assert.ok(this.rootGroup.getBBox.lastCall.calledAfter(legend._insideLegendGroup.attr.lastCall));
});

QUnit.test('coordsIn after erase', function(assert) {
    this.renderer.bBoxTemplate = { x: 10, y: 15, height: 30, width: 20 };
    var legend = this.createSimpleLegend()
            .draw(200, 200)
            .shift(10, 15)
            .erase();

    assert.ok(!legend.coordsIn(10, 30));
    assert.ok(!legend.coordsIn(20, 30));
    assert.ok(!legend.coordsIn(30, 30));

    assert.ok(!legend.coordsIn(20, 15));
    assert.ok(!legend.coordsIn(20, 30));
    assert.ok(!legend.coordsIn(20, 45));
});

// T205280
QUnit.test("coordsIn after update without data", function(assert) {
    // arrange
    var legend = this.createSimpleLegend(),
        legendSize = { width: 200, height: 200, top: 0, bottom: 0, left: 0, right: 0 };

    legend.draw(200, 200);
    legend.shift(10, 15);

    // act
    legend.update([], getLegendOptions());
    legend.draw(legendSize);

    // assert
    assert.strictEqual(legend.coordsIn(10, 10), false);
});

QUnit.test('getItemByCoord', function(assert) {
    this.data = getLegendData(2);
    var legend = this.createSimpleLegend()
        .draw(200, 200)
        .shift(10, 15),
        element1 = {
            bottom: 18,
            id: 0,
            left: -4,
            right: 45,
            top: -4,
            argument: "argument0",
            argumentIndex: "argumentIndex0"
        },
        element2 = {
            bottom: 40,
            id: 1,
            left: -4,
            right: 45,
            top: 18,
            argument: "argument1",
            argumentIndex: "argumentIndex1"
        };

    assert.strictEqual(legend.getItemByCoord(12, 30), null);
    assert.deepEqual(legend.getItemByCoord(17, 30), element1);
    assert.deepEqual(legend.getItemByCoord(18, 30), element1);
    assert.deepEqual(legend.getItemByCoord(30, 30), element1);
    assert.deepEqual(legend.getItemByCoord(64, 30), null);
    assert.strictEqual(legend.getItemByCoord(68, 30), null);

    assert.deepEqual(legend.getItemByCoord(30, 21), element1);
    assert.deepEqual(legend.getItemByCoord(30, 22), element1);
    assert.deepEqual(legend.getItemByCoord(30, 30), element1);
    assert.deepEqual(legend.getItemByCoord(30, 47), element2);
    assert.deepEqual(legend.getItemByCoord(30, 48), element2);
    assert.strictEqual(legend.getItemByCoord(30, 75), null);
});

QUnit.test('Pass color & opacity to markers on create', function(assert) {
    var states = getDefaultStates();
    this.data = [{
        text: 'text_0',
        id: 0,
        states: $.extend(true, {}, states, { normal: { fill: 'color_0', opacity: 0.1 } })
    }, {
        text: 'text_1',
        id: 1,
        states: $.extend(true, {}, states, { normal: { fill: 'color_1' } })
    }, {
        text: 'text_2',
        id: 2,
        states: $.extend(true, {}, states, { normal: { fill: 'color_2', opacity: 0.2 } })
    }];
    this.createSimpleLegend()
        .draw(200, 200);

    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: 'color_0', opacity: 0.1 });
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: 'color_1', opacity: undefined });
    assert.deepEqual(this.renderer.rect.getCall(2).returnValue.attr.getCall(0).args[0], { fill: 'color_2', opacity: 0.2 });
});

QUnit.test('Pass color & opacity to markers on update', function(assert) {
    var states = getDefaultStates(),
        legendData = [{
            text: 'text_0',
            id: 0,
            states: $.extend(true, {}, states, { normal: { opacity: 0.1, fill: 'color_0' } })
        }],
        legend = this.createSimpleLegend(legendData);

    legend.draw(200, 200);

    legend.update([{
        text: 'text_0',
        id: 0,
        states: $.extend(true, {}, states, { normal: { opacity: 0.5, fill: 'new_color_0' } })
    }], getLegendOptions());

    legend.draw();

    assert.deepEqual(this.renderer.rect.lastCall.returnValue.attr.getCall(0).args[0], { fill: 'new_color_0', opacity: 0.5 });
});

QUnit.module("getLayoutOptions", environment);

QUnit.test("Without draw. vertical position", function(assert) {
    assert.deepEqual(this.createSimpleLegend().getLayoutOptions(), {
        cutLayoutSide: "right",
        height: 0,
        cutSide: "horizontal",
        position: {
            horizontal: "right",
            vertical: "top"
        },
        horizontalAlignment: "right",
        verticalAlignment: "top",
        width: 0,
        x: 0,
        y: 0
    });
});

QUnit.test("Without draw. horizontal position", function(assert) {
    this.options.orientation = "horizontal";
    assert.deepEqual(this.createSimpleLegend().getLayoutOptions(), {
        cutLayoutSide: "top",
        height: 0,
        cutSide: "vertical",
        position: {
            horizontal: "right",
            vertical: "top"
        },
        horizontalAlignment: "right",
        verticalAlignment: "top",
        width: 0,
        x: 0,
        y: 0
    });
});

QUnit.test('T121386. getLayoutOptions cutLayoutOptions when horizontal alignment === center and vertical alignment === top', function(assert) {
    this.options = getLegendOptions({
        orientation: "vertical",
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
    });

    assert.deepEqual(this.createSimpleLegend().getLayoutOptions(), {
        cutLayoutSide: "top",
        height: 0,
        cutSide: "vertical",
        position: {
            horizontal: "center",
            vertical: "top"
        },
        horizontalAlignment: "center",
        verticalAlignment: "top",
        width: 0,
        x: 0,
        y: 0
    });
});

QUnit.test("After draw", function(assert) {
    assert.deepEqual(this.createSimpleLegend().draw(200, 200).getLayoutOptions(), {
        width: 20 + this.options.margin.left + this.options.margin.right,
        height: 10 + this.options.margin.top + this.options.margin.bottom,
        x: -7,
        y: -5,
        horizontalAlignment: 'right',
        verticalAlignment: 'top',
        cutSide: "horizontal",
        position: {
            horizontal: "right",
            vertical: "top"
        },
        cutLayoutSide: 'right'
    });
});

QUnit.test("After draw. horizontalAlignment = \"center\"", function(assert) {
    this.options.horizontalAlignment = "center";

    assert.deepEqual(this.createSimpleLegend().draw(200, 200).getLayoutOptions(), {
        height: 26,
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom',
        width: 36,
        cutSide: "vertical",
        position: {
            horizontal: "center",
            vertical: "bottom"
        },
        cutLayoutSide: 'bottom',
        x: -7,
        y: -5
    });
});

QUnit.test("layoutOptions", function(assert) {
    var options = this.createSimpleLegend().layoutOptions();

    assert.equal(options.horizontalAlignment, "right");
    assert.equal(options.verticalAlignment, "top");
    assert.equal(options.side, "horizontal");
    assert.equal(options.priority, 1);
});

QUnit.test("measure", function(assert) {
    assert.deepEqual(this.createSimpleLegend().measure(100, 200), [36, 26]);
});

QUnit.test("move", function(assert) {
    this.createAndDrawLegend().move([10, 15]);

    assert.deepEqual(this.renderer.g.returnValues[0].attr.args[0][0], { translateX: 17, translateY: 20 });
});

QUnit.test("free space", function(assert) {
    var legend = this.createSimpleLegend();
    legend.measure(100, 200);

    legend.freeSpace();

    assert.ok(this.renderer.g.returnValues[0].dispose.calledOnce);
    assert.ok(this.options._incidentOccurred.calledOnce);
    assert.ok(this.options._incidentOccurred.calledWith("W2104"));
});

QUnit.module('Legend Options', environment);

QUnit.test('Default center for not-set align', function(assert) {
    this.options = getLegendOptions({ horizontalAlignment: 'center' });

    var legend = this.createSimpleLegend();

    assert.ok(legend);
    assert.equal(legend._options.orientation, 'horizontal');
});

QUnit.test('Default vertical for right align', function(assert) {
    var legend = this.createSimpleLegend();

    assert.equal(legend._options.orientation, 'vertical');
});

QUnit.test('Default vertical for left align', function(assert) {
    var legend = this.createSimpleLegend();

    assert.ok(legend);
    assert.equal(legend._options.orientation, 'vertical');
});

QUnit.test('horizontalAlignment specified incorrectly', function(assert) {
    var legend = this.createSimpleLegend();

    assert.equal(legend._options.horizontalAlignment, 'right');
});


QUnit.module("Life cycle", $.extend({}, environment, {
    beforeEach: function() {
        this.legend = this.createSimpleLegend()
                .draw(200, 200);
    }
}));

QUnit.test("Disposing", function(assert) {
    var legend = this.legend;

    legend.dispose();

    assert.strictEqual(legend._items, null);
    assert.strictEqual(legend._insideLegendGroup, null);
    assert.strictEqual(legend._legendGroup, null);
    assert.strictEqual(legend._renderer, null);
    assert.strictEqual(legend._options, null);
    assert.strictEqual(legend._data, null);
});

QUnit.module('States', $.extend({}, environment, {
    beforeEach: function(assert) {
        environment.beforeEach.apply(this, arguments);
        var states = getDefaultStates();

        this.data = [{
            text: 'first item',
            id: 0,
            states: states
        }, {
            text: 'second item',
            id: 1,
            states: states
        }];
        this.legend = this.createSimpleLegend()
                .draw(200, 200);
    }
}));

QUnit.test('applyHover', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub("smartAttr").reset();
    this.renderer.rect.getCall(1).returnValue.stub("smartAttr").reset();
    this.legend.applyHover(0);

    assert.equal(this.renderer.rect.getCall(0).returnValue.smartAttr.lastCall.args[0].fill, "blue");
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.smartAttr.lastCall.args[0].hatching, { direction: "right", step: 5, width: 2 });
    assert.equal(this.renderer.rect.getCall(1).returnValue._stored_settings.fill, '#00FF00');
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub("smartAttr").callCount, 0);
});

QUnit.test('applySelected', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub("smartAttr").reset();
    this.renderer.rect.getCall(1).returnValue.stub("smartAttr").reset();
    this.legend.applySelected(0);

    assert.equal(this.renderer.rect.getCall(0).returnValue.smartAttr.lastCall.args[0].fill, "black");
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.smartAttr.lastCall.args[0].hatching, { direction: "right", step: 5, width: 2 });
    assert.equal(this.renderer.rect.getCall(1).returnValue._stored_settings.fill, '#00FF00');
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub("smartAttr").callCount, 0);
});

QUnit.test('resetItem', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub("smartAttr").reset();
    this.renderer.rect.getCall(1).returnValue.stub("smartAttr").reset();
    this.legend.resetItem(0);

    assert.equal(this.renderer.rect.getCall(0).returnValue.smartAttr.lastCall.args[0].fill, "#00FF00");
    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.smartAttr.lastCall.args[0].hatching, undefined);
    assert.equal(this.renderer.rect.getCall(1).returnValue._stored_settings.fill, '#00FF00');
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub("smartAttr").callCount, 0);
});

QUnit.test('applyHover from invisible series', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub("smartAttr").reset();
    this.renderer.rect.getCall(1).returnValue.stub("smartAttr").reset();
    this.legend.applyHover(4);

    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.stub("smartAttr").callCount, 0);
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub("smartAttr").callCount, 0);
});

QUnit.test('applySelected from invisible series', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub("smartAttr").reset();
    this.renderer.rect.getCall(1).returnValue.stub("smartAttr").reset();
    this.legend.applySelected(4);

    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.stub("smartAttr").callCount, 0);
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub("smartAttr").callCount, 0);
});

QUnit.test('resetItem from invisible series', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub("smartAttr").reset();
    this.renderer.rect.getCall(1).returnValue.stub("smartAttr").reset();
    this.legend.resetItem(4);

    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.stub("smartAttr").callCount, 0);
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub("smartAttr").callCount, 0);
});

QUnit.test('resetItem from invisible series', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub("smartAttr").reset();
    this.renderer.rect.getCall(1).returnValue.stub("smartAttr").reset();
    this.legend.resetItem(4);

    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.stub("smartAttr").callCount, 0);
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub("smartAttr").callCount, 0);
});

// T164539
QUnit.module('legend without data', $.extend({}, environment, {
    beforeEach: function() {
        this.legend = this.createSimpleLegend().draw(200, 200);
    }
}));

QUnit.test('legend without data. applySelected', function(assert) {
    assert.expect(0);
    this.legend.applySelected(0);
});

QUnit.test('legend without data. applyHover', function(assert) {
    assert.expect(0);
    this.legend.applyHover(0);
});

QUnit.test('legend without data. resetItem', function(assert) {
    assert.expect(0);
    this.legend.resetItem(0);
});

QUnit.module('General', environment);

QUnit.test('Drawing', function(assert) {
    this.createAndDrawLegend();

    assert.deepEqual(this.renderer.g.getCall(0).returnValue.append.lastCall.args, [this.rootGroup], 'group is appended');
});

QUnit.test('Erasing', function(assert) {
    this.createAndDrawLegend().erase();

    assert.deepEqual(this.renderer.g.getCall(0).returnValue.remove.lastCall.args, [], 'group is removed');
});

QUnit.module('Markers', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        legendModule._DEBUG_stubMarkerCreator(this.createMarker);
    },
    afterEach: function() {
        environment.afterEach.apply(this, arguments);
        legendModule._DEBUG_restoreMarkerCreator();
    }
}));

QUnit.test('Squares', function(assert) {
    legendModule._DEBUG_restoreMarkerCreator();
    this.createAndDrawLegend();

    assert.strictEqual(this.renderer.rect.callCount, 3);
});

QUnit.test('Circles', function(assert) {
    legendModule._DEBUG_restoreMarkerCreator();
    this.options.markerShape = 'circle';
    this.createAndDrawLegend();

    assert.strictEqual(this.renderer.circle.callCount, 3);
});

QUnit.test('Appended to container', function(assert) {
    this.createAndDrawLegend();

    var createMarker = this.createMarker,
        createGroup = this.renderer.g;

    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).returnValue.append.lastCall.args, [createGroup.getCall(0).returnValue], String(i));
    });
});

QUnit.test('Colors', function(assert) {
    this.createAndDrawLegend();

    var createMarker = this.createMarker;
    $.each(this.data, function(i, data) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.getCall(0).args, [{ fill: data.states.normal.fill, opacity: undefined }], String(i));
    });
});

QUnit.test('Common color', function(assert) {
    $.each(this.data, function(_, item) {
        item.states.normal.fill = null;
    });
    this.options.markerColor = 'common-color';
    this.createAndDrawLegend();

    var createMarker = this.createMarker;
    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.getCall(0).args, [{ fill: 'common-color', opacity: undefined }], String(i));
    });
});

QUnit.test('No state color, no marker color - use default color', function(assert) {
    $.each(this.data, function(_, item) {
        item.states.normal.fill = null;
    });
    this.options.defaultColor = 'default-color';
    this.createAndDrawLegend();

    var createMarker = this.createMarker;
    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.getCall(0).args, [{ fill: 'default-color', opacity: undefined }], String(i));
    });
});

QUnit.test('Sizes', function(assert) {
    this.options.markerSize = 8;
    this.createAndDrawLegend();

    var renderer = this.renderer,
        createMarker = this.createMarker;
    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).args, [renderer, 8], String(i));
    });
});

QUnit.test('Partial sizes', function(assert) {
    var that = this;
    $.each(this.data, function(i, data) {
        data.size = i + 4;
    });
    this.createAndDrawLegend();

    $.each(this.data, function(i) {
        assert.equal(that.createMarker.getCall(i).args[0], that.renderer);
        assert.equal(that.createMarker.getCall(i).args[1], i + 4);
    });
});

QUnit.test('Items in inverted order', function(assert) {
    this.options.inverted = true;
    this.createAndDrawLegend();

    var createMarker = this.createMarker;
    $.each(this.data.reverse(), function(i, data) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.getCall(0).args, [{ fill: data.states.normal.fill, opacity: undefined }], String(i));
    });
});

QUnit.test('markers centering(partial markers sizes).', function(assert) {
    var createMarker;

    this.options.itemTextPosition = 'right';
    $.each(this.data, function(i, data) {
        data.size = i + 4;
    });
    this.createAndDrawLegend();

    createMarker = this.createMarker;

    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.lastCall.args, [{ fill: "color-" + (1 + i), opacity: undefined }]);
        assert.deepEqual(createMarker.getCall(i).args[1], i + 4, "marker size");
    });
});

QUnit.test('markers centering(partial markers sizes). markerShape = circle', function(assert) {
    var createMarker;

    this.options.itemTextPosition = 'right';
    this.options.markerShape = 'circle';
    $.each(this.data, function(i, data) {
        data.size = i + 4;
    });
    this.createAndDrawLegend();

    createMarker = this.createMarker;
    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.lastCall.args, [{ fill: "color-" + (1 + i), opacity: undefined }]);
        assert.deepEqual(createMarker.getCall(i).args[1], i + 4, "marker size");
    });
});

QUnit.module("probeDraw", environment);

QUnit.test("probeDraw", function(assert) {
    var legend = this.createSimpleLegend();
    legend.draw = sinon.stub();
    legend.probeDraw();
    assert.ok(legend.draw.calledOnce);
});

QUnit.module("getActionCallback", environment);

QUnit.test("applying some action", function(assert) {
    var legend = this.createSimpleLegend();
    legend.draw = sinon.stub();
    legend.applyAction = sinon.stub();
    legend.getActionCallback({ index: 1 })("applyAction");

    assert.ok(legend.applyAction.called);
    assert.strictEqual(legend.applyAction.args[0][0], 1);
});

QUnit.test("legend is not visible", function(assert) {
    this.options.visible = false;
    var legend = this.createSimpleLegend();

    legend.applyAction = sinon.stub();
    legend.getActionCallback({ index: 1 })("applyAction");

    assert.ok(!legend.applyAction.called);
});
