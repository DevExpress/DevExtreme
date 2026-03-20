import jq from 'jquery';
import '../js/integration/jquery';
import { setLicenseCheckSkipCondition } from '../js/__internal/core/license/license_validation';
import ArrayStore from '../js/data/array_store';
import CustomStore from '../js/data/custom_store';
import DataSource from '../js/data/data_source';
import query from '../js/data/query';
import notify from '../js/ui/notify';
import * as dialog from '../js/ui/dialog';
import * as localization from '../js/localization';
import * as timeZoneUtils from '../js/time_zone_utils';

(window as any).$ = (window as any).jQuery = jq;

(window as any).DevExpress = {
    data: { ArrayStore, CustomStore, DataSource, query },
    ui: { notify, dialog },
    localization,
    utils: { getTimeZones: timeZoneUtils.getTimeZones },
};

import '../js/ui/accordion';
import '../js/ui/action_sheet';
import '../js/ui/autocomplete';
import '../js/ui/box';
import '../js/ui/button';
import '../js/ui/button_group';
import '../js/ui/calendar';
import '../js/ui/chat';
import '../js/ui/check_box';
import '../js/ui/color_box';
import '../js/ui/context_menu';
import '../js/ui/data_grid';
import '../js/ui/date_box';
import '../js/ui/date_range_box';
import '../js/ui/diagram';
import '../js/ui/draggable';
import '../js/ui/drawer';
import '../js/ui/drop_down_box';
import '../js/ui/drop_down_button';
import '../js/ui/file_manager';
import '../js/ui/file_uploader';
import '../js/ui/filter_builder';
import '../js/ui/form';
import '../js/ui/gallery';
import '../js/ui/gantt';
import '../js/ui/html_editor';
import '../js/ui/list';
import '../js/ui/load_indicator';
import '../js/ui/load_panel';
import '../js/ui/lookup';
import '../js/ui/map';
import '../js/ui/menu';
import '../js/ui/multi_view';
import '../js/ui/number_box';
import '../js/ui/pagination';
import '../js/ui/pivot_grid';
import '../js/ui/pivot_grid_field_chooser';
import '../js/ui/popover';
import '../js/ui/popup';
import '../js/ui/progress_bar';
import '../js/ui/radio_group';
import '../js/ui/range_slider';
import '../js/ui/recurrence_editor';
import '../js/ui/resizable';
import '../js/ui/responsive_box';
import '../js/ui/scheduler';
import '../js/ui/scroll_view';
import '../js/ui/select_box';
import '../js/ui/slider';
import '../js/ui/sortable';
import '../js/ui/speed_dial_action';
import '../js/ui/splitter';
import '../js/ui/stepper';
import '../js/ui/switch';
import '../js/ui/tab_panel';
import '../js/ui/tabs';
import '../js/ui/tag_box';
import '../js/ui/text_area';
import '../js/ui/text_box';
import '../js/ui/tile_view';
import '../js/ui/toast';
import '../js/ui/toolbar';
import '../js/ui/tooltip';
import '../js/ui/tree_list';
import '../js/ui/tree_view';
import '../js/ui/validation_group';
import '../js/ui/validation_summary';
import '../js/ui/validator';
import '../js/viz/bar_gauge';
import '../js/viz/bullet';
import '../js/viz/chart';
import '../js/viz/circular_gauge';
import '../js/viz/funnel';
import '../js/viz/linear_gauge';
import '../js/viz/pie_chart';
import '../js/viz/polar_chart';
import '../js/viz/range_selector';
import '../js/viz/sankey';
import '../js/viz/sparkline';
import '../js/viz/tree_map';
import '../js/viz/vector_map';

setLicenseCheckSkipCondition();

const themeLoaders = import.meta.glob('../artifacts/css/dx.*.css', { as: 'url' });
const themeId = localStorage.getItem('currentThemeId');
const themeKey = themeId
    ? Object.keys(themeLoaders).find((p) => p.includes(`dx.${themeId}.css`))
    : Object.keys(themeLoaders)[0];

if (themeKey) {
    const url = await (themeLoaders[themeKey] as () => Promise<string>)();
    await new Promise<void>((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => resolve();
        document.head.appendChild(link);
    });
}
