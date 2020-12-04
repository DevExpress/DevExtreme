import translator from 'animation/translator';
import visibilityChange from 'events/visibility_change';
import $ from 'jquery';
import 'ui/resizable';
import pointerMock from '../../helpers/pointerMock.js';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="resizable" style="height: 50px; width: 50px; position: absolute; box-sizing: border-box;"></div>\
        <div id="resizableAutoSize" style="height: auto; width: auto; position: absolute"><div style="height: 50px; width: 50px; box-sizing: border-box;"></div></div>\
        <div id="areaDiv" style="height: 100px; width:100px; position: absolute; box-sizing: border-box;"></div>';

    $('#qunit-fixture').html(markup);
});

const RESIZABLE_HANDLE_RIGHT_CLASS = 'dx-resizable-handle-right';
const RESIZABLE_HANDLE_BOTTOM_CLASS = 'dx-resizable-handle-bottom';
const RESIZABLE_HANDLE_TOP_CLASS = 'dx-resizable-handle-top';
const RESIZABLE_HANDLE_LEFT_CLASS = 'dx-resizable-handle-left';
const RESIZABLE_HANDLE_CORNER_CLASS = 'dx-resizable-handle-corner';

QUnit.module('behavior', () => {
    QUnit.test('resizable should have dx-resizable-resizing class while resizing', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'right'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS); const pointer = pointerMock($handle).start();

        assert.ok(!$resizable.hasClass('dx-resizable-resizing'), 'element has not appropriate class before resizing');

        pointer.dragStart().drag(10, 0);
        assert.ok($resizable.hasClass('dx-resizable-resizing'), 'element has right class');

        pointer.dragEnd();
        assert.ok(!$resizable.hasClass('dx-resizable-resizing'), 'element has not appropriate class');
    });

    QUnit.test('drag on right handle should change width', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'right'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS); const pointer = pointerMock($handle).start(); const elementWidth = $resizable.outerWidth();

        pointer.dragStart().drag(10, 0);
        assert.equal($resizable.outerWidth(), elementWidth + 10, 'width of element was changed');
    });

    QUnit.test('drag on bottom handle should change height', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'bottom'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS); const pointer = pointerMock($handle).start(); const elementHeight = $resizable.outerHeight();

        pointer.dragStart().drag(0, 10);
        assert.equal($resizable.outerHeight(), elementHeight + 10, 'height of element was changed');
    });

    QUnit.test('drag on top handle should change height and top', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'top'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_TOP_CLASS); const pointer = pointerMock($handle).start(); const elementHeight = $resizable.outerHeight(); const elementTop = $resizable.offset().top;

        pointer.dragStart().drag(0, -10);
        assert.equal($resizable.outerHeight(), elementHeight + 10, 'height of element was changed');
        assert.equal($resizable.offset().top, elementTop - 10, 'top of element was changed');
    });

    QUnit.test('drag on top handle should not move the widget down', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'top',
            height: 15,
            minHeight: 15
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_TOP_CLASS); const pointer = pointerMock($handle).start(); const elementHeight = $resizable.outerHeight(); const elementTop = $resizable.offset().top;

        pointer.dragStart().drag(0, 10);
        assert.equal($resizable.outerHeight(), elementHeight, 'height of element was not changed');
        assert.equal($resizable.offset().top, elementTop, 'top of element was not changed');
    });

    QUnit.test('drag on left handle should not move the widget right', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'left',
            width: 15,
            minWidth: 15
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_LEFT_CLASS); const pointer = pointerMock($handle).start(); const elementWidth = $resizable.outerWidth(); const elementLeft = $resizable.offset().left;

        pointer.dragStart().drag(10, 0);
        assert.equal($resizable.outerWidth(), elementWidth, 'height of element was not changed');
        assert.equal($resizable.offset().left, elementLeft, 'top of element was not changed');
    });

    QUnit.test('drag on handle should not break element position', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'left'
        });

        translator.move($resizable, { top: 100, left: 100 });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_LEFT_CLASS); const elementLeft = $resizable.offset().left;

        pointerMock($handle).start().dragStart().drag(0, 0);
        assert.equal(elementLeft, $resizable.offset().left, 'element position is correct');
    });

    QUnit.test('resizable should change size correctly after several drag events', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'bottom right'
        });

        let $handle;

        const elementWidth = $resizable.outerWidth();
        const elementHeight = $resizable.outerHeight();

        $handle = $resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS);
        pointerMock($handle).start().dragStart().drag(0, 10).drag(0, 1);
        assert.equal($resizable.outerHeight(), elementHeight + 11, 'height of element was changed correctly');

        $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS);
        pointerMock($handle).start().dragStart().drag(10, 0).drag(1, 0);
        assert.equal($resizable.outerWidth(), elementWidth + 11, 'width of element was changed correctly');
    });
});

QUnit.module('behavior with auto size', () => {
    QUnit.test('drag on left handle should not change height', function(assert) {
        const $resizable = $('#resizableAutoSize').dxResizable({
            handles: 'left'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_LEFT_CLASS); const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(-10, 0);
        assert.equal($resizable[0].style.height, 'auto', 'height of element was not changed');
    });

    QUnit.test('drag on right handle should not change height', function(assert) {
        const $resizable = $('#resizableAutoSize').dxResizable({
            handles: 'right'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS); const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(10, 0);
        assert.equal($resizable[0].style.height, 'auto', 'height of element was not changed');
    });

    QUnit.test('drag on top handle should not change width', function(assert) {
        const $resizable = $('#resizableAutoSize').dxResizable({
            handles: 'top'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_TOP_CLASS); const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(0, -10);
        assert.equal($resizable[0].style.width, 'auto', 'width of element was not changed');
    });

    QUnit.test('drag on bottom handle should not change width', function(assert) {
        const $resizable = $('#resizableAutoSize').dxResizable({
            handles: 'bottom'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS); const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(0, 10);
        assert.equal($resizable[0].style.width, 'auto', 'width of element was not changed');
    });
});

QUnit.module('drag integration', () => {
    QUnit.test('vertical handle should change only width', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'right'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS); const pointer = pointerMock($handle).start(); const elementHeight = $resizable.outerHeight();

        pointer.down().move(0, 20);
        assert.equal($resizable.outerHeight(), elementHeight, 'height of element was not changed');
    });

    QUnit.test('horizontal handle should change only height', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'bottom'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS); const pointer = pointerMock($handle).start(); const elementWidth = $resizable.outerWidth();

        pointer.down().move(20, 0);
        assert.equal($resizable.outerWidth(), elementWidth, 'height of element was not changed');
    });

    QUnit.test('top left corner', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'top left'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-top-left'); const pointer = pointerMock($handle).start(); const width = $resizable.outerWidth(); const height = $resizable.outerHeight(); const top = $resizable.offset().top; const left = $resizable.offset().left;

        pointer.down().move(-20, -20);
        assert.equal($resizable.outerWidth(), width + 20, 'width was enlarged');
        assert.equal($resizable.outerHeight(), height + 20, 'height was enlarged');
        assert.equal($resizable.offset().left, left - 20, 'top was reduced');
        assert.equal($resizable.offset().top, top - 20, 'left was reduced');
    });

    QUnit.test('top left corner with css maxWidth and minWidth', function(assert) {
        const $resizable = $('#resizable').css({
            maxWidth: 300,
            minWidth: 200,
            width: 250,
            maxHeight: 300,
            minHeight: 200,
            height: 250
        }).dxResizable({
            handles: 'top left'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-top-left'); const pointer = pointerMock($handle).start(); const top = $resizable.offset().top; const left = $resizable.offset().left;

        pointer.down().move(-100, -100);
        assert.equal($resizable.outerWidth(), 300, 'width was enlarged');
        assert.equal($resizable.outerHeight(), 300, 'height was enlarged');
        assert.equal($resizable.offset().left, left - 50, 'top was reduced');
        assert.equal($resizable.offset().top, top - 50, 'left was reduced');
    });

    QUnit.test('top right corner', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'top right'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-top-right'); const pointer = pointerMock($handle).start(); const width = $resizable.outerWidth(); const height = $resizable.outerHeight(); const top = $resizable.offset().top; const left = $resizable.offset().left;

        pointer.down().move(20, -20);
        assert.equal($resizable.outerWidth(), width + 20, 'width was enlarged');
        assert.equal($resizable.outerHeight(), height + 20, 'height was enlarged');
        assert.equal($resizable.offset().top, top - 20, 'top was reduced');
        assert.equal($resizable.offset().left, left, 'left was not changed');
    });

    QUnit.test('bottom left corner', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'bottom left'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-left'); const pointer = pointerMock($handle).start(); const width = $resizable.outerWidth(); const height = $resizable.outerHeight(); const top = $resizable.offset().top; const left = $resizable.offset().left;

        pointer.down().move(-20, 20);
        assert.equal($resizable.outerWidth(), width + 20, 'width was enlarged');
        assert.equal($resizable.outerHeight(), height + 20, 'height was enlarged');
        assert.equal($resizable.offset().top, top, 'top was not changed');
        assert.equal($resizable.offset().left, left - 20, 'left was reduced');
    });

    QUnit.test('bottom right corner', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'bottom right'
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-right'); const pointer = pointerMock($handle).start(); const width = $resizable.outerWidth(); const height = $resizable.outerHeight(); const top = $resizable.offset().top; const left = $resizable.offset().left;

        pointer.down().move(20, 20);
        assert.equal($resizable.outerWidth(), width + 20, 'width was enlarged');
        assert.equal($resizable.outerHeight(), height + 20, 'height was enlarged');
        assert.equal($resizable.offset().top, top, 'top was not changed');
        assert.equal($resizable.offset().left, left, 'left was not changed');
    });

    QUnit.test('moved resizable should have correct position after drag', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'all'
        });

        translator.move($resizable, { top: 100, left: 100 });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS); const pointer = pointerMock($handle).start(); const elementOffset = $resizable.offset();

        pointer.dragStart().drag(20, 20);

        assert.equal(elementOffset.top, $resizable.offset().top, '');
        assert.equal(elementOffset.left, $resizable.offset().left, '');
    });

    QUnit.test('onResizeEnd right handle', function(assert) {
        assert.expect(2);

        const $resizable = $('#resizable').dxResizable({
            handles: 'all',
            'onResizeEnd': function(args) {
                assert.deepEqual(args.handles, { left: false, right: true, top: false, bottom: false }, 'right handle returns correct handles');
            }
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS);
        const handlePointer = pointerMock($handle).start();

        handlePointer.dragStart().drag(20, 0).dragEnd();
        handlePointer.dragStart().drag(-40, 0).dragEnd();
    });

    QUnit.test('onResizeEnd left handle', function(assert) {
        assert.expect(2);

        const $resizable = $('#resizable').dxResizable({
            handles: 'all',
            'onResizeEnd': function(args) {
                assert.deepEqual(args.handles, { left: true, right: false, top: false, bottom: false }, 'left handle returns correct handles');
            }
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_LEFT_CLASS);
        const handlePointer = pointerMock($handle).start();

        handlePointer.dragStart().drag(20, 0).dragEnd();
        handlePointer.dragStart().drag(-40, 0).dragEnd();
    });

    QUnit.test('onResizeEnd top handle', function(assert) {
        assert.expect(2);

        const $resizable = $('#resizable').dxResizable({
            handles: 'all',
            'onResizeEnd': function(args) {
                assert.deepEqual(args.handles, { left: false, right: false, top: true, bottom: false }, 'top handle returns correct handles');
            }
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_TOP_CLASS);
        const handlePointer = pointerMock($handle).start();

        handlePointer.dragStart().drag(0, 20).dragEnd();
        handlePointer.dragStart().drag(0, -40).dragEnd();
    });

    QUnit.test('onResizeEnd bottom handle', function(assert) {
        assert.expect(2);

        const $resizable = $('#resizable').dxResizable({
            handles: 'all',
            'onResizeEnd': function(args) {
                assert.deepEqual(args.handles, { left: false, right: false, top: false, bottom: true }, 'bottom handle returns correct handles');
            }
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS);
        const handlePointer = pointerMock($handle).start();

        handlePointer.dragStart().drag(0, 20).dragEnd();
        handlePointer.dragStart().drag(0, -40).dragEnd();
    });

    QUnit.test('Resizable horizontal offset should be right when stepPrecision is strict', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'right left',
            stepPrecision: 'strict',
            step: 40,
            width: 60
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS); const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(20, 0);
        assert.equal($resizable.outerWidth(), 80, 'right offset - correct width');

        pointer.dragStart().drag(-20, 0);
        assert.equal($resizable.outerWidth(), 80, 'back offset - width didn\'t change');

        pointer.dragStart().drag(-40, 0);
        assert.equal($resizable.outerWidth(), 40, 'back offset - correct width');

        const $leftHandle = $resizable.find('.' + RESIZABLE_HANDLE_LEFT_CLASS); const leftPointer = pointerMock($leftHandle).start();

        leftPointer.dragStart().drag(-40, 0);
        assert.equal($resizable.outerWidth(), 80, 'left offset - correct width');
    });

    QUnit.test('Resizable vertical offset should be right when stepPrecision is strict', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            handles: 'top bottom',
            stepPrecision: 'strict',
            step: 40,
            height: 60
        });

        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS); const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(0, 20);
        assert.equal($resizable.outerHeight(), 80, 'bottom offset - correct width');

        pointer.dragStart().drag(0, -20);
        assert.equal($resizable.outerHeight(), 80, 'back offset - height didn\'t change');

        pointer.dragStart().drag(0, -40);
        assert.equal($resizable.outerHeight(), 40, 'back offset - correct height');

        const $topHandle = $resizable.find('.' + RESIZABLE_HANDLE_TOP_CLASS); const topPointer = pointerMock($topHandle).start();

        topPointer.dragStart().drag(0, -40);
        assert.equal($resizable.outerHeight(), 80, 'top offset - correct width');
    });
});

QUnit.module('options', () => {
    QUnit.test('disabled option', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            disabled: true,
            width: 50
        });
        const pointerDrag = function() {
            const pointer = pointerMock($resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS)).start();
            pointer.dragStart().drag(-10, 0);
        };

        pointerDrag();
        assert.equal($resizable.outerWidth(), 50, 'resizable was not updated');

        $resizable.dxResizable('option', 'disabled', false);
        pointerDrag();
        assert.equal($resizable.outerWidth(), 40, 'resizable was updated');

        $resizable.dxResizable('option', 'disabled', true);
        pointerDrag();
        assert.equal($resizable.outerWidth(), 40, 'resizable was not updated');
    });

    QUnit.test('dx-state-disabled class', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            width: 50
        });
        const pointerDrag = function() {
            const pointer = pointerMock($resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS)).start();
            pointer.down().move(-10, 0).up();
        };

        $resizable.addClass('dx-state-disabled');
        pointerDrag();
        assert.equal($resizable.outerWidth(), 50, 'resizable was not updated');

        $resizable.removeClass('dx-state-disabled');
        pointerDrag();
        assert.equal($resizable.outerWidth(), 40, 'resizable was updated');
    });

    QUnit.test('min/max width option', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            minWidth: 50,
            maxWidth: 60
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS);
        const pointer = pointerMock($handle).start();

        $resizable.width(55);

        pointer.dragStart().drag(-10, 0);
        assert.equal($resizable.outerWidth(), 50, 'width of the resizable should be set to minWidth');

        pointer.dragStart().drag(30, 0);
        assert.equal($resizable.outerWidth(), 60, 'width of the resizable should be set to maxWidth');
    });

    QUnit.test('min/max height option', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            minHeight: 50,
            maxHeight: 60
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS);
        const pointer = pointerMock($handle).start();

        $resizable.height(55);

        pointer.dragStart().drag(0, -10);
        assert.equal($resizable.outerHeight(), 50, 'height of the resizable should be set to minWidth');

        pointer.dragStart().drag(0, 30);
        assert.equal($resizable.outerHeight(), 60, 'height of the resizable should be set to maxWidth');
    });

    QUnit.test('min/max width option change should change element width', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            minWidth: 30
        });
        const resizable = $resizable.dxResizable('instance');

        assert.equal($resizable.outerWidth(), 50, 'width of the resizable should not be changed');

        resizable.option('minWidth', 70);
        assert.equal($resizable.outerWidth(), 70, 'width of the resizable should be set to minWidth');
    });

    QUnit.test('min/max height option change should change element height', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            minHeight: 30
        });
        const resizable = $resizable.dxResizable('instance');

        assert.equal($resizable.outerHeight(), 50, 'height of the resizable should not be changed');

        resizable.option('minHeight', 70);
        assert.equal($resizable.outerHeight(), 70, 'height of the resizable should be set to minWidth');
    });

    QUnit.test('horizontal grid step', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            step: '10 7',
            width: 50
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS);
        const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(12, 0).dragEnd();
        assert.equal($resizable.outerWidth(), 60, 'grid step forward');
    });

    QUnit.test('vertical grid step', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            step: '7 10',
            height: 50
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS);
        const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(0, 12).dragEnd();
        assert.equal($resizable.outerHeight(), 60, 'grid step forward');
    });
});

QUnit.module('area', () => {
    QUnit.test('element bottom boundary', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            area: $('#areaDiv')
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS);
        const pointer = pointerMock($handle).start();
        const areaBottomBoundary = $('#areaDiv').offset().top + $('#areaDiv').outerHeight();

        pointer.down().move(0, 70).dragEnd();
        const resizableBottomBoundary = $resizable.offset().top + $resizable.outerHeight();

        assert.equal(resizableBottomBoundary, areaBottomBoundary, 'resizable did not go outside of the area');
    });

    QUnit.test('top boundary', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            area: $('#areaDiv')
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_TOP_CLASS);
        const pointer = pointerMock($handle).start();
        const areaTopBoundary = $('#areaDiv').offset().top;

        pointer.down().move(0, -70).dragEnd();
        const resizableTopBoundary = $resizable.offset().top;

        assert.equal(resizableTopBoundary, areaTopBoundary, 'resizable did not go outside of the area');
    });

    QUnit.test('left boundary', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            area: $('#areaDiv')
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_LEFT_CLASS);
        const pointer = pointerMock($handle).start();
        const areaLeftBoundary = $('#areaDiv').offset().left;

        pointer.down().move(-50, 0).dragEnd();
        const resizableLeftBoundary = $resizable.offset().left;

        assert.equal(resizableLeftBoundary, areaLeftBoundary, 'resizable did not go outside of the area');
    });

    QUnit.test('right boundary', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            area: function() { return $('#areaDiv'); }
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS);
        const pointer = pointerMock($handle).start();
        const areaRightBoundary = $('#areaDiv').offset().left + $('#areaDiv').outerWidth();

        pointer.down().move(70, 0).dragEnd();
        const resizableRightBoundary = $resizable.offset().left + $resizable.outerWidth();

        assert.equal(resizableRightBoundary, areaRightBoundary, 'resizable did not go outside of the area');
    });

    QUnit.test('borders should be included in drag offset', function(assert) {
        const $area = $('#areaDiv');
        const $resizable = $('#resizable').dxResizable({
            area: function() { return $area; }
        });

        $area.css('border', '6px solid red');
        $resizable.css('border', '8px solid red');

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_LEFT_CLASS)).start().down().move(-70, 0).dragEnd();
        assert.equal($resizable.offset().left, $area.offset().left + 6);

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_TOP_CLASS)).start().down().move(0, -70).dragEnd();
        assert.equal($resizable.offset().top, $area.offset().top + 6);

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS)).start().down().move(70, 0).dragEnd();
        assert.equal($resizable.offset().left + $resizable.outerWidth(), $area.offset().left + 6 + $area.innerWidth());

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS)).start().down().move(0, 70).dragEnd();
        assert.equal($resizable.offset().top + $resizable.outerHeight(), $area.offset().top + 6 + $area.innerHeight());
    });

    QUnit.test('It should be possible to set area as object with coordinates', function(assert) {
        const $area = $('#areaDiv'); const areaOffset = $area.offset(); const areaOffsetLeft = areaOffset.left; const areaOffsetTop = areaOffset.top;

        const $resizable = $('#resizable').dxResizable({
            area: function() {
                return {
                    left: areaOffsetLeft,
                    top: areaOffsetTop,
                    right: areaOffsetLeft + $area.outerWidth(),
                    bottom: areaOffsetTop + $area.outerHeight()
                };
            }
        });

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_LEFT_CLASS)).start().down().move(-70, 0).dragEnd();
        assert.equal($resizable.offset().left, areaOffsetLeft);

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_TOP_CLASS)).start().down().move(0, -70).dragEnd();
        assert.equal($resizable.offset().top, areaOffsetTop);
    });

    QUnit.test('Borders should be included in drag offset if area is object with coordinates', function(assert) {
        const $area = $('#areaDiv'); const areaOffset = $area.offset(); const areaOffsetLeft = areaOffset.left; const areaOffsetTop = areaOffset.top;

        const $resizable = $('#resizable').dxResizable({
            area: function() {
                return {
                    left: areaOffsetLeft,
                    top: areaOffsetTop,
                    right: areaOffsetLeft + $area.outerWidth(),
                    bottom: areaOffsetTop + $area.outerHeight()
                };
            }
        });

        $resizable.css('border', '8px solid red');

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_LEFT_CLASS)).start().down().move(-70, 0).dragEnd();
        assert.equal($resizable.offset().left, areaOffsetLeft);

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_TOP_CLASS)).start().down().move(0, -70).dragEnd();
        assert.equal($resizable.offset().top, areaOffsetTop);

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS)).start().down().move(70, 0).dragEnd();
        assert.equal($resizable.offset().left + $resizable.outerWidth(), areaOffsetLeft + $area.innerWidth());

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS)).start().down().move(0, 70).dragEnd();
        assert.equal($resizable.offset().top + $resizable.outerHeight(), areaOffsetTop + $area.innerHeight());
    });

    QUnit.test('Area can be a window', function(assert) {
        $('#resizable').offset({ left: 150, top: 150 });

        const $resizable = $('#resizable').dxResizable({
            area: $(window)
        });
        const resizableLeft = $resizable.offset().left;
        const resizableTop = $resizable.offset().top;

        $resizable.css('border', '8px solid red');

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_LEFT_CLASS)).start().down().move(-20, 0).dragEnd();
        assert.equal($resizable.offset().left, resizableLeft - 20);

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_TOP_CLASS)).start().down().move(0, -20).dragEnd();
        assert.equal($resizable.offset().top, resizableTop - 20);

        const resizableRight = $resizable.offset().left + $resizable.outerWidth();
        const resizableBottom = $resizable.offset().top + $resizable.outerHeight();

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_RIGHT_CLASS)).start().down().move(20, 0).dragEnd();
        assert.equal($resizable.offset().left + $resizable.outerWidth(), resizableRight + 20);

        pointerMock($resizable.find('.' + RESIZABLE_HANDLE_BOTTOM_CLASS)).start().down().move(0, 20).dragEnd();
        assert.equal($resizable.offset().top + $resizable.outerHeight(), resizableBottom + 20);
    });

    QUnit.test('resizing with \'window\' area that have a scroll offset', function(assert) {
        const scrollY = 1500;
        const scrollX = 2500;
        const $resizable = $('#resizable')
            .offset({ left: scrollX + 150, top: scrollY + 150 })
            .css('border', '8px solid red');
        const $fixtureElement = $('<div>')
            .height(3000)
            .width(3000)
            .appendTo('body');

        $(window)
            .scrollTop(scrollY)
            .scrollLeft(scrollX);

        $resizable.dxResizable({
            area: $(window)
        });

        pointerMock($resizable.find(`.${RESIZABLE_HANDLE_LEFT_CLASS}`))
            .start({ x: scrollX, y: scrollY })
            .down()
            .move(-20, 0)
            .dragEnd();
        assert.strictEqual($resizable.outerWidth(), 70, 'width changed correctly');

        pointerMock($resizable.find(`.${RESIZABLE_HANDLE_TOP_CLASS}`))
            .start({ x: scrollX, y: scrollY })
            .down()
            .move(0, -20)
            .dragEnd();
        assert.strictEqual($resizable.outerHeight(), 70, 'height changed correctly');
        $fixtureElement.remove();
    });
});

QUnit.module('actions', () => {
    QUnit.test('onResizeStart action should be fired on resize start', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            onResizeStart: function(e) {
                assert.ok(true, 'onResizeStart action fired');

                assert.equal(e.width, $resizable.outerWidth(), 'width passed as event argument');
                assert.equal(e.height, $resizable.outerHeight(), 'height passed as event argument');
            }
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-right');
        const pointer = pointerMock($handle).start();

        pointer.dragStart();
    });

    QUnit.test('onResizeStart - subscription by "on" method', function(assert) {
        assert.expect(3);

        const resizeStartHandler = function(e) {
            assert.ok(true, 'onResizeStart action fired');

            assert.equal(e.width, $resizable.outerWidth(), 'width passed as event argument');
            assert.equal(e.height, $resizable.outerHeight(), 'height passed as event argument');
        };

        const resize = () => {
            const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-right');
            const pointer = pointerMock($handle).start();
            pointer.dragStart();
        };

        const $resizable = $('#resizable').dxResizable();
        const instance = $resizable.dxResizable('instance');

        instance.on('resizeStart', resizeStartHandler);
        resize();

        instance.off('resizeStart', resizeStartHandler);
        resize();
    });

    QUnit.test('onResize action should be fired during resize', function(assert) {
        assert.expect(3);

        const $resizable = $('#resizable').dxResizable({
            onResize: function(e) {
                assert.ok(true, 'onResize action fired');

                assert.equal(e.width, $resizable.outerWidth(), 'width passed as event argument');
                assert.equal(e.height, $resizable.outerHeight(), 'height passed as event argument');
            }
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-right');
        const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(10, 0);
    });

    QUnit.test('onResize action - subscription by "on" method', function(assert) {
        assert.expect(3);

        const resizeHandler = function(e) {
            assert.ok(true, 'onResize action fired');

            assert.equal(e.width, $resizable.outerWidth(), 'width passed as event argument');
            assert.equal(e.height, $resizable.outerHeight(), 'height passed as event argument');
        };

        const resize = () => {
            const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-right');
            const pointer = pointerMock($handle).start();
            pointer.dragStart().drag(10, 0);
        };

        const $resizable = $('#resizable').dxResizable();
        const instance = $resizable.dxResizable('instance');

        instance.on('resize', resizeHandler);
        resize();

        instance.off('resize', resizeHandler);
        resize();
    });

    QUnit.test('dxresize event should be fired during resize', function(assert) {
        const $resizable = $('#resizable').dxResizable(); const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-right'); const pointer = pointerMock($handle).start();

        const triggerFunction = visibilityChange.triggerResizeEvent;
        assert.expect(1);

        try {
            visibilityChange.triggerResizeEvent = function() {
                assert.ok(true, 'event triggered');
            };

            pointer.dragStart().drag(10, 0);

        } finally {
            visibilityChange.triggerResizeEvent = triggerFunction;
        }
    });

    QUnit.test('onResize action should be fired with correct args when oversizing', function(assert) {
        assert.expect(2);

        const $resizable = $('#resizable').dxResizable({
            maxWidth: 100,
            maxHeight: 100,
            onResize: function(e) {
                assert.equal(e.width, 100, 'width passed as event argument');
            }
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-right');
        const resizable = $resizable.dxResizable('instance');
        const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(160, 0);

        resizable.option('onResize', function(e) {
            assert.equal(e.height, 100, 'height passed as event argument');
        });

        pointer.dragStart().drag(0, 160);
    });

    QUnit.test('onResizeEnd action should be fired after end resize', function(assert) {
        const $resizable = $('#resizable').dxResizable({
            onResizeEnd: function(e) {
                assert.ok(true, 'onResizeEnd action fired');

                assert.equal(e.width, $resizable.outerWidth(), 'width passed as event argument');
                assert.equal(e.height, $resizable.outerHeight(), 'height passed as event argument');
            }
        });
        const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-right');
        const pointer = pointerMock($handle).start();

        pointer.dragStart().drag(10, 0).dragEnd();
    });

    QUnit.test('onResizeEnd action - subscription by "on" method', function(assert) {
        const resizeEndHandler = function(e) {
            assert.ok(true, 'onResizeEnd action fired');

            assert.equal(e.width, $resizable.outerWidth(), 'width passed as event argument');
            assert.equal(e.height, $resizable.outerHeight(), 'height passed as event argument');
        };

        const resize = () => {
            const $handle = $resizable.find('.' + RESIZABLE_HANDLE_CORNER_CLASS + '-bottom-right');
            const pointer = pointerMock($handle).start();
            pointer.dragStart().drag(10, 0).dragEnd();
        };

        const $resizable = $('#resizable').dxResizable();
        const instance = $resizable.dxResizable('instance');

        instance.on('resizeEnd', resizeEndHandler);
        resize();

        instance.off('resizeEnd', resizeEndHandler);
        resize();
    });
});

