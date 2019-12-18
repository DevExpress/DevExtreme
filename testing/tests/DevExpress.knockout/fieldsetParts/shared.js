var $ = require('jquery'),
    ko = require('knockout'),
    browser = require('core/utils/browser'),
    devices = require('core/devices'),
    themes = require('ui/themes');

require('../../../helpers/executeAsyncMock.js');
require('integration/knockout');
require('bundles/modules/parts/widgets-all');

var LABEL = '.dx-field-label',
    VALUE = '.dx-field-value';

var fieldsetFixtureTemplate = '    <div id="markup" style="width: 980px">								\
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


var checkThatTestingIsPossible = function() {
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

    var realDevice = devices.real();
    if(realDevice.platform === 'android' || realDevice.platform === 'ios' || realDevice.platform === 'win') {
        QUnit.test('Temporarily we do not test on mobile devices', function(assert) {
            assert.ok(true);
        });
        return false;
    }

    return true;
};

var defaultOptions = {
    numberBoxAlign: 'right',
    testVerticalOffset: true,
    testSwitchBaseline: true,
    testDateBox: true
};

var getFullOffsetLeft = function($element) {
    return Math.round($element.offset().left +
        parseFloat($element.css('padding-left')) +
        parseFloat($element.css('border-left-width')));
};

var getFullOffsetRight = function($element) {
    return Math.round($element.offset().left +
        $element.innerWidth());
};

var testVerticalAlign = function($parent, inputSelector, isContainer, testVerticalOffsetFlag) {
    var $label = $parent.find(LABEL),
        $value = $parent.find(inputSelector);

    if(testVerticalOffsetFlag) {
        testVerticalOffset($label, $value);
    }

    var $valueContainer = isContainer ? $value : $value.parent();
    testBaselineOffset($label, $valueContainer);
};

var testVerticalOffset = function($label, $value) {
    var isIE9 = document.all && !document.atob;
    var labelOffset = Math.round($label.offset().top - parseInt($label.css('margin-top')) - isIE9 ? parseInt($label.css('borderTopWidth')) : 0),
        valueOffset = Math.round($value.offset().top - parseInt($value.css('margin-top')) - isIE9 ? parseInt($value.css('borderTopWidth')) : 0);

    QUnit.assert.equal(labelOffset, valueOffset, 'Top offset equal');
};

var testBaselineOffset = function($labelContainer, $valueContainer) {
    var $imgForLabel,
        $imgForInput;

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

    var runTestModule = function(themeName) {
        QUnit.module(themeName, {
            beforeEach: function() {
                DevExpress.testing.executeAsyncMock.setup();
                $('#qunit-fixture').html(fieldsetFixtureTemplate);
                var $markup = $('#markup');
                ko.applyBindings({}, $markup.get(0));
            },
            afterEach: function() {
                $('#qunit-fixture').empty();
                DevExpress.testing.executeAsyncMock.teardown();
            }
        });

        QUnit.test('Horizontal align for same widgets on and in field-value', function(assert) {
            var offsetRightForSwitchOnField = getFullOffsetRight($('#switchOnField ' + VALUE + ' .dx-switch-wrapper')),
                offsetRightForSwitchInField = getFullOffsetRight($('#switchInField ' + VALUE + ' .dx-switch-wrapper')),

                offsetRightForCheckboxOnField = getFullOffsetRight($('#checkboxOnField ' + VALUE + ' .dx-checkbox-icon')),
                offsetRightForCheckboxInField = getFullOffsetRight($('#checkboxInField ' + VALUE + ' .dx-checkbox-icon')),

                offsetLeftForSliderOnField = getFullOffsetLeft($('#sliderOnField ' + VALUE + ' .dx-slider-wrapper')),
                offsetLeftForSliderInField = getFullOffsetLeft($('#sliderInField ' + VALUE + ' .dx-slider-wrapper')),

                offsetLeftForTextBoxOnField = getFullOffsetLeft($('#textboxOnField ' + VALUE + ' input')),
                offsetLeftForTextBoxInField = getFullOffsetLeft($('#textboxInField ' + VALUE + ' input')),

                offsetLeftForAutocompleteOnField = getFullOffsetLeft($('#autocompleteOnField ' + VALUE + ' input.dx-texteditor-input')),
                offsetLeftForAutocompleteInField = getFullOffsetLeft($('#autocompleteInField ' + VALUE + ' input.dx-texteditor-input')),

                offsetLeftForDateBoxOnField = getFullOffsetLeft($('#dateboxOnField ' + VALUE + ' input')),
                offsetLeftForDateBoxInField = getFullOffsetLeft($('#dateboxInField ' + VALUE + ' input')),

                offsetLeftForTextAreaOnField = getFullOffsetLeft($('#textareaOnField ' + VALUE + ' textarea')),
                offsetLeftForTextAreaInField = getFullOffsetLeft($('#textareaInField ' + VALUE + ' textarea')),

                offsetLeftForLookupOnField = getFullOffsetLeft($('#lookupOnField ' + VALUE + ' .dx-lookup-field')),
                offsetLeftForLookupInField = getFullOffsetLeft($('#lookupInField ' + VALUE + ' .dx-lookup-field')),

                offsetLeftForSimpleOnField = getFullOffsetLeft($('#simpleTextOnField ' + VALUE)),
                offsetLeftForSimpleInField = getFullOffsetLeft($('#simpleTextInField ' + VALUE)),

                offsetRightForNumberBoxOnField = getFullOffsetRight($('#numberboxOnField ' + VALUE + ' input')),
                offsetRightForNumberBoxInField = getFullOffsetRight($('#numberboxInField ' + VALUE + ' input')),

                offsetLeftForNumberBoxOnField = getFullOffsetLeft($('#numberboxOnField ' + VALUE + ' input')),
                offsetLeftForNumberBoxInField = getFullOffsetLeft($('#numberboxInField ' + VALUE + ' input'));

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
            var offsetLeftForTextBoxOnField = getFullOffsetLeft($('#textboxOnField ' + VALUE + ' input')),

                offsetLeftForAutocompleteOnField = getFullOffsetLeft($('#autocompleteOnField ' + VALUE + ' input.dx-texteditor-input')),

                offsetLeftForDateBoxOnField = getFullOffsetLeft($('#dateboxOnField ' + VALUE + ' input.dx-texteditor-input')),

                offsetLeftForTextAreaOnField = getFullOffsetLeft($('#textareaOnField ' + VALUE + ' textarea')),

                offsetLeftForLookupOnField = getFullOffsetLeft($('#lookupOnField ' + VALUE + ' .dx-lookup-field')),

                offsetLeftForSimpleOnField = getFullOffsetLeft($('#simpleTextOnField ' + VALUE)),

                currentTheme = themes.current(),

                paddingTextAreaDifference = currentTheme === 'ios.default' || currentTheme === 'ios7.default' ? 3 : 0;

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
            var widthForSwitchOnField = $('#switchOnField ' + VALUE + ' .dx-switch-wrapper').width(),
                widthForSwitchInField = $('#switchInField ' + VALUE + ' .dx-switch-wrapper').width(),

                widthForCheckboxOnField = $('#checkboxOnField ' + VALUE + ' .dx-checkbox-icon').width(),
                widthForCheckboxInField = $('#checkboxInField ' + VALUE + ' .dx-checkbox-icon').width(),

                widthForSliderOnField = $('#sliderOnField ' + VALUE + ' .dx-slider-wrapper').width(),
                widthForSliderInField = $('#sliderInField ' + VALUE + ' .dx-slider-wrapper').width(),

                widthForTextBoxOnField = $('#textboxOnField ' + VALUE + ' input').width(),
                widthForTextBoxInField = $('#textboxInField ' + VALUE + ' input').width(),

                widthForAutocompleteOnField = $('#autocompleteOnField ' + VALUE + ' input.dx-texteditor-input').width(),
                widthForAutocompleteInField = $('#autocompleteInField ' + VALUE + ' input.dx-texteditor-input').width(),

                widthForDateBoxOnField = $('#dateboxOnField ' + VALUE + ' input.dx-texteditor-input').width(),
                widthForDateBoxInField = $('#dateboxInField ' + VALUE + ' input.dx-texteditor-input').width(),

                widthForTextAreaOnField = $('#textareaOnField ' + VALUE + ' textarea').width(),
                widthForTextAreaInField = $('#textareaInField ' + VALUE + ' textarea').width(),

                widthForLookupOnField = $('#lookupOnField ' + VALUE + ' .dx-lookup-field').width(),
                widthForLookupInField = $('#lookupInField ' + VALUE + ' .dx-lookup-field').width(),

                widthForSimpleOnField = $('#simpleTextOnField ' + VALUE).width(),
                widthForSimpleInField = $('#simpleTextInField ' + VALUE).width(),

                widthForNumberBoxOnField = $('#numberboxOnField ' + VALUE + ' input').width(),
                widthForNumberBoxInField = $('#numberboxInField ' + VALUE + ' input').width();

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
            var $parent = $('#textareaOnField'),
                $label = $parent.find(LABEL),
                $valueInput = $parent.find(VALUE + ' textarea');

            if(options.verticalOffsetTest) {
                testVerticalOffset($label, $valueInput);
            }

            var cloneTextArea = $('<div>').css('display', 'inline-block')
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
            var $parent = $('#textareaInField'),
                $label = $parent.find(LABEL),
                $valueInput = $parent.find(VALUE + ' textarea');

            if(options.verticalOffsetTest) {
                testVerticalOffset($label, $valueInput);
            }

            var cloneTextArea = $('<div>').css('display', 'inline-block')
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
