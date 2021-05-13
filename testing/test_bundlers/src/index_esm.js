/* global document */

import Button from 'devextreme/ui/button';
import Popup from 'devextreme/ui/popup';

// import Accordion from 'devextreme/ui/accordion';
// import ActionSheet from 'devextreme/ui/action_sheet';
// import Autocomplete from 'devextreme/ui/autocomplete';
// import BarGauge from 'devextreme/viz/bar_gauge';
// import Box from 'devextreme/ui/box';
// import Bullet from 'devextreme/viz/bullet';
// import Button from 'devextreme/ui/button';
// import Calendar from 'devextreme/ui/calendar';
// import Chart from 'devextreme/viz/chart';
// import CheckBox from 'devextreme/ui/check_box';
// import CircularGauge from 'devextreme/viz/circular_gauge';
// import ColorBox from 'devextreme/ui/color_box';
// import ContextMenu from 'devextreme/ui/context_menu';
// import DataGrid from 'devextreme/ui/data_grid';
// import DateBox from 'devextreme/ui/date_box';
// import DeferRendering from 'devextreme/ui/defer_rendering';
// import Drawer from 'devextreme/ui/drawer';
// import DropDownBox from 'devextreme/ui/drop_down_box';
// import FileManager from 'devextreme/ui/file_manager';
// import FileUploader from 'devextreme/ui/file_uploader';
// import FilterBuilder from 'devextreme/ui/filter_builder';
// import Form from 'devextreme/ui/form';
// import Funnel from 'devextreme/viz/funnel';
// import Gallery from 'devextreme/ui/gallery';
// import Gantt from 'devextreme/ui/gantt';
// import HtmlEditor from 'devextreme/ui/html_editor';
// import LinearGauge from 'devextreme/viz/linear_gauge';
// import List from 'devextreme/ui/list';
// import LoadIndicator from 'devextreme/ui/load_indicator';
// import LoadPanel from 'devextreme/ui/load_panel';
// import Lookup from 'devextreme/ui/lookup';
// import Map from 'devextreme/ui/map';
// import Menu from 'devextreme/ui/menu';
// import MultiView from 'devextreme/ui/multi_view';
// import NavBar from 'devextreme/ui/nav_bar';
// import NumberBox from 'devextreme/ui/number_box';
// import PieChart from 'devextreme/viz/pie_chart';
// import PivotGrid from 'devextreme/ui/pivot_grid';
// import PivotGridFieldChooser from 'devextreme/ui/pivot_grid_field_chooser';
// import PolarChart from 'devextreme/viz/polar_chart';
// import Popover from 'devextreme/ui/popover';
// import Popup from 'devextreme/ui/popup';
// import ProgressBar from 'devextreme/ui/progress_bar';
// import RangeSelector from 'devextreme/viz/range_selector';
// import RangeSlider from 'devextreme/ui/range_slider';
// import RadioGroup from 'devextreme/ui/radio_group';
// import Resizable from 'devextreme/ui/resizable';
// import ResponsiveBox from 'devextreme/ui/responsive_box';
// import Sankey from 'devextreme/viz/sankey';
// import Scheduler from 'devextreme/ui/scheduler';
// import ScrollView from 'devextreme/ui/scroll_view';
// import SelectBox from 'devextreme/ui/select_box';
// import SlideOut from 'devextreme/ui/slide_out';
// import SlideOutView from 'devextreme/ui/slide_out_view';
// import Slider from 'devextreme/ui/slider';
// import Sparkline from 'devextreme/viz/sparkline';
// import Switch from 'devextreme/ui/switch';
// import TabPanel from 'devextreme/ui/tab_panel';
// import Tabs from 'devextreme/ui/tabs';
// import TagBox from 'devextreme/ui/tag_box';
// import TextArea from 'devextreme/ui/text_area';
// import TextBox from 'devextreme/ui/text_box';
// import TileView from 'devextreme/ui/tile_view';
// import Toast from 'devextreme/ui/toast';
// import Toolbar from 'devextreme/ui/toolbar';
// import Tooltip from 'devextreme/ui/tooltip';
// import TreeList from 'devextreme/ui/tree_list';
// import TreeMap from 'devextreme/viz/tree_map';
// import TreeView from 'devextreme/ui/tree_view';
// import ValidationGroup from 'devextreme/ui/validation_group';
// import ValidationSummary from 'devextreme/ui/validation_summary';
// import VectorMap from 'devextreme/viz/vector_map';

const widgetsList = {
//     Accordion,
//     ActionSheet,
//     Autocomplete,
//     BarGauge,
//     Box,
//     Bullet,
    Button,
    //     Calendar,
    //     Chart,
    //     CheckBox,
    //     CircularGauge,
    //     ColorBox,
    //     ContextMenu,
    //     DataGrid,
    //     DateBox,
    //     DeferRendering,
    //     Drawer,
    //     DropDownBox,
    //     FileManager,
    //     FileUploader,
    //     FilterBuilder,
    //     Form,
    //     Funnel,
    //     Gallery,
    //     Gantt,
    //     HtmlEditor,
    //     LinearGauge,
    //     List,
    //     LoadIndicator,
    //     LoadPanel,
    //     Lookup,
    //     Map,
    //     Menu,
    //     MultiView,
    //     NavBar,
    //     NumberBox,
    //     PieChart,
    //     PivotGrid,
    //     PivotGridFieldChooser,
    //     PolarChart,
    //     Popover,
    Popup,
    //     ProgressBar,
    //     RangeSelector,
    //     RangeSlider,
    //     RadioGroup,
    //     Resizable,
    //     ResponsiveBox,
    //     Sankey,
    //     Scheduler,
    //     ScrollView,
    //     SelectBox,
    //     SlideOut,
    //     SlideOutView,
    //     Slider,
    //     Sparkline,
    //     Switch,
    // TabPanel,
    // Tabs,
    // TagBox,
    // TextArea,
    // TextBox,
    // TileView,
    // Toast,
    // Toolbar,
    // Tooltip,
    // TreeList,
    // TreeMap,
    // TreeView,
    // ValidationGroup,
    // ValidationSummary,
    // VectorMap
};

const myPopup = new widgetsList.Popup(document.getElementById('myPopUp'), {
    title: 'PopUp!'
});

new widgetsList.Button(document.getElementById('myButton'), {
    text: 'Push!',
    onClick: function() {
        myPopup.show();
    }
});

Object.keys(widgetsList).forEach((widget) => {
    const div = document.createElement('div');
    new widgetsList[widget](div, {
        text: widget
    });
    document.body.appendChild(div);
});
