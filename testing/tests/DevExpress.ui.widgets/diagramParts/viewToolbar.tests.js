import $ from 'jquery';
const { test } = QUnit;
import 'ui/diagram';

import { Consts, getViewToolbarElement, getViewToolbarInstance, findViewToolbarItem, findContextMenuItem, getContextMenuItemCheck } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('View Toolbar', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('should not render if toolbar.visible is false', function(assert) {
        let $toolbar = this.$element.find(Consts.FLOATING_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 3);
        this.instance.option('viewToolbar.visible', false);
        $toolbar = this.$element.find(Consts.FLOATING_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 2);
    });
    test('should fill toolbar with default items', function(assert) {
        const toolbar = getViewToolbarInstance(this.$element);
        assert.equal(toolbar.option('dataSource').length, 6);
    });
    test('should fill toolbar with custom items', function(assert) {
        this.instance.option('viewToolbar.commands', ['copy']);
        const toolbar = getViewToolbarInstance(this.$element);
        assert.equal(toolbar.option('dataSource').length, 1);
    });
    test('should toggle fullscreen class name on button click', function(assert) {
        assert.notOk(this.$element.hasClass(Consts.FULLSCREEN_CLASS));
        const $fullScreenButton = findViewToolbarItem(this.$element, 'full screen');
        $fullScreenButton.trigger('dxclick');
        assert.ok(this.$element.hasClass(Consts.FULLSCREEN_CLASS));
        $fullScreenButton.trigger('dxclick');
        assert.notOk(this.$element.hasClass(Consts.FULLSCREEN_CLASS));
    });
    test('diagram should be focused after button click', function(assert) {
        assert.notOk(this.$element.hasClass(Consts.FULLSCREEN_CLASS));
        const $fullScreenButton = findViewToolbarItem(this.$element, 'full screen');
        assert.notEqual(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
        $fullScreenButton.trigger('dxclick');
        this.clock.tick(200);
        assert.equal(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
    });
    test('should toggle check state on show grid button click', function(assert) {
        assert.equal(this.instance.option('showGrid'), true);

        const $optionsButton = findViewToolbarItem(this.$element, 'settings');
        $optionsButton.trigger('dxclick');
        let $showGridButton = findContextMenuItem(this.$element, 'show grid');
        let $showGridButtonCheck = getContextMenuItemCheck($showGridButton);
        assert.equal($showGridButtonCheck.length, 1);
        assert.equal($showGridButtonCheck.css('visibility'), 'visible');
        $showGridButton.trigger('dxclick');
        assert.equal(this.instance.option('showGrid'), false);

        $optionsButton.trigger('dxclick');
        $showGridButton = findContextMenuItem(this.$element, 'show grid');
        $showGridButtonCheck = getContextMenuItemCheck($showGridButton);
        assert.equal($showGridButtonCheck.css('visibility'), 'hidden');
    });
    test('should toggle check state on zoom levels', function(assert) {
        assert.equal(this.instance.option('zoomLevel'), 1);

        const $viewToolbar = getViewToolbarElement(this.$element);
        const $zoomLevelTextBox = $viewToolbar.find('.dx-textbox');
        const $zoomLevelDropDownButton = $zoomLevelTextBox.find('.dx-button');
        $zoomLevelDropDownButton.trigger('dxclick');
        this.clock.tick(200); // initiate render

        let $zoomLevel100Button = findContextMenuItem(this.$element, '100%');
        let $zoomLevel100ButtonCheck = getContextMenuItemCheck($zoomLevel100Button);
        let $zoomLevel200Button = findContextMenuItem(this.$element, '200%');
        let $zoomLevel200ButtonCheck = getContextMenuItemCheck($zoomLevel200Button);
        assert.equal($zoomLevel100ButtonCheck.length, 1);
        assert.equal($zoomLevel200ButtonCheck.length, 1);
        assert.equal($zoomLevel100ButtonCheck.css('visibility'), 'visible');
        assert.equal($zoomLevel200ButtonCheck.css('visibility'), 'hidden');
        $zoomLevel200Button.trigger('dxclick');
        assert.equal(this.instance.option('zoomLevel'), 2);

        $zoomLevelDropDownButton.trigger('dxclick');
        this.clock.tick(200); // initiate render
        $zoomLevelDropDownButton.trigger('dxclick');

        $zoomLevel100Button = findContextMenuItem(this.$element, '100%');
        $zoomLevel100ButtonCheck = getContextMenuItemCheck($zoomLevel100Button);
        $zoomLevel200Button = findContextMenuItem(this.$element, '200%');
        $zoomLevel200ButtonCheck = getContextMenuItemCheck($zoomLevel200Button);
        assert.equal($zoomLevel100ButtonCheck.css('visibility'), 'hidden');
        assert.equal($zoomLevel200ButtonCheck.css('visibility'), 'visible');
    });
});
