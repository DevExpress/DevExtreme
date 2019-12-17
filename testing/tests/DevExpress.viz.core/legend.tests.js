import $ from 'jquery';
import { noop } from 'core/utils/common';
import { extend } from 'core/utils/extend';
import vizMocks from '../../helpers/vizMocks.js';
import legendModule from 'viz/components/legend';
import module from 'viz/core/title';

const Legend = legendModule.Legend;

const defaultMarkerBBox = { x: 0, y: 0, height: 14, width: 14 };

const environment = {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.bBoxes = [];
        this.markerBBoxes = [];

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
            let bBox = null;
            if(this._stored_settings.class === 'dxl-marker') {
                bBox = that.markerBBoxes.pop() || defaultMarkerBBox;
            } else {
                bBox = that.bBoxes.pop();
            }

            return bBox || { x: 1, y: 3, height: 10, width: 20 };
        };
        this.options._incidentOccurred = sinon.spy();
    },
    afterEach: noop,
    createSimpleLegend: function() {
        const that = this;
        const bBoxes = this.bBoxes;

        if(bBoxes && bBoxes.length) {
            this.data = this.createData(bBoxes.length);
            this.bBoxes = bBoxes.slice().reverse();
        }

        return this.createLegend({
            renderer: this.renderer, group: this.rootGroup, textField: this.nameField,
            getFormatObject: function(data) {
                const res = {};
                res[that.indexField] = data.id;
                res[that.colorField] = data.states.normal.fill;
                res[that.nameField] = data.text;
                return res;
            },
            widget: {
                _getTemplate: function(f) {
                    this.template = {
                        render: sinon.spy(function(arg) {
                            return f(arg.model, arg.container);
                        })
                    };
                    return this.template;
                },
                _requestChange: sinon.spy()
            },
            itemGroupClass: this.itemGroupClass,
            backgroundClass: this.backgroundClass,
            allowInsidePosition: true,
        }, this.data, this.options);
    },
    createLegend: function(settings, data, options) {
        this.legend = new Legend(settings).update(data, options, this.themeManagerTitleOptions);
        return this.legend;
    },
    createAndDrawLegend: function() {
        return this.createSimpleLegend().draw(this.size.width, this.size.height);
    },
    getRenderedElements: function() {
        const insideLegendGroup = this.renderer.g.returnValues[1];
        const items = $.map(insideLegendGroup.children, function(item) {
            return {
                group: item,
                marker: item.children[0],
                text: item.children[1]
            };
        });

        return { insideLegendGroup: insideLegendGroup, items: items };
    },
    borderCorrection() {
        return this.options.border.visible ? 1 : 0;
    },
    checkItems: function(assert, items) {
        let i = 0;
        const titleCorrection = this.options.title.text ? 1 : 0;
        const subtitleCorrection = titleCorrection;
        let item;
        const itemsCount = items.length;

        this._checkMarkup(assert, itemsCount);

        for(; i < items.length; i++) {
            item = items[i];
            item.marker && this._checkMarker(assert, item.marker, i);
            item.label && this._checkLabel(assert, item.label, i + titleCorrection + subtitleCorrection);
            item.tracker && this.checkTrackers(assert, item.tracker, i);
        }

        this._checkCreatingMarkerAndLabel(assert, itemsCount);
    },
    createData: function(itemCount) {
        const data = [];
        let i;

        for(i = 0; i < itemCount; i++) {
            data.push({
                id: i,
                text: 'Marker ' + (i + 1),
                states: { normal: { fill: 'color-' + (i + 1) } },
                visible: true
            });
        }

        return data;
    },

    findMarkersGroup: function() {
        const insideLegendGroup = this.renderer.g.secondCall.returnValue;
        for(let i = 0; i < insideLegendGroup.children.length; i++) {
            const child = insideLegendGroup.children[i];
            if(child.attr.firstCall.args[0].class === 'dxc-item') {
                return child;
            }
        }
    },

    _checkMarkup: function(assert, itemsCount) {
        const that = this;
        let i;
        const markersGroup = this.findMarkersGroup();
        const titleCorrection = this.options.title.text ? 1 : 0;
        const subtitleCorrection = titleCorrection;
        const borderCorrection = this.borderCorrection();

        assert.equal(markersGroup.children.length, itemsCount, 'Legend created the correct items count.');
        for(i = 0; i < itemsCount; i++) {
            const itemGroup = markersGroup.children[i];
            const markerGroup = itemGroup.children[0].element;
            assert.equal(that.renderer.rect.getCall(i + borderCorrection).returnValue.append.lastCall.args[0].element, markerGroup, 'first element is marker rect. ' + i + ' ID');
            assert.equal(that.renderer.text.getCall(i + titleCorrection + subtitleCorrection).returnValue.append.lastCall.args[0], itemGroup, 'second element is text, ' + i + ' ID');
        }
    },
    _checkCreatingMarkerAndLabel: function(assert, itemsCount) {
        let i = 0;
        for(; i < itemsCount; i++) {
            this._checkCreatingMarker(assert, i);
            this._checkCreatingLabel(assert, i);
        }
    },
    _checkCreatingMarker: function(assert, indexItem) {
        const marker = this.renderer.rect.getCall(indexItem);
        assert.equal(marker.args[0], 0);
        assert.equal(marker.args[1], 0);
    },
    _checkCreatingLabel: function(assert, indexItem) {
        const titleCorrection = this.options.title.text ? 1 : 0;
        const subtitleCorrection = titleCorrection;
        const label = this.renderer.text.getCall(indexItem + titleCorrection + subtitleCorrection);
        assert.equal(label.args[1], 0);
        assert.equal(label.args[2], 0);
    },
    _checkMarker: function(assert, markerAttr, index) {
        const marker = this.renderer.rect.getCall(index + this.borderCorrection()).returnValue;
        const settings = marker._stored_settings;
        const markerGroup = this.findMarkersGroup().children[index].children[0];
        $.each(markerAttr, function(key, value) {
            switch(key) {
                case 'translateX':
                    assert.equal(markerGroup.move.lastCall.args[0], value, key + ' marker attr; ' + index + ' id');
                    break;
                case 'translateY':
                    assert.equal(markerGroup.move.lastCall.args[1], value, key + ' marker attr; ' + index + ' id');
                    break;
                default:
                    assert.equal(settings[key], value, key + ' marker attr; ' + index + ' id');
            }
        });
    },
    _checkLabel: function(assert, labelAttr, index) {
        const label = this.renderer.text.getCall(index).returnValue;
        const settings = label._stored_settings;

        $.each(labelAttr, function(key, value) {
            switch(key) {
                case 'translateX':
                    assert.equal(label.move.lastCall.args[0], value, key + ' label attr; ' + index + ' id');
                    break;
                case 'translateY':
                    assert.equal(label.move.lastCall.args[1], value, key + ' label attr; ' + index + ' id');
                    break;
                default:
                    assert.equal(settings[key], value, key + ' label attr; ' + index + ' id');
            }
        });
    },
    checkTrackers: function(assert, trackerAttr, indexItem) {
        const tracker = this.legend._items[indexItem].tracker;
        assert.equal(tracker.left, trackerAttr.left, 'left');
        assert.equal(tracker.top, trackerAttr.top, 'top');
        assert.equal(tracker.right, trackerAttr.right, 'right');
        assert.equal(tracker.bottom, trackerAttr.bottom, 'bottom');
    }
};

function getDefaultStates() {
    return {
        hover: { hatching: { direction: 'right' }, fill: 'blue' },
        normal: { fill: '#00FF00' },
        selection: { hatching: { direction: 'right' }, fill: 'black' }
    };
}

function getLegendOptions(options) {
    options = options || {};

    return $.extend(true, {}, {
        visible: true,
        margin: 8,
        markerSize: 14,
        title: {
            margin: {
                top: 0,
                bottom: 0
            }
        },
        font: {
            color: '#7F7F7F',
            family: 'Helvetica',
            size: 14
        },
        border: {
            visible: false,
            width: 1,
            color: 'red'
        },
        position: 'outside',
        paddingLeftRight: 10,
        paddingTopBottom: 10,
        columnItemSpacing: 8,
        rowItemSpacing: 8,
        hoverMode: 'includePoints',
        cutSide: 'vertical'
    }, options);
}

function getLegendData(count) {
    const states = getDefaultStates();
    const array = [];
    let i;

    for(i = 0; i < count; i++) {
        array.push({
            text: i + '',
            id: i,
            argument: 'argument' + i,
            argumentIndex: 'argumentIndex' + i,
            states: states,
            visible: true
        });
    }

    return array;
}

QUnit.module('constructor', environment);

QUnit.test('getOptions', function(assert) {
    this.options.hoverMode = 'customHoverMode';
    const legend = this.createSimpleLegend();

    assert.strictEqual(legend.getOptions().hoverMode, 'customhovermode');
});

QUnit.module('draw legend', environment);

QUnit.test('visible = false', function(assert) {
    this.options.visible = false;
    this.createSimpleLegend();
    assert.ok(!this.renderer.g.called);
});

QUnit.test('Creates correct types of objects for series', function(assert) {
    let marker; let text; let elements;

    this.createAndDrawLegend(200, 200);

    elements = this.getRenderedElements();

    assert.equal(elements.insideLegendGroup.append.firstCall.args[0], this.rootGroup, 'Series groups were added, trackers was added');
    assert.equal(this.renderer.g.callCount, 9, 'renderer must create 6 groups (insideLegendGroup, titleGroup, markersGroup, dataItems group, marker group)');
    assert.equal(elements.insideLegendGroup.children.length, 1, 'insideLegendGroup must contain just markers group');
    assert.equal(elements.insideLegendGroup.children[0].children.length, this.data.length, 'markersGroup must contain all groups with rects and labels');

    for(let i = 0; i < this.data.length; i++) {
        marker = this.renderer.rect.getCall(i).returnValue;
        text = this.renderer.text.getCall(i).returnValue;
        assert.deepEqual(marker.attr.firstCall.args[0], { 'fill': this.data[i].states.normal.fill, opacity: 1 }, 'Rect element not found for series ' + i);

        assert.equal(text.typeOfNode, 'text', 'Text element for series ' + i);
        assert.equal(text.stub('setTitle').callCount, 0, 'Text element for series ' + i);
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

    const itemGroups = this.findMarkersGroup().children;

    for(let i = 0; i < this.data.length; i++) {
        const expectedValue = this.data[i].text + ' ' + this.data[i].states.normal.fill + ' ' + this.data[i].id;
        assert.equal(itemGroups[i].setTitle.firstCall.args[0], expectedValue, 'Text element for series ' + i);
    }
});

QUnit.test('Create legend, hover fill is "none"', function(assert) {
    let states = {
        hover: { hatching: {}, fill: 'none' },
        selection: { hatching: {}, fill: 'black' }
    };
    this.data = [
        {
            text: 'First',
            id: 0,
            states: { hover: states.hover, selection: states.selection, normal: { fill: '#00FF00' } },
            visible: true
        },
        {
            text: 'Second',
            id: 1,
            states: { hover: states.hover, selection: states.selection, normal: { fill: '#99FF99' } },
            visible: true
        },
        {
            text: 'Third',
            id: 2,
            states: { hover: states.hover, selection: states.selection, normal: { fill: 'blue' } },
            visible: true
        }
    ];
    const legend = this.createSimpleLegend();

    legend.draw(200, 200);

    states = $.map(legend._items, function(item) { return item.states; });

    assert.equal(states[0].hover.fill, '#00FF00');
    assert.equal(states[0].selection.fill, 'black');

    assert.equal(states[1].hover.fill, '#99FF99');
    assert.equal(states[1].selection.fill, 'black');

    assert.equal(states[2].hover.fill, 'blue');
    assert.equal(states[2].selection.fill, 'black');
});

QUnit.test('Create legend, textOpacity is "undefined"', function(assert) {
    this.options.font.opacity = 0.5;
    const states = {
        hover: { hatching: {}, fill: 'none' },
        selection: { hatching: {}, fill: 'black' }
    };
    this.data = [
        {
            text: 'First',
            id: 0,
            states: { hover: states.hover, selection: states.selection, normal: { fill: '#00FF00' } },
            textOpacity: undefined,
            visible: true
        }
    ];

    this.createSimpleLegend()
        .draw(200, 200);

    assert.deepEqual(this.renderer.text.lastCall.returnValue.css.lastCall.args[0], {}, 'Label should not have font style');
    assert.equal(this.renderer.g.getCall(1).returnValue.children[0].css.lastCall.args[0].fill, 'rgba(127,127,127,0.5)', 'Label\'s group should have fill with opacity');
});

QUnit.test('Create legend, textOpacity less than font opacity', function(assert) {
    this.options.font.opacity = 0.5;
    const states = {
        hover: { hatching: {}, fill: 'none' },
        selection: { hatching: {}, fill: 'black' }
    };
    this.data = [
        {
            text: 'First',
            id: 0,
            states: { hover: states.hover, selection: states.selection, normal: { fill: '#00FF00' } },
            textOpacity: 0.3,
            visible: true
        }
    ];
    this.createAndDrawLegend();

    assert.equal(this.renderer.text.lastCall.returnValue.css.lastCall.args[0].fill, 'rgba(127,127,127,0.3)', 'Label should be changed');
});

QUnit.test('Create legend, selected fill is "none"', function(assert) {
    let states = {
        hover: { hatching: {}, fill: 'red' },
        selection: { hatching: {}, fill: 'none' }
    };

    this.data = [{
        text: 'First',
        id: 0,
        states: { hover: states.hover, selection: states.selection, normal: { fill: '#00FF00' } },
        visible: true
    }, {
        text: 'Second',
        id: 1,
        states: { hover: states.hover, selection: states.selection, normal: { fill: '#99FF99' } },
        visible: true
    }, {
        text: 'Third',
        id: 2,
        states: { hover: states.hover, selection: states.selection, normal: { fill: 'blue' } },
        visible: true
    }];
    const legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.ok(legend._insideLegendGroup);
    states = $.map(legend._items, function(item) { return item.states; });

    assert.equal(states[0].hover.fill, 'red');
    assert.equal(states[0].selection.fill, '#00FF00');

    assert.equal(states[1].hover.fill, 'red');
    assert.equal(states[1].selection.fill, '#99FF99');

    assert.equal(states[2].hover.fill, 'red');
    assert.equal(states[2].selection.fill, 'blue');
});

QUnit.test('Update', function(assert) {
    let states = getDefaultStates();
    this.data = [{
        text: 'First',
        id: 0,
        states: { hover: states.hover, selection: states.selection, normal: { fill: '#00FF00' } },
        visible: true
    }];
    const legend = this.createSimpleLegend()
        .draw(200, 200)
        .update([{
            text: 'newText',
            id: 0,
            states: {
                hover: { fill: 'green1', hatching: { direction: 'right' } },
                normal: { fill: 'none' },
                selection: { fill: 'blue1', hatching: { direction: 'left' } }
            },
            visible: true
        }], this.options)
        .draw();

    states = $.map(legend._items, function(item) { return item.states; });

    assert.equal(states[0].hover.fill, 'green1');
    assert.deepEqual(states[0].hover.hatching.direction, 'right', 'hover hatching');
    assert.equal(states[0].selection.fill, 'blue1');
    assert.deepEqual(states[0].selection.hatching.direction, 'left');
});

QUnit.test('Draw legend, orientation = "horizontal"', function(assert) {
    this.options.orientation = 'horizontal';
    this.data = [{
        text: 'First',
        id: 0,
        states: getDefaultStates(),
        visible: true
    }];

    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [{
        id: 0,
        marker: {
            fill: '#00FF00',
            width: 14,
            height: 14
        },
        label: {
            text: 'First'
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
    this.data = [{
        text: 'First',
        id: 0, states: getDefaultStates(),
        visible: true
    }];
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [{
        id: 0,
        marker: {
            fill: '#00FF00',
            width: 14,
            height: 14
        },
        label: {
            text: 'First'
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
    this.data = [{
        text: 'First',
        id: 0, states: getDefaultStates(),
        visible: true
    }];
    const legend = this.createSimpleLegend();

    legend.draw(200, 200);

    this.checkItems(assert, [{
        id: 0,
        marker: {
            fill: '#00FF00',
            width: 14,
            height: 14
        },
        label: {
            text: 'First'
        },
        tracker: {
            left: -4,
            top: -4,
            right: 24,
            bottom: 32
        }
    }]);
});

QUnit.test('Clear group if the size is too small. Width', function(assert) {
    this.createSimpleLegend()
        .draw(4, 200);

    assert.ok(this.renderer.g.returnValues[1].dispose.calledOnce);
    assert.ok(this.options._incidentOccurred.calledOnce);
    assert.ok(this.options._incidentOccurred.calledWith('W2104'));
});

QUnit.module('Check items position', environment);

QUnit.test('Vertical orientation', function(assert) {
    this.options.itemTextPosition = 'bottom';
    this.data = this.createData(1);
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } }
    ]);
});

QUnit.test('Vertical orientation. ItemTextPosition = \'top\'', function(assert) {
    this.options.itemTextPosition = 'top';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 14 }, label: { translateX: -1, translateY: -3 } },
        { id: 1, marker: { translateX: 3, translateY: 50 }, label: { translateX: -1, translateY: 33 } },
        { id: 2, marker: { translateX: 3, translateY: 86 }, label: { translateX: -1, translateY: 69 } }
    ]);
});

QUnit.test('Vertical orientation. ItemTextPosition = \'right\'', function(assert) {
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 20, translateY: 21 } },
        { id: 2, marker: { translateX: 0, translateY: 44 }, label: { translateX: 20, translateY: 43 } }
    ]);
});

QUnit.test('Vertical orientation. Two columns', function(assert) {
    this.options.itemTextPosition = 'bottom';
    this.data = this.createData(4);
    this.createSimpleLegend().draw(200, 130);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 3, translateY: 36 }, label: { translateX: -1, translateY: 51 } },
        { id: 2, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 3, marker: { translateX: 31, translateY: 36 }, label: { translateX: 27, translateY: 51 } }
    ]);
});

QUnit.test('Vertical orientation. Two columns. ItemTextPosition = \'right\'', function(assert) {
    this.options.border.visible = true;
    this.createSimpleLegend().draw(200, 91);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 20, translateY: 21 } },
        { id: 2, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } }
    ]);
});

QUnit.test('Vertical orientation. Three columns', function(assert) {
    this.options.itemTextPosition = 'bottom';
    this.createSimpleLegend().draw(200, 70);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 59, translateY: 0 }, label: { translateX: 55, translateY: 15 } }
    ]);
});

QUnit.test('Horizontal orientation', function(assert) {
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = 'right';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } },
        { id: 2, marker: { translateX: 98, translateY: 0 }, label: { translateX: 118, translateY: -1 } }
    ]);
});

QUnit.test('Horizontal orientation. itemTextPosition = \'top\'', function(assert) {
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = 'top';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 14 }, label: { translateX: -1, translateY: -3 } },
        { id: 1, marker: { translateX: 31, translateY: 14 }, label: { translateX: 27, translateY: -3 } },
        { id: 2, marker: { translateX: 59, translateY: 14 }, label: { translateX: 55, translateY: -3 } }
    ]);
});

QUnit.test('Horizontal orientation. two rows', function(assert) {
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = 'top';
    this.createSimpleLegend().draw(91, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 14 }, label: { translateX: -1, translateY: -3 } },
        { id: 1, marker: { translateX: 31, translateY: 14 }, label: { translateX: 27, translateY: -3 } },
        { id: 2, marker: { translateX: 3, translateY: 50 }, label: { translateX: -1, translateY: 33 } }
    ]);
});

QUnit.test('Horizontal orientation. itemTextPosition = \'left\'', function(assert) {
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = 'left';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 27, translateY: 0 }, label: { translateX: -1, translateY: -1 } },
        { id: 1, marker: { translateX: 76, translateY: 0 }, label: { translateX: 48, translateY: -1 } },
        { id: 2, marker: { translateX: 125, translateY: 0 }, label: { translateX: 97, translateY: -1 } }
    ]);
});

QUnit.test('rowCount options', function(assert) {
    this.options.rowCount = 1;
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } },
        { id: 2, marker: { translateX: 98, translateY: 0 }, label: { translateX: 118, translateY: -1 } }
    ]);
});

QUnit.test('columnCount options. vertical orientation', function(assert) {
    this.options.columnCount = 3;
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } },
        { id: 2, marker: { translateX: 98, translateY: 0 }, label: { translateX: 118, translateY: -1 } }
    ]);
});

QUnit.test('Horizontal orientation. bottom', function(assert) {
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 59, translateY: 0 }, label: { translateX: 55, translateY: 15 } }
    ]);
});

QUnit.test('columnCount options', function(assert) {
    this.options.columnCount = 1;
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 3, translateY: 36 }, label: { translateX: -1, translateY: 51 } },
        { id: 2, marker: { translateX: 3, translateY: 72 }, label: { translateX: -1, translateY: 87 } }
    ]);
});

QUnit.test('rowCount options. horizontal orientation', function(assert) {
    this.options.rowCount = 3;
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 3, translateY: 36 }, label: { translateX: -1, translateY: 51 } },
        { id: 2, marker: { translateX: 3, translateY: 72 }, label: { translateX: -1, translateY: 87 } }
    ]);
});

QUnit.test('columnItemSpacing options', function(assert) {
    this.options.orientation = 'horizontal';
    this.options.columnItemSpacing = 10;
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 33, translateY: 0 }, label: { translateX: 29, translateY: 15 } },
        { id: 2, marker: { translateX: 63, translateY: 0 }, label: { translateX: 59, translateY: 15 } }
    ]);
});

QUnit.test('rowItemSpacing options', function(assert) {
    this.options.rowItemSpacing = 10;
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 24 }, label: { translateX: 20, translateY: 23 } },
        { id: 2, marker: { translateX: 0, translateY: 48 }, label: { translateX: 20, translateY: 47 } }
    ]);
});

QUnit.test('paddingLeftRight options', function(assert) {
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

QUnit.test('paddingTopBottom options', function(assert) {
    this.options.border.visible = true;
    this.options.paddingTopBottom = 20;
    this.createSimpleLegend().draw(200, 101);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 20, translateY: 21 } },
        { id: 2, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } }
    ]);
});

QUnit.test('T405783, border is visible', function(assert) {
    this.options.border.visible = true;
    this.options.columnCount = 2;
    this.createSimpleLegend().draw(200, 56);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } },
        { id: 2, marker: { translateX: 98, translateY: 0 }, label: { translateX: 118, translateY: -1 } }
    ]);
});

QUnit.test('T405783, border is not visible', function(assert) {
    this.options.border.visible = false;
    this.options.columnCount = 2;
    this.createSimpleLegend().draw(200, 72);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 20, translateY: 21 } },
        { id: 2, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } }
    ]);
});

QUnit.test('itemsAlignment options. Center. items in one line.', function(assert) {
    this.options.itemsAlignment = 'center';
    this.options.columnCount = 2;
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = 'right';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 49, translateY: 0 }, label: { translateX: 69, translateY: -1 } },
        { id: 2, marker: { translateX: 25, translateY: 22 }, label: { translateX: 45, translateY: 21 } }
    ]);
});

QUnit.test('itemsAlignment options. Left', function(assert) {
    this.options.itemsAlignment = 'left';
    this.options.columnCount = 2;
    this.options.orientation = 'horizontal';

    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 3, translateY: 36 }, label: { translateX: -1, translateY: 51 } }
    ]);
});

QUnit.test('itemsAlignment options. Center', function(assert) {
    this.options.itemsAlignment = 'center';
    this.options.columnCount = 2;
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 17, translateY: 36 }, label: { translateX: 13, translateY: 51 } }
    ]);
});

QUnit.test('itemsAlignment options. Right', function(assert) {
    this.options.itemsAlignment = 'right';
    this.options.columnCount = 2;
    this.options.orientation = 'horizontal';
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 3, translateY: 0 }, label: { translateX: -1, translateY: 15 } },
        { id: 1, marker: { translateX: 31, translateY: 0 }, label: { translateX: 27, translateY: 15 } },
        { id: 2, marker: { translateX: 31, translateY: 36 }, label: { translateX: 27, translateY: 51 } }
    ]);
});

QUnit.test('Vertical orientation. Transform must be rounded', function(assert) {
    this.data[2].size = 13;
    this.markerBBoxes = [{ x: 5, y: 3, width: 13, height: 13 }, defaultMarkerBBox, defaultMarkerBBox];
    this.createSimpleLegend().draw(200, 200);

    this.checkItems(assert, [
        { id: 0, marker: { translateX: 0, translateY: 0 }, label: { translateX: 20, translateY: -1 } },
        { id: 1, marker: { translateX: 0, translateY: 22 }, label: { translateX: 20, translateY: 21 } },
        { id: 2, marker: { translateX: 1 - 5, translateY: 44 - 3 }, label: { translateX: 20, translateY: 43 } }
    ]);
});

QUnit.test('item size > legend canvas', function(assert) {
    assert.expect(0);

    this.createSimpleLegend().draw(10, 10);
});

QUnit.module('Label align', environment);

QUnit.test('text align. right', function(assert) {
    this.options.cssClass = 'legend_class';
    this.createSimpleLegend().draw(200, 200);
    this.checkItems(assert, [
        { id: 0, label: { align: 'left', 'class': 'legend_class' } },
        { id: 0, label: { align: 'left', 'class': 'legend_class' } },
        { id: 0, label: { align: 'left', 'class': 'legend_class' } }
    ]);
});

QUnit.test('text align. left', function(assert) {
    this.options.itemTextPosition = 'left';
    this.createSimpleLegend().draw(200, 200);
    this.checkItems(assert, [
        { id: 0, label: { align: 'right' } },
        { id: 0, label: { align: 'right' } },
        { id: 0, label: { align: 'right' } }
    ]);
});

QUnit.test('text align. top', function(assert) {
    this.options.itemTextPosition = 'top';
    this.createSimpleLegend().draw(200, 200);
    this.checkItems(assert, [
        { id: 0, label: { align: 'center' } },
        { id: 0, label: { align: 'center' } },
        { id: 0, label: { align: 'center' } }
    ]);
});

QUnit.test('text align. bottom', function(assert) {
    this.options.itemTextPosition = 'bottom';
    this.createSimpleLegend().draw(200, 200);
    this.checkItems(assert, [
        { id: 0, label: { align: 'center' } },
        { id: 0, label: { align: 'center' } },
        { id: 0, label: { align: 'center' } }
    ]);
});

QUnit.test('bottom', function(assert) {
    this.options.orientation = 'horizontal';
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

QUnit.test('top', function(assert) {
    this.options.orientation = 'horizontal';
    this.options.itemTextPosition = 'top';
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

QUnit.test('left', function(assert) {
    this.options.itemTextPosition = 'left';
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

QUnit.test('right', function(assert) {
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
    const legend = this.createSimpleLegend().draw(200, 200);
    legend._options.visible = false;
    legend.draw();

    legend._options.visible = true;
    legend.draw();

    const trackers = $.map(legend._items, function(item) {
        return item.tracker;
    });

    assert.deepEqual(trackers, [{
        'bottom': 18,
        'id': 0,
        'left': -4,
        'right': 45,
        'top': -4,
        'argument': undefined,
        'argumentIndex': undefined
    },
    {
        'bottom': 40,
        'id': 1,
        'left': -4,
        'right': 45,
        'top': 18,
        'argument': undefined,
        'argumentIndex': undefined
    },
    {
        'bottom': 62,
        'id': 2,
        'left': -4,
        'right': 45,
        'top': 40,
        'argument': undefined,
        'argumentIndex': undefined
    }]);
});

QUnit.test('Default label format', function(assert) {
    this.nameField = 'seriesName';
    const legend = this.createSimpleLegend();

    const formatResult = legend._options.customizeText.call({ seriesName: 'test name' }, { seriesName: 'test name' });

    assert.equal(formatResult, 'test name');
});

QUnit.test('Custom label format', function(assert) {
    this.options.customizeText = function() { return this.text + ' ' + this.itemIndex; };
    const legend = this.createSimpleLegend();

    const formatResult = legend._options.customizeText.call({ text: 'test name', itemIndex: 1 }, { text: 'test name', itemIndex: 1 });

    assert.equal(formatResult, 'test name 1');
});

QUnit.test('Custom label title format', function(assert) {
    this.options.customizeHint = function() { return this.text + ' ' + this.itemIndex; };
    const legend = this.createSimpleLegend();

    const formatResult = legend._options.customizeHint.call({ text: 'test name', itemIndex: 1 }, { text: 'test name', itemIndex: 1 });

    assert.equal(formatResult, 'test name 1');
});

QUnit.test('Draw legend with custom format label', function(assert) {
    this.data = [{
        text: 'First',
        id: 0, states: $.extend(true, getDefaultStates(), {
            normal: { fill: 'red' }
        }),
        visible: true
    }];
    this.options.customizeText = function() { return this.seriesName + ':' + this.seriesIndex + ':' + this.seriesColor; };
    this.nameField = 'seriesName';
    this.indexField = 'seriesIndex';
    this.colorField = 'seriesColor';
    const legend = this.createSimpleLegend();

    legend.draw(200, 200);

    this.checkItems(assert, [{
        id: 0, label: { text: 'First:0:red', x: 0, y: 0 }
    }]);
});

QUnit.test('Border is not drawn, position = "inside", backgroundColor is not specify', function(assert) {
    const options = {
        containerBackgroundColor: '#ffffff',
        position: 'inside'
    };
    const legendData = [{
        text: 'First', id: 0,
        states: getDefaultStates(),
        visible: true
    }];
    this.data = legendData;
    this.options = getLegendOptions(options);
    const legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.ok(legend._insideLegendGroup);

    assert.equal(legend._legendGroup.children.length, 1, 'inside group created, trackers was added');
    assert.equal(legend._markersGroup.children.length, legendData.length, 'Series groups were added');
    assert.equal(legend._insideLegendGroup.children[0].attr.firstCall.args[0].fill, '#ffffff', 'background color is white');
});

QUnit.test('Border is not drawn, backgroundColor is specify', function(assert) {
    const options = {
        containerBackgroundColor: '#ffffff',
        backgroundColor: '#123456'
    };
    const legendData = [{
        text: 'First',
        id: 0, states: getDefaultStates(),
        visible: true
    }];
    this.data = legendData;
    this.options = getLegendOptions(options);
    const legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.ok(legend._insideLegendGroup);
    assert.equal(legend._legendGroup.children.length, 1, 'inside group created');
    assert.equal(legend._markersGroup.children.length, legendData.length, 'Series groups were added');
    assert.equal(legend._insideLegendGroup.children[0].attr.firstCall.args[0].fill, '#123456', 'background color is specify');
});

QUnit.test('Border is drawn', function(assert) {
    const options = {
        border: {
            visible: true,
            width: 1,
            color: 'black',
            dashStyle: 'dot'
        }
    };
    const legendData = [{
        text: 'First',
        id: 0,
        states: getDefaultStates(),
        visible: true
    }];
    this.data = legendData;
    this.options = getLegendOptions(options);
    const legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.ok(legend._insideLegendGroup);
    assert.equal(legend._legendGroup.children.length, 1, 'inside group created, trackers was added');
    assert.equal(legend._insideLegendGroup.children.length, 2, 'legend group must contain markers group and border group');
    assert.equal(legend._markersGroup.children.length, legendData.length, 'Series groups were added');

    const borderGroup = legend._insideLegendGroup.children[0];
    assert.equal(borderGroup.attr.firstCall.args[0].fill, 'none');
    assert.equal(borderGroup.attr.firstCall.args[0]['class'], 'dxc-border');
    assert.equal(borderGroup._stored_settings['stroke-width'], 1);
    assert.equal(borderGroup._stored_settings.stroke, 'black');
    assert.equal(borderGroup._stored_settings.dashStyle, 'dot');
});

QUnit.test('Border is drawn, position = "inside"', function(assert) {
    const options = {
        containerBackgroundColor: '#ffffff',
        border: {
            visible: true,
            width: 1,
            color: 'black',
            dashStyle: 'dot'
        },
        position: 'inside'
    };
    const legendData = [{
        text: 'First',
        id: 0,
        states: getDefaultStates(),
        visible: true
    }];
    this.data = legendData;
    this.options = getLegendOptions(options);
    const legend = this.createSimpleLegend();

    legend.draw(200, 200);

    assert.ok(legend._insideLegendGroup);
    assert.equal(legend._legendGroup.children.length, 1, 'inside group created, trackers was added');
    assert.equal(legend._insideLegendGroup.children.length, 2, 'legend group must contain markers group and border group');
    assert.equal(legend._markersGroup.children.length, legendData.length, 'Series groups were added');

    const borderGroup = legend._insideLegendGroup.children[0];
    assert.equal(borderGroup.attr.firstCall.args[0].fill, '#ffffff');
    assert.equal(borderGroup.attr.firstCall.args[0]['class'], 'dxc-border');
    assert.equal(borderGroup._stored_settings['stroke-width'], 1);
    assert.equal(borderGroup._stored_settings.stroke, 'black');
    assert.equal(borderGroup._stored_settings.dashStyle, 'dot');
});

QUnit.test('Draw background rect.Legend with border', function(assert) {
    const states = getDefaultStates();
    const options = {
        border: {
            visible: true,
            color: 'green',
            width: 1,
            dashStyle: 'dash',
            opacity: 0.5
        },
        paddingLeftRight: 5,
        paddingTopBottom: 10
    };
    const legendMockBBox = { width: 120, height: 40, x: 30, y: 50 };
    this.data = [{
        text: 'first item',
        id: 0,
        states: states,
        visible: true
    }, {
        text: 'second item',
        id: 1,
        states: states,
        visible: true
    }, {
        text: 'third item',
        id: 2,
        states: states,
        visible: true
    }];
    this.options = getLegendOptions(options);
    const legend = this.createSimpleLegend();

    legend._legendGroup.stub('getBBox') && (legend._legendGroup.getBBox = function() { return legendMockBBox; });

    legend.draw(200, 200);

    const borderRect = legend._insideLegendGroup.children[0];

    assert.deepEqual(borderRect._stored_settings, {
        'class': 'dxc-border',
        'fill': 'none',
        x: -4,
        y: -7,
        width: 20 + 2 * options.paddingLeftRight,
        height: 10 + 2 * options.paddingTopBottom,
        'stroke-width': options.border.width,
        stroke: options.border.color,
        'stroke-opacity': options.border.opacity,
        dashStyle: options.border.dashStyle,
        rx: 0,
        ry: 0,
        opacity: undefined
    });
});

QUnit.test('Draw background rect.Legend without border', function(assert) {
    const states = getDefaultStates();
    const options = {
        backgroundColor: 'red',
        border: {
            visible: false,
            color: 'green',
            width: 1,
            dashStyle: 'dash',
            opacity: 0.5
        },
        paddingLeftRight: 5,
        paddingTopBottom: 10
    };
    const mockBBox = { width: 120, height: 40, x: 30, y: 50 };
    this.data = [{
        text: 'first item',
        id: 0,
        states: states,
        visible: true
    }, {
        text: 'second item',
        id: 1,
        states: states,
        visible: true
    }, {
        text: 'third item',
        id: 2,
        states: states,
        visible: true
    }];
    this.options = getLegendOptions(options);
    const legend = this.createSimpleLegend();

    legend._legendGroup.stub('getBBox') && (legend._legendGroup.getBBox = function() { return mockBBox; });

    legend.draw(200, 200);

    const borderRect = legend._insideLegendGroup.children[0];

    assert.deepEqual(borderRect._stored_settings, {
        'class': 'dxc-border',
        'fill': 'red',
        x: -4,
        y: -7,
        width: 20 + 2 * options.paddingLeftRight,
        height: 10 + 2 * options.paddingTopBottom,
        opacity: undefined
    });
});

QUnit.test('Legend with incorrect margin number', function(assert) {
    this.options.margin = -20;
    const legend = this.createSimpleLegend();

    assert.deepEqual(legend._options.margin, { left: 10, right: 10, top: 10, bottom: 10 }, 'Margin should have default margin');
});

QUnit.test('Legend with incorrect margin number - string', function(assert) {
    this.options.margin = 'bad';
    const legend = this.createSimpleLegend();

    assert.deepEqual(legend._options.margin, { left: 10, right: 10, top: 10, bottom: 10 }, 'Margin should have default margin');
});

QUnit.test('Legend with incorrect margin number - string number', function(assert) {
    this.options = getLegendOptions({ margin: '5' });
    const legend = this.createSimpleLegend();

    assert.deepEqual(legend._options.margin, { left: 5, right: 5, top: 5, bottom: 5 }, 'Margin should have default margin');
});

QUnit.test('Legend with incorrect margin number - null', function(assert) {
    this.options = getLegendOptions({ margin: null });
    const legend = this.createSimpleLegend();

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
    const legend = this.createSimpleLegend();

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
    const legend = this.createSimpleLegend();

    assert.deepEqual(legend._options.margin, { left: 3, right: 4, top: 1, bottom: 2 }, 'Margin should have default margin');
});

QUnit.test('Mapping indexes', function(assert) {
    const states = getDefaultStates();
    this.data = [{
        text: 'first item',
        id: 11,
        states: states,
        visible: true
    }, {
        text: 'second item',
        id: 4,
        states: states,
        visible: true
    }, {
        text: 'third item',
        id: 7,
        states: states,
        visible: true
    }];


    const legend = this.createSimpleLegend();

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

    const legend = this.createSimpleLegend();

    legend.draw(200, 200);
    legend.shift(10, 15);

    assert.ok(legend._insideLegendGroup.attr.calledOnce);
    assert.deepEqual(legend._insideLegendGroup.attr.firstCall.args[0], { translateX: 17, translateY: 20 });
});

QUnit.test('coordsIn', function(assert) {
    this.renderer.bBoxTemplate = { x: 10, y: 15, height: 30, width: 20 };
    this.data = getLegendData(3);

    const legend = this.createSimpleLegend();

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
    const legend = this.createSimpleLegend()
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
QUnit.test('coordsIn after update without data', function(assert) {
    // arrange
    const legend = this.createSimpleLegend();
    const legendSize = { width: 200, height: 200, top: 0, bottom: 0, left: 0, right: 0 };

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
    const legend = this.createSimpleLegend()
        .draw(200, 200)
        .shift(10, 15);
    const element1 = {
        bottom: 18,
        id: 0,
        left: -4,
        right: 45,
        top: -4,
        argument: 'argument0',
        argumentIndex: 'argumentIndex0'
    };
    const element2 = {
        bottom: 40,
        id: 1,
        left: -4,
        right: 45,
        top: 18,
        argument: 'argument1',
        argumentIndex: 'argumentIndex1'
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
    const states = getDefaultStates();
    this.data = [{
        text: 'text_0',
        id: 0,
        states: $.extend(true, {}, states, { normal: { fill: 'color_0', opacity: 0.1 } }),
        visible: true
    }, {
        text: 'text_1',
        id: 1,
        states: $.extend(true, {}, states, { normal: { fill: 'color_1' } }),
        visible: true
    }, {
        text: 'text_2',
        id: 2,
        states: $.extend(true, {}, states, { normal: { fill: 'color_2', opacity: 0.2 } }),
        visible: true
    }];
    this.createSimpleLegend()
        .draw(200, 200);

    assert.deepEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: 'color_0', opacity: 0.1 });
    assert.deepEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: 'color_1', opacity: 1 });
    assert.deepEqual(this.renderer.rect.getCall(2).returnValue.attr.getCall(0).args[0], { fill: 'color_2', opacity: 0.2 });
});

QUnit.test('Pass color & opacity to markers on update', function(assert) {
    const states = getDefaultStates();
    const legendData = [{
        text: 'text_0',
        id: 0,
        states: $.extend(true, {}, states, { normal: { opacity: 0.1, fill: 'color_0' } }),
        visible: true
    }];
    const legend = this.createSimpleLegend(legendData);

    legend.draw(200, 200);

    legend.update([{
        text: 'text_0',
        id: 0,
        states: $.extend(true, {}, states, { normal: { opacity: 0.5, fill: 'new_color_0' } }),
        visible: true
    }], getLegendOptions());

    legend.draw();

    assert.deepEqual(this.renderer.rect.lastCall.returnValue.attr.getCall(0).args[0], { fill: 'new_color_0', opacity: 0.5 });
});

QUnit.module('getLayoutOptions', environment);

QUnit.test('Without draw. vertical position', function(assert) {
    assert.deepEqual(this.createSimpleLegend().getLayoutOptions(), {
        cutLayoutSide: 'right',
        height: 0,
        cutSide: 'horizontal',
        position: {
            horizontal: 'right',
            vertical: 'top'
        },
        horizontalAlignment: 'right',
        verticalAlignment: 'top',
        width: 0,
        x: 0,
        y: 0
    });
});

QUnit.test('Without draw. horizontal position', function(assert) {
    this.options.orientation = 'horizontal';
    assert.deepEqual(this.createSimpleLegend().getLayoutOptions(), {
        cutLayoutSide: 'top',
        height: 0,
        cutSide: 'vertical',
        position: {
            horizontal: 'right',
            vertical: 'top'
        },
        horizontalAlignment: 'right',
        verticalAlignment: 'top',
        width: 0,
        x: 0,
        y: 0
    });
});

QUnit.test('T121386. getLayoutOptions cutLayoutOptions when horizontal alignment === center and vertical alignment === top', function(assert) {
    this.options = getLegendOptions({
        orientation: 'vertical',
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
    });

    assert.deepEqual(this.createSimpleLegend().getLayoutOptions(), {
        cutLayoutSide: 'top',
        height: 0,
        cutSide: 'vertical',
        position: {
            horizontal: 'center',
            vertical: 'top'
        },
        horizontalAlignment: 'center',
        verticalAlignment: 'top',
        width: 0,
        x: 0,
        y: 0
    });
});

QUnit.test('After draw', function(assert) {
    assert.deepEqual(this.createSimpleLegend().draw(200, 200).getLayoutOptions(), {
        width: 20 + this.options.margin.left + this.options.margin.right,
        height: 10 + this.options.margin.top + this.options.margin.bottom,
        widthWithoutMargins: 20,
        x: -7,
        y: -5,
        horizontalAlignment: 'right',
        verticalAlignment: 'top',
        cutSide: 'horizontal',
        position: {
            horizontal: 'right',
            vertical: 'top'
        },
        cutLayoutSide: 'right'
    });
});

QUnit.test('After draw. horizontalAlignment = "center"', function(assert) {
    this.options.horizontalAlignment = 'center';

    assert.deepEqual(this.createSimpleLegend().draw(200, 200).getLayoutOptions(), {
        height: 26,
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom',
        width: 36,
        widthWithoutMargins: 20,
        cutSide: 'vertical',
        position: {
            horizontal: 'center',
            vertical: 'bottom'
        },
        cutLayoutSide: 'bottom',
        x: -7,
        y: -5
    });
});

QUnit.test('layoutOptions', function(assert) {
    const options = this.createSimpleLegend().layoutOptions();

    assert.equal(options.horizontalAlignment, 'right');
    assert.equal(options.verticalAlignment, 'top');
    assert.equal(options.side, 'horizontal');
    assert.equal(options.priority, 1);
});

QUnit.test('layoutOptions is null if legend is not visible', function(assert) {
    this.options.visible = false;
    const options = this.createSimpleLegend().layoutOptions();

    assert.strictEqual(options, null);
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(this.createSimpleLegend().measure(100, 200), [36, 26]);
});

QUnit.test('move', function(assert) {
    this.createAndDrawLegend().move([10, 15]);

    assert.deepEqual(this.renderer.g.returnValues[1].attr.args[0][0], { translateX: 17, translateY: 20 });
});

QUnit.test('free space', function(assert) {
    const legend = this.createSimpleLegend();
    legend.measure(100, 200);

    legend.freeSpace();

    assert.ok(this.renderer.g.returnValues[1].dispose.calledOnce);
    assert.ok(this.options._incidentOccurred.calledOnce);
    assert.ok(this.options._incidentOccurred.calledWith('W2104'));
});

QUnit.module('Legend Options', environment);

QUnit.test('Default center for not-set align', function(assert) {
    this.options = getLegendOptions({ horizontalAlignment: 'center' });

    const legend = this.createSimpleLegend();

    assert.equal(legend._options.orientation, 'horizontal');
});

QUnit.test('Default vertical for right align', function(assert) {
    const legend = this.createSimpleLegend();

    assert.equal(legend._options.orientation, 'vertical');
});

QUnit.test('Default vertical for left align', function(assert) {
    const legend = this.createSimpleLegend();

    assert.equal(legend._options.orientation, 'vertical');
});

QUnit.test('horizontalAlignment specified incorrectly', function(assert) {
    const legend = this.createSimpleLegend();

    assert.equal(legend._options.horizontalAlignment, 'right');
});


QUnit.module('Life cycle', $.extend({}, environment, {
    beforeEach: function() {
        this.legend = this.createSimpleLegend()
            .draw(200, 200);
    }
}));

QUnit.test('Disposing', function(assert) {
    const legend = this.legend;

    legend.dispose();

    assert.strictEqual(legend._items, null);
    assert.strictEqual(legend._insideLegendGroup, null);
    assert.strictEqual(legend._legendGroup, null);
    assert.strictEqual(legend._renderer, null);
    assert.strictEqual(legend._options, null);
    assert.strictEqual(legend._data, null);
});

QUnit.module('States', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        const states = getDefaultStates();

        this.renderer.stub('lockHatching').returns('DevExpress');

        this.data = [{
            text: 'first item',
            id: 0,
            states: states,
            visible: true
        }, {
            text: 'second item',
            id: 1,
            states: states,
            visible: true
        }];
        this.legend = this.createSimpleLegend()
            .draw(200, 200);
    }
}));

QUnit.test('Change state - leads to redraw marker', function(assert) {
    const markersGroup = this.findMarkersGroup();

    markersGroup.children[0].children[0].stub('clear').reset();
    this.renderer.rect.reset();
    this.renderer.text.reset();

    this.legend.applyHover(0);

    assert.equal(markersGroup.children[0].children[0].clear.callCount, 1);
    assert.equal(markersGroup.children[1].stub('clear').callCount, 0);

    assert.equal(this.renderer.rect.callCount, 1);
    const marker = this.renderer.rect.lastCall.returnValue;
    assert.equal(marker.append.lastCall.args[0].element, markersGroup.children[0].children[0].element);
    assert.deepEqual(marker._stored_settings, {
        fill: 'url(#DevExpress)',
        height: 14,
        opacity: 1,
        width: 14,
        x: 0,
        y: 0
    }, 'second marker settings are not changed');

    assert.equal(this.renderer.text.callCount, 0);
});

QUnit.test('applyHover', function(assert) {
    this.legend.applyHover(0);

    assert.equal(this.renderer.rect.lastCall.returnValue._stored_settings.fill, 'url(#DevExpress)');
    assert.deepEqual(this.renderer.lockHatching.lastCall.args[0], 'blue');
    assert.deepEqual(this.renderer.lockHatching.lastCall.args[1], {
        'direction': 'right',
        'step': 5,
        'width': 2
    });
});

QUnit.test('do not wrap fill to url if not pattern', function(assert) {
    this.renderer.lockHatching.returns('red');
    this.legend.applyHover(0);

    assert.equal(this.renderer.rect.lastCall.returnValue._stored_settings.fill, 'red');
});

QUnit.test('applySelected', function(assert) {
    this.legend.applySelected(0);

    assert.equal(this.renderer.rect.lastCall.returnValue._stored_settings.fill, 'url(#DevExpress)');
    assert.equal(this.renderer.lockHatching.lastCall.args[0], 'black');
});

QUnit.test('resetItem', function(assert) {
    this.legend.resetItem(0);

    assert.equal(this.renderer.rect.lastCall.returnValue._stored_settings.fill, '#00FF00');
});

QUnit.test('applyHover from invisible series', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub('smartAttr').reset();
    this.renderer.rect.getCall(1).returnValue.stub('smartAttr').reset();
    this.legend.applyHover(4);

    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.stub('smartAttr').callCount, 0);
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub('smartAttr').callCount, 0);
});

QUnit.test('applySelected from invisible series', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub('smartAttr').reset();
    this.renderer.rect.getCall(1).returnValue.stub('smartAttr').reset();
    this.legend.applySelected(4);

    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.stub('smartAttr').callCount, 0);
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub('smartAttr').callCount, 0);
});

QUnit.test('resetItem from invisible series', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub('smartAttr').reset();
    this.renderer.rect.getCall(1).returnValue.stub('smartAttr').reset();
    this.legend.resetItem(4);

    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.stub('smartAttr').callCount, 0);
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub('smartAttr').callCount, 0);
});

QUnit.test('resetItem from invisible series', function(assert) {
    this.renderer.rect.getCall(0).returnValue.stub('smartAttr').reset();
    this.renderer.rect.getCall(1).returnValue.stub('smartAttr').reset();
    this.legend.resetItem(4);

    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.stub('smartAttr').callCount, 0);
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.stub('smartAttr').callCount, 0);
});

// T164539
QUnit.module('legend without data', $.extend({}, environment, {
    beforeEach: function() {
        this.legend = this.createSimpleLegend().draw(200, 200);
    },
    afterEach: noop
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

    assert.deepEqual(this.renderer.g.getCall(1).returnValue.append.lastCall.args, [this.rootGroup], 'group is appended');
});

QUnit.test('Erasing', function(assert) {
    this.createAndDrawLegend().erase();

    assert.deepEqual(this.renderer.g.getCall(1).returnValue.remove.lastCall.args, [], 'group is removed');
});

// T808328
QUnit.test('Erase legend on update options', function(assert) {
    this.createAndDrawLegend();
    this.options.title = {
        text: 'title'
    };
    const titleGroup = this.renderer.g.firstCall.returnValue;
    titleGroup.linkRemove.reset();
    this.legend.update([]);

    assert.deepEqual(this.renderer.g.getCall(1).returnValue.remove.lastCall.args, [], 'group is removed');
    assert.ok(this.renderer.g.getCall(1).returnValue.remove.lastCall.calledAfter(titleGroup.linkRemove.lastCall), 'group is removed');
});

QUnit.test('Check groups order', function(assert) {
    this.options.title = {
        text: 'title'
    };
    this.options.border.visible = true;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    const titleGroup = this.renderer.g.firstCall.returnValue;
    const markersGroup = this.findMarkersGroup();
    const rect = this.renderer.rect.firstCall.returnValue;

    assert.ok(rect.append.calledBefore(markersGroup.append));
    assert.ok(rect.append.calledBefore(titleGroup.linkAppend));
    assert.ok(titleGroup.linkAppend.calledBefore(markersGroup.append));
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

    const createMarker = this.createMarker;
    const markersGroup = this.findMarkersGroup();

    this.data.forEach((_, i) => {
        assert.equal(createMarker.getCall(i).returnValue.append.lastCall.args[0].element, markersGroup.children[i].children[0].element, String(i));
    });
});

QUnit.test('Colors', function(assert) {
    this.createAndDrawLegend();

    const createMarker = this.createMarker;
    $.each(this.data, function(i, data) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.getCall(0).args, [{ fill: data.states.normal.fill, opacity: 1 }], String(i));
    });
});

QUnit.test('Common color', function(assert) {
    $.each(this.data, function(_, item) {
        item.states.normal.fill = null;
    });
    this.options.markerColor = 'common-color';
    this.createAndDrawLegend();

    const createMarker = this.createMarker;
    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.getCall(0).args, [{ fill: 'common-color', opacity: 1 }], String(i));
    });
});

QUnit.test('No state color, no marker color - use default color', function(assert) {
    $.each(this.data, function(_, item) {
        item.states.normal.fill = null;
    });
    this.options.defaultColor = 'default-color';
    this.createAndDrawLegend();

    const createMarker = this.createMarker;
    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.getCall(0).args, [{ fill: 'default-color', opacity: 1 }], String(i));
    });
});

QUnit.test('Sizes', function(assert) {
    this.options.markerSize = 8;
    this.createAndDrawLegend();

    const renderer = this.renderer;
    const createMarker = this.createMarker;
    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).args, [renderer, 8], String(i));
    });
});

QUnit.test('Partial sizes', function(assert) {
    const that = this;
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

    const createMarker = this.createMarker;
    $.each(this.data.reverse(), function(i, data) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.getCall(0).args, [{ fill: data.states.normal.fill, opacity: 1 }], String(i));
    });
});

QUnit.test('Customize order using customizeItems', function(assert) {
    this.options.customizeItems = function(i) {
        return i.reverse();
    };
    this.createAndDrawLegend();

    const createMarker = this.createMarker;
    $.each(this.data.reverse(), function(i, data) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.getCall(0).args, [{ fill: data.states.normal.fill, opacity: 1 }], String(i));
    });
});

QUnit.test('Process items return nothing - get original items', function(assert) {
    this.options.customizeItems = noop;
    this.createAndDrawLegend();

    const createMarker = this.createMarker;
    $.each(this.data, function(i, data) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.getCall(0).args, [{ fill: data.states.normal.fill, opacity: 1 }], String(i));
    });
});

QUnit.test('Do not render hidden items', function(assert) {
    this.data[1].visible = false;
    this.createAndDrawLegend();

    const createMarker = this.createMarker;

    assert.equal(createMarker.callCount, this.data.length - 1);
});

QUnit.test('Can hide all items', function(assert) {
    this.data = this.data.map(i => {
        i.visible = false;
        return i;
    });
    this.createAndDrawLegend();

    const createMarker = this.createMarker;

    assert.equal(createMarker.callCount, 0);
});

QUnit.test('markers centering(partial markers sizes).', function(assert) {
    let createMarker;

    this.options.itemTextPosition = 'right';
    $.each(this.data, function(i, data) {
        data.size = i + 4;
    });
    this.createAndDrawLegend();

    createMarker = this.createMarker;

    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.lastCall.args, [{ fill: 'color-' + (1 + i), opacity: 1 }]);
        assert.deepEqual(createMarker.getCall(i).args[1], i + 4, 'marker size');
    });
});

QUnit.test('markers centering(partial markers sizes). markerShape = circle', function(assert) {
    let createMarker;

    this.options.itemTextPosition = 'right';
    this.options.markerShape = 'circle';
    $.each(this.data, function(i, data) {
        data.size = i + 4;
    });
    this.createAndDrawLegend();

    createMarker = this.createMarker;
    $.each(this.data, function(i) {
        assert.deepEqual(createMarker.getCall(i).returnValue.attr.lastCall.args, [{ fill: 'color-' + (1 + i), opacity: 1 }]);
        assert.deepEqual(createMarker.getCall(i).args[1], i + 4, 'marker size');
    });
});

QUnit.module('probeDraw', environment);

QUnit.test('probeDraw', function(assert) {
    const legend = this.createSimpleLegend();
    legend.draw = sinon.stub();
    legend.probeDraw();
    assert.ok(legend.draw.calledOnce);
});

QUnit.module('getActionCallback', environment);

QUnit.test('applying some action', function(assert) {
    const legend = this.createSimpleLegend();
    legend.draw = sinon.stub();
    legend.applyAction = sinon.stub();
    legend.getActionCallback({ index: 1 })('applyAction');

    assert.ok(legend.applyAction.called);
    assert.strictEqual(legend.applyAction.args[0][0], 1);
});

QUnit.test('legend is not visible', function(assert) {
    this.options.visible = false;
    const legend = this.createSimpleLegend();

    legend.applyAction = sinon.stub();
    legend.getActionCallback({ index: 1 })('applyAction');

    assert.ok(!legend.applyAction.called);
});

const titleEnvironment = $.extend({}, environment, {
    beforeEach: function() {
        const that = this;
        environment.beforeEach.apply(that, arguments);

        const titleConstructor = module.Title;

        that.titleLayout = { height: 17, width: 20, x: 4, y: 5 };
        module.Title = function(params) {
            that.title = new titleConstructor(params);

            that.title.getLayoutOptions = sinon.stub();
            that.title.getLayoutOptions.returns((function() {
                if(that.options.title) {
                    const margin = that.options.title.margin || { left: 0, right: 0 };
                    that.titleLayout.x -= margin.left;
                    that.titleLayout.width += margin.left + margin.right;
                }
                return that.titleLayout;
            })());

            that.title.shift = sinon.spy();

            return that.title;
        };

        that.themeManagerTitleOptions = {
            backgroundColor: '#ffffff',
            font: {
                size: 28,
                weight: 200
            },
            subtitle: {
                font: {
                    size: 16
                }
            }
        };

        this.data = [{ text: 'First', id: 0, states: getDefaultStates(), visible: true }];
    },

    checkTitle: function(assert, titleDescription) {
        const titleGroup = this.renderer.g.firstCall.returnValue;
        const titleText = this.options.title.text ? 1 : 0;
        const subtitleText = (this.options.title.subtitle || {}).text && titleText ? 1 : 0;
        const insideLegendGroup = this.renderer.g.secondCall.returnValue;

        assert.equal(titleGroup.linkOn.lastCall.args[0], insideLegendGroup, 'title must be into insideLegendGroup');
        assert.equal(titleGroup.linkAppend.callCount, 2);
        assert.equal(titleGroup.children.length, titleText + subtitleText, 'titleGroup must have children');

        if(titleText) {
            assert.equal(this.renderer.text.getCall(0).returnValue, titleGroup.children[0], 'first child in titleGroup must be a main text');
        }

        if(subtitleText) {
            assert.equal(this.renderer.text.getCall(1).returnValue, titleGroup.children[1], 'second child in titleGroup must be a subtitle text');
        }

        const marker = this.findMarkersGroup().children[0].children[0];
        assert.equal(marker.move.firstCall.args[0], titleDescription.expectedOffset.x);
        const sign = this.options.title.verticalAlignment === 'bottom' ? -1 : 1;
        assert.equal(marker.move.firstCall.args[1], sign * titleDescription.expectedOffset.y);
    },

    afterEach: function() {
        environment.afterEach.apply(this, arguments);
    }
});

QUnit.module('Title', titleEnvironment);

QUnit.test('Simple title; legend options by default', function(assert) {
    this.options.title = {
        text: 'Simple title',
        margin: 0
    };

    this.createSimpleLegend().draw(200, 200);

    this.checkTitle(assert, {
        expectedOffset: {
            x: 0,
            y: 0
        }
    });
    this.checkItems(assert, [{
        id: 0,
        marker: {
            fill: '#00FF00',
            width: 14,
            height: 14
        },
        label: {
            text: 'First'
        },
        tracker: {
            left: -4,
            top: -4,
            right: 45,
            bottom: 18
        }
    }]);
});

QUnit.test('Simple title with subtitle; legend options by default', function(assert) {
    this.options.title = {
        text: 'Simple title',
        margin: 0,
        subtitle: {
            text: 'Simple subtitle'
        }
    };

    this.createSimpleLegend().draw(200, 200);

    this.checkTitle(assert, {
        expectedOffset: {
            x: 0,
            y: 0
        }
    });
    this.checkItems(assert, [{
        id: 0,
        marker: {
            fill: '#00FF00',
            width: 14,
            height: 14
        },
        label: {
            text: 'First'
        },
        tracker: {
            left: -4,
            top: -4,
            right: 45,
            bottom: 18
        }
    }]);
});

QUnit.test('Title width more than markers width; legend horizontalAlignment = \'center\'', function(assert) {
    this.options.title = {
        text: 'Simple title',
        margin: {
            left: 0,
            right: 0,
            top: 3,
            bottom: 4
        }
    };
    this.options.horizontalAlignment = 'center';
    this.titleLayout.width = 30;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);

    const markersGroup = this.findMarkersGroup();
    assert.deepEqual(markersGroup.attr.lastCall.args[0], { translateX: 5, translateY: 17 }, 'markers must moved');

    this.checkTrackers(assert, {
        left: 1,
        top: 13,
        right: 29,
        bottom: 49
    }, 0);
});

QUnit.test('Title width less than markers width; legend horizontalAlignment = \'center\'', function(assert) {
    this.options.title = {
        text: 'Simple title',
        margin: {
            left: 0,
            right: 0,
            top: 3,
            bottom: 4
        }
    };
    this.options.horizontalAlignment = 'center';
    this.titleLayout.width = 10;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);

    const markersGroup = this.findMarkersGroup();
    assert.deepEqual(markersGroup.attr.callCount, 2, 'attr function just calling for set class name and set Y position');
    assert.deepEqual(markersGroup.attr.lastCall.args[0], { translateX: 0, translateY: 17 }, 'markers must move under title');
    assert.equal(this.title.shift.callCount, 2, 'method \'shift\' must be called');
    assert.deepEqual(this.title.shift.firstCall.args, [0, 0], 'title must have moved');
    assert.deepEqual(this.title.shift.lastCall.args, [5, -5], 'title must have moved');
    assert.strictEqual(this.title.getOptions().horizontalAlignment, 'center');
});

QUnit.test('Shift simple title; horizontalAlignment = \'center\' verticalAlignment = \'bottom\'; margins not zero', function(assert) {
    this.options.title = {
        text: 'Simple title',
        verticalAlignment: 'bottom',
        margin: {
            left: 3,
            right: 3,
            top: 3,
            bottom: 4
        }
    };

    this.options.horizontalAlignment = 'center';
    this.titleLayout.width = 12;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);

    const markersGroup = this.findMarkersGroup();
    assert.deepEqual(markersGroup.attr.callCount, 1, 'attr function just calling for set class name');
    assert.equal(this.title.shift.callCount, 2, 'method \'shift\' must be called');
    assert.deepEqual(this.title.shift.lastCall.args, [1, 5], 'title must have moved');
});

QUnit.test('Shift simple title; horizontalAlignment = \'right\' verticalAlignment = \'top\'; margins not zero', function(assert) {
    this.options.title = {
        text: 'Simple title',
        margin: {
            left: 0,
            right: 0,
            top: 3,
            bottom: 4
        }
    };

    this.options.horizontalAlignment = 'right';

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);
    assert.equal(this.title.shift.callCount, 2, 'method \'shift\' must be called');
    assert.deepEqual(this.title.shift.lastCall.args, [0, -5], 'title must have moved');
    assert.strictEqual(this.title.getOptions().horizontalAlignment, 'left');
});

QUnit.test('Shift simple title; horizontalAlignment = \'center\'; border exist', function(assert) {
    this.options.title = {
        text: 'Simple title',
        margin: {
            left: 0,
            right: 0,
            top: 3,
            bottom: 4
        }
    };

    this.options.horizontalAlignment = 'center';
    this.options.paddingLeftRight = 4;
    this.options.border.visible = true;
    this.titleLayout.width = 18;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);

    assert.equal(this.title.shift.callCount, 2, 'method \'shift\' must be called');
    assert.deepEqual(this.title.shift.lastCall.args, [-3, -5], 'title must have moved');
});

QUnit.test('Shift simple title; horizontalAlignment = \'center\'; legend position \'inside\'', function(assert) {
    this.options.title = {
        text: 'Simple title',
        margin: {
            left: 0,
            right: 0,
            top: 3,
            bottom: 4
        }
    };

    this.options.horizontalAlignment = 'center';
    this.options.paddingLeftRight = 4;
    this.options.border.visible = false;
    this.options.position = 'inside';
    this.titleLayout.width = 18;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);

    assert.equal(this.title.shift.callCount, 2, 'method \'shift\' must be called');
    assert.deepEqual(this.title.shift.lastCall.args, [-3, -5], 'title must have moved');
});

QUnit.test('Shift simple title; itemTextPosition = \'left\'', function(assert) {
    this.options.title = { text: 'Simple title' };

    this.options.itemTextPosition = 'left';
    this.titleLayout.width = 16;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);
    assert.strictEqual(this.title.getOptions().horizontalAlignment, 'right');
    assert.deepEqual(this.title.shift.lastCall.args, [4, 2], 'title must have moved');
});

QUnit.test('Shift simple title; horizontalAlignment = \'right\'', function(assert) {
    this.options.title = { text: 'Simple title' };

    this.options.horizontalAlignment = 'right';

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);
    assert.deepEqual(this.title.shift.lastCall.args, [0, 2], 'title must have moved');
});

QUnit.test('Shift simple title; itemTextPosition = \'top\'', function(assert) {
    this.options.title = { text: 'Simple title' };

    this.options.itemTextPosition = 'top';

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);
    assert.deepEqual(this.title.shift.lastCall.args, [0, 2], 'title must have moved');
});

QUnit.test('Shift simple title; itemTextPosition = \'bottom\'', function(assert) {
    this.options.title = { text: 'Simple title' };

    this.options.itemTextPosition = 'bottom';
    this.titleLayout.width = 16;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);
    assert.deepEqual(this.title.shift.lastCall.args, [2, 2], 'title must have moved');
});

QUnit.test('Shift simple title; horizontalAlignment = \'right\' verticalAlignment = \'top\' title.horizontalAlignment = \'center\'; margins not zero', function(assert) {
    this.options.title = {
        text: 'Simple title',
        horizontalAlignment: 'center',
        margin: {
            left: 5,
            right: 0
        }
    };

    this.options.horizontalAlignment = 'right';
    this.titleLayout.width = 10;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);
    assert.equal(this.title.shift.callCount, 2, 'method \'shift\' must be called');
    assert.deepEqual(this.title.shift.lastCall.args, [2.5, 2], 'title must have moved');
});

QUnit.test('Shift simple title; horizontalAlignment = \'center\' verticalAlignment = \'bottom\' title.horizontalAlignment = \'right\'; margins not zero', function(assert) {
    this.options.title = {
        text: 'Simple title',
        horizontalAlignment: 'right',
        margin: {
            left: 0,
            right: 5
        }
    };

    this.options.horizontalAlignment = 'center';
    this.options.verticalAlignment = 'bottom';
    this.titleLayout.width = 10;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);
    assert.equal(this.title.shift.callCount, 2, 'method \'shift\' must be called');
    assert.deepEqual(this.title.shift.lastCall.args, [5, 2], 'title must have moved');
});

QUnit.test('Shift simple title; horizontalAlignment = \'left\' verticalAlignment = \'top\' title.horizontalAlignment = \'left\'; margins not zero', function(assert) {
    this.options.title = {
        text: 'Simple title',
        horizontalAlignment: 'right',
        margin: {
            left: 10,
            right: 10
        }
    };

    this.options.horizontalAlignment = 'left';
    this.titleLayout.width = 20;

    const legend = this.createSimpleLegend();
    legend.draw(200, 200);
    legend.shift(0, 0);
    assert.equal(this.title.shift.callCount, 2, 'method \'shift\' must be called');
    assert.deepEqual(this.title.shift.lastCall.args, [0, 2], 'title must have moved');
    assert.equal(this.legend._boundingRect.width, 56, 'boundingRect must be expanded');
});

QUnit.module('Template', extend({}, environment, {
    beforeEach() {
        environment.beforeEach.call(this);

        this.options.markerTemplate = sinon.spy();
        this.data = this.createData(1);

        this.data[0].states.hover = { fill: 'hover-color', opacity: 0.2 };
        this.data[0].states.selection = { fill: 'selection-color', opacity: 0.2 };
    }
}));

QUnit.test('Call template function', function(assert) {
    this.createAndDrawLegend();

    assert.equal(this.options.markerTemplate.callCount, 1);
    assert.deepEqual(this.options.markerTemplate.lastCall.args[0], {
        id: 0,
        size: 14,
        marker: {
            size: 14,
            fill: 'color-1',
            opacity: 1,
            state: 'normal'
        },
        states: {
            hover: {
                state: 'hovered',
                fill: 'hover-color',
                hatching: {
                    step: 5,
                    width: 2
                },
                opacity: 0.2
            },
            selection: {
                state: 'selected',
                fill: 'selection-color',
                hatching: {
                    step: 5,
                    width: 2
                },
                opacity: 0.2
            },
            normal: {
                fill: 'color-1',
                state: 'normal',
                opacity: 1
            }
        },
        text: 'Marker 1',
        visible: true
    });
});

QUnit.test('Call second time when state changed', function(assert) {
    this.createAndDrawLegend();
    this.options.markerTemplate.reset();

    this.legend.applyHover(0);

    assert.equal(this.options.markerTemplate.callCount, 1);
    assert.deepEqual(this.options.markerTemplate.lastCall.args[0].marker.state, 'hovered');
    assert.deepEqual(this.options.markerTemplate.lastCall.args[0].marker.opacity, 0.2);
});

QUnit.test('can customize legendItem.marker.size', function(assert) {
    this.options.customizeItems = items => {
        items.forEach(i => i.marker.size = 60);
    };
    this.createAndDrawLegend();

    assert.deepEqual(this.options.markerTemplate.lastCall.args[0].marker.size, 60);
});

// legendItem.size backward capability
QUnit.test('can customize legendItem.size', function(assert) {
    this.options.customizeItems = items => {
        items.forEach(i => i.size = 60);
    };
    this.createAndDrawLegend();

    assert.deepEqual(this.options.markerTemplate.lastCall.args[0].marker.size, 60);
});


QUnit.test('Pass customized item size to hover state', function(assert) {
    this.options.customizeItems = items => {
        items.forEach(i => i.marker.size = 60);
    };

    this.createAndDrawLegend();
    this.options.markerTemplate.reset();

    this.legend.applyHover(0);

    assert.deepEqual(this.options.markerTemplate.lastCall.args[0].marker.state, 'hovered');
    assert.deepEqual(this.options.markerTemplate.lastCall.args[0].marker.size, 60);
});

QUnit.test('Pass customized item opacity for different states', function(assert) {
    this.options.customizeItems = items => {
        items.forEach(i => {
            i.marker.opacity = 0.65;
            i.states.normal.opacity = 0.3;
            i.states.selection.opacity = 0.9;
        });
    };

    this.createAndDrawLegend();

    assert.equal(this.data[0].marker.opacity, 0.3);
    assert.equal(this.options.markerTemplate.lastCall.args[0].marker.state, 'normal');
    assert.equal(this.options.markerTemplate.lastCall.args[0].marker.opacity, 0.3);

    this.options.markerTemplate.reset();
    this.legend.applyHover(0);

    assert.equal(this.options.markerTemplate.lastCall.args[0].marker.state, 'hovered');
    assert.equal(this.options.markerTemplate.lastCall.args[0].marker.opacity, 0.65);

    this.options.markerTemplate.reset();
    this.legend.applySelected(0);

    assert.equal(this.options.markerTemplate.lastCall.args[0].marker.state, 'selected');
    assert.equal(this.options.markerTemplate.lastCall.args[0].marker.opacity, 0.9);
});

QUnit.test('Request change if template is asynchronous', function(assert) {
    this.options.customizeItems = items => {
        items.forEach(i => i.marker.size = 60);
    };

    this.createAndDrawLegend();

    const widget = this.legend._widget;

    assert.ok(!widget._requestChange.called);
    widget.template.render.lastCall.args[0].onRendered();
    assert.deepEqual(widget._requestChange.lastCall.args[0], ['LAYOUT']);
});

QUnit.test('Do not request change if template is asynchronous but marker group is not empty', function(assert) {
    this.options.markerTemplate = function(_, container) {
        container.appendChild(document.createElement('svg'));
    };
    this.options.customizeItems = items => {
        items.forEach(i => i.marker.size = 60);
    };

    this.createAndDrawLegend();

    const widget = this.legend._widget;

    assert.ok(!widget._requestChange.called);
    widget.template.render.lastCall.args[0].onRendered();
    assert.ok(!widget._requestChange.called);
});

