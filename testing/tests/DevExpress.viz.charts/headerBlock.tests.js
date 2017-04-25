"use strict";

var headerBlockModule = require("viz/chart_components/header_block");

QUnit.module("Creation");

QUnit.test("Create the header block", function(assert) {
    //arrange, act
    var headerBlock = new headerBlockModule.HeaderBlock();

    //assert
    assert.ok(headerBlock);
});

QUnit.module("API methods", {
    beforeEach: function() {
        var stub1 = sinon.stub(),
            stub2 = sinon.stub(),
            stub3 = sinon.stub();

        stub1.getLayoutOptions = sinon.stub().returns({
            width: 30,
            height: 25,
            x: 10,
            y: 10
        });
        stub1.probeDraw = sinon.spy();
        stub1.draw = sinon.spy();
        stub1.shift = sinon.spy();

        stub2.getLayoutOptions = sinon.stub().returns(null);
        stub2.probeDraw = sinon.spy();
        stub2.draw = sinon.spy();
        stub2.shift = sinon.spy();

        stub3.getLayoutOptions = sinon.stub().returns({
            width: 70,
            height: 80,
            x: 10,
            y: 10,
            position: {
                vertical: "top",
                horizontal: "left"
            }
        });
        stub3.probeDraw = sinon.spy();
        stub3.draw = sinon.spy();
        stub3.shift = sinon.spy();

        this.laidOutElements = [stub1, stub2, stub3];
    }
});

QUnit.test("Get layout options", function(assert) {
    //arrange
    var headerBlock = new headerBlockModule.HeaderBlock(),
        layout;

    headerBlock.update(this.laidOutElements);

    //act
    layout = headerBlock.getLayoutOptions();

    //assert
    assert.deepEqual(layout, {
        width: 100,
        height: 80,
        x: 10,
        y: 10,
        position: {
            vertical: "top",
            horizontal: "left"
        },
        horizontalAlignment: "left",
        verticalAlignment: "top"
    }, "layout options");
});

QUnit.test("Get layout options after update", function(assert) {
    //arrange
    var headerBlock = new headerBlockModule.HeaderBlock(),
        layout,
        stub = sinon.stub();

    stub.getLayoutOptions = sinon.stub().returns({
        width: 200,
        height: 200,
        x: 10,
        y: 10,
        position: {}
    });
    stub.probeDraw = sinon.spy();
    stub.draw = sinon.spy();
    stub.shift = sinon.spy();

    //act
    headerBlock.update([stub]);
    headerBlock.getLayoutOptions();
    headerBlock.update(this.laidOutElements);
    layout = headerBlock.getLayoutOptions();

    //assert
    assert.deepEqual(layout, {
        width: 100,
        height: 80,
        x: 10,
        y: 10,
        position: {
            vertical: "top",
            horizontal: "left"
        },
        horizontalAlignment: "left",
        verticalAlignment: "top"
    }, "layout options");
});

QUnit.test("Update", function(assert) {
    //arrange
    var headerBlock = new headerBlockModule.HeaderBlock(),
        layout;

    headerBlock.update(this.laidOutElements);

    //act
    headerBlock.update([]);
    layout = headerBlock.getLayoutOptions();

    //assert
    assert.strictEqual(layout, null, "layout options");
});

QUnit.test("Get layout options. Zero elements", function(assert) {
    //arrange
    var elements = [{
            getLayoutOptions: function() {
                return null;
            }
        }],
        headerBlock = new headerBlockModule.HeaderBlock(),
        layout;

    headerBlock.update(elements);

    //act
    layout = headerBlock.getLayoutOptions();

    //assert
    assert.strictEqual(layout, null, "layout options");
});

QUnit.test("Get layout options. One element", function(assert) {
    //arrange
    var elements = [{
            getLayoutOptions: function() {
                return {
                    width: 100,
                    height: 80,
                    x: 10,
                    y: 10
                };
            }
        }],
        headerBlock = new headerBlockModule.HeaderBlock(),
        layout;

    headerBlock.update(elements);

    //act
    layout = headerBlock.getLayoutOptions();

    //assert
    assert.deepEqual(layout, {
        width: 100,
        height: 80,
        x: 10,
        y: 10,
        position: {}
    }, "layout options");
});

QUnit.test("Probe draw", function(assert) {
    //arrange
    var headerBlock = new headerBlockModule.HeaderBlock(),
        layout;

    headerBlock.update(this.laidOutElements);

    //act
    layout = headerBlock.probeDraw(100, 20);

    //assert
    assert.equal(this.laidOutElements[0].probeDraw.callCount, 1, "first element with probe draw");
    assert.deepEqual(this.laidOutElements[0].probeDraw.getCall(0).args, [100, 20], "first element with probe draw");

    assert.equal(this.laidOutElements[1].probeDraw.callCount, 0, "second element with probe draw");

    assert.equal(this.laidOutElements[2].probeDraw.callCount, 1, "third element with probe draw");
    assert.deepEqual(this.laidOutElements[2].probeDraw.getCall(0).args, [70, 20], "third element with probe draw");
});

QUnit.test("Draw", function(assert) {
    //arrange
    var headerBlock = new headerBlockModule.HeaderBlock(),
        layout;

    headerBlock.update(this.laidOutElements, { width: 30 });

    //act
    layout = headerBlock.draw(100, 20);

    //assert
    assert.equal(this.laidOutElements[0].draw.callCount, 1, "first element with draw");
    assert.deepEqual(this.laidOutElements[0].draw.getCall(0).args, [100, 20, { width: 30 }], "first element with draw");

    assert.equal(this.laidOutElements[1].draw.callCount, 0, "second element with draw");

    assert.equal(this.laidOutElements[2].draw.callCount, 1, "third element with draw");
    assert.deepEqual(this.laidOutElements[2].draw.getCall(0).args, [70, 20, { width: 30 }], "third element with draw");
});

QUnit.test("Shift", function(assert) {
    //arrange
    var headerBlock = new headerBlockModule.HeaderBlock(),
        layout;

    headerBlock.update(this.laidOutElements, { width: 400 });

    //act
    layout = headerBlock.shift(10, 20);

    //assert
    assert.deepEqual(this.laidOutElements[0].shift.getCall(0).args, [10, 20], "first element with shift");
    assert.equal(this.laidOutElements[1].shift.callCount, 0, "second element with shift");
    assert.deepEqual(this.laidOutElements[2].shift.getCall(0).args, [10, 20], "third element with shift");
});
