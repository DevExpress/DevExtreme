
import $ from 'jquery';
import OverlayDrag from 'ui/overlay/overlay_drag';
import { getWindow } from 'core/utils/window';
const window = getWindow();

QUnit.testStart(function() {
    const markup =
        '<div id="draggableElement" style="width: 100px; height: 100px; position: absolute; top: 300px; left: 300px;">\
            <div id="handle" style="width: 100%; height: 50px"></div>\
        </div>\
        <div id="container" style="width: 200px; height: 200px;"></div>\
        <div id="container2" style="width: 300px; height: 350px; position: absolute; top: -1000px; left: -700px"></div>\
        ';

    $('#qunit-fixture').html(markup);
});

QUnit.module('overlay_drag', {
    beforeEach: function() {
        this.handle = $('#handle').get(0);
        this.draggableElement = $('#draggableElement').get(0);
        this.container = $('#container').get(0);
        this.container2 = $('#container2').get(0);
    }
}, () => {
    ['#container', '#container2', '#qunit-fixture', 'window'].forEach((value) => {
        QUnit.test(`calculates container dimensions for ${value}`, function(assert) {
            const container = value === 'window' ? window : $(value).get(0);
            const drag = new OverlayDrag({
                dragEnabled: true,
                handle: this.handle,
                container,
                draggableElement: this.draggableElement,
                outsideDragFactor: 0,
                updatePositionChangeHandled: () => {}
            });
            const expectedWidth = $(container).outerWidth();
            const expectedHeight = $(container).outerHeight();

            assert.strictEqual(expectedWidth, drag._getContainerDimensions().width, 'width is correct');
            assert.strictEqual(expectedHeight, drag._getContainerDimensions().height, 'height is correct');
        });
    });

    [
        { container: '#container', outsideDragFactor: 0 },
        { container: '#container2', outsideDragFactor: 0.5 },
        { container: '#qunit-fixture', outsideDragFactor: 0.75 },
        { container: 'window', outsideDragFactor: 1 }
    ].forEach((value) => {
        QUnit.test(`calculates delta size properly for ${value.container} container and ${value.outsideDragFactor} outsideDragFactor`,
            function(assert) {
                const container = value.container === 'window' ? window : $(value.container).get(0);
                const outsideDragFactor = value.outsideDragFactor;
                const drag = new OverlayDrag({
                    dragEnabled: true,
                    handle: this.handle,
                    container,
                    draggableElement: this.draggableElement,
                    outsideDragFactor,
                    updatePositionChangeHandled: () => {}
                });
                const draggableElementWidth = this.draggableElement.offsetWidth;
                const draggableElementHeight = this.draggableElement.offsetHeight;
                const expectedDeltaWidth = $(container).outerWidth() - draggableElementWidth + (draggableElementWidth * outsideDragFactor);
                const expectedDeltaHeight = $(container).outerHeight() - draggableElementHeight + (draggableElementHeight * outsideDragFactor);

                assert.strictEqual(expectedDeltaWidth, drag._deltaSize().width, 'delta width is correct');
                assert.strictEqual(expectedDeltaHeight, drag._deltaSize().height, 'delta height is correct');
            });
    });

    QUnit.test('changes draggableElement position', function(assert) {
        const drag = new OverlayDrag({
            dragEnabled: true,
            handle: this.handle,
            container: this.container,
            draggableElement: this.draggableElement,
            outsideDragFactor: 0,
            updatePositionChangeHandled: () => {}
        });
        const startPosition = this.draggableElement.getBoundingClientRect();
        drag._changePosition({ top: 100, left: 100 });
        const newPosition = this.draggableElement.getBoundingClientRect();

        assert.strictEqual(startPosition.top + 100, newPosition.top, 'top position changed');
        assert.strictEqual(startPosition.left + 100, newPosition.left, 'left position changed');
    });

    ['#container', '#container2', '#qunit-fixture', 'window'].forEach((value) => {
        QUnit.test(`calculates allowed offsets properly for draggableElement and ${value} container`, function(assert) {
            const container = value === 'window' ? window : $(value).get(0);
            const drag = new OverlayDrag({
                dragEnabled: true,
                handle: this.handle,
                container,
                draggableElement: this.draggableElement,
                outsideDragFactor: 0,
                updatePositionChangeHandled: () => {}
            });
            const draggableElementPosition = this.draggableElement.getBoundingClientRect();
            const containerPosition = value === 'window' ? { top: 0, left: 0 } : container.getBoundingClientRect();
            const expectedTopOffset = draggableElementPosition.top - containerPosition.top;
            const expectedBottomOffset = -draggableElementPosition.top + containerPosition.top + drag._deltaSize().height;
            const expectedLeftOffset = draggableElementPosition.left - containerPosition.left;
            const expectedRightOffset = -draggableElementPosition.left + containerPosition.left + drag._deltaSize().width;

            assert.strictEqual(expectedTopOffset, drag._allowedOffsets().top, 'top offset is correct');
            assert.strictEqual(expectedBottomOffset, drag._allowedOffsets().bottom, 'bottom offset is correct');
            assert.strictEqual(expectedLeftOffset, drag._allowedOffsets().left, 'left offset is correct');
            assert.strictEqual(expectedRightOffset, drag._allowedOffsets().right, 'right offset is correct');
        });
    });
});
