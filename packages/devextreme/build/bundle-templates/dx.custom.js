"use strict";

/* Comment lines below for the widgets you don't require and run "devextreme-bundler" in this directory, then include dx.custom.js in your project */

/* Core (dx.module-core.js) */
/* eslint-disable import/no-commonjs */
const DevExpress = require('../bundles/modules/core');
require('../bundles/modules/core.legacy');

/* Integrations (dx.module-core.js) */

require('../integration/jquery');
require('../integration/knockout');

require('../common/core/localization/globalize/core');
require('../common/core/localization/globalize/message');
require('../common/core/localization/globalize/number');
require('../common/core/localization/globalize/date');
require('../common/core/localization/globalize/currency');

/* Events (dx.module-core.js) */

require('../common/core/events/click');
require('../common/core/events/contextmenu');
require('../common/core/events/double_click');
require('../common/core/events/drag');
require('../common/core/events/hold');
require('../common/core/events/hover');
require('../common/core/events/pointer');
require('../common/core/events/swipe');
require('../common/core/events/transform');


/* Data (dx.module-core.js) */

const data = DevExpress.data = require('../bundles/modules/data');
require('../bundles/modules/data.legacy');

data.odata = require('../bundles/modules/data.odata');
require('../bundles/modules/data.odata.legacy');


/* UI core (dx.module-core.js) */

const ui = DevExpress.ui = require('../bundles/modules/ui');

ui.themes = require('../ui/themes');

// deprecated
ui.setTemplateEngine = require('../core/templates/template_engine_registry').setTemplateEngine;

ui.dialog = require('../ui/dialog');
ui.notify = require('../ui/notify');
ui.repaintFloatingActionButton = require('../ui/speed_dial_action/repaint_floating_action_button');
ui.hideToasts = require('../ui/toast/hide_toasts');

/* Base widgets (dx.module-widgets-base.js) */

ui.dxActionSheet = require('../ui/action_sheet');
ui.dxAutocomplete = require('../ui/autocomplete');
ui.dxBox = require('../ui/box');
ui.dxButton = require('../ui/button');
ui.dxDropDownButton = require('../ui/drop_down_button');
ui.dxButtonGroup = require('../ui/button_group');
ui.dxCalendar = require('../ui/calendar');
ui.dxCheckBox = require('../ui/check_box');
ui.dxColorBox = require('../ui/color_box');
ui.dxChat = require('../ui/chat');
ui.dxDateBox = require('../ui/date_box');
ui.dxDateRangeBox = require('../ui/date_range_box');
ui.dxDrawer = require('../ui/drawer');
ui.dxDropDownBox = require('../ui/drop_down_box');
ui.dxFileUploader = require('../ui/file_uploader');
ui.dxForm = require('../ui/form');
ui.dxGallery = require('../ui/gallery');
ui.dxHtmlEditor = require('../ui/html_editor');
ui.dxInformer = require('../ui/informer');
ui.dxList = require('../ui/list');
ui.dxLoadIndicator = require('../ui/load_indicator');
ui.dxLoadPanel = require('../ui/load_panel');
ui.dxLookup = require('../ui/lookup');
ui.dxMap = require('../ui/map');
ui.dxMultiView = require('../ui/multi_view');
ui.dxNumberBox = require('../ui/number_box');
ui.dxOverlay = require('../ui/overlay/ui.overlay');
ui.dxPagination = require('../ui/pagination');
ui.dxPopover = require('../ui/popover');
ui.dxPopup = require('../ui/popup');
ui.dxProgressBar = require('../ui/progress_bar');
ui.dxRadioGroup = require('../ui/radio_group');
ui.dxRangeSlider = require('../ui/range_slider');
ui.dxResizable = require('../ui/resizable');
ui.dxResponsiveBox = require('../ui/responsive_box');
ui.dxScrollView = require('../ui/scroll_view');
ui.dxSelectBox = require('../ui/select_box');
ui.dxSlider = require('../ui/slider');
ui.dxSpeechToText = require('../ui/speech_to_text');
ui.dxSpeedDialAction = require('../ui/speed_dial_action');
ui.dxStepper = require('../ui/stepper');
ui.dxSplitter = require('../ui/splitter');
ui.dxSwitch = require('../ui/switch');
ui.dxTabPanel = require('../ui/tab_panel');
ui.dxTabs = require('../ui/tabs');
ui.dxTagBox = require('../ui/tag_box');
ui.dxTextArea = require('../ui/text_area');
ui.dxTextBox = require('../ui/text_box');
ui.dxTileView = require('../ui/tile_view');
ui.dxToast = require('../ui/toast');
ui.dxToolbar = require('../ui/toolbar');
ui.dxTooltip = require('../ui/tooltip');
ui.dxTrackBar = require('../ui/track_bar');
ui.dxDraggable = require('../ui/draggable');
ui.dxSortable = require('../ui/sortable');

/* Validation (dx.module-widgets-base.js) */

DevExpress.validationEngine = require('../ui/validation_engine');
ui.dxValidationSummary = require('../ui/validation_summary');
ui.dxValidationGroup = require('../ui/validation_group');
ui.dxValidator = require('../ui/validator');


/* Web widgets (dx.module-widgets-web.js) */

ui.dxAccordion = require('../ui/accordion');
ui.dxContextMenu = require('../ui/context_menu');
ui.dxDataGrid = require('../ui/data_grid');
ui.dxTreeList = require('../ui/tree_list');
ui.dxCardView = require('../ui/card_view');
ui.dxMenu = require('../ui/menu');
ui.dxPivotGrid = require('../ui/pivot_grid');
ui.dxPivotGridFieldChooser = require('../ui/pivot_grid_field_chooser');
data.PivotGridDataSource = require('../ui/pivot_grid/data_source');
data.XmlaStore = require('../ui/pivot_grid/xmla_store');
ui.dxScheduler = require('../ui/scheduler');
ui.dxTreeView = require('../ui/tree_view');
ui.dxFilterBuilder = require('../ui/filter_builder');
ui.dxFileManager = require('../ui/file_manager');
ui.dxDiagram = require('../ui/diagram');
ui.dxGantt = require('../ui/gantt');


/* Chart common */
require('../bundles/modules/common.charts');

/* Viz core (dx.module-viz-core.js) */

const viz = DevExpress.viz = require('../bundles/modules/viz');
viz.currentTheme = require('../viz/themes').currentTheme;
viz.registerTheme = require('../viz/themes').registerTheme;
viz.exportFromMarkup = require('../viz/export').exportFromMarkup;
viz.getMarkup = require('../viz/export').getMarkup;
viz.exportWidgets = require('../viz/export').exportWidgets;
viz.currentPalette = require('../viz/palette').currentPalette;
viz.getPalette = require('../viz/palette').getPalette;
viz.generateColors = require('../viz/palette').generateColors;
viz.registerPalette = require('../viz/palette').registerPalette;
viz.refreshTheme = require('../viz/themes').refreshTheme;

/* Charts (dx.module-viz-charts.js) */
viz.dxChart = require('../viz/chart');
viz.dxPieChart = require('../viz/pie_chart');
viz.dxPolarChart = require('../viz/polar_chart');

/* Gauges (dx.module-viz-gauges.js) */
viz.dxLinearGauge = require('../viz/linear_gauge');
viz.dxCircularGauge = require('../viz/circular_gauge');
viz.dxBarGauge = require('../viz/bar_gauge');

/* Range selector (dx.module-viz-rangeselector.js) */
viz.dxRangeSelector = require('../viz/range_selector');

/* Vector map (dx.module-viz-vectormap.js) */
viz.dxVectorMap = require('../viz/vector_map');
viz.map = {};
viz.map.sources = {};
viz.map.projection = require('../viz/vector_map/projection').projection;

/* Sparklines (dx.module-viz-sparklines.js) */
viz.dxSparkline = require('../viz/sparkline');
viz.dxBullet = require('../viz/bullet');

/* Treemap */
viz.dxTreeMap = require('../viz/tree_map');

/* Funnel */
viz.dxFunnel = require('../viz/funnel');

/* Sankey */
viz.dxSankey = require('../viz/sankey');


/* Utilities for integration with ASP.NET */
/* DevExpress.aspnet = require('../aspnet'); */
