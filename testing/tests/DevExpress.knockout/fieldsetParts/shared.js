const $ = require('jquery');
const ko = require('knockout');
const browser = require('core/utils/browser');
const devices = require('core/devices');
const themes = require('ui/themes');

require('../../../helpers/executeAsyncMock.js');
require('integration/knockout');
require('bundles/modules/parts/widgets-all');

const LABEL = '.dx-field-label';
const VALUE = '.dx-field-value';

const fieldsetFixtureTemplate = '    <div id="markup" style="width: 980px">								\
    <div class="dx-fieldset" id="widgetsOnFields">														\
        <div class="dx-field" id="switchOnField">														\
            <div class="dx-field-label" data-bind="text: \'Switch:\'"></div>							\
            <div class="dx-field-value" data-bind="dxSwitch: {}"></div>									\
        </div>																							\
        <div class="dx-field" id="checkboxOnField">														\
            <div class="dx-field-label" data-bind="text: \'CheckBox:\'"></div>							\
            <div class="dx-field-value" data-bind="dxCheckBox: {}"></div>								\
        </div>																							\
        <div class="dx-field" id="textboxOnField">														\
            <div class="dx-field-label" data-bind="text: \'TextBox: \'"></div>							\
            <div class="dx-field-value" data-bind="dxTextBox: {}"></div>								\
        </div>																							\
        <div class="dx-field" id="autocompleteOnField">													\
            <div class="dx-field-label" data-bind="text: \'Autocomplete: \'"></div>						\
            <div class="dx-field-value" data-bind="dxAutocomplete: {}"></div>							\
        </div>																							\
        <div class="dx-field" id="textareaOnField">														\
            <div class="dx-field-label" data-bind="text: \'TextArea: \'"></div>							\
            <div class="dx-field-value" data-bind="dxTextArea: {}"></div>								\
        </div>																							\
        <div class="dx-field" id="lookupOnField">														\
            <div class="dx-field-label" data-bind="text: \'Lookup: \'"></div>							\
            <div class="dx-field-value" data-bind="dxLookup: {}"></div>									\
        </div>																							\
        <div class="dx-field" id="sliderOnField">														\
            <div class="dx-field-label" data-bind="text: \'Slider: \'"></div>							\
            <div class="dx-field-value" data-bind="dxSlider: {}"></div>									\
        </div>																							\
        <div class="dx-field" id="dateboxOnField">														\
            <div class="dx-field-label" data-bind="text: \'DateBox: \'"></div>							\
            <div class="dx-field-value" data-bind="dxDateBox: { useCalendar: false }"></div>			\
        </div>																							\
        <div class="dx-field" id="numberboxOnField">													\
            <div class="dx-field-label" data-bind="text: \'dxNumberBox: \'"></div>						\
            <div class="dx-field-value" data-bind="dxNumberBox: {}"></div>								\
        </div>																							\
        <div class="dx-field" id="simpleTextOnField">													\
            <div class="dx-field-label" data-bind="text: \'Simple text: \'"></div>						\
            <div class="dx-field-value dx-field-value-static" data-bind="text: \'Simple text\'"></div>	\
        </div>																							\
    </div>																								\
    <div class="dx-fieldset" id="widgetsInFields">														\
        <div class="dx-field" id="switchInField">														\
            <div class="dx-field-label" data-bind="text: \'Switch:\'"></div>							\
            <div class="dx-field-value">																\
                <div data-bind="dxSwitch: {}"></div>													\
            </div>																						\
        </div>																							\
        <div class="dx-field" id="checkboxInField">														\
            <div class="dx-field-label" data-bind="text: \'CheckBox:\'"></div>							\
            <div class="dx-field-value">																\
                <div data-bind="dxCheckBox: {}"></div>													\
            </div>																						\
        </div>																							\
        <div class="dx-field" id="textboxInField">														\
            <div class="dx-field-label" data-bind="text: \'TextBox: \'"></div>							\
            <div class="dx-field-value">																\
                <div data-bind="dxTextBox: {}"></div>													\
            </div>																						\
        </div>																							\
        <div class="dx-field" id="autocompleteInField">													\
            <div class="dx-field-label" data-bind="text: \'Autocomplete: \'"></div>						\
            <div class="dx-field-value">																\
                <div data-bind="dxAutocomplete: {}"></div>												\
            </div>																						\
        </div>																							\
        <div class="dx-field" id="textareaInField">														\
            <div class="dx-field-label" data-bind="text: \'TextArea: \'"></div>							\
            <div class="dx-field-value">																\
                <div data-bind="dxTextArea: {}"></div>													\
            </div>																						\
        </div>																							\
        <div class="dx-field" id="lookupInField">														\
            <div class="dx-field-label" data-bind="text: \'Lookup: \'"></div>							\
            <div class="dx-field-value">																\
                <div data-bind="dxLookup: {}"></div>													\
            </div>																						\
        </div>																							\
        <div class="dx-field" id="sliderInField">														\
            <div class="dx-field-label" data-bind="text: \'Slider: \'"></div>							\
            <div class="dx-field-value">																\
                <div data-bind="dxSlider: {}"></div>													\
            </div>																						\
        </div>																							\
        <div class="dx-field" id="dateboxInField">														\
            <div class="dx-field-label" data-bind="text: \'DateBox: \'"></div>							\
            <div class="dx-field-value">																\
                <div data-bind="dxDateBox: { useCalendar: false }"></div>						     	\
            </div>																						\
        </div>																							\
        <div class="dx-field" id="numberboxInField">													\
            <div class="dx-field-label" data-bind="text: \'dxNumberBox: \'"></div>						\
            <div class="dx-field-value">																\
                <div data-bind="dxNumberBox: {}"></div>													\
            </div>																						\
        </div>																							\
        <div class="dx-field" id="simpleTextInField">													\
            <div class="dx-field-label" data-bind="text: \'Simple text: \'"></div>						\
            <div class="dx-field-value dx-field-value-static">											\
                Simple text																				\
            </div>																						\
        </div>																							\
    </div>																								\
</div>';


const checkThatTestingIsPossible = function() {
    if(browser.mozilla) {
        QUnit.test('Temporarily we do not test for firefox', function(assert) {
            assert.ok(true);
        });
        return false;
    }

    if(!browser.webkit) {
        QUnit.test('Temporarily we do not test for non-webkit browsers', function(assert) {
            assert.ok(true);
        });
        return false;
    }

    const realDevice = devices.real();
    if(realDevice.platform === 'android' || realDevice.platform === 'ios') {
        QUnit.test('Temporarily we do not test on mobile devices', function(assert) {
            assert.ok(true);
        });
        return false;
    }

    return true;
};

const defaultOptions = {
    numberBoxAlign: 'right',
    testVerticalOffset: true,
    testSwitchBaseline: true,
    testDateBox: true
};

const getFullOffsetLeft = function($element) {
    return Math.round($element.offset().left +
        parseFloat($element.css('padding-left')) +
        parseFloat($element.css('border-left-width')));
};

const getFullOffsetRight = function($element) {
    return Math.round($element.offset().left +
        $element.innerWidth());
};

const testVerticalAlign = function($parent, inputSelector, isContainer, testVerticalOffsetFlag) {
    const $label = $parent.find(LABEL);
    const $value = $parent.find(inputSelector);

    if(testVerticalOffsetFlag) {
        testVerticalOffset($label, $value);
    }

    const $valueContainer = isContainer ? $value : $value.parent();
    testBaselineOffset($label, $valueContainer);
};

var testVerticalOffset = function($label, $value) {
    const isIE9 = document.all && !document.atob;
    const labelOffset = Math.round($label.offset().top - parseInt($label.css('margin-top')) - isIE9 ? parseInt($label.css('borderTopWidth')) : 0);
    const valueOffset = Math.round($value.offset().top - parseInt($value.css('margin-top')) - isIE9 ? parseInt($value.css('borderTopWidth')) : 0);

    QUnit.assert.equal(labelOffset, valueOffset, 'Top offset equal');
};

var testBaselineOffset = function($labelContainer, $valueContainer) {
    let $imgForLabel;
    let $imgForInput;

    try {
        $imgForLabel = $('<img/>').height(1).width(1).appendTo($labelContainer);
        $imgForInput = $('<img/>').height(1).width(1).appendTo($valueContainer);
        $imgForLabel.closest('.dx-field-label').css('whiteSpace', 'nowrap');
        $imgForInput.closest('.dx-field-value').css('whiteSpace', 'nowrap');
        QUnit.assert.roughEqual($imgForLabel.offset().top, $imgForInput.offset().top, 0.99);
    } finally {
        $imgForLabel.remove();
        $imgForInput.remove();
    }
};


module.exports = function(themeName, options) {
    if(!checkThatTestingIsPossible()) {
        return;
    }

    options = options || {};
    options = $.extend({}, defaultOptions, options);

    const runTestModule = function(themeName) {
        QUnit.module(themeName, {
            beforeEach: function() {
                DevExpress.testing.executeAsyncMock.setup();
                $('#qunit-fixture').html(fieldsetFixtureTemplate);
                const $markup = $('#markup');
                ko.applyBindings({}, $markup.get(0));
            },
            afterEach: function() {
                $('#qunit-fixture').empty();
                DevExpress.testing.executeAsyncMock.teardown();
            }
        });

        QUnit.test('Horizontal align for same widgets on and in field-value', function(assert) {
            const offsetRightForSwitchOnField = getFullOffsetRight($('#switchOnField ' + VALUE + ' .dx-switch-wrapper'));
            const offsetRightForSwitchInField = getFullOffsetRight($('#switchInField ' + VALUE + ' .dx-switch-wrapper'));

            const offsetRightForCheckboxOnField = getFullOffsetRight($('#checkboxOnField ' + VALUE + ' .dx-checkbox-icon'));
            const offsetRightForCheckboxInField = getFullOffsetRight($('#checkboxInField ' + VALUE + ' .dx-checkbox-icon'));

            const offsetLeftForSliderOnField = getFullOffsetLeft($('#sliderOnField ' + VALUE + ' .dx-slider-wrapper'));
            const offsetLeftForSliderInField = getFullOffsetLeft($('#sliderInField ' + VALUE + ' .dx-slider-wrapper'));

            const offsetLeftForTextBoxOnField = getFullOffsetLeft($('#textboxOnField ' + VALUE + ' input'));
            const offsetLeftForTextBoxInField = getFullOffsetLeft($('#textboxInField ' + VALUE + ' input'));

            const offsetLeftForAutocompleteOnField = getFullOffsetLeft($('#autocompleteOnField ' + VALUE + ' input.dx-texteditor-input'));
            const offsetLeftForAutocompleteInField = getFullOffsetLeft($('#autocompleteInField ' + VALUE + ' input.dx-texteditor-input'));

            const offsetLeftForDateBoxOnField = getFullOffsetLeft($('#dateboxOnField ' + VALUE + ' input'));
            const offsetLeftForDateBoxInField = getFullOffsetLeft($('#dateboxInField ' + VALUE + ' input'));

            const offsetLeftForTextAreaOnField = getFullOffsetLeft($('#textareaOnField ' + VALUE + ' textarea'));
            const offsetLeftForTextAreaInField = getFullOffsetLeft($('#textareaInField ' + VALUE + ' textarea'));

            const offsetLeftForLookupOnField = getFullOffsetLeft($('#lookupOnField ' + VALUE + ' .dx-lookup-field'));
            const offsetLeftForLookupInField = getFullOffsetLeft($('#lookupInField ' + VALUE + ' .dx-lookup-field'));

            const offsetLeftForSimpleOnField = getFullOffsetLeft($('#simpleTextOnField ' + VALUE));
            const offsetLeftForSimpleInField = getFullOffsetLeft($('#simpleTextInField ' + VALUE));

            const offsetRightForNumberBoxOnField = getFullOffsetRight($('#numberboxOnField ' + VALUE + ' input'));
            const offsetRightForNumberBoxInField = getFullOffsetRight($('#numberboxInField ' + VALUE + ' input'));

            const offsetLeftForNumberBoxOnField = getFullOffsetLeft($('#numberboxOnField ' + VALUE + ' input'));
            const offsetLeftForNumberBoxInField = getFullOffsetLeft($('#numberboxInField ' + VALUE + ' input'));

            assert.equal(offsetRightForSwitchOnField, offsetRightForSwitchInField, 'Horizontal align for switches');
            assert.equal(offsetRightForCheckboxOnField, offsetRightForCheckboxInField, 'Horizontal align for checkboxes');
            assert.equal(offsetLeftForSliderOnField, offsetLeftForSliderInField, 'Horizontal align for sliders');
            assert.equal(offsetLeftForTextBoxOnField, offsetLeftForTextBoxInField, 'Horizontal align for textboxes');
            assert.equal(offsetLeftForAutocompleteOnField, offsetLeftForAutocompleteInField, 'Horizontal align for autocompletes');

            if(options.testDateBox) {
                assert.equal(offsetLeftForDateBoxOnField, offsetLeftForDateBoxInField, 'Horizontal align for dateboxes');
            }

            assert.equal(offsetLeftForTextAreaOnField, offsetLeftForTextAreaInField, 'Horizontal align for textareas');
            assert.equal(offsetLeftForLookupOnField, offsetLeftForLookupInField, 'Horizontal align for lookups');
            assert.equal(offsetLeftForSimpleOnField, offsetLeftForSimpleInField, 'Horizontal align for simples');
            if(options.numberBoxAlign === 'right') {
                assert.equal(offsetRightForNumberBoxOnField, offsetRightForNumberBoxInField, 'Horizontal align for numberboxes');
            } else if(options.numberBoxAlign === 'left') {
                assert.equal(offsetLeftForNumberBoxOnField, offsetLeftForNumberBoxInField, 'Horizontal align for numberboxes');
            }
        });

        QUnit.test('Horizontal align for different widgets on field-value', function(assert) {
            const offsetLeftForTextBoxOnField = getFullOffsetLeft($('#textboxOnField ' + VALUE + ' input'));

            const offsetLeftForAutocompleteOnField = getFullOffsetLeft($('#autocompleteOnField ' + VALUE + ' input.dx-texteditor-input'));

            let offsetLeftForDateBoxOnField = getFullOffsetLeft($('#dateboxOnField ' + VALUE + ' input.dx-texteditor-input'));

            const offsetLeftForTextAreaOnField = getFullOffsetLeft($('#textareaOnField ' + VALUE + ' textarea'));

            const offsetLeftForLookupOnField = getFullOffsetLeft($('#lookupOnField ' + VALUE + ' .dx-lookup-field'));

            const offsetLeftForSimpleOnField = getFullOffsetLeft($('#simpleTextOnField ' + VALUE));

            const currentTheme = themes.current();

            const paddingTextAreaDifference = currentTheme === 'ios.default' || currentTheme === 'ios7.default' ? 3 : 0;

            assert.equal(offsetLeftForTextBoxOnField, offsetLeftForAutocompleteOnField, 'Horizontal align for textbox and autocomplete');

            if(options.testDateBox) {
                assert.equal(offsetLeftForAutocompleteOnField, offsetLeftForDateBoxOnField, 'Horizontal align for autocomplete and datebox');
            } else {
                offsetLeftForDateBoxOnField = offsetLeftForAutocompleteOnField;
            }

            assert.equal(offsetLeftForDateBoxOnField, offsetLeftForTextAreaOnField + paddingTextAreaDifference, 'Horizontal align for datebox and textarea');
            assert.equal(offsetLeftForTextAreaOnField + paddingTextAreaDifference, offsetLeftForLookupOnField, 'Horizontal align for textarea and lookup');
            assert.equal(offsetLeftForLookupOnField, offsetLeftForSimpleOnField, 'Horizontal align for lookup and simpletext');
        });

        QUnit.test('Equal width for same widgets on and in field-value', function(assert) {
            const widthForSwitchOnField = $('#switchOnField ' + VALUE + ' .dx-switch-wrapper').width();
            const widthForSwitchInField = $('#switchInField ' + VALUE + ' .dx-switch-wrapper').width();

            const widthForCheckboxOnField = $('#checkboxOnField ' + VALUE + ' .dx-checkbox-icon').width();
            const widthForCheckboxInField = $('#checkboxInField ' + VALUE + ' .dx-checkbox-icon').width();

            const widthForSliderOnField = $('#sliderOnField ' + VALUE + ' .dx-slider-wrapper').width();
            const widthForSliderInField = $('#sliderInField ' + VALUE + ' .dx-slider-wrapper').width();

            const widthForTextBoxOnField = $('#textboxOnField ' + VALUE + ' input').width();
            const widthForTextBoxInField = $('#textboxInField ' + VALUE + ' input').width();

            const widthForAutocompleteOnField = $('#autocompleteOnField ' + VALUE + ' input.dx-texteditor-input').width();
            const widthForAutocompleteInField = $('#autocompleteInField ' + VALUE + ' input.dx-texteditor-input').width();

            const widthForDateBoxOnField = $('#dateboxOnField ' + VALUE + ' input.dx-texteditor-input').width();
            const widthForDateBoxInField = $('#dateboxInField ' + VALUE + ' input.dx-texteditor-input').width();

            const widthForTextAreaOnField = $('#textareaOnField ' + VALUE + ' textarea').width();
            const widthForTextAreaInField = $('#textareaInField ' + VALUE + ' textarea').width();

            const widthForLookupOnField = $('#lookupOnField ' + VALUE + ' .dx-lookup-field').width();
            const widthForLookupInField = $('#lookupInField ' + VALUE + ' .dx-lookup-field').width();

            const widthForSimpleOnField = $('#simpleTextOnField ' + VALUE).width();
            const widthForSimpleInField = $('#simpleTextInField ' + VALUE).width();

            const widthForNumberBoxOnField = $('#numberboxOnField ' + VALUE + ' input').width();
            const widthForNumberBoxInField = $('#numberboxInField ' + VALUE + ' input').width();

            assert.equal(widthForSwitchOnField, widthForSwitchInField, 'Width for switches');
            assert.equal(widthForCheckboxOnField, widthForCheckboxInField, 'Width for checkboxes');
            assert.equal(widthForSliderOnField, widthForSliderInField, 'Width for sliders');
            assert.equal(widthForTextBoxOnField, widthForTextBoxInField, 'Width for textboxes');
            assert.equal(widthForAutocompleteOnField, widthForAutocompleteInField, 'Width for autocompletes');
            assert.equal(widthForDateBoxOnField, widthForDateBoxInField, 'Width for dateboxes');
            assert.equal(widthForTextAreaOnField, widthForTextAreaInField, 'Width for textarea');
            assert.equal(widthForLookupOnField, widthForLookupInField, 'Width for lookups');
            assert.equal(widthForSimpleOnField, widthForSimpleInField, 'Width for simples');
            assert.equal(widthForNumberBoxOnField, widthForNumberBoxInField, 'Width for numberboxes');
        });

        QUnit.test('dxSwitch on Field', function(assert) {
            if(options.testSwitchBaseline) {
                testBaselineOffset($('#switchOnField ' + LABEL), $('#switchOnField').find(VALUE + ' .dx-switch-off'), true);
            } else {
                assert.ok(true);
            }
        });

        QUnit.test('dxSwitch in Field', function(assert) {
            if(options.testSwitchBaseline) {
                testBaselineOffset($('#switchInField ' + LABEL), $('#switchInField').find(VALUE + ' .dx-switch-off'), true);
            } else {
                assert.ok(true);
            }
        });

        QUnit.test('dxTextbox on Field', function(assert) {
            testVerticalAlign($('#textboxOnField'), VALUE + ' input', false, options.testVerticalOffset);
        });

        QUnit.test('dxTextbox in Field', function(assert) {
            testVerticalAlign($('#textboxInField'), VALUE + ' input', false, options.testVerticalOffset);
        });

        QUnit.test('dxAutocomplete on Field', function(assert) {
            testVerticalAlign($('#autocompleteOnField'), VALUE + ' input.dx-texteditor-input', false, options.testVerticalOffset);
        });

        QUnit.test('dxAutocomplete in Field', function(assert) {
            testVerticalAlign($('#autocompleteInField'), VALUE + ' input.dx-texteditor-input', false, options.testVerticalOffset);
        });

        QUnit.test('dxLookup on Field', function(assert) {
            testVerticalAlign($('#lookupOnField'), VALUE + ' .dx-lookup-field', true, options.testVerticalOffset);
        });

        QUnit.test('dxLookup in Field', function(assert) {
            testVerticalAlign($('#lookupInField'), VALUE + ' .dx-lookup-field', true, options.testVerticalOffset);
        });

        QUnit.test('simpleText on Field', function(assert) {
            testVerticalAlign($('#simpleTextOnField'), VALUE, true, options.testVerticalOffset);
        });

        QUnit.test('simpleText in Field', function(assert) {
            testVerticalAlign($('#simpleTextInField'), VALUE, true, options.testVerticalOffset);
        });

        QUnit.test('dxNumberbox on Field', function(assert) {
            testVerticalAlign($('#numberboxOnField'), VALUE + ' input.dx-texteditor-input', false, options.testVerticalOffset);
        });

        QUnit.test('dxNumberbox in Field', function(assert) {
            testVerticalAlign($('#numberboxInField'), VALUE + ' input.dx-texteditor-input', false, options.testVerticalOffset);
        });

        QUnit.test('dxTextarea on Field', function(assert) {
            const $parent = $('#textareaOnField');
            const $label = $parent.find(LABEL);
            const $valueInput = $parent.find(VALUE + ' textarea');

            if(options.verticalOffsetTest) {
                testVerticalOffset($label, $valueInput);
            }

            const cloneTextArea = $('<div>').css('display', 'inline-block')
                .css('vertical-align', 'top')
                .css('padding-top', $valueInput.css('padding-top'))
                .css('paddingBottom', $valueInput.css('paddingBottom'))
                .css('margin-top', $valueInput.css('margin-top'))
                .css('marginBottom', $valueInput.css('marginBottom'))
                .css('borderTopWidth', $valueInput.css('borderTopWidth'))
                .css('borderBottomWidth', $valueInput.css('borderBottomWidth'))
                .css('border-top-style', $valueInput.css('border-top-style'))
                .css('border-bottom-style', $valueInput.css('border-bottom-style'))
                .prependTo($valueInput.parent());
            testBaselineOffset($label, cloneTextArea);
        });

        QUnit.test('dxTextarea in Field', function(assert) {
            const $parent = $('#textareaInField');
            const $label = $parent.find(LABEL);
            const $valueInput = $parent.find(VALUE + ' textarea');

            if(options.verticalOffsetTest) {
                testVerticalOffset($label, $valueInput);
            }

            const cloneTextArea = $('<div>').css('display', 'inline-block')
                .css('vertical-align', 'top')
                .css('padding-top', $valueInput.css('padding-top'))
                .css('paddingBottom', $valueInput.css('paddingBottom'))
                .css('margin-top', $valueInput.css('margin-top'))
                .css('marginBottom', $valueInput.css('marginBottom'))
                .css('borderTopWidth', $valueInput.css('borderTopWidth'))
                .css('borderBottomWidth', $valueInput.css('borderBottomWidth'))
                .css('border-top-style', $valueInput.css('border-top-style'))
                .css('border-bottom-style', $valueInput.css('border-bottom-style'))
                .prependTo($valueInput.parent());
            testBaselineOffset($label, cloneTextArea);
        });
    };

    runTestModule();
};
