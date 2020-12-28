import $ from 'jquery';
import { dropDownEditorsList } from '../../helpers/widgetsList.js';
import { defaultDropDownOptions } from '../../helpers/dropDownOptions.js';

import 'common.css!';
import 'generic_light.css!';

const dropDownEditorsNames = Object.keys(dropDownEditorsList);
const dropDownOptionsKeys = Object.keys(defaultDropDownOptions);
const expectedPositionCollision = {
    dxAutocomplete: 'flip',
    dxColorBox: 'flip flip',
    dxDateBox: 'flipfit flip',
    dxDropDownBox: 'flipfit',
    dxDropDownButton: 'flipfit',
    dxSelectBox: 'flip',
    dxTagBox: 'flip',
};


const getPopupInstance = (editor) => {
    return editor._popup;
};
const skipTesting = (assert) => {
    assert.ok(true, 'tests for this option are implemented separately');
};

QUnit.testStart(function() {
    const markup = '<div id="editor"></div>\
    <div id="container"></div>';

    $('#qunit-fixture').html(markup);
});

const optionComparer = {
    position: function(assert, editor) {
        const expectedPosition = {
            my: 'left top',
            at: 'left bottom',
            collision: expectedPositionCollision[editor.NAME],
            of: $('#editor')
        };

        ['my', 'at', 'collision'].forEach(positionProp => {
            assert.strictEqual(editor.option('dropDownOptions.position')[positionProp], expectedPosition[positionProp], `dropDownOptions.position.${positionProp} is correct`);
            assert.strictEqual(getPopupInstance(editor).option('position')[positionProp], expectedPosition[positionProp], `popup position.${positionProp} is correct`);
        });
        assert.strictEqual(editor.option('dropDownOptions.position.of').get(0), expectedPosition.of.get(0), 'dropDownOptions.position.of is correct');
        assert.strictEqual(getPopupInstance(editor).option('position.of').get(0), expectedPosition.of.get(0), 'dropDownOptions.position.of is correct');
    },
    contentTemplate: function(assert, editor) {
        if(editor.NAME === 'dxDropDownBox' || editor.NAME === 'dxDropDownButton') {
            assert.strictEqual(editor.option('dropDownOptions.contentTemplate'), 'content', 'dropDownOptions.contentTemplate is correct');
            assert.strictEqual(getPopupInstance(editor).option('contentTemplate'), 'content', 'popup contentTemplate is correct');
            return;
        }

        assert.strictEqual(editor.option('dropDownOptions.contentTemplate'), null, 'dropDownOptions.contentTemplate is correct');
        assert.strictEqual(getPopupInstance(editor).option('contentTemplate'), null, 'popup contentTemplate is correct');
    },
    title: function(assert, editor) {
        if(editor.NAME === 'dxDateBox') {
            const expectedTitle = editor._getPopupTitle();
            assert.strictEqual(editor.option('dropDownOptions.title'), expectedTitle, 'dropDownOptions.title is correct');
            assert.strictEqual(getPopupInstance(editor).option('title'), expectedTitle, 'popup title is correct');
            return;
        }

        assert.strictEqual(editor.option('dropDownOptions.title'), '', 'dropDownOptions.title is correct');
        assert.strictEqual(getPopupInstance(editor).option('title'), '', 'popup title is correct');
    },
    deferRendering: skipTesting,
    closeOnOutsideClick: skipTesting,
    width: skipTesting,
    maxHeight: skipTesting
};

QUnit.module('dropDownOptions value on pure init', () => {
    dropDownEditorsNames.forEach(widgetName => {
        QUnit.module(widgetName, function() {
            dropDownOptionsKeys.forEach(option => {
                QUnit.test(`${option} is correct`, function(assert) {
                    const editor = new dropDownEditorsList[widgetName]('#editor', { deferRendering: false, applyValueMode: 'instantly', usePopover: false });

                    if(optionComparer[option]) {
                        optionComparer[option](assert, editor);
                        return;
                    }

                    assert.deepEqual(editor.option(`dropDownOptions.${option}`), defaultDropDownOptions[option], `dropDownOptions.${option} is equal to ${defaultDropDownOptions[option]}`);
                    assert.deepEqual(getPopupInstance(editor).option(option), defaultDropDownOptions[option], `popup ${option} is equal to ${defaultDropDownOptions[option]}`);
                });
            });
        });
    });
});
