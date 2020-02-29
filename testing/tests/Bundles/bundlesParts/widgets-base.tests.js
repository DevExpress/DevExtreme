const $ = require('jquery');

QUnit.test('widgets-base', function(assert) {

    $.each([
        'validationEngine',
    ], function(_, namespace) {
        assert.ok(DevExpress[namespace], 'DevExpress.' + namespace + ' present');
    });

    $.each([
        'dialog',
        'notify',

        'dxActionSheet',
        'dxAutocomplete',
        'dxBox',
        'dxButton',
        'dxCalendar',
        'dxCheckBox',
        'dxColorBox',
        'dxDateBox',
        'dxDeferRendering',
        'dxDropDownMenu',
        'dxFileUploader',
        'dxForm',
        'dxGallery',
        'dxList',
        'dxLoadIndicator',
        'dxLoadPanel',
        'dxLookup',
        'dxMap',
        'dxMultiView',
        'dxNavBar',
        'dxNumberBox',
        'dxOverlay',
        'dxPopover',
        'dxPopup',
        'dxProgressBar',
        'dxRadioGroup',
        'dxRangeSlider',
        'dxResizable',
        'dxResponsiveBox',
        'dxScrollView',
        'dxSelectBox',
        'dxSlider',
        'dxSwitch',
        'dxTabPanel',
        'dxTabs',
        'dxTagBox',
        'dxTextArea',
        'dxTextBox',
        'dxTileView',
        'dxToast',
        'dxToolbar',
        'dxTooltip',
        'dxTrackBar',

        'dxValidator',
        'dxValidationGroup',
        'dxValidationSummary'
    ], function(_, namespace) {
        assert.ok(DevExpress.ui[namespace], 'DevExpress.ui.' + namespace + ' present');
    });

});
