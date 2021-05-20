/* global document */

import { requestAnimationFrame, cancelAnimationFrame } from 'devextreme/animation/frame';

import fx from 'devextreme/animation/fx';
import animationPresets from 'devextreme/animation/presets';
import TransitionExecutor from 'devextreme/animation/transition_executor';

import config from 'devextreme/core/config';
import devices from 'devextreme/core/devices';
import Guid from 'devextreme/core/guid';
import setTemplateEngine from 'devextreme/core/set_template_engine';

import applyChanges from 'devextreme/data/apply_changes';
import ArrayStore from 'devextreme/data/array_store';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import EndpointSelector from 'devextreme/data/endpoint_selector'; // опечатка в документации, EndpointSelecror
// import errorHandler from 'data/errors').errorHandler;       // файла нет, правка документации
import LocalStore from 'devextreme/data/local_store';
import ODataContext from 'devextreme/data/odata/context';
import ODataStore from 'devextreme/data/odata/store';
import { EdmLiteral, keyConverters } from 'devextreme/data/odata/utils';

import Query from 'devextreme/data/query';
import utils from 'devextreme/data/utils'; // не сработало по документации

import { off, on, one, trigger } from 'devextreme/events';


// import click from 'events/click');
// import contextmenu from 'events/contextmenu');
// import dblclick from 'events/dblclick');
// import drag from 'events/drag');
// import hold from 'events/hold');
// import hover from 'events/hover');
// import pointer from 'events/pointer');
// import remove from 'events/remove'),         documentation needs to be adjusted
// import swipe from 'events/swipe');
// import transform from 'events/transform')

import { exportDataGrid as excelExportDataGrid, exportPivotGrid } from 'devextreme/excel_exporter';


import CustomFileSystemProvider from 'devextreme/file_management/custom_provider';
import FileSystemItem from 'devextreme/file_management/file_system_item';
import ObjectFileSystemProvider from 'devextreme/file_management/object_provider';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
// import UploadInfo from "devextreme/file_management/upload_info";         documentation needs to be adjusted

// import angular from 'integration/angular');
// import jquery from 'integration/jquery');
// import knockout from 'integration/knockout')

import 'devextreme/localization/globalize/currency';
import 'devextreme/localization/globalize/date';
import 'devextreme/localization/globalize/message';
import 'devextreme/localization/globalize/number';

import hideTopOverlay from 'devextreme/mobile/hide_top_overlay';
import initMobileViewport from 'devextreme/mobile/init_mobile_viewport';

import { exportDataGrid as pdfExportDataGrid } from 'devextreme/pdf_exporter';

import { getTimeZones } from 'devextreme/time_zone_utils';

import Accordion from 'devextreme/ui/accordion';
import ActionSheet from 'devextreme/ui/action_sheet';
import Autocomplete from 'devextreme/ui/autocomplete';
import BarGauge from 'devextreme/viz/bar_gauge';
import Box from 'devextreme/ui/box';
import Bullet from 'devextreme/viz/bullet';
import Button from 'devextreme/ui/button';
import Calendar from 'devextreme/ui/calendar';
import Chart from 'devextreme/viz/chart';
import CheckBox from 'devextreme/ui/check_box';
import CircularGauge from 'devextreme/viz/circular_gauge';
import ColorBox from 'devextreme/ui/color_box';
import ContextMenu from 'devextreme/ui/context_menu';
import DataGrid from 'devextreme/ui/data_grid';
import DateBox from 'devextreme/ui/date_box';
import DropDownButton from 'devextreme/ui/drop_down_button';
import DeferRendering from 'devextreme/ui/defer_rendering';
import Drawer from 'devextreme/ui/drawer';
import DropDownBox from 'devextreme/ui/drop_down_box';
import FileManager from 'devextreme/ui/file_manager';
import FileUploader from 'devextreme/ui/file_uploader';
import FilterBuilder from 'devextreme/ui/filter_builder';
import Form from 'devextreme/ui/form';
import Funnel from 'devextreme/viz/funnel';
import Gallery from 'devextreme/ui/gallery';
import Gantt from 'devextreme/ui/gantt';
import HtmlEditor from 'devextreme/ui/html_editor';
import LinearGauge from 'devextreme/viz/linear_gauge';
import List from 'devextreme/ui/list';
import LoadIndicator from 'devextreme/ui/load_indicator';
import LoadPanel from 'devextreme/ui/load_panel';
import Lookup from 'devextreme/ui/lookup';
import Map from 'devextreme/ui/map';
import Menu from 'devextreme/ui/menu';
import MultiView from 'devextreme/ui/multi_view';
import NavBar from 'devextreme/ui/nav_bar';
import NumberBox from 'devextreme/ui/number_box';
import PieChart from 'devextreme/viz/pie_chart';
import PivotGrid from 'devextreme/ui/pivot_grid';
import PivotGridFieldChooser from 'devextreme/ui/pivot_grid_field_chooser';
import PolarChart from 'devextreme/viz/polar_chart';
import Popover from 'devextreme/ui/popover';
import Popup from 'devextreme/ui/popup';
import ProgressBar from 'devextreme/ui/progress_bar';
import RangeSelector from 'devextreme/viz/range_selector';
import RangeSlider from 'devextreme/ui/range_slider';
import RadioGroup from 'devextreme/ui/radio_group';
import Resizable from 'devextreme/ui/resizable';
import ResponsiveBox from 'devextreme/ui/responsive_box';
import Sankey from 'devextreme/viz/sankey';
import Scheduler from 'devextreme/ui/scheduler';
import ScrollView from 'devextreme/ui/scroll_view';
import SelectBox from 'devextreme/ui/select_box';
import SlideOut from 'devextreme/ui/slide_out';
import SlideOutView from 'devextreme/ui/slide_out_view';
import Slider from 'devextreme/ui/slider';
import Sparkline from 'devextreme/viz/sparkline';
import Switch from 'devextreme/ui/switch';
import TabPanel from 'devextreme/ui/tab_panel';
import Tabs from 'devextreme/ui/tabs';
import TagBox from 'devextreme/ui/tag_box';
import TextArea from 'devextreme/ui/text_area';
import TextBox from 'devextreme/ui/text_box';
import TileView from 'devextreme/ui/tile_view';
import Toast from 'devextreme/ui/toast';
import Toolbar from 'devextreme/ui/toolbar';
import Tooltip from 'devextreme/ui/tooltip';
import TreeList from 'devextreme/ui/tree_list';
import TreeMap from 'devextreme/viz/tree_map';
import TreeView from 'devextreme/ui/tree_view';
import ValidationGroup from 'devextreme/ui/validation_group';
import ValidationSummary from 'devextreme/ui/validation_summary';
import VectorMap from 'devextreme/viz/vector_map';

import DropDownEditor from 'devextreme/ui/drop_down_editor/ui.drop_down_editor';
import DropDownList from 'devextreme/ui/drop_down_editor/ui.drop_down_list';

import { compileGetter, compileSetter } from 'devextreme/utils';

// import { exportFromMarkup, getMarkup, exportWidgets } from 'devextreme/viz/export';   // в соответствующих папках есть только TS файлы экспортирующие типы

import { currentPalette, getPalette, registerPalette } from 'devextreme/viz/palette'; //  опечатка в докуметации GetPalette, не хвататет кавычек

import { currentTheme, refreshTheme, registerTheme, } from 'devextreme/viz/themes';
import { refreshPaths } from 'devextreme/viz/utils';
import { projection } from 'devextreme/viz/vector_map/projection'; // в документации import { add }

const imports = {
    animationExportsList: {
        requestAnimationFrame,
        cancelAnimationFrame,
        fx,
        animationPresets,
        TransitionExecutor,
    },

    coreExportsList: {
        config,
        devices,
        Guid,
        setTemplateEngine
    },

    dataExportsList: {
        applyChanges,
        ArrayStore,
        CustomStore,
        DataSource,
        EndpointSelector,
        // errorHandler,
        LocalStore,
        ODataContext,
        ODataStore,
        EdmLiteral,
        keyConverters,
        Query,
        base64_encode: utils.base64_encode
    },

    eventsExportsList: {
        off,
        on,
        one,
        trigger,
        // click,
        // contextmenu,
        // dblclick,
        // drag,
        // hold,
        // hover,
        // pointer,
        // remove
        // swipe,
        // transform
    },

    excelExporter: {
        excelExportDataGrid,
        exportPivotGrid
    },

    fileManagementExportsList: {
        CustomFileSystemProvider,
        FileSystemItem,
        ObjectFileSystemProvider,
        RemoteFileSystemProvider
    // UploadInfo,        documentation needs to be adjusted
    },

    integrationExportsList: {
    // angular,
    // jquery,
    // knockout
    },

    mobileExportsList: {
        hideTopOverlay,
        initMobileViewport
    },

    pdfExporter: {
        pdfExportDataGrid
    },

    timeZoneUtils: {
        getTimeZones
    },

    widgetsList: {
        Accordion,
        ActionSheet,
        Autocomplete,
        BarGauge,
        Box,
        Bullet,
        Button,
        Calendar,
        Chart,
        CheckBox,
        CircularGauge,
        ColorBox,
        ContextMenu,
        DataGrid,
        DateBox,
        DeferRendering,
        Drawer,
        DropDownBox,
        FileManager,
        FileUploader,
        FilterBuilder,
        Form,
        Funnel,
        Gallery,
        Gantt,
        HtmlEditor,
        LinearGauge,
        List,
        LoadIndicator,
        LoadPanel,
        Lookup,
        Map,
        Menu,
        MultiView,
        NavBar,
        NumberBox,
        PieChart,
        PivotGrid,
        PivotGridFieldChooser,
        PolarChart,
        Popover,
        Popup,
        ProgressBar,
        RangeSelector,
        RangeSlider,
        RadioGroup,
        Resizable,
        ResponsiveBox,
        Sankey,
        Scheduler,
        ScrollView,
        SelectBox,
        SlideOut,
        SlideOutView,
        Slider,
        Sparkline,
        Switch,
        TabPanel,
        Tabs,
        TagBox,
        TextArea,
        TextBox,
        TileView,
        Toast,
        Toolbar,
        Tooltip,
        TreeList,
        TreeMap,
        TreeView,
        ValidationGroup,
        ValidationSummary,
        VectorMap
    },

    dropDownEditorsList: {
        Autocomplete,
        ColorBox,
        DateBox,
        DropDownBox,
        DropDownButton,
        SelectBox,
        TagBox,
        DropDownEditor,
        DropDownList,
    },

    utilsExportsList: {
        compileGetter,
        compileSetter
    },

    vizExportsList: {
        BarGauge,
        Bullet,
        Chart,
        CircularGauge,
        // exportFromMarkup,
        // getMarkup,
        // exportWidgets,
        Funnel,
        LinearGauge,
        currentPalette,
        getPalette,
        registerPalette,
        PieChart,
        PolarChart,
        RangeSelector,
        Sankey,
        Sparkline,
        currentTheme,
        refreshTheme,
        registerTheme,
        TreeMap,
        refreshPaths,
        VectorMap,
        add: projection.add
    }
};

const de = require('devextreme/localization/messages/de.json');
const ru = require('devextreme/localization/messages/ru.json');

const Globalize = require('globalize');

Globalize.load(
    require('devextreme-cldr-data/supplemental.json'),
    require('devextreme-cldr-data/de.json'),
    require('devextreme-cldr-data/ru.json')
);

Globalize.loadMessages(de);
Globalize.loadMessages(ru);

const myPopup = new imports.widgetsList.Popup(document.getElementById('myPopUp'), {
    title: 'PopUp!'
});

new imports.widgetsList.Button(document.getElementById('myButton'), {
    text: 'Push!',
    onClick: function() {
        myPopup.show();
    }
});

Object.keys(imports.widgetsList).forEach((widget) => {
    const div = document.createElement('div');
    new imports.widgetsList[widget](div, {
        text: widget
    });
    document.body.appendChild(div);
});
