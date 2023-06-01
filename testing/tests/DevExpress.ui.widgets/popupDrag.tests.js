
import $ from 'jquery';
import PopupDrag from 'ui/popup/popup_drag';
import { PopupPositionController } from 'ui/popup/popup_position_controller';

const KEYBOARD_DRAG_STEP = 5;

QUnit.testStart(function() {
    const markup =
        '<div id="draggableElement">\
            <div id="handle"></div>\
        </div>\
        <div id="container"></div>\
        <div id="container2"></div>\
        ';

    $('#qunit-fixture').html(markup);

    $('#draggableElement').css({
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '300px',
        left: '300px'
    });

    $('#handle').css({
        width: '100%',
        height: '50px'
    });

    $('#container').css({
        width: '200px',
        height: '200px'
    });

    $('#container2').css({
        width: '300px',
        height: '350px',
        position: 'absolute',
        top: '-1000px',
        left: '-700px'
    });
});

QUnit.module('overlay_drag', {
    beforeEach: function() {
        this.handle = $('#handle').get(0);
        this.draggableElement = $('#draggableElement').get(0);
        this.container = $('#container').get(0);
        this.container2 = $('#container2').get(0);
    }
}, () => {
    QUnit.module('public methods', () => {
        QUnit.module('keyboard navigation', {
            beforeEach: function() {
                this.drag = new PopupDrag({
                    dragEnabled: true,
                    handle: this.handle,
                    draggableElement: this.draggableElement,
                    positionController: new PopupPositionController({
                        container: $('#qunit-fixture'),
                        $root: $('#qunit-fixture'),
                        $content: this.draggableElement,
                        restorePosition: {},
                        onVisualPositionChanged: () => {},
                        onPositioned: () => {},
                        outsideDragFactor: 0,
                    })
                });
                this.initialPosition = this.draggableElement.getBoundingClientRect();
                this.delta = {
                    moveDown: { x: 0, y: KEYBOARD_DRAG_STEP },
                    moveUp: { x: 0, y: -KEYBOARD_DRAG_STEP },
                    moveLeft: { x: -KEYBOARD_DRAG_STEP, y: 0 },
                    moveRight: { x: KEYBOARD_DRAG_STEP, y: 0 },
                };
            }
        }, () => {
            ['moveDown', 'moveUp', 'moveLeft', 'moveRight'].forEach(methodName => {
                QUnit.module(methodName, () => {
                    QUnit.test('should drag element down by default step', function(assert) {
                        this.drag[methodName]($.Event('keydown'));

                        const newPosition = this.draggableElement.getBoundingClientRect();
                        const expectedLeft = this.initialPosition.left + this.delta[methodName].x;
                        const expectedTop = this.initialPosition.top + this.delta[methodName].y;
                        assert.strictEqual(newPosition.left, expectedLeft, 'horizontal position is still the same');
                        assert.strictEqual(newPosition.top, expectedTop, 'vertical position is changed correctly');
                    });

                    QUnit.test('parameter event should be default prevented', function(assert) {
                        const preventDefaultStub = sinon.stub();
                        const event = $.Event('keydown', { preventDefault: preventDefaultStub });

                        this.drag[methodName](event);

                        assert.ok(preventDefaultStub.called, 'event is default prevented');
                    });

                    QUnit.test('parameter event propogation should be stopped', function(assert) {
                        const stopPropagationStub = sinon.stub();
                        const event = $.Event('keydown', { stopPropagation: stopPropagationStub });

                        this.drag[methodName](event);

                        assert.ok(stopPropagationStub.called, 'event propagation is stopped');
                    });
                });
            });
        });
    });

    QUnit.test('_moveByOffset() changes draggableElement position', function(assert) {
        const drag = new PopupDrag({
            dragEnabled: true,
            handle: this.handle,
            container: this.container,
            draggableElement: this.draggableElement,
            outsideDragFactor: 0,
            updatePositionChangeHandled: () => {}
        });
        const startPosition = this.draggableElement.getBoundingClientRect();
        drag._moveByOffset({ top: 100, left: 100 });
        const newPosition = this.draggableElement.getBoundingClientRect();

        assert.strictEqual(startPosition.top + 100, newPosition.top, 'top position changed');
        assert.strictEqual(startPosition.left + 100, newPosition.left, 'left position changed');
    });
});
