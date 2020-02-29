import $ from 'jquery';

import PopupModule from 'ui/html_editor/modules/popup';
import windowUtils from 'core/utils/window';

const POPUP_CLASS = 'dx-popup';
const SUGGESTION_LIST_CLASS = 'dx-suggestion-list';
const SUGGESTION_LIST_WRAPPER_CLASS = 'dx-suggestion-list-wrapper';

const MIN_HEIGHT = 100;

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#htmlEditor');
        this.clock = sinon.useFakeTimers();

        this.options = {
            editorInstance: {
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                }
            }
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
};

const { test } = QUnit;

QUnit.module('Popup module', moduleConfig, () => {
    test('Render Popup with a suggestion list', function(assert) {
        this.options.dataSource = ['Test1', 'Test2'];
        new PopupModule({}, this.options);

        const $popup = this.$element.children();
        const $suggestionList = $popup.find(`.${SUGGESTION_LIST_CLASS}`);
        const listDataSource = $suggestionList.dxList('option', 'dataSource');

        assert.ok($popup.hasClass(POPUP_CLASS), 'Popup rendered');
        assert.strictEqual($suggestionList.length, 1, 'Popup contains one suggestion list');
        assert.deepEqual(listDataSource, this.options.dataSource, 'List has a correct dataSource');
    });

    test('Show and hide popup on item selecting', function(assert) {
        this.options.dataSource = ['Test1', 'Test2'];
        const popupModule = new PopupModule({}, this.options);
        const insertEmbedContent = sinon.spy(popupModule, 'insertEmbedContent');

        popupModule.showPopup();
        this.clock.tick();
        const $suggestionList = $(`.${SUGGESTION_LIST_CLASS}`);
        const $suggestionListWrapper = $suggestionList.closest(`.${SUGGESTION_LIST_WRAPPER_CLASS}`);

        assert.strictEqual($suggestionListWrapper.length, 1, 'Suggestion list is wrapped by element with specific class');
        assert.ok($suggestionList.is(':visible'), 'list is visible');
        assert.strictEqual($suggestionList.length, 1, 'one list');
        assert.ok(insertEmbedContent.notCalled, 'ok');

        $suggestionList.find('.dx-list-item').first().trigger('dxclick');
        this.clock.tick(500);
        assert.ok(insertEmbedContent.calledOnce, 'ok');
        assert.notOk($suggestionList.is(':visible'), 'list isn\'t visible');
    });

    test('Save position and get position', function(assert) {
        const popupModule = new PopupModule({}, this.options);

        popupModule.savePosition(5);

        assert.strictEqual(popupModule.getPosition(), 5, 'correct position');
    });

    test('Max height should be a half of the window height', function(assert) {
        const windowStub = sinon.stub(windowUtils, 'getWindow').returns($('<div>').height(240));
        const popupModule = new PopupModule({}, this.options);

        assert.strictEqual(popupModule.maxHeight, 120, 'max height is a half of the window height');
        windowStub.restore();
    });

    test('Max height shouldn\'t less than a predefined threshold', function(assert) {
        const windowStub = sinon.stub(windowUtils, 'getWindow').returns($('<div>').height(80));
        const popupModule = new PopupModule({}, this.options);

        assert.strictEqual(popupModule.maxHeight, MIN_HEIGHT, 'Max height cannot be less than a threshold');
        windowStub.restore();
    });
});
