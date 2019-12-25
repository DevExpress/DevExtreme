var DevExpress = require('./core');
require('./data');
require('./file_providers');

/// BUNDLER_PARTS
/* UI core (dx.module-core.js) */

var ui = DevExpress.ui = require('../../../bundles/modules/ui');

ui.themes = require('../../../ui/themes');

// deprecated
ui.setTemplateEngine = require('../../../core/templates/template_engine_registry').setTemplateEngine;

ui.dialog = require('../../../ui/dialog');
ui.notify = require('../../../ui/notify');
ui.repaintFloatingActionButton = require('../../../ui/speed_dial_action/repaint_floating_action_button');

/* Base widgets (dx.module-widgets-base.js) */

ui.dxActionSheet = require('../../../ui/action_sheet');
ui.dxAutocomplete = require('../../../ui/autocomplete');
ui.dxBox = require('../../../ui/box');
ui.dxButton = require('../../../ui/button');
ui.dxTestButton = require('../../../ui/test-button');
ui.dxDropDownButton = require('../../../ui/drop_down_button');
ui.dxButtonGroup = require('../../../ui/button_group');
ui.dxCalendar = require('../../../ui/calendar');
ui.dxCheckBox = require('../../../ui/check_box');
ui.dxColorBox = require('../../../ui/color_box');
ui.dxDateBox = require('../../../ui/date_box');
ui.dxDrawer = require('../../../ui/drawer');
ui.dxDeferRendering = require('../../../ui/defer_rendering');
ui.dxDropDownBox = require('../../../ui/drop_down_box');
ui.dxDropDownMenu = require('../../../ui/drop_down_menu');
ui.dxFileUploader = require('../../../ui/file_uploader');
ui.dxForm = require('../../../ui/form');
ui.dxGallery = require('../../../ui/gallery');
ui.dxHtmlEditor = require('../../../ui/html_editor');
ui.dxList = require('../../../ui/list');
ui.dxLoadIndicator = require('../../../ui/load_indicator');
ui.dxLoadPanel = require('../../../ui/load_panel');
ui.dxLookup = require('../../../ui/lookup');
ui.dxMap = require('../../../ui/map');
ui.dxMultiView = require('../../../ui/multi_view');
ui.dxNavBar = require('../../../ui/nav_bar');
ui.dxNumberBox = require('../../../ui/number_box');
ui.dxOverlay = require('../../../ui/overlay');
ui.dxPopover = require('../../../ui/popover');
ui.dxPopup = require('../../../ui/popup');
ui.dxProgressBar = require('../../../ui/progress_bar');
ui.dxRadioGroup = require('../../../ui/radio_group');
ui.dxRangeSlider = require('../../../ui/range_slider');
ui.dxResizable = require('../../../ui/resizable');
ui.dxResponsiveBox = require('../../../ui/responsive_box');
ui.dxScrollView = require('../../../ui/scroll_view');
ui.dxSelectBox = require('../../../ui/select_box');
ui.dxSlider = require('../../../ui/slider');
ui.dxSpeedDialAction = require('../../../ui/speed_dial_action');
ui.dxSwitch = require('../../../ui/switch');
ui.dxTabPanel = require('../../../ui/tab_panel');
ui.dxTabs = require('../../../ui/tabs');
ui.dxTagBox = require('../../../ui/tag_box');
ui.dxTextArea = require('../../../ui/text_area');
ui.dxTextBox = require('../../../ui/text_box');
ui.dxTileView = require('../../../ui/tile_view');
ui.dxToast = require('../../../ui/toast');
ui.dxToolbar = require('../../../ui/toolbar');
ui.dxTooltip = require('../../../ui/tooltip');
ui.dxTrackBar = require('../../../ui/track_bar');
ui.dxDraggable = require('../../../ui/draggable');
ui.dxSortable = require('../../../ui/sortable');

/* Validation (dx.module-widgets-base.js) */

DevExpress.validationEngine = require('../../../ui/validation_engine');
ui.dxValidationSummary = require('../../../ui/validation_summary');
ui.dxValidationGroup = require('../../../ui/validation_group');
ui.dxValidator = require('../../../ui/validator');

/* Widget parts */
require('../../../ui/html_editor/converters/markdown');
/// BUNDLER_PARTS_END

// Dashboards
ui.CollectionWidget = require('../../../ui/collection/ui.collection_widget.edit');
// Dashboards

// Reports
ui.dxDropDownEditor = require('../../../ui/drop_down_editor/ui.drop_down_editor');
// Reports

module.exports = ui;
